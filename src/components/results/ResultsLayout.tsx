// src/components/results/ResultsLayout.tsx
import React, { useState, useCallback, useEffect } from 'react';
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
import type { AdmetFilters } from '../../types/filters';

interface ResultsLayoutProps {
  onBack: () => void;
  isBatch: boolean;
}

const ResultsLayout = ({ onBack, isBatch }: ResultsLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedMolecule, setSelectedMolecule] = useState<Molecule | null>(null);
  
  // Estado que controla se a "Página" de detalhes está aberta
  const [detailedMolecule, setDetailedMolecule] = useState<Molecule | null>(null);

  // ── Filtros ──────────────────────────────────────────────────────────────
  const { appliedFilters } = useAdmetFilters();
  const [currentApplied, setCurrentApplied] = useState<AdmetFilters>(appliedFilters);

  const handleAppliedChange = useCallback((filters: AdmetFilters) => {
    setCurrentApplied(filters);
  }, []);

  // ── Dados filtrados ───────────────────────────────────────────────────────
  const { filteredMolecules, totalCount, filteredCount } = useMoleculeFilter(currentApplied);

  React.useEffect(() => {
    if (!isBatch && filteredMolecules.length > 0) {
      setSelectedMolecule(filteredMolecules[0]);
      setIsSidebarOpen(false);
    }
  }, [isBatch, filteredMolecules]);

  // =======================================================================
  // HISTORY SYNC: Escuta o botão Voltar E Avançar do navegador internamente
  // =======================================================================
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const pageState = e.state?.page;

      if (pageState === 'detail' && e.state?.molId) {
        // CÁLCULO DE AVANÇAR: O usuário apertou "Avançar" no navegador
        // Nós pegamos o ID salvo no histórico e restauramos a tela de detalhes.
        const molToRestore = filteredMolecules.find(m => m.id === e.state.molId);
        if (molToRestore) {
          setDetailedMolecule(molToRestore);
        }
      } else if (pageState === 'results') {
        // CÁLCULO DE VOLTAR: O usuário apertou "Voltar" enquanto via os detalhes.
        // O estado voltou para 'results', então fechamos os detalhes para revelar a tabela.
        setDetailedMolecule(null);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [filteredMolecules]);
  
  // ── Export CSV simples ────────────────────────────────────────────────────
  const handleExportCsv = () => {
    const headers = ['ID', 'Nome', 'SMILES', 'MW', 'LogP', 'TPSA', 'Lipinski', 'AMES', 'Hepato', 'hERG'];
    const rows = filteredMolecules.map(m =>
      [m.id, m.name, m.smiles, m.mw, m.logp, m.tpsa, m.lipinski, m.ames[1], m.hepato[1], m.herg[1]].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admet_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Se houver uma detailedMolecule, renderizamos a página inteira de detalhes.
  if (detailedMolecule) {
    return (
      <MoleculeDetailPage 
        molecule={detailedMolecule} 
        onBack={() => {
          // Em vez de apenas setar 'null', nós usamos a API do navegador para voltar, 
          // disparando o popstate e mantendo o histórico perfeito.
          window.history.back();
        }} 
      />
    );
  }

  return (
    <div className="w-full flex h-[calc(100vh-65px)] animate-fade-in bg-gray-50 mt-[-2rem] md:mt-0 overflow-hidden">
      {isBatch && (
        <aside
          className={`bg-white flex flex-col h-full shadow-[2px_0_8px_-4px_rgba(0,0,0,0.05)] z-20 shrink-0 overflow-hidden transition-all duration-300 ease-in-out border-r border-gray-200 ${
            isSidebarOpen ? 'w-[380px]' : 'w-16'
          }`}
        >
          <div className="w-[380px] min-w-[380px] flex flex-col h-full">
            <FilterSidebar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={() => setIsSidebarOpen(v => !v)}
              onAppliedFiltersChange={handleAppliedChange}
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
                <div>
                  <p className="font-nunito_sans font-extrabold text-gray-900 text-lg leading-none">
                    Análise em Lote
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={onBack}
                  variant="text"
                  startIcon={<AddIcon />}
                  className="font-inter font-bold normal-case text-blue-600 hover:bg-blue-50 px-4"
                >
                  Nova Predição
                </Button>
                <div className="w-px h-6 bg-gray-200" />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportCsv}
                  className="normal-case font-bold border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm px-4 rounded-lg"
                >
                  Exportar CSV
                </Button>
              </div>
            </div>

            <ResultsSummaryBar
              filteredCount={filteredCount}
              totalCount={totalCount}
            />

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

      {/* PAINEL DIREITO: PREVIEW */}
      <aside
        className={`bg-white flex flex-col h-full z-20 shrink-0 overflow-hidden transition-all duration-300 ease-in-out border-l border-gray-200 ${
          selectedMolecule ? 'w-[380px]' : 'w-0'
        }`}
      >
        {selectedMolecule && (
          <MoleculePreview
            molecule={selectedMolecule}
            onClose={() => setSelectedMolecule(null)}
            onViewFullReport={mol => {
              // A MÁGICA 2: Salvamos o ID da molécula junto com a "página" no histórico
              window.history.pushState({ page: 'detail', molId: mol.id }, '', window.location.pathname);
              setDetailedMolecule(mol);
            }} 
          />
        )}
      </aside>

    </div>
  );
};

export default ResultsLayout;