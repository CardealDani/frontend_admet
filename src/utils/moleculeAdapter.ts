// // src/utils/moleculeAdapter.ts
// import type { 
//   Molecule, 
//   CategoricalBinary, 
//   CategoricalTernary, 
//   CategoricalYesNo 
// } from '../types/molecules.types';

// // Tipagem do dado exatamente como ele vem do Backend (só os números brutos)
// export interface MoleculeApiResponse {
//   id: string;
//   name: string;
//   smiles: string;
//   imgUrl: string;
//   mw: number;
//   logp: number;
//   tpsa: number;
//   absorptionPercent: number;
//   caco2: number;          // Ex: -4.85
//   pgpInhibitor: number;   // Ex: 0.15
//   bbb: number;            // Ex: 0.50
//   ppb: number;
//   fu: number;
//   cyp1a2Substrate: number;// Ex: 0.80
//   cyp2d6Substrate: number;
//   cyp3a4Substrate: number;
//   clPlasma: number;
//   tHalf: number;
//   ames: number;           // Ex: 0.15
//   hepato: number;
//   herg: number;
//   lipinski: 'Pass' | 'Fail';
//   pfizer: 'Pass' | 'Fail';
//   qed: number;
// }

// // Funções puras de categorização baseadas na documentação do ADMETlab
// const parseCaco2 = (val: number): CategoricalBinary => 
//   [val, val > -5.15 ? 'Excelente' : 'Ruim'];

// const parseToxAndDist = (val: number): CategoricalTernary => {
//   if (val <= 0.3) return [val, 'Excelente'];
//   if (val <= 0.7) return [val, 'Médio'];
//   return [val, 'Ruim'];
// };

// const parseCyp = (val: number): CategoricalYesNo => 
//   [val, val > 0.5 ? 'Sim' : 'Não'];


// // A função principal que transforma o dado cru na nossa Interface rica
// export const adaptMoleculeResponse = (rawData: MoleculeApiResponse): Molecule => {
//   return {
//     ...rawData,
//     // Convertendo os números brutos nas Tuplas maravilhosas que criamos
//     caco2: parseCaco2(rawData.caco2),
//     pgpInhibitor: parseToxAndDist(rawData.pgpInhibitor),
//     bbb: parseToxAndDist(rawData.bbb),
//     cyp1a2Substrate: parseCyp(rawData.cyp1a2Substrate),
//     cyp2d6Substrate: parseCyp(rawData.cyp2d6Substrate),
//     cyp3a4Substrate: parseCyp(rawData.cyp3a4Substrate),
//     ames: parseToxAndDist(rawData.ames),
//     hepato: parseToxAndDist(rawData.hepato),
//     herg: parseToxAndDist(rawData.herg),
//   };
// };