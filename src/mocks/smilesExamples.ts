// src/mocks/smilesExamples.ts
import { RAW_MOLECULES } from './molecules.mock';

export interface SmilesExample {
  name: string;
  smiles: string;
}

export const SAFE_EXAMPLES: SmilesExample[] = RAW_MOLECULES.map(mol => ({
  name: mol.name,
  smiles: mol.smiles
}));