// src/hooks/useMoleculeFilter.ts
// Recebe appliedFilters e retorna as moléculas do mock que passam por todos os critérios ativos.
// Quando o back estiver pronto, basta trocar MOCK_MOLECULES por uma chamada de API
// e manter a mesma interface de retorno — zero mudança nos componentes.

import { useMemo } from 'react';
import { MOCK_MOLECULES } from '../../mocks/molecules.mock';
import type { AdmetFilters } from '../../types/filters';
import type { Molecule } from '../../types/molecules.types';

// ─── Engine de filtragem ────────────────────────────────────────────────────

const applyFilters = (molecules: Molecule[], f: AdmetFilters): Molecule[] => {
  return molecules.filter(mol => {

    // ── Físico-Química ──────────────────────────────────────────────────────
    if (f.pfq.mw.active) {
      const [min, max] = f.pfq.mw.value;
      if (mol.mw < min || mol.mw > max) return false;
    }
    if (f.pfq.logp.active) {
      const [min, max] = f.pfq.logp.value;
      if (mol.logp < min || mol.logp > max) return false;
    }
    if (f.pfq.tpsa.active) {
      const [min, max] = f.pfq.tpsa.value;
      if (mol.tpsa < min || mol.tpsa > max) return false;
    }

    // ── MedChem ─────────────────────────────────────────────────────────────
    if (f.medchem.lipinski && mol.lipinski !== 'Pass') return false;
    if (f.medchem.pfizer   && mol.pfizer   !== 'Pass') return false;
    if (f.medchem.qed.active) {
      const [min, max] = f.medchem.qed.value;
      if (mol.qed < min || mol.qed > max) return false;
    }

    // ── Absorção ────────────────────────────────────────────────────────────
    if (f.absorption.absorptionPercent.active) {
      const [min, max] = f.absorption.absorptionPercent.value;
      if (mol.absorptionPercent < min || mol.absorptionPercent > max) return false;
    }
    // Arrays categóricos: array vazio ou com string vazia = filtro desligado
    const activeCaco2 = f.absorption.caco2.filter(Boolean);
    if (activeCaco2.length > 0 && !activeCaco2.includes(mol.caco2)) return false;

    const activePgp = f.absorption.pgpInhibitor.filter(Boolean);
    if (activePgp.length > 0 && !activePgp.includes(mol.pgpInhibitor)) return false;

    // ── Distribuição ────────────────────────────────────────────────────────
    const activeBbb = f.distribution.bbb.filter(Boolean);
    console.log("Active BBB filters:", activeBbb);
    if (activeBbb.length > 0 && !activeBbb.includes(mol.bbb)) return false;

    if (f.distribution.ppb.active) {
      const [min, max] = f.distribution.ppb.value;
      if (mol.ppb < min || mol.ppb > max) return false;
    }
    if (f.distribution.fu.active) {
      const [min, max] = f.distribution.fu.value;
      if (mol.fu < min || mol.fu > max) return false;
    }

    // ── Metabolismo ─────────────────────────────────────────────────────────
    const activeCyp1a2 = f.metabolism.cyp1a2Substrate.filter(Boolean);
    if (activeCyp1a2.length > 0 && !activeCyp1a2.includes(mol.cyp1a2Substrate)) return false;

    const activeCyp2d6 = f.metabolism.cyp2d6Substrate.filter(Boolean);
    if (activeCyp2d6.length > 0 && !activeCyp2d6.includes(mol.cyp2d6Substrate)) return false;

    const activeCyp3a4 = f.metabolism.cyp3a4Substrate.filter(Boolean);
    if (activeCyp3a4.length > 0 && !activeCyp3a4.includes(mol.cyp3a4Substrate)) return false;

    // ── Excreção ────────────────────────────────────────────────────────────
    if (f.excretion.clPlasma.active) {
      const [min, max] = f.excretion.clPlasma.value;
      if (mol.clPlasma < min || mol.clPlasma > max) return false;
    }
    if (f.excretion.tHalf.active) {
      const [min, max] = f.excretion.tHalf.value;
      if (mol.tHalf < min || mol.tHalf > max) return false;
    }

    // ── Toxicidade ──────────────────────────────────────────────────────────
    const activeAmes = f.toxicity.ames.filter(Boolean);
    if (activeAmes.length > 0 && !activeAmes.includes(mol.ames)) return false;

    const activeHepato = f.toxicity.hepato.filter(Boolean);
    if (activeHepato.length > 0 && !activeHepato.includes(mol.hepato)) return false;

    const activeHerg = f.toxicity.herg.filter(Boolean);
    if (activeHerg.length > 0 && !activeHerg.includes(mol.herg)) return false;

    return true;
  });
};

// ─── Hook ──────────────────────────────────────────────────────────────────

export interface UseMoleculeFilterReturn {
  filteredMolecules: Molecule[];
  totalCount: number;          // total do mock (sem filtros)
  filteredCount: number;       // após aplicar filtros
}

export const useMoleculeFilter = (
  appliedFilters: AdmetFilters
): UseMoleculeFilterReturn => {
  const filteredMolecules = useMemo(
    () => applyFilters(MOCK_MOLECULES, appliedFilters),
    [appliedFilters]
  );

  return {
    filteredMolecules,
    totalCount: MOCK_MOLECULES.length,
    filteredCount: filteredMolecules.length,
  };
};