// src/components/results/SingleMoleculeLayout.tsx
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';

import MoleculeDetail from './MoleculeDetail';
import { MOCK_MOLECULES } from '../../mocks/molecules.mock';
import type { Molecule } from '../../types/molecules.types';

interface SingleMoleculeLayoutProps {
  smiles?: string;
  onBack: () => void;
}

const exportCsv = (mol: Molecule) => {
  const headers = [
    'ID','Nome','SMILES','MW','LogP','TPSA','QED',
    'HIA%','Caco-2 (cat)','Caco-2 (raw)',
    'P-gp (cat)','P-gp (raw)',
    'BBB (cat)','BBB (raw)','PPB%','Fu%',
    'CYP1A2 (cat)','CYP1A2 (raw)',
    'CYP2D6 (cat)','CYP2D6 (raw)',
    'CYP3A4 (cat)','CYP3A4 (raw)',
    'CL Plasmático','T½',
    'AMES (cat)','AMES (raw)',
    'hERG (cat)','hERG (raw)',
    'Hepato (cat)','Hepato (raw)',
    'Lipinski','Pfizer',
  ];
  const row = [
    mol.id, mol.name, mol.smiles,
    mol.mw, mol.logp, mol.tpsa, mol.qed,
    mol.absorptionPercent,
    mol.caco2.category,       mol.caco2.raw,
    mol.pgpInhibitor.category, mol.pgpInhibitor.raw,
    mol.bbb.category,          mol.bbb.raw,
    mol.ppb, mol.fu,
    mol.cyp1a2Substrate.category, mol.cyp1a2Substrate.raw,
    mol.cyp2d6Substrate.category, mol.cyp2d6Substrate.raw,
    mol.cyp3a4Substrate.category, mol.cyp3a4Substrate.raw,
    mol.clPlasma, mol.tHalf,
    mol.ames.category,   mol.ames.raw,
    mol.herg.category,   mol.herg.raw,
    mol.hepato.category, mol.hepato.raw,
    mol.lipinski, mol.pfizer,
  ];
  const csv  = [headers.join(','), row.join(',')].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `${mol.id}_admet.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const SingleMoleculeLayout = ({ smiles, onBack }: SingleMoleculeLayoutProps) => {
  const molecule = MOCK_MOLECULES[0];

  return (
    <div className="w-full h-[calc(100vh-65px)] flex flex-col bg-slate-50 overflow-hidden">

      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-inter text-xs text-gray-400 font-medium">Análise de Molécula Única</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md max-w-xs truncate">
            {smiles || molecule.smiles}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="text" size="small" startIcon={<AddIcon sx={{ fontSize: 16 }} />} onClick={onBack}
            className="normal-case font-inter font-semibold text-sm text-blue-600 hover:bg-blue-50 px-3 rounded-lg">
            Nova Predição
          </Button>
          <div className="w-px h-5 bg-gray-200" />
          <Button variant="outlined" size="small" startIcon={<DownloadIcon sx={{ fontSize: 15 }} />}
            onClick={() => exportCsv(molecule)}
            className="normal-case font-inter font-semibold text-sm border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg px-3"
            sx={{ boxShadow: 'none' }}>
            Exportar CSV
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <MoleculeDetail molecule={molecule} />
        </div>
      </div>
    </div>
  );
};

export default SingleMoleculeLayout;