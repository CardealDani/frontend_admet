// src/mocks/molecules.mock.ts
import { adaptMolecule } from '../utils/moleculeAdapter';
import type { MoleculeApiResponse } from '../utils/moleculeAdapter';
import type { Molecule } from '../types/molecules.types';

const getImageUrl = (id: string) => `src/assets/molecules/${id}.png`;

// Dicionário de Valores para forçar variação no Frontend:
// Probabilidades (AMES, Hepato, hERG, CYP, BBB, Pgp): 0.1 (Excelente/Não), 0.5 (Médio), 0.85 (Ruim/Sim/Tóxico)
// Caco-2: -4.5 (Excelente), -5.3 (Médio), -6.0 (Ruim)

export const RAW_MOLECULES: MoleculeApiResponse[] = [
  {
    id: 'MOL-001', 
    name: 'Aspirina', 
    smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O', 
    imgUrl: getImageUrl('MOL-001'),
    // Físico-Química e Drug-Likeness (Baseado no ADMETlab)
    mw: 180.04, logp: 1.19, tpsa: 63.6, qed: 0.55, lipinski: 'Pass', pfizer: 'Pass',
    // Absorção
    absorptionPercent: 95, 
    caco2: -4.98, // ADMETlab: -4.985 (Verde/Excelente)
    pgpInhibitor: 0.05, // ADMETlab: --- (Verde/Excelente)
    // Distribuição
    bbb: 0.95, // ADMETlab: +++ (Vermelho/Ruim - alta penetração indesejada)
    ppb: 60.3, // ADMETlab: 60.3%
    fu: 40.1,  // ADMETlab: 40.1%
    // Metabolismo (CYPs)
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.1, 
    // Excreção
    clPlasma: 2.76, // ADMETlab: 2.766
    tHalf: 0.82,    // ADMETlab: 0.822
    // Toxicidade
    ames: 0.25,   // ADMETlab: 0.256 (Verde/Excelente)
    herg: 0.01,   // ADMETlab: 0.015 (Verde/Excelente)
    hepato: 0.407  // ADMETlab (DILI): 0.744 (Vermelho/Ruim)
  },
  {
    id: 'MOL-002', name: 'Cafeína', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C', imgUrl: getImageUrl('MOL-002'),
    mw: 194.19, logp: -0.07, tpsa: 58.4, qed: 0.55, absorptionPercent: 99, caco2: -4.5, pgpInhibitor: 0.1, bbb: 0.85, ppb: 36, fu: 64,
    cyp1a2Substrate: 0.85, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.1, clPlasma: 1.4, tHalf: 5.0, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-003', name: 'Paracetamol', smiles: 'CC(=O)NC1=CC=C(O)C=C1', imgUrl: getImageUrl('MOL-003'),
    mw: 151.16, logp: 0.46, tpsa: 49.3, qed: 0.67, absorptionPercent: 89, caco2: -4.8, pgpInhibitor: 0.1, bbb: 0.1, ppb: 25, fu: 75,
    cyp1a2Substrate: 0.5, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.1, clPlasma: 18.0, tHalf: 2.5, ames: 0.1, hepato: 0.85, herg: 0.1, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-004', name: 'Ibuprofeno', smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O', imgUrl: getImageUrl('MOL-004'),
    mw: 206.13, logp: 3.574, tpsa: 37.3, qed: 0.822, absorptionPercent: 100, caco2: -4.301, pgpInhibitor: 0.1, bbb: 0.1, ppb: 99, fu: 1,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.5, cyp3a4Substrate: 0.1, clPlasma: 1.038, tHalf: 1.449, ames: 0.046, hepato: 0.74, herg: 0.165, lipinski: 'Pass', pfizer: 'Fail'
  },
  {
    id: 'MOL-005', name: 'Metformina', smiles: 'CN(C)C(=N)N=C(N)N', imgUrl: getImageUrl('MOL-005'),
    mw: 129.16, logp: -1.43, tpsa: 88.6, qed: 0.43, absorptionPercent: 55, caco2: -6.0, pgpInhibitor: 0.1, bbb: 0.1, ppb: 0, fu: 100,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.1, clPlasma: 110.0, tHalf: 6.2, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-006', name: 'Amoxicilina', smiles: 'CC1(C(N2C(S1)C(C2=O)NC(=O)C(C3=CC=C(C=C3)O)N)C(=O)O)C', imgUrl: getImageUrl('MOL-006'),
    mw: 365.4, logp: 0.87, tpsa: 158.2, qed: 0.59, absorptionPercent: 93, caco2: -5.3, pgpInhibitor: 0.1, bbb: 0.1, ppb: 18, fu: 82,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.1, clPlasma: 4.1, tHalf: 1.3, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Fail'
  },
  {
    id: 'MOL-007', name: 'Omeprazol', smiles: 'CC1=CN=C(C(=C1OC)C)CS(=O)C2=NC3=C(N2)C=C(C=C3)OC', imgUrl: getImageUrl('MOL-007'),
    mw: 345.42, logp: 2.23, tpsa: 97.8, qed: 0.62, absorptionPercent: 65, caco2: -5.3, pgpInhibitor: 0.85, bbb: 0.1, ppb: 95, fu: 5,
    cyp1a2Substrate: 0.85, cyp2d6Substrate: 0.85, cyp3a4Substrate: 0.85, clPlasma: 7.8, tHalf: 1.0, ames: 0.1, hepato: 0.5, herg: 0.1, lipinski: 'Pass', pfizer: 'Fail'
  },
  {
    id: 'MOL-008', name: 'Losartana', smiles: 'CCCCC1=NC(=C(N1CC2=CC=C(C=C2)C3=CC=CC=C3C4=NNN=N4)CO)Cl', imgUrl: getImageUrl('MOL-008'),
    mw: 422.91, logp: 4.01, tpsa: 93.5, qed: 0.52, absorptionPercent: 33, caco2: -6.0, pgpInhibitor: 0.5, bbb: 0.1, ppb: 99, fu: 1,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.5, clPlasma: 9.2, tHalf: 2.0, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Fail'
  },
  {
    id: 'MOL-009', name: 'Atorvastatina', smiles: 'CC(C)C1=C(C(=C(N1CCC(CC(CC(=O)O)O)O)C2=CC=C(C=C2)F)C3=CC=CC=C3)C(=O)NC4=CC=CC=C4', imgUrl: getImageUrl('MOL-009'),
    mw: 558.64, logp: 4.46, tpsa: 111.8, qed: 0.38, absorptionPercent: 14, caco2: -6.0, pgpInhibitor: 0.85, bbb: 0.1, ppb: 98, fu: 2,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.85, clPlasma: 65.0, tHalf: 14.0, ames: 0.1, hepato: 0.5, herg: 0.1, lipinski: 'Fail', pfizer: 'Fail'
  },
  {
    id: 'MOL-010', name: 'Azitromicina', smiles: 'CCC1C(C(C(N(CC(CC(C(C(C(C(C(=O)O1)C)OC2CC(C(C(O2)C)O)(C)OC)C)C)O)C)C)C)O)(C)O', imgUrl: getImageUrl('MOL-010'),
    mw: 749.0, logp: 3.98, tpsa: 180.1, qed: 0.12, absorptionPercent: 37, caco2: -6.0, pgpInhibitor: 0.85, bbb: 0.1, ppb: 50, fu: 50,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.85, clPlasma: 40.0, tHalf: 68.0, ames: 0.1, hepato: 0.5, herg: 0.5, lipinski: 'Fail', pfizer: 'Fail'
  },
  {
    id: 'MOL-011', name: 'Fluoxetina', smiles: 'CNC(C)CCC(C1=CC=CC=C1)OC2=CC=C(C=C2)C(F)(F)F', imgUrl: getImageUrl('MOL-011'),
    mw: 309.33, logp: 4.05, tpsa: 21.3, qed: 0.70, absorptionPercent: 72, caco2: -4.4, pgpInhibitor: 0.5, bbb: 0.85, ppb: 94, fu: 6,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.85, cyp3a4Substrate: 0.1, clPlasma: 14.7, tHalf: 48.0, ames: 0.1, hepato: 0.1, herg: 0.5, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-012', name: 'Sertralina', smiles: 'CNC1CCC(C2=CC=CC=C12)C3=CC(=C(C=C3)Cl)Cl', imgUrl: getImageUrl('MOL-012'),
    mw: 306.23, logp: 4.39, tpsa: 12.0, qed: 0.75, absorptionPercent: 44, caco2: -4.5, pgpInhibitor: 0.85, bbb: 0.85, ppb: 98, fu: 2,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.85, cyp3a4Substrate: 0.1, clPlasma: 25.0, tHalf: 26.0, ames: 0.1, hepato: 0.1, herg: 0.5, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-013', name: 'Diazepam', smiles: 'CC1=C(C=C(C=C1)Cl)N(C(=O)CN=C2C3=CC=CC=C3)C', imgUrl: getImageUrl('MOL-013'),
    mw: 284.74, logp: 2.82, tpsa: 32.7, qed: 0.76, absorptionPercent: 99, caco2: -4.3, pgpInhibitor: 0.1, bbb: 0.85, ppb: 98, fu: 2,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.85, clPlasma: 0.9, tHalf: 43.0, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-014', name: 'Ciprofloxacino', smiles: 'C1CC1N2C=C(C(=O)C3=CC(=C(C=C32)N4CCNCC4)F)C(=O)O', imgUrl: getImageUrl('MOL-014'),
    mw: 331.34, logp: 0.28, tpsa: 74.6, qed: 0.73, absorptionPercent: 70, caco2: -5.3, pgpInhibitor: 0.5, bbb: 0.1, ppb: 40, fu: 60,
    cyp1a2Substrate: 0.5, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.1, clPlasma: 9.8, tHalf: 4.0, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-015', name: 'Pantoprazol', smiles: 'CC1=CN=C(C(=C1)OC)CS(=O)C2=NC3=C(N2)C=CC(=C3)OC(F)F', imgUrl: getImageUrl('MOL-015'),
    mw: 383.37, logp: 2.05, tpsa: 97.8, qed: 0.58, absorptionPercent: 77, caco2: -5.3, pgpInhibitor: 0.5, bbb: 0.1, ppb: 98, fu: 2,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.85, cyp3a4Substrate: 0.5, clPlasma: 6.4, tHalf: 1.5, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Fail'
  },
  {
    id: 'MOL-016', name: 'Simvastatina', smiles: 'CCC(C)(C)C(=O)OC1CC(C=C2C1C(C(C=C2)C)CCC3CC(CC(=O)O3)O)C', imgUrl: getImageUrl('MOL-016'),
    mw: 418.57, logp: 4.68, tpsa: 72.8, qed: 0.49, absorptionPercent: 50, caco2: -4.8, pgpInhibitor: 0.85, bbb: 0.1, ppb: 95, fu: 5,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.85, clPlasma: 30.0, tHalf: 3.0, ames: 0.1, hepato: 0.5, herg: 0.1, lipinski: 'Pass', pfizer: 'Fail'
  },
  {
    id: 'MOL-017', name: 'Amlodipina', smiles: 'CCOC(=O)C1=C(NC(=C(C1C2=CC=CC(=C2)Cl)C(=O)OC)C)COCCN', imgUrl: getImageUrl('MOL-017'),
    mw: 408.88, logp: 2.22, tpsa: 87.6, qed: 0.51, absorptionPercent: 64, caco2: -5.3, pgpInhibitor: 0.5, bbb: 0.1, ppb: 93, fu: 7,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.85, clPlasma: 42.0, tHalf: 35.0, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Fail'
  },
  {
    id: 'MOL-018', name: 'Metoprolol', smiles: 'CC(C)NCC(COC1=CC=C(C=C1)CCOC)O', imgUrl: getImageUrl('MOL-018'),
    mw: 267.36, logp: 1.88, tpsa: 50.7, qed: 0.71, absorptionPercent: 95, caco2: -4.8, pgpInhibitor: 0.1, bbb: 0.85, ppb: 12, fu: 88,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.85, cyp3a4Substrate: 0.1, clPlasma: 14.7, tHalf: 3.5, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-019', name: 'Lisinopril', smiles: 'C1CC(N(C1)C(=O)C(CCC2=CC=CC=C2)NC(CCCCN)C(=O)O)C(=O)O', imgUrl: getImageUrl('MOL-019'),
    mw: 405.49, logp: -0.94, tpsa: 116.5, qed: 0.46, absorptionPercent: 25, caco2: -6.0, pgpInhibitor: 0.1, bbb: 0.1, ppb: 0, fu: 100,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.1, clPlasma: 5.0, tHalf: 12.0, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Fail'
  },
  {
    id: 'MOL-020', name: 'Escitalopram', smiles: 'CN(C)CCCC1(C2=C(CO1)C=C(C=C2)C#N)C3=CC=C(C=C3)F', imgUrl: getImageUrl('MOL-020'),
    mw: 324.39, logp: 3.41, tpsa: 33.0, qed: 0.73, absorptionPercent: 80, caco2: -4.5, pgpInhibitor: 0.1, bbb: 0.85, ppb: 56, fu: 44,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.85, cyp3a4Substrate: 0.5, clPlasma: 35.0, tHalf: 30.0, ames: 0.1, hepato: 0.1, herg: 0.5, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-021', name: 'Alprazolam', smiles: 'CC1=NN=C2N1C3=C(C=CC(=C3)Cl)C(=NC2)C4=CC=CC=C4', imgUrl: getImageUrl('MOL-021'),
    mw: 308.76, logp: 2.12, tpsa: 43.1, qed: 0.77, absorptionPercent: 90, caco2: -4.3, pgpInhibitor: 0.1, bbb: 0.85, ppb: 80, fu: 20,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.85, clPlasma: 1.0, tHalf: 11.0, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-022', name: 'Valsartana', smiles: 'CCCCC(=O)N(CC1=CC=C(C=C1)C2=CC=CC=C2C3=NNN=N3)C(C(C)C)C(=O)O', imgUrl: getImageUrl('MOL-022'),
    mw: 435.52, logp: 4.1, tpsa: 111.9, qed: 0.44, absorptionPercent: 25, caco2: -5.3, pgpInhibitor: 0.1, bbb: 0.1, ppb: 95, fu: 5,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.1, clPlasma: 2.2, tHalf: 6.0, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Fail'
  },
  {
    id: 'MOL-023', name: 'Meloxicam', smiles: 'CC1=C(SC(=N1)NC(=O)C2=C(C=CC=C2S(=O)(=O)C)O)C', imgUrl: getImageUrl('MOL-023'),
    mw: 351.4, logp: 2.5, tpsa: 114.2, qed: 0.65, absorptionPercent: 89, caco2: -4.8, pgpInhibitor: 0.1, bbb: 0.1, ppb: 99, fu: 1,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.1, clPlasma: 0.7, tHalf: 20.0, ames: 0.1, hepato: 0.5, herg: 0.1, lipinski: 'Pass', pfizer: 'Fail'
  },
  {
    id: 'MOL-024', name: 'Diclofenaco', smiles: 'C1=CC=C(C(=C1)CC(=O)O)NC2=C(C=CC=C2Cl)Cl', imgUrl: getImageUrl('MOL-024'),
    mw: 296.15, logp: 4.25, tpsa: 49.3, qed: 0.77, absorptionPercent: 100, caco2: -4.4, pgpInhibitor: 0.1, bbb: 0.1, ppb: 99, fu: 1,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.5, cyp3a4Substrate: 0.1, clPlasma: 16.0, tHalf: 2.0, ames: 0.1, hepato: 0.85, herg: 0.5, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-025', name: 'Naproxeno', smiles: 'CC(C1=CC2=C(C=C1)C=C(C=C2)OC)C(=O)O', imgUrl: getImageUrl('MOL-025'),
    mw: 230.09, logp: 2.893, tpsa: 46.5, qed: 0.81, absorptionPercent: 99, caco2: -4.524, pgpInhibitor: 0.1, bbb: 0.1, ppb: 99, fu: 1,
    cyp1a2Substrate: 0.5, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.1, clPlasma:	0.51, tHalf: 1.736, ames: 0.298, hepato: 0.662, herg: 0.146, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-026', name: 'Celecoxibe', smiles: 'CC1=CC=C(C=C1)C2=CC(=NN2C3=CC=C(C=C3)S(=O)(=O)N)C(F)(F)F', imgUrl: getImageUrl('MOL-026'),
    mw: 381.37, logp: 3.53, tpsa: 86.3, qed: 0.65, absorptionPercent: 74, caco2: -4.9, pgpInhibitor: 0.1, bbb: 0.1, ppb: 97, fu: 3,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.5, cyp3a4Substrate: 0.1, clPlasma: 28.0, tHalf: 11.0, ames: 0.1, hepato: 0.1, herg: 0.5, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-027', name: 'Ranitidina', smiles: 'CN/C(=C\\N[N+](=O)[O-])/NCCSC1=CC=C(O1)CN(C)C', imgUrl: getImageUrl('MOL-027'),
    mw: 314.4, logp: 0.27, tpsa: 115.5, qed: 0.43, absorptionPercent: 50, caco2: -5.3, pgpInhibitor: 0.5, bbb: 0.1, ppb: 15, fu: 85,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.1, clPlasma: 43.0, tHalf: 2.5, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Fail'
  },
  {
    id: 'MOL-028', name: 'Famotidina', smiles: 'C(CSC1=C(N=C(S1)N)N)N=C(N)NS(=O)(=O)N', imgUrl: getImageUrl('MOL-028'),
    mw: 337.45, logp: -0.64, tpsa: 178.5, qed: 0.28, absorptionPercent: 40, caco2: -6.0, pgpInhibitor: 0.1, bbb: 0.1, ppb: 15, fu: 85,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.1, clPlasma: 30.0, tHalf: 3.0, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Fail'
  },
  {
    id: 'MOL-029', name: 'Ácido Ascórbico', smiles: 'C(C(C1C(=C(C(=O)O1)O)O)O)O', imgUrl: getImageUrl('MOL-029'),
    mw: 176.12, logp: -1.64, tpsa: 107.2, qed: 0.44, absorptionPercent: 100, caco2: -6.0, pgpInhibitor: 0.1, bbb: 0.1, ppb: 0, fu: 100,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.1, clPlasma: 0.0, tHalf: 1.0, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Fail'
  },
  {
    id: 'MOL-030', name: 'Retinol', smiles: 'CC1=C(C(CCC1)(C)C)C=CC=C(C)C=CC=C(C)C=CO', imgUrl: getImageUrl('MOL-030'),
    mw: 286.45, logp: 5.68, tpsa: 20.2, qed: 0.45, absorptionPercent: 100, caco2: -4.5, pgpInhibitor: 0.1, bbb: 0.85, ppb: 99, fu: 1,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.5, clPlasma: 5.0, tHalf: 12.0, ames: 0.1, hepato: 0.5, herg: 0.1, lipinski: 'Fail', pfizer: 'Pass'
  },
  {
    id: 'MOL-031', name: 'Colecalciferol', smiles: 'CC(CCCC(C)C)C1CCC2C1(CCCC2=CC=C3CC(CCC3=C)O)C', imgUrl: getImageUrl('MOL-031'),
    mw: 384.64, logp: 7.21, tpsa: 20.2, qed: 0.23, absorptionPercent: 80, caco2: -4.5, pgpInhibitor: 0.1, bbb: 0.85, ppb: 99, fu: 1,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.5, clPlasma: 2.0, tHalf: 480.0, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Fail', pfizer: 'Pass'
  },
  {
    id: 'MOL-032', name: 'Melatonina', smiles: 'CC(=O)NCCC1=CNC2=C1C=C(C=C2)OC', imgUrl: getImageUrl('MOL-032'),
    mw: 232.28, logp: 1.65, tpsa: 54.1, qed: 0.77, absorptionPercent: 80, caco2: -4.5, pgpInhibitor: 0.1, bbb: 0.85, ppb: 60, fu: 40,
    cyp1a2Substrate: 0.85, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.1, clPlasma: 18.0, tHalf: 0.8, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-033', name: 'Serotonina', smiles: 'C1=CC2=C(C=C1O)C(=CN2)CCN', imgUrl: getImageUrl('MOL-033'),
    mw: 176.21, logp: 0.21, tpsa: 62.0, qed: 0.61, absorptionPercent: 80, caco2: -5.3, pgpInhibitor: 0.1, bbb: 0.1, ppb: 0, fu: 100,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.5, cyp3a4Substrate: 0.1, clPlasma: 40.0, tHalf: 1.0, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-034', name: 'Dopamina', smiles: 'C1=CC(=C(C=C1CCN)O)O', imgUrl: getImageUrl('MOL-034'),
    mw: 153.18, logp: -0.98, tpsa: 66.5, qed: 0.54, absorptionPercent: 90, caco2: -5.3, pgpInhibitor: 0.1, bbb: 0.1, ppb: 0, fu: 100,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.85, cyp3a4Substrate: 0.1, clPlasma: 120.0, tHalf: 0.1, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-035', name: 'Adrenalina', smiles: 'CNC[C@H](C1=CC(=C(C=C1)O)O)O', imgUrl: getImageUrl('MOL-035'),
    mw: 183.2, logp: -1.37, tpsa: 77.5, qed: 0.49, absorptionPercent: 85, caco2: -6.0, pgpInhibitor: 0.1, bbb: 0.1, ppb: 50, fu: 50,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.1, clPlasma: 100.0, tHalf: 0.1, ames: 0.1, hepato: 0.1, herg: 0.5, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-036', name: 'Histamina', smiles: 'C1=C(NC=N1)CCN', imgUrl: getImageUrl('MOL-036'),
    mw: 111.15, logp: -0.7, tpsa: 54.7, qed: 0.46, absorptionPercent: 99, caco2: -4.8, pgpInhibitor: 0.1, bbb: 0.1, ppb: 0, fu: 100,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.1, clPlasma: 200.0, tHalf: 0.2, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-037', name: 'Cortisol', smiles: 'CC12CCC(=O)C=C1CCC3C2C(CC4(C3CCC4(C(=O)CO)O)C)O', imgUrl: getImageUrl('MOL-037'),
    mw: 362.46, logp: 1.61, tpsa: 94.8, qed: 0.65, absorptionPercent: 96, caco2: -5.3, pgpInhibitor: 0.85, bbb: 0.5, ppb: 90, fu: 10,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.85, clPlasma: 3.0, tHalf: 1.5, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Fail'
  },
  {
    id: 'MOL-038', name: 'Testosterona', smiles: 'CC12CCC3C(C1CCC2=O)CCC4(C3CCC4O)C', imgUrl: getImageUrl('MOL-038'),
    mw: 288.42, logp: 3.32, tpsa: 37.3, qed: 0.72, absorptionPercent: 99, caco2: -4.5, pgpInhibitor: 0.1, bbb: 0.85, ppb: 98, fu: 2,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.85, clPlasma: 15.0, tHalf: 0.5, ames: 0.1, hepato: 0.5, herg: 0.1, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-039', name: 'Estradiol', smiles: 'CC12CCC3C(C1CCC2O)CCC4=C3C=CC(=C4)O', imgUrl: getImageUrl('MOL-039'),
    mw: 272.38, logp: 4.01, tpsa: 40.5, qed: 0.75, absorptionPercent: 98, caco2: -4.5, pgpInhibitor: 0.1, bbb: 0.85, ppb: 98, fu: 2,
    cyp1a2Substrate: 0.5, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.85, clPlasma: 18.0, tHalf: 1.0, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-040', name: 'Progesterona', smiles: 'CC(=O)C1CCC2C1(CCC3C2CCC4=CC(=O)CCC34C)C', imgUrl: getImageUrl('MOL-040'),
    mw: 314.46, logp: 3.87, tpsa: 34.1, qed: 0.71, absorptionPercent: 100, caco2: -4.5, pgpInhibitor: 0.1, bbb: 0.85, ppb: 98, fu: 2,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.85, clPlasma: 35.0, tHalf: 0.3, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-041', name: 'Nicotina', smiles: 'CN1CCCC1C2=CN=CC=C2', imgUrl: getImageUrl('MOL-041'),
    mw: 162.23, logp: 1.17, tpsa: 16.1, qed: 0.69, absorptionPercent: 100, caco2: -4.5, pgpInhibitor: 0.1, bbb: 0.85, ppb: 5, fu: 95,
    cyp1a2Substrate: 0.85, cyp2d6Substrate: 0.85, cyp3a4Substrate: 0.1, clPlasma: 60.0, tHalf: 2.0, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-042', name: 'Teofilina', smiles: 'CN1C2=C(C(=O)N(C1=O)C)NC=N2', imgUrl: getImageUrl('MOL-042'),
    mw: 180.16, logp: -0.02, tpsa: 71.4, qed: 0.63, absorptionPercent: 100, caco2: -4.8, pgpInhibitor: 0.1, bbb: 0.1, ppb: 40, fu: 60,
    cyp1a2Substrate: 0.85, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.1, clPlasma: 3.0, tHalf: 8.0, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-043', name: 'Cloroquina', smiles: 'CCN(CC)CCCC(C)NC1=C2C=CC(=CC2=NC=C1)Cl', imgUrl: getImageUrl('MOL-043'),
    mw: 319.18, logp:4.733, tpsa: 28.16, qed: 0.756, absorptionPercent: 95, caco2: -4.8, pgpInhibitor: 0.5, bbb: 0.85, ppb: 55, fu: 45,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.85, cyp3a4Substrate: 0.85, clPlasma: 6.0, tHalf: 1200.0, ames: 0.512, hepato: 0.727, herg: 0.958, lipinski: 'Pass', pfizer: 'Fail'
  },
  {
    id: 'MOL-044', name: 'Hidroxicloroquina', smiles: 'CCN(CCO)CCCC(C)NC1=C2C=CC(=CC2=NC=C1)Cl', imgUrl: getImageUrl('MOL-044'),
    mw: 335.87, logp: 3.84, tpsa: 48.4, qed: 0.68, absorptionPercent: 74, caco2: -5.3, pgpInhibitor: 0.5, bbb: 0.85, ppb: 50, fu: 50,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.5, cyp3a4Substrate: 0.5, clPlasma: 5.5, tHalf: 960.0, ames: 0.1, hepato: 0.1, herg: 0.5, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-045', name: 'Haloperidol', smiles: 'C1CN(CCC1(C2=CC=C(C=C2)Cl)O)CCCC(=O)C3=CC=C(C=C3)F', imgUrl: getImageUrl('MOL-045'),
    mw: 375.86, logp: 4.3, tpsa: 40.5, qed: 0.67, absorptionPercent: 60, caco2: -4.8, pgpInhibitor: 0.85, bbb: 0.85, ppb: 92, fu: 8,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.85, cyp3a4Substrate: 0.85, clPlasma: 12.0, tHalf: 24.0, ames: 0.1, hepato: 0.5, herg: 0.85, lipinski: 'Pass', pfizer: 'Pass'
  },
  {
    id: 'MOL-046', name: 'Cetoconazol', smiles: 'CC1=CC=C(C=C1)N2C=CN=C2', imgUrl: getImageUrl('MOL-046'),
    mw: 531.43, logp: 4.34, tpsa: 67.5, qed: 0.35, absorptionPercent: 75, caco2: -4.8, pgpInhibitor: 0.85, bbb: 0.1, ppb: 99, fu: 1,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.85, clPlasma: 15.0, tHalf: 8.0, ames: 0.481, hepato: 0.629, herg: 0.403, lipinski: 'Fail', pfizer: 'Fail'
  },
  {
    id: 'MOL-047', name: 'Fluconazol', smiles: 'C1=CN(C=N1)CC(CN2C=NC=N2)(C3=C(C=C(C=C3)F)F)O', imgUrl: getImageUrl('MOL-047'),
    mw: 306.27, logp: 0.5, tpsa: 81.7, qed: 0.61, absorptionPercent: 90, caco2: -5.3, pgpInhibitor: 0.1, bbb: 0.5, ppb: 11, fu: 89,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.85, clPlasma: 0.3, tHalf: 30.0, ames: 0.1, hepato: 0.5, herg: 0.1, lipinski: 'Pass', pfizer: 'Fail'
  },
  {
    id: 'MOL-048', name: 'Oseltamivir', smiles: 'CCC(CC)OC1C=C(CC(C1NC(=O)C)N)C(=O)OCC', imgUrl: getImageUrl('MOL-048'),
    mw: 312.4, logp: 1.1, tpsa: 92.4, qed: 0.52, absorptionPercent: 80, caco2: -6.0, pgpInhibitor: 0.5, bbb: 0.1, ppb: 42, fu: 58,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.1, clPlasma: 22.0, tHalf: 3.0, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Fail'
  },
  {
    id: 'MOL-049', name: 'Sildenafil', smiles: 'CCCC1=NN(C2=C1N=C(NC2=O)C3=C(C=CC(=C3)S(=O)(=O)N4CCN(CC4)C)OCCC)C', imgUrl: getImageUrl('MOL-049'),
    mw: 474.58, logp: 2.26, tpsa: 115.2, qed: 0.45, absorptionPercent: 41, caco2: -6.0, pgpInhibitor: 0.85, bbb: 0.1, ppb: 96, fu: 4,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.85, clPlasma: 41.0, tHalf: 4.0, ames: 0.1, hepato: 0.1, herg: 0.5, lipinski: 'Pass', pfizer: 'Fail'
  },
  {
    id: 'MOL-050', name: 'Tadalafil', smiles: 'CN1CC(=O)N2C(C1)C3=C(NC4=CC=CC=C34)C(C2)C5=CC6=C(C=C5)OCO6', imgUrl: getImageUrl('MOL-050'),
    mw: 389.4, logp: 2.5, tpsa: 74.5, qed: 0.62, absorptionPercent: 60, caco2: -5.3, pgpInhibitor: 0.85, bbb: 0.1, ppb: 94, fu: 6,
    cyp1a2Substrate: 0.1, cyp2d6Substrate: 0.1, cyp3a4Substrate: 0.85, clPlasma: 2.5, tHalf: 17.5, ames: 0.1, hepato: 0.1, herg: 0.1, lipinski: 'Pass', pfizer: 'Pass'
  }
];

export const MOCK_MOLECULES: Molecule[] = RAW_MOLECULES.map(adaptMolecule);