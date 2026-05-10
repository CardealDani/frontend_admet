// src/types/molecules.types.ts

// ─── Tipos categóricos ────────────────────────────────────────────────────────
export type CategoryBinary  = 'Excelente' | 'Ruim';
export type CategoryTernary = 'Excelente' | 'Médio' | 'Ruim';
export type CategoryYesNo   = 'Sim' | 'Não';
export type PassFail        = 'Pass' | 'Fail';

// ─── Tipo central: valor numérico + categoria derivada ────────────────────────
// Carrega o dado bruto da API E a label para UI — sem perder informação.
//
// Exemplos de uso:
//   mol.caco2.raw      → -4.85   (para MoleculeDetail mostrar o número exato)
//   mol.caco2.category → 'Excelente' (para filtros, badges, cores)
//   mol.ames.raw       → 0.12    (probabilidade bruta)
//   mol.ames.category  → 'Excelente'

export interface MeasuredValue<C> {
  raw: number;        // valor numérico exato da API
  category: C;        // categoria derivada pelo adapter
}

// ─── Aliases para cada domínio ────────────────────────────────────────────────
export type BinaryValue  = MeasuredValue<CategoryBinary>;
export type TernaryValue = MeasuredValue<CategoryTernary>;
export type ToxValue     = MeasuredValue<CategoryTernary>;
export type YesNoValue   = MeasuredValue<CategoryYesNo>;

// ─── Interface Molecule ───────────────────────────────────────────────────────
export interface Molecule {
  // Identificação
  id: string;
  name: string;
  smiles: string;
  imgUrl: string;

  // Físico-Química (valores contínuos — sem categorização necessária)
  mw: number;       // g/mol
  logp: number;
  tpsa: number;     // Å²
  qed: number;      // 0–1

  // Absorção
  absorptionPercent: number;   // % HIA — contínuo
  caco2: BinaryValue;          // raw: cm/s log  | threshold: -5.15
  pgpInhibitor: TernaryValue;  // raw: prob 0–1  | 0–0.3 Excelente, 0.3–0.7 Médio, >0.7 Ruim

  // Distribuição
  bbb: TernaryValue;           // raw: prob 0–1  | invertido: ≤0.3 Excelente (não penetra)
  ppb: number;                 // % — contínuo
  fu: number;                  // % fração livre — contínuo

  // Metabolismo
  cyp1a2Substrate: YesNoValue; // raw: prob 0–1  | >0.5 = Sim
  cyp2d6Substrate: YesNoValue;
  cyp3a4Substrate: YesNoValue;

  // Excreção (contínuos)
  clPlasma: number;  // mL/min/kg
  tHalf: number;     // horas

  // Toxicidade
  ames: ToxValue;    // raw: prob 0–1  | ≤0.3 Seguro, ≤0.7 Atenção, >0.7 Tóxico
  hepato: ToxValue;
  herg: ToxValue;

  // MedChem
  lipinski: PassFail;
  pfizer: PassFail;
}