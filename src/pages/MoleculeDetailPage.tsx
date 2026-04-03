// src/pages/MoleculeDetailPage.tsx
import { Button, Tooltip } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';

import MoleculeDetail from '../components/results/MoleculeDetail';
import type { Molecule } from '../types/molecules.types';

// ─── Export CSV de uma molécula ───────────────────────────────────────────────

const exportSingleCsv = (mol: Molecule) => {
  const headers = [
    'ID', 'Nome', 'SMILES',
    'MW', 'LogP', 'TPSA', 'QED',
    'HIA%', 'Caco-2', 'P-gp',
    'BBB', 'PPB%', 'Fu%',
    'CYP1A2', 'CYP2D6', 'CYP3A4',
    'CL Plasmático', 'T½',
    'AMES', 'hERG', 'Hepato',
    'Lipinski', 'Pfizer',
  ];
  
  // Usamos [1] para pegar as Labels das Tuplas!
  const row = [
    mol.id, mol.name, mol.smiles,
    mol.mw, mol.logp, mol.tpsa, mol.qed,
    mol.absorptionPercent, mol.caco2[1], mol.pgpInhibitor[1],
    mol.bbb[1], mol.ppb, mol.fu,
    mol.cyp1a2Substrate[1], mol.cyp2d6Substrate[1], mol.cyp3a4Substrate[1],
    mol.clPlasma, mol.tHalf,
    mol.ames[1], mol.herg[1], mol.hepato[1],
    mol.lipinski, mol.pfizer,
  ];

  const csv = [headers.join(','), row.join(',')].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
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
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 sticky top-0 z-30">

        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 font-medium font-inter hover:text-blue-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-blue-50"
        >
          <ArrowBackIosIcon sx={{ fontSize: 13 }} />
          Voltar aos resultados
        </button>

        {/* ID da molécula — centro */}
        <span className="font-mono text-xs text-gray-400 font-medium absolute left-1/2 -translate-x-1/2">
          {molecule.id}
        </span>

        {/* Ações */}
        <div className="flex items-center gap-2">
          <Tooltip title="Copiar link da molécula">
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
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
            Exportar CSV
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