// src/mocks/presets.mock.ts
// Presets embutidos (não deletáveis pelo usuário).
// Cada preset é um AdmetFilters completo — o usePresets aplica via spread sobre defaultFilters.

import { defaultFilters } from '../types/filters';
import type { AdmetFilters } from '../types/filters';

export interface PresetDefinition {
  id: string;
  label: string;
  description: string;
  isBuiltIn: boolean;          // true = não pode ser deletado pelo usuário
  filters: AdmetFilters;
}

export const BUILT_IN_PRESETS: PresetDefinition[] = [
  {
    id: 'default',
    label: 'Sem filtros',
    description: 'Exibe todas as moléculas sem restrições.',
    isBuiltIn: true,
    filters: defaultFilters,
  },
  {
    id: 'lipinski_strict',
    label: 'Regra de Lipinski',
    description: 'MW ≤ 500 e LogP ≤ 5. Critério clássico de drug-likeness oral.',
    isBuiltIn: true,
    filters: {
      ...defaultFilters,
      medchem: { ...defaultFilters.medchem, lipinski: true },
      pfq: {
        ...defaultFilters.pfq,
        mw:   { value: [0, 500], active: true },
        logp: { value: [-5, 5],  active: true },
      },
    },
  },
  {
    id: 'pfizer_3_75',
    label: 'Regra Pfizer (3/75)',
    description: 'LogP ≤ 3 e TPSA ≥ 75. Minimiza toxicidade in vivo.',
    isBuiltIn: true,
    filters: {
      ...defaultFilters,
      medchem: { ...defaultFilters.medchem, pfizer: true },
      pfq: {
        ...defaultFilters.pfq,
        logp: { value: [-5, 3],   active: true },
        tpsa: { value: [75, 200], active: true },
      },
    },
  },
  {
    id: 'lead_like_safe',
    label: 'Lead-Like (Alta Segurança)',
    description: 'Lipinski + sem mutagenicidade + sem cardiotoxicidade.',
    isBuiltIn: true,
    filters: {
      ...defaultFilters,
      medchem: { ...defaultFilters.medchem, lipinski: true },
      pfq: {
        ...defaultFilters.pfq,
        mw:   { value: [0, 500], active: true },
        logp: { value: [-5, 5],  active: true },
      },
      toxicity: {
        ames:   ['Excelente'],
        hepato: ['Excelente'],
        herg:   ['Excelente'],
      },
    },
  },
];