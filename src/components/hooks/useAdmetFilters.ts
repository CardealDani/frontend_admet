// src/hooks/useAdmetFilters.ts
// O coração da refatoração.
//
// CONCEITO CHAVE — dois estados separados:
//   stagedFilters  → o que o usuário está configurando no painel (muda a cada interação)
//   appliedFilters → o que foi confirmado e vai para a tabela (muda só ao clicar "Aplicar")
//
// Isso resolve dois problemas do código anterior:
//   1. A tabela não filtrava em tempo real sem querer (sem Deferred Payload acidental)
//   2. O botão "Aplicar" agora tem semântica real: só fica habilitado quando há diff

import { useState, useCallback, useMemo } from 'react';
import { defaultFilters } from '../../types/filters';
import type { AdmetFilters } from '../../types/filters';

// ─── Helpers de comparação profunda ────────────────────────────────────────

// Compara dois AdmetFilters verificando se são semanticamente iguais.
// Usamos JSON.stringify por simplicidade — funciona aqui porque os valores
// são apenas primitivos, arrays e objetos planos (sem Dates, Functions, etc.)
const filtersAreEqual = (a: AdmetFilters, b: AdmetFilters): boolean => {
    return JSON.stringify(a) === JSON.stringify(b);
};

// ─── Tipos públicos do hook ─────────────────────────────────────────────────

export interface UseAdmetFiltersReturn {
    // Estado
    stagedFilters: AdmetFilters;
    appliedFilters: AdmetFilters;
    hasDiff: boolean;               // true quando staged !== applied

    // Mutações do estado staged (chamadas pelos controles de UI)
    updateFilter: (category: keyof AdmetFilters, field: string, value: unknown) => void;
    toggleArrayFilter: (category: keyof AdmetFilters, field: string, value: string) => void;

    // Lógica MedChem interligada (Lipinski ↔ LogP/MW, Pfizer ↔ LogP/TPSA)
    handleLipinskiToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePfizerToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;

    // Ações
    applyFilters: () => void;        // staged → applied
    resetFilters: () => void;        // staged E applied → defaultFilters
    loadPreset: (preset: AdmetFilters) => void; // substitui staged pelo preset

    // Contagens para badges
    counts: {
        pfq: number;
        absorption: number;
        distribution: number;
        metabolism: number;
        excretion: number;
        toxicity: number;
        total: number;
    };
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export const useAdmetFilters = (): UseAdmetFiltersReturn => {
    const [stagedFilters, setStagedFilters] = useState<AdmetFilters>(defaultFilters);
    const [appliedFilters, setAppliedFilters] = useState<AdmetFilters>(defaultFilters);

    // ── hasDiff ──────────────────────────────────────────────────────────────
    const hasDiff = useMemo(
        () => !filtersAreEqual(stagedFilters, appliedFilters),
        [stagedFilters, appliedFilters]
    );

    // ── Mutações ─────────────────────────────────────────────────────────────

    // Atualiza campos diretos (sliders com ToggleableFilter, booleans, etc.)
    const updateFilter = useCallback(
        (category: keyof AdmetFilters, field: string, value: unknown) => {
            setStagedFilters(prev => ({
                ...prev,
                [category]: { ...prev[category], [field]: value },
            }));
        },
        []
    );

    // Atualiza arrays categóricos (FilterButtonGroup)
    // Toggle: se o valor já existe, remove; se não existe, adiciona.
    // Atualiza arrays categóricos (FilterButtonGroup)
    const toggleArrayFilter = useCallback(
        (category: keyof AdmetFilters, field: string, value: string) => {
            setStagedFilters(prev => {
                // Double casting: escapamos a restrição estrutural do TS
                const section = prev[category] as unknown as Record<string, unknown>;
                const currentArray = section[field] as string[];

                const newArray = currentArray.includes(value)
                    ? currentArray.filter(v => v !== value)
                    : [...currentArray, value];

                return { ...prev, [category]: { ...section, [field]: newArray } };
            });
        },
        []
    );

    // ── Lógica MedChem interligada ────────────────────────────────────────────
    // Regras de colisão: Lipinski e Pfizer compartilham o slider LogP.
    // A regra mais restrita vence (Pfizer: ≤3 é mais restrito que Lipinski: ≤5).

    const handleLipinskiToggle = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const isLipinski = e.target.checked;
            setStagedFilters(prev => {
                const isPfizer = prev.medchem.pfizer;
                return {
                    ...prev,
                    medchem: { ...prev.medchem, lipinski: isLipinski },
                    pfq: {
                        ...prev.pfq,
                        mw: { value: isLipinski ? [0, 500] : [0, 1000], active: isLipinski },
                        logp: {
                            value: isPfizer ? [-5, 3] : isLipinski ? [-5, 5] : [-5, 10],
                            active: isPfizer || isLipinski,
                        },
                    },
                };
            });
        },
        []
    );

    const handlePfizerToggle = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const isPfizer = e.target.checked;
            setStagedFilters(prev => {
                const isLipinski = prev.medchem.lipinski;
                return {
                    ...prev,
                    medchem: { ...prev.medchem, pfizer: isPfizer },
                    pfq: {
                        ...prev.pfq,
                        tpsa: { value: isPfizer ? [75, 200] : [0, 200], active: isPfizer },
                        logp: {
                            value: isPfizer ? [-5, 3] : isLipinski ? [-5, 5] : [-5, 10],
                            active: isPfizer || isLipinski,
                        },
                    },
                };
            });
        },
        []
    );

    // ── Ações ─────────────────────────────────────────────────────────────────

    const applyFilters = useCallback(() => {
        setAppliedFilters(stagedFilters);
        console.log("Aplicando filtros:", stagedFilters);
    }, [stagedFilters]);

    const resetFilters = useCallback(() => {
        setStagedFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
    }, []);

    // Carrega um preset no staged (não aplica automaticamente — usuário confirma)
    const loadPreset = useCallback((preset: AdmetFilters) => {
        setStagedFilters(preset);
    }, []);

   // ── Contagens para badges ─────────────────────────────────────────────────

    const countSection = (
        current: unknown,
        defaults: unknown
    ): number => {
        // Resolvemos o cast de forma isolada aqui dentro
        const currObj = current as Record<string, unknown>;
        const defObj = defaults as Record<string, unknown>;
        
        let count = 0;
        Object.keys(currObj).forEach(key => {
            const cVal = currObj[key];
            const dVal = defObj[key];

            if (cVal && typeof cVal === 'object' && 'active' in (cVal as object)) {
                if ((cVal as { active: boolean }).active) count++;
            } else if (Array.isArray(cVal) && Array.isArray(dVal)) {
                if (JSON.stringify(cVal) !== JSON.stringify(dVal)) count++;
            } else if (cVal !== dVal) {
                count++;
            }
        });
        return count;
    };

    const counts = useMemo(() => {
        // Olha como o código fica absurdamente mais limpo sem os casts aqui!
        const pfq = countSection(stagedFilters.pfq, defaultFilters.pfq)
            + countSection(stagedFilters.medchem, defaultFilters.medchem);
            
        const absorption = countSection(stagedFilters.absorption, defaultFilters.absorption);
        const distribution = countSection(stagedFilters.distribution, defaultFilters.distribution);
        const metabolism = countSection(stagedFilters.metabolism, defaultFilters.metabolism);
        const excretion = countSection(stagedFilters.excretion, defaultFilters.excretion);
        const toxicity = countSection(stagedFilters.toxicity, defaultFilters.toxicity);
        
        const total = pfq + absorption + distribution + metabolism + excretion + toxicity;
        
        return { pfq, absorption, distribution, metabolism, excretion, toxicity, total };
    }, [stagedFilters]);

    return {
        stagedFilters,
        appliedFilters,
        hasDiff,
        updateFilter,
        toggleArrayFilter,
        handleLipinskiToggle,
        handlePfizerToggle,
        applyFilters,
        resetFilters,
        loadPreset,
        counts,
    };
};