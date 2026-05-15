// src/hooks/useMoleculeFilter.ts
import { useMemo } from 'react';
import type { AdmetFilters } from '../types/filters';
import type { Molecule } from '../types/molecules.types';

const applyFilters = (molecules: Molecule[], f: AdmetFilters): Molecule[] => {
  return molecules.filter(mol => {

    // ── Físico-Química ──────────────────────────────────────────────────────
    if (f.pfq.mw.active) { const [min, max] = f.pfq.mw.value; if (mol.mw < min || mol.mw > max) return false; }
    if (f.pfq.logp.active) { const [min, max] = f.pfq.logp.value; if (mol.logp < min || mol.logp > max) return false; }
    if (f.pfq.tpsa.active) { const [min, max] = f.pfq.tpsa.value; if (mol.tpsa < min || mol.tpsa > max) return false; }

    // ── MedChem ─────────────────────────────────────────────────────────────
    if (f.medchem.lipinski && mol.lipinski !== 'Pass') return false;
    if (f.medchem.pfizer && mol.pfizer !== 'Pass') return false;
    if (f.medchem.qed.active) { const [min, max] = f.medchem.qed.value; if (mol.qed < min || mol.qed > max) return false; }

    // ── Absorção ────────────────────────────────────────────────────────────
    if (f.absorption.absorptionPercent.active) {
      const [min, max] = f.absorption.absorptionPercent.value;
      if (mol.absorptionPercent < min || mol.absorptionPercent > max) return false;
    }
    const activeCaco2 = f.absorption.caco2.filter(Boolean);
    if (activeCaco2.length > 0 && !activeCaco2.includes(mol.caco2.category)) return false;

    const activePgp = f.absorption.pgpInhibitor.filter(Boolean);
    if (activePgp.length > 0 && !activePgp.includes(mol.pgpInhibitor.category)) return false;

    // ── Distribuição ────────────────────────────────────────────────────────
    const activeBbb = f.distribution.bbb.filter(Boolean);
    if (activeBbb.length > 0 && !activeBbb.includes(mol.bbb.category)) return false;

    if (f.distribution.ppb.active) { const [min, max] = f.distribution.ppb.value; if (mol.ppb < min || mol.ppb > max) return false; }
    if (f.distribution.fu.active) { const [min, max] = f.distribution.fu.value; if (mol.fu < min || mol.fu > max) return false; }

    // ── Metabolismo ─────────────────────────────────────────────────────────
    const activeCyp1a2 = f.metabolism.cyp1a2Substrate.filter(Boolean);
    if (activeCyp1a2.length > 0 && !activeCyp1a2.includes(mol.cyp1a2Substrate.category)) return false;

    const activeCyp2d6 = f.metabolism.cyp2d6Substrate.filter(Boolean);
    if (activeCyp2d6.length > 0 && !activeCyp2d6.includes(mol.cyp2d6Substrate.category)) return false;

    const activeCyp3a4 = f.metabolism.cyp3a4Substrate.filter(Boolean);
    if (activeCyp3a4.length > 0 && !activeCyp3a4.includes(mol.cyp3a4Substrate.category)) return false;

    // ── Excreção ────────────────────────────────────────────────────────────
    if (f.excretion.clPlasma.active) { const [min, max] = f.excretion.clPlasma.value; if (mol.clPlasma < min || mol.clPlasma > max) return false; }
    if (f.excretion.tHalf.active) { const [min, max] = f.excretion.tHalf.value; if (mol.tHalf < min || mol.tHalf > max) return false; }

    // ── Toxicidade ──────────────────────────────────────────────────────────
    const activeAmes = f.toxicity.ames.filter(Boolean);
    if (activeAmes.length > 0 && !activeAmes.includes(mol.ames.category)) return false;

    const activeHepato = f.toxicity.hepato.filter(Boolean);
    if (activeHepato.length > 0 && !activeHepato.includes(mol.hepato.category)) return false;

    const activeHerg = f.toxicity.herg.filter(Boolean);
    if (activeHerg.length > 0 && !activeHerg.includes(mol.herg.category)) return false;

    return true;
  });
};

export interface UseMoleculeFilterReturn {
  filteredMolecules: Molecule[];
  totalCount: number;
  filteredCount: number;
}

export const useMoleculeFilter = (molecules: Molecule[], appliedFilters: AdmetFilters): UseMoleculeFilterReturn => {
  const filteredMolecules = useMemo(
    () => applyFilters(molecules, appliedFilters),
    [molecules, appliedFilters]
  );
  return {
    filteredMolecules,
    totalCount: molecules.length,
    filteredCount: filteredMolecules.length,
  };
};