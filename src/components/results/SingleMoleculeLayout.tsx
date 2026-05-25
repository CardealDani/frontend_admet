// src/components/results/SingleMoleculeLayout.tsx
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import MoleculeDetail from './MoleculeDetail';
import type { Molecule } from '../../types/molecules.types';
import { MOCK_MOLECULES } from '../../mocks/molecules.mock';

interface SingleMoleculeLayoutProps {
  molecule?: Molecule; 
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
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `${mol.id}_admet.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const SingleMoleculeLayout = ({ molecule: propMolecule }: SingleMoleculeLayoutProps) => {
  // Fallback para o mock se não vier molécula por props
  const molecule = propMolecule || MOCK_MOLECULES[0];

  return (
    <div className="w-full h-[calc(100vh-65px)] flex flex-col bg-slate-50 animate-fade-in overflow-hidden">

      {/* SUB-HEADER DA PÁGINA (Apenas utilitários, sem botão de navegação) */}
      <div className="w-full max-w-6xl mx-auto px-6 pt-4 flex items-center justify-between shrink-0">
        
        {/* LADO ESQUERDO: Título Limpo */}
        <div className="flex flex-col">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visualização de Relatório</span>
          <h2 className="font-nunito_sans font-extrabold text-slate-700 text-sm mt-0.5">Propriedades Farmacocinéticas Avançadas</h2>
        </div>

        {/* LADO DIREITO: Download */}
        <div className="flex items-center gap-2">
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
            onClick={() => exportCsv(molecule)}
            className="normal-case font-inter font-semibold text-xs bg-white border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg px-6 py-1.5"
            sx={{ boxShadow: 'none' }}
          >
            Baixar Relatório
          </Button>
        </div>
      </div>

      {/* CONTEÚDO SCROLLÁVEL */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <MoleculeDetail molecule={molecule} />
        </div>
      </main>
    </div>
  );
};

export default SingleMoleculeLayout;