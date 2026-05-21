// src/components/results/ResultsLayout.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Button, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import FilterSidebar from './FilterSidebar';
import ResultsTable from './ResultsTable';
import ResultsSummaryBar from './ResultsSummaryBar';
import MoleculePreview from './MoleculePreview';
import MoleculeDetailPage from '../../pages/MoleculeDetailPage';

import { useAdmetFilters } from '../../hooks/useAdmetFilters';
import { useMoleculeFilter } from '../../hooks/useMoleculeFilter';
import type { Molecule } from '../../types/molecules.types';
import { usePresets } from '../../hooks/usePresets';

interface ResultsLayoutProps {
  onBack: () => void;
  isBatch: boolean;
  molecules: Molecule[];
}

const ResultsLayout = ({ onBack, isBatch, molecules }: ResultsLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedMolecule, setSelectedMolecule] = useState<Molecule | null>(null);
  const [detailedMolecule, setDetailedMolecule] = useState<Molecule | null>(null);
  
  // NOVO: Estado da barra de pesquisa
  const [searchQuery, setSearchQuery] = useState('');

  const filterEngine = useAdmetFilters();
  const { filteredMolecules, totalCount } = useMoleculeFilter(molecules, filterEngine.appliedFilters);

  const { resetFilters } = filterEngine;
  const {setActivePresetId} = usePresets();

  // 1. Aplicamos a Pesquisa por cima dos Filtros ADMET
  const searchedMolecules = useMemo(() => {
    if (!searchQuery.trim()) return filteredMolecules;
    const lowerQ = searchQuery.toLowerCase();
    return filteredMolecules.filter(m => 
      m.name.toLowerCase().includes(lowerQ) || 
      m.id.toLowerCase().includes(lowerQ) || 
      m.smiles.toLowerCase().includes(lowerQ)
    );
  }, [filteredMolecules, searchQuery]);

  // 2. INTELIGÊNCIA: Quantas moléculas a pesquisa encontrou que estão ESCONDIDAS pelos filtros ADMET?
  const hiddenByFiltersCount = useMemo(() => {
    if (!searchQuery.trim() || searchedMolecules.length > 0) return 0;
    const lowerQ = searchQuery.toLowerCase();
    
    return molecules.filter(m => 
      (m.name.toLowerCase().includes(lowerQ) || m.id.toLowerCase().includes(lowerQ) || m.smiles.toLowerCase().includes(lowerQ)) &&
      !filteredMolecules.find(fm => fm.id === m.id)
    ).length;
  }, [molecules, filteredMolecules, searchQuery, searchedMolecules.length]);

  useEffect(() => {
    if (!isBatch && searchedMolecules.length > 0) {
      setSelectedMolecule(searchedMolecules[0]);
      setIsSidebarOpen(false);
    }
  }, [isBatch, searchedMolecules]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.page === 'detail' && e.state?.molId) {
        const mol = molecules.find(m => m.id === e.state.molId);
        if (mol) setDetailedMolecule(mol);
      } else {
        setDetailedMolecule(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [molecules]);

  const handleExportCsv = () => {
    const headers = ['ID', 'Nome', 'SMILES', 'MW', 'LogP', 'TPSA', 'Lipinski', 'AMES', 'Hepato', 'hERG'];
    const rows = searchedMolecules.map(m => [
      m.id, m.name, m.smiles, m.mw, m.logp, m.tpsa,
      m.lipinski,
      m.ames.category, m.hepato.category, m.herg.category,
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
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
          <div className="flex-1 p-6 h-full flex flex-col min-h-0 gap-3"> 

            {/* ── CARD PRINCIPAL ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">

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

                <div className="flex items-center gap-3">
                  {/* BARRA DE PESQUISA */}
                  {/* BARRA DE PESQUISA PREMIUM */}
                  <div className="relative flex items-center group">
                    <SearchIcon 
                      className="absolute left-3 text-slate-400 transition-colors group-focus-within:text-blue-500" 
                      sx={{ fontSize: 16 }} 
                    />
                    <input
                      type="text"
                      placeholder="Pesquisar ID, Nome ou SMILES..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="peer pl-9 pr-99 py-1.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-inter text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-[3px] focus:ring-blue-500/10 focus:border-blue-500 outline-none w-64 focus:w-80 transition-all duration-300 shadow-sm"
                    />
                    
                    {/* Dica de Teclado (Visível apenas quando vazio e sem foco) */}
                    {!searchQuery && (
                      <div className="absolute right-2.5 flex items-center pointer-events-none opacity-100 peer-focus:opacity-0 transition-opacity duration-200">
                        
                      </div>
                    )}

                    {/* Botão de Limpar (Close) */}
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')} 
                        className="absolute right-1.5"
                        title="Limpar pesquisa"
                      >
                        <CloseIcon className='text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all animate-fade-in' sx={{ fontSize: 14 }} />
                      </button>
                    )}
                  </div>

                  <div className="w-px h-6 bg-slate-200" />

                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<DownloadIcon sx={{ fontSize: 15 }} />} 
                    onClick={handleExportCsv}
                    className="normal-case font-inter font-bold text-xs border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 rounded-lg px-3.5 py-1.5 shadow-sm transition-all shrink-0"
                  >
                    Exportar CSV
                  </Button>
                </div>
              </div>

              <ResultsSummaryBar filteredCount={searchedMolecules.length} totalCount={totalCount} />

              <div className="flex-1 overflow-hidden min-h-0 flex flex-col bg-slate-50/30">
                {searchedMolecules.length > 0 ? (
                  <ResultsTable
                    molecules={searchedMolecules} // Passamos a lista pesquisada
                    onRowClick={mol => setSelectedMolecule(mol)}
                    selectedMolId={selectedMolecule?.id ?? null}
                  />
                ) : (
                  /* ESTADO VAZIO INTELIGENTE (Premium Redesign) */
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in-up">
                    
                    {/* Ícone Principal com Efeito de Brilho */}
                    <div className="relative mb-5">
                      <div className="absolute inset-0 bg-slate-200 rounded-full blur-xl opacity-60"></div>
                      <div className="relative bg-white border border-slate-100 p-5 rounded-full shadow-sm">
                        <SearchIcon sx={{ fontSize: 42 }} className="text-slate-300" />
                      </div>
                    </div>
                    
                    <p className="font-nunito_sans font-extrabold text-slate-800 text-xl">
                      Nenhum resultado visível
                    </p>
                    <p className="font-inter text-slate-500 text-[13px] mt-2 max-w-sm leading-relaxed">
                      Não encontrámos moléculas com o termo <span className="font-bold text-slate-700">"{searchQuery}"</span> sob as restrições atuais.
                    </p>

                    {/* A MÁGICA DE UX ACONTECE AQUI (Card Premium) */}
                    {hiddenByFiltersCount > 0 && (
                      <div className="mt-8 relative group">
                        {/* Efeito Glow no fundo do alerta */}
                        <div className="absolute inset-0 bg-amber-400 rounded-2xl blur-md opacity-15 group-hover:opacity-25 transition-opacity duration-300" />
                        
                        <div className="relative bg-white border border-amber-200/60 p-5 rounded-2xl max-w-sm shadow-sm text-left flex flex-col gap-4 transition-transform duration-300 ">
                          
                          <div className="flex items-start gap-3">
                            <div className="bg-amber-100/50 p-2 rounded-xl shrink-0 border border-amber-100">
                              <WarningAmberIcon className="text-amber-500" sx={{ fontSize: 24 }} />
                            </div>
                            <div>
                              <p className="font-inter text-[13px] text-slate-800 font-extrabold">
                                Molécula filtrada pelo ADMET
                              </p>
                              <p className="font-inter text-[11px] text-slate-500 leading-relaxed mt-1">
                                Encontrámos <strong className="text-slate-700">{hiddenByFiltersCount} correspondência(s)</strong> no lote original, mas foram ocultadas pelas regras da sua barra lateral.
                              </p>
                            </div>
                          </div>
                          
                          {/* CORREÇÃO DO BUG DE ESTADO: Agora é verdadeiramente instantâneo */}
                          <Button 
                            variant="contained" 
                            fullWidth
                            onClick={() => { 
                              filterEngine.resetFilters(); 
                              setActivePresetId('default'); 
                            }}
                            className="bg-amber-500 hover:bg-amber-600 normal-case font-bold text-xs py-2 shadow-none rounded-xl transition-colors"
                          >
                            Limpar Filtros para Visualizar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Aside e DetailPage continuam iguais... */}
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