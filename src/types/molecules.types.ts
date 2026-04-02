// src/types/molecules.types.ts
// Representa o output da API ADMETlab para uma única molécula.
// Mantido separado de filters.ts: filtros descrevem critérios de busca,
// Molecule descreve o dado retornado — responsabilidades distintas.

// Tipos base para garantir o "Single Source of Truth"
export type CategoricalBinary   = 'Excelente' | 'Ruim';
export type CategoricalYesNo    = 'Sim' | 'Não'; // Usado primariamente pelas CYPs
export type CategoricalTernary  = 'Excelente' | 'Médio' | 'Ruim';
export type PassFail            = 'Pass' | 'Fail';

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
  pgpInhibitor: CategoricalTernary;// 'Excelente' | 'Médio' | 'Ruim'

  // Distribuição
  bbb: CategoricalTernary;         // invertido: Baixa penetração = Excelente (alvo periférico)
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
  ames: CategoricalTernary;   // 'Excelente' | 'Médio' | 'Ruim'
  hepato: CategoricalTernary; // 'Excelente' | 'Médio' | 'Ruim'
  herg: CategoricalTernary;   // 'Excelente' | 'Médio' | 'Ruim'

  // MedChem
  lipinski: PassFail; // 'Pass' | 'Fail'
  pfizer: PassFail;   // 'Pass' | 'Fail'
  qed: number;        // 0–1
}