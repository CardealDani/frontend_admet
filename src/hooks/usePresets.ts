// src/hooks/usePresets.ts
// Gerencia presets embutidos + presets salvos pelo usuário (localStorage).
// Retorna uma lista unificada e ações de save/delete/update.

import { useState, useCallback, useMemo } from 'react';
import { BUILT_IN_PRESETS, type PresetDefinition } from '../mocks/presets.mock';
import type { AdmetFilters } from '../types/filters';

const STORAGE_KEY = 'admet_user_presets';

const loadFromStorage = (): PresetDefinition[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PresetDefinition[]) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (presets: PresetDefinition[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch {
    // localStorage indisponível (iframe, SSR) — falha silenciosa
  }
};

// ─── Tipos públicos ─────────────────────────────────────────────────────────

export interface UsePresetsReturn {
  allPresets: PresetDefinition[];         // built-in + user
  userPresets: PresetDefinition[];        // apenas os do usuário (deletáveis)
  activePresetId: string;                 // id do preset selecionado no Select
  setActivePresetId: (id: string) => void;
  saveCurrentAsPreset: (label: string, filters: AdmetFilters) => PresetDefinition;
  deleteUserPreset: (id: string) => void;
  updatePreset: (id: string, newFilters: AdmetFilters) => void; // <--- ADICIONADO AQUI
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export const usePresets = (): UsePresetsReturn => {
  const [userPresets, setUserPresets] = useState<PresetDefinition[]>(loadFromStorage);
  const [activePresetId, setActivePresetId] = useState<string>('default');

  const allPresets = useMemo(
    () => [...BUILT_IN_PRESETS, ...userPresets],
    [userPresets]
  );

  const saveCurrentAsPreset = useCallback(
    (label: string, filters: AdmetFilters): PresetDefinition => {
      const newPreset: PresetDefinition = {
        id: `user_${Date.now()}`,
        label: label.trim() || 'Meu Preset',
        description: 'Configuração personalizada.',
        isBuiltIn: false,
        filters,
      };
      setUserPresets(prev => {
        const updated = [...prev, newPreset];
        saveToStorage(updated);
        return updated;
      });
      setActivePresetId(newPreset.id);
      return newPreset;
    },
    []
  );

  const deleteUserPreset = useCallback((id: string) => {
    setUserPresets(prev => {
      const updated = prev.filter(p => p.id !== id);
      saveToStorage(updated);
      return updated;
    });
    // Se o preset deletado era o ativo, volta pro default
    setActivePresetId(prev => (prev === id ? 'default' : prev));
  }, []);

  // <--- NOVA FUNÇÃO DE ATUALIZAÇÃO CORRIGIDA --->
  const updatePreset = useCallback((id: string, newFilters: AdmetFilters) => {
    setUserPresets(prev => {
      // Mapeia os presets do utilizador e atualiza apenas o que tem o ID correspondente
      const updated = prev.map(p =>
        p.id === id ? { ...p, filters: newFilters } : p
      );
      saveToStorage(updated); // Persiste a alteração no localStorage
      return updated;
    });
  }, []);

  return {
    allPresets,
    userPresets,
    activePresetId,
    setActivePresetId,
    saveCurrentAsPreset,
    deleteUserPreset,
    updatePreset, // <--- EXPORTADO AQUI
  };
};