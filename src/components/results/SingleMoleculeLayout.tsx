// src/components/results/SingleMoleculeLayout.tsx
import { Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DownloadIcon from '@mui/icons-material/Download';
import MoleculeDetail from './MoleculeDetail';
import type { Molecule } from '../../types/molecules.types';
import { MOCK_MOLECULES } from '../../mocks/molecules.mock';

interface SingleMoleculeLayoutProps {
  smiles?: string;
  onBack: () => void;
  // Agora recebemos a molécula real vinda do serviço
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
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `${mol.id}_admet.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const SingleMoleculeLayout = ({ smiles, onBack, molecule: propMolecule }: SingleMoleculeLayoutProps) => {
  // Fallback para o mock se não vier molécula por props
  const molecule = propMolecule || MOCK_MOLECULES[0];

  return (
    <div className="w-full h-[calc(100vh-65px)] flex flex-col bg-slate-50 animate-fade-in overflow-hidden">

      {/* HEADER UNIFICADO (Igual ao MoleculeDetailPage) */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-sm">
        
        {/* LADO ESQUERDO: Ação de Voltar */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 font-medium font-inter hover:text-blue-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-blue-50"
        >
          <ArrowBackIosIcon sx={{ fontSize: 13 }} />
          Voltar ao Início
        </button>

        {/* CENTRO: Identificação da análise atual */}
        <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
           <span className="font-inter text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Análise Única</span>
           <span className="font-mono text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 max-w-[150px] truncate">
            {smiles || molecule.smiles}
          </span>
        </div>

        {/* LADO DIREITO: Ações de Exportação */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<DownloadIcon sx={{ fontSize: 15 }} />}
            onClick={() => exportCsv(molecule)}
            className="normal-case font-inter font-semibold text-sm border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg px-3"
            sx={{ boxShadow: 'none' }}
          >
            Exportar CSV
          </Button>
        </div>
      </header>

      {/* CONTEÚDO SCROLLÁVEL */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <MoleculeDetail molecule={molecule} />
        </div>
      </main>
    </div>
  );
};

export default SingleMoleculeLayout;