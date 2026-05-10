// src/types/molecules.types.ts
// Representa o output da API ADMETlab para uma única molécula.
// Mantido separado de filters.ts: filtros descrevem critérios de busca,
// Molecule descreve o dado retornado — responsabilidades distintas.

// Tipos base para garantir o "Single Source of Truth"
// 1. Primeiro definimos os Labels exatos que a UI e os Filtros esperam
export type BinaryLabel = 'Excelente' | 'Ruim';
export type YesNoLabel = 'Sim' | 'Não';
export type TernaryLabel = 'Excelente' | 'Médio' | 'Ruim';
export type PassFail = 'Pass' | 'Fail';

// 2. Agora criamos as Tuplas: [valorCru, classificacao]
// Exemplo prático vindo do Back: [0.15, 'Excelente'] ou [0.82, 'Ruim']
export type CategoricalBinary = [number, BinaryLabel];
export type CategoricalYesNo = [number, YesNoLabel];
export type CategoryTernary = [number, TernaryLabel];

export interface Molecule {
  // Identificação
  id: string;
  name: string;
  smiles: string;
  imgUrl: string;

  // Físico-Química
  mw: number;       // g/mol  — Lipinski: ≤ 500
  logp: number;     // —       — Lipinski: ≤ 5 | Pfizer: ≤ 3
  tpsa: number;     // Å²      — Pfizer: ≥ 75

  // Absorção
  absorptionPercent: number;       // % HIA
  caco2: CategoricalBinary;        // 'Excelente' | 'Ruim'  (threshold -5.15)
  pgpInhibitor: CategoryTernary;// 'Excelente' | 'Médio' | 'Ruim'

  // Distribuição
  bbb: CategoryTernary;         // invertido: Baixa penetração = Excelente (alvo periférico)
  ppb: number;                     // %
  fu: number;                      // % fração livre

  // Metabolismo (Evitar Substrato -> Não é o Sucesso)
  cyp1a2Substrate: CategoricalYesNo; // 'Sim' | 'Não'
  cyp2d6Substrate: CategoricalYesNo; // 'Sim' | 'Não'
  cyp3a4Substrate: CategoricalYesNo; // 'Sim' | 'Não'

  // Excreção
  clPlasma: number;  // mL/min/kg
  tHalf: number;     // horas

  // Toxicidade (0 a 0.3 = Excelente/Seguro, 0.7 a 1 = Ruim/Tóxico)
  ames: CategoryTernary;   // 'Excelente' | 'Médio' | 'Ruim'
  hepato: CategoryTernary; // 'Excelente' | 'Médio' | 'Ruim'
  herg: CategoryTernary;   // 'Excelente' | 'Médio' | 'Ruim'

  // MedChem
  lipinski: PassFail; // 'Pass' | 'Fail'
  pfizer: PassFail;   // 'Pass' | 'Fail'
  qed: number;        // 0–1
}