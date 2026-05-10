// src/utils/moleculeAdapter.ts
// Converte o JSON bruto da API (só números) → Molecule (número + categoria).
// É a única camada que conhece os thresholds do ADMETlab.
// Componentes de UI NUNCA fazem esse cálculo — apenas leem .raw e .category.

import type {
  Molecule,
  BinaryValue, TernaryValue, ToxValue, YesNoValue,
} from '../types/molecules.types';

// ─── Forma do JSON da API ────────────────────────────────────────────────────

export interface MoleculeApiResponse {
  id: string;
  name: string;
  smiles: string;
  imgUrl: string;

  // Físico-Química
  mw: number;
  logp: number;
  tpsa: number;
  qed: number;

  // Absorção
  absorptionPercent: number;
  caco2: number;          // log cm/s   — threshold: -5.15
  pgpInhibitor: number;   // prob 0–1

  // Distribuição
  bbb: number;            // prob 0–1   — invertido (baixo = bom)
  ppb: number;
  fu: number;

  // Metabolismo
  cyp1a2Substrate: number; // prob 0–1  — >0.5 = substrato
  cyp2d6Substrate: number;
  cyp3a4Substrate: number;

  // Excreção
  clPlasma: number;
  tHalf: number;

  // Toxicidade
  ames: number;           // prob 0–1
  hepato: number;
  herg: number;

  // MedChem (já categórico na API)
  lipinski: 'Pass' | 'Fail';
  pfizer: 'Pass' | 'Fail';
}

// ─── Funções de categorização (thresholds ADMETlab) ──────────────────────────

const caco2Category = (v: number): BinaryValue => ({
  raw: v,
  category: v > -5.15 ? 'Excelente' : 'Ruim',
});

// Genérico: ≤0.3 Excelente | ≤0.7 Médio | >0.7 Ruim
const ternary = (v: number): TernaryValue => ({
  raw: v,
  category: v <= 0.3 ? 'Excelente' : v <= 0.7 ? 'Médio' : 'Ruim',
});

// BBB: invertido — baixa penetração é desejável (alvo periférico)
const bbbCategory = (v: number): TernaryValue => ({
  raw: v,
  category: v <= 0.3 ? 'Excelente' : v <= 0.7 ? 'Médio' : 'Ruim',
});

// Toxicidade: ≤0.3 Excelente | ≤0.7 Atenção | >0.7 Tóxico
const toxCategory = (v: number): ToxValue => ({
  raw: v,
  category: v <= 0.3 ? 'Excelente' : v <= 0.7 ? 'Médio' : 'Ruim',
});

// CYP: prob >0.5 = substrato
const cypCategory = (v: number): YesNoValue => ({
  raw: v,
  category: v > 0.5 ? 'Sim' : 'Não',
});

// ─── Adapter principal ────────────────────────────────────────────────────────

export const adaptMolecule = (api: MoleculeApiResponse): Molecule => ({
  id:    api.id,
  name:  api.name,
  smiles: api.smiles,
  imgUrl: api.imgUrl,

  mw:   api.mw,
  logp: api.logp,
  tpsa: api.tpsa,
  qed:  api.qed,

  absorptionPercent: api.absorptionPercent,
  caco2:        caco2Category(api.caco2),
  pgpInhibitor: ternary(api.pgpInhibitor),

  bbb: bbbCategory(api.bbb),
  ppb: api.ppb,
  fu:  api.fu,

  cyp1a2Substrate: cypCategory(api.cyp1a2Substrate),
  cyp2d6Substrate: cypCategory(api.cyp2d6Substrate),
  cyp3a4Substrate: cypCategory(api.cyp3a4Substrate),

  clPlasma: api.clPlasma,
  tHalf:    api.tHalf,

  ames:   toxCategory(api.ames),
  hepato: toxCategory(api.hepato),
  herg:   toxCategory(api.herg),

  lipinski: api.lipinski,
  pfizer:   api.pfizer,
});

// Adaptar array (batch)
export const adaptMolecules = (list: MoleculeApiResponse[]): Molecule[] =>
  list.map(adaptMolecule);