// src/components/results/ResultsLayout.tsx
import React, { useState, useEffect } from 'react';
import ViewListIcon from '@mui/icons-material/ViewList';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button, } from '@mui/material';

import FilterSidebar from './FilterSidebar';
import ResultsTable from './ResultsTable';
import ResultsSummaryBar from './ResultsSummaryBar';
import MoleculePreview from './MoleculePreview';
import MoleculeDetailPage from '../../pages/MoleculeDetailPage';

import { useAdmetFilters } from '../../hooks/useAdmetFilters';
import { useMoleculeFilter } from '../../hooks/useMoleculeFilter';
import type { Molecule } from '../../types/molecules.types';

interface ResultsLayoutProps {
  onBack: () => void;
  isBatch: boolean;
  molecules: Molecule[]; 
}

const ResultsLayout = ({ onBack, isBatch, molecules }: ResultsLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedMolecule, setSelectedMolecule] = useState<Molecule | null>(null);
  const [detailedMolecule, setDetailedMolecule] = useState<Molecule | null>(null);

  const filterEngine = useAdmetFilters();
const { filteredMolecules, totalCount, filteredCount } = useMoleculeFilter(molecules, filterEngine.appliedFilters);
  useEffect(() => {
    if (!isBatch && filteredMolecules.length > 0) {
      setSelectedMolecule(filteredMolecules[0]);
      setIsSidebarOpen(false);
    }
  }, [isBatch, filteredMolecules]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.page === 'detail' && e.state?.molId) {
        const mol = filteredMolecules.find(m => m.id === e.state.molId);
        if (mol) setDetailedMolecule(mol);
      } else {
        setDetailedMolecule(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [filteredMolecules]);

  const handleExportCsv = () => {
    const headers = ['ID', 'Nome', 'SMILES', 'MW', 'LogP', 'TPSA', 'Lipinski', 'AMES', 'Hepato', 'hERG'];
    const rows = filteredMolecules.map(m => [
      m.id, m.name, m.smiles, m.mw, m.logp, m.tpsa,
      m.lipinski,
      m.ames.category, m.hepato.category, m.herg.category,
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admet_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <React.Fragment>
      <div className={`w-full h-[calc(100vh-65px)] animate-fade-in bg-gray-50 mt-[-2rem] md:mt-0 overflow-hidden ${detailedMolecule ? 'hidden' : 'flex'}`}>

        {isBatch && (
          <aside className={`bg-white flex flex-col h-full shadow-[2px_0_8px_-4px_rgba(0,0,0,0.05)] z-20 shrink-0 overflow-hidden transition-all duration-300 ease-in-out border-r border-gray-200 ${isSidebarOpen ? 'w-[390px]' : 'w-16'}`}>
            <div className="w-[390px] min-w-[380px] flex flex-col h-full">
              <FilterSidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(v => !v)}
                filterEngine={filterEngine}
              />
            </div>
          </aside>
        )}

        <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50">
          {/* Adicionei gap-3 para separar a navegação do card branco */}
          <div className="flex-1 px-6 pb-6 pt-3 h-full flex flex-col min-h-0 gap-3"> 
            
            {/* ── NAVEGAÇÃO DE PÁGINA (BREADCRUMB) FORA DA TABELA ── */}
            <div className="flex items-center shrink-0">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-[13px] font-inter font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50/80 px-2 py-1 rounded-lg transition-all"
              >
                <ArrowBackIosIcon sx={{ fontSize: 11 }} className="mb-[1px]" />
                Voltar ao Início
              </button>
            </div>

            {/* ── CARD PRINCIPAL DA TABELA ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">

              {/* HEADER LIMPO (Apenas Título e Ações da Tabela) */}
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center shrink-0 bg-white">
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50/50 border border-blue-100 text-blue-600 shadow-sm">
                    <ViewListIcon fontSize="small" />
                  </div>
                  <div>
                    <p className="font-nunito_sans font-extrabold text-slate-800 text-lg leading-none">Análise em Lote</p>
                    <p className="font-inter text-[11px] font-medium text-slate-400 mt-1">
                      Explore e filtre os resultados gerados pela predição.
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<DownloadIcon sx={{ fontSize: 15 }} />} 
                    onClick={handleExportCsv}
                    className="normal-case font-inter font-bold text-xs border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 rounded-lg px-3.5 py-1.5 shadow-sm transition-all"
                  >
                    Exportar CSV
                  </Button>
                </div>
              </div>

              {/* BARRA DE RESUMO E TABELA */}
              <ResultsSummaryBar filteredCount={filteredCount} totalCount={totalCount} />

              <div className="flex-1 overflow-hidden min-h-0">
                <ResultsTable
                  molecules={filteredMolecules}
                  onRowClick={mol => setSelectedMolecule(mol)}
                  selectedMolId={selectedMolecule?.id ?? null}
                />
              </div>

            </div>
          </div>
        </main>

        <aside className={`bg-white flex flex-col h-full z-20 shrink-0 overflow-hidden transition-all duration-300 ease-in-out border-l border-gray-200 ${selectedMolecule ? 'w-[390px]' : 'w-0'}`}>
          {selectedMolecule && (
            <MoleculePreview
              molecule={selectedMolecule}
              onClose={() => setSelectedMolecule(null)}
              onViewFullReport={mol => {
                window.history.pushState({ page: 'detail', molId: mol.id }, '', window.location.pathname);
                setDetailedMolecule(mol);
              }}
            />
          )}
        </aside>
      </div>

      {detailedMolecule && (
        <MoleculeDetailPage
          molecule={detailedMolecule}
          onBack={() => window.history.back()}
        />
      )}
    </React.Fragment>
  );
};

export default ResultsLayout;