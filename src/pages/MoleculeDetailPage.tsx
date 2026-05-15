// src/pages/MoleculeDetailPage.tsx
import { Button, Tooltip } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';

import MoleculeDetail from '../components/results/MoleculeDetail';
import type { Molecule } from '../types/molecules.types';

// ─── Export CSV de uma molécula (Atualizado para o formato .category e .raw) ───

const exportSingleCsv = (mol: Molecule) => {
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
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `${mol.id}_admet.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Página Transformada em View Component ────────────────────────────────────

interface MoleculeDetailPageProps {
  molecule: Molecule;
  onBack: () => void;
}

const MoleculeDetailPage = ({ molecule, onBack }: MoleculeDetailPageProps) => {
  return (
    <div className="w-full flex h-[calc(100vh-65px)] animate-fade-in bg-slate-50 mt-[-2rem] md:mt-0 flex-col">

      {/* ── TOPBAR ─────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-sm">

        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 font-medium font-inter hover:text-blue-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-blue-50"
        >
          <ArrowBackIosIcon sx={{ fontSize: 13 }} />
          Voltar à Tabela
        </button>

        {/* Info Central */}
        <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <span className="font-mono text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            {molecule.id}
          </span>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2">
          <Tooltip title="A URL simula um link para compartilhamento">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/?molecule=${molecule.id}`);
                alert('Link de compartilhamento simulado copiado!');
              }}
              className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <ShareIcon sx={{ fontSize: 17 }} />
            </button>
          </Tooltip>

          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon sx={{ fontSize: 15 }} />}
            onClick={() => exportSingleCsv(molecule)}
            className="normal-case font-inter font-semibold text-sm border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg px-3"
            sx={{ boxShadow: 'none' }}
          >
            Baixar Relatório (CSV)
          </Button>
        </div>
      </header>

      {/* ── CONTEÚDO ───────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <MoleculeDetail molecule={molecule} />
        </div>
      </main>

    </div>
  );
};

export default MoleculeDetailPage;