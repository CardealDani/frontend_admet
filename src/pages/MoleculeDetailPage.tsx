// src/pages/MoleculeDetailPage.tsx
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

import MoleculeDetail from '../components/results/MoleculeDetail';
import type { Molecule } from '../types/molecules.types';

// Lógica completa de exportação do CSV
const exportSingleCsv = (mol: Molecule) => {
  const headers = [
    'ID','Nome','SMILES','MW','LogP','TPSA','QED',
    'HIA%','Caco-2 (cat)','Caco-2 (value)',
    'P-gp (cat)','P-gp (value)',
    'BBB (cat)','BBB (value)','PPB%','Fu%',
    'CYP1A2 (cat)','CYP1A2 (value)',
    'CYP2D6 (cat)','CYP2D6 (value)',
    'CYP3A4 (cat)','CYP3A4 (value)',
    'CL Plasmático','T½',
    'AMES (cat)','AMES (value)',
    'hERG (cat)','hERG (value)',
    'Hepato (cat)','Hepato (value)',
    'Lipinski','Pfizer',
  ];
  
  const row = [
    mol.id, mol.name, mol.smiles,
    mol.mw, mol.logp, mol.tpsa, mol.qed,
    mol.absorptionPercent,
    mol.caco2.category, mol.caco2.raw,
    mol.pgpInhibitor.category, mol.pgpInhibitor.raw,
    mol.bbb.category, mol.bbb.raw,
    mol.ppb, mol.fu,
    mol.cyp1a2Substrate.category, mol.cyp1a2Substrate.raw,
    mol.cyp2d6Substrate.category, mol.cyp2d6Substrate.raw,
    mol.cyp3a4Substrate.category, mol.cyp3a4Substrate.raw,
    mol.clPlasma, mol.tHalf,
    mol.ames.category, mol.ames.raw,
    mol.herg.category, mol.herg.raw,
    mol.hepato.category, mol.hepato.raw,
    mol.lipinski, mol.pfizer,
  ];

  const csv = [headers.join(','), row.join(',')].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `${mol.id}_admet_report.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
interface MoleculeDetailPageProps {
  molecule: Molecule;
}

const MoleculeDetailPage = ({ molecule }: MoleculeDetailPageProps) => {
  
  return (
    <div className="w-full flex h-full bg-slate-50 flex-col">

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
            onClick={() => exportSingleCsv(molecule)}
            className="normal-case font-nunito_sans font-bold text-xs bg-blue-600 text-white font-nunito_sans hover:bg-blue-700 rounded-lg px-6 py-1.5"
            sx={{ boxShadow: 'none' }}
          >
            Baixar Relatório
          </Button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <MoleculeDetail molecule={molecule} />
        </div>
      </main>
    </div>
  );
};

export default MoleculeDetailPage;
