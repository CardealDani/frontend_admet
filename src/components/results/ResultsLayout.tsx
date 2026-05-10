// src/components/results/ResultsLayout.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import DownloadIcon from '@mui/icons-material/Download';

import FilterSidebar from './FilterSidebar';
import ResultsTable from './ResultsTable';
import ResultsSummaryBar from './ResultsSummaryBar';
import MoleculePreview from './MoleculePreview';
import MoleculeDetailPage from '../../pages/MoleculeDetailPage';

import { useAdmetFilters } from '../hooks/useAdmetFilters';
import { useMoleculeFilter } from '../hooks/useMoleculeFilter';
import type { Molecule } from '../../types/molecules.types';

interface ResultsLayoutProps {
  onBack: () => void;
  isBatch: boolean;
}

const ResultsLayout = ({ onBack, isBatch }: ResultsLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen]     = useState(true);
  const [selectedMolecule, setSelectedMolecule] = useState<Molecule | null>(null);
  const [detailedMolecule, setDetailedMolecule] = useState<Molecule | null>(null);

  const filterEngine = useAdmetFilters();
  const { filteredMolecules, totalCount, filteredCount } = useMoleculeFilter(filterEngine.appliedFilters);

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
    const csv  = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = 'admet_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <React.Fragment>
      <div className={`w-full h-[calc(100vh-65px)] animate-fade-in bg-gray-50 mt-[-2rem] md:mt-0 overflow-hidden ${detailedMolecule ? 'hidden' : 'flex'}`}>

        {isBatch && (
          <aside className={`bg-white flex flex-col h-full shadow-[2px_0_8px_-4px_rgba(0,0,0,0.05)] z-20 shrink-0 overflow-hidden transition-all duration-300 ease-in-out border-r border-gray-200 ${isSidebarOpen ? 'w-[380px]' : 'w-16'}`}>
            <div className="w-[380px] min-w-[380px] flex flex-col h-full">
              <FilterSidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(v => !v)}
                filterEngine={filterEngine}
              />
            </div>
          </aside>
        )}

        <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50">
          <div className="flex-1 p-6 h-full flex flex-col min-h-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <ViewListIcon fontSize="small" />
                  </div>
                  <p className="font-nunito_sans font-extrabold text-gray-900 text-lg leading-none">Análise em Lote</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={onBack} variant="text" startIcon={<AddIcon />}
                    className="font-inter font-bold normal-case text-blue-600 hover:bg-blue-50 px-4">
                    Nova Predição
                  </Button>
                  <div className="w-px h-6 bg-gray-200" />
                  <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={handleExportCsv}
                    className="normal-case font-bold border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm px-4 rounded-lg">
                    Exportar CSV
                  </Button>
                </div>
              </div>

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

        <aside className={`bg-white flex flex-col h-full z-20 shrink-0 overflow-hidden transition-all duration-300 ease-in-out border-l border-gray-200 ${selectedMolecule ? 'w-[380px]' : 'w-0'}`}>
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