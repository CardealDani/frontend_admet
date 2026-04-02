// src/components/results/ResultsLayout.tsx
import React, { useState } from 'react';
import { Typography, Chip, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import DownloadIcon from '@mui/icons-material/Download';

import FilterSidebar from './FilterSidebar';
import { ResultsTable } from './ResultsTable';
// import MoleculePreview from './MoleculePreview'; // FASE 3

import { useAdmetFilters } from '../hooks/useAdmetFilters';
import { useMoleculeFilter } from '../hooks/useMoleculeFilter'; 
import type { Molecule } from '../../types/molecules.types';

interface ResultsLayoutProps {
  onBack: () => void;
  isBatch: boolean;
}

const ResultsLayout = ({ onBack, isBatch }: ResultsLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedMolecule, setSelectedMolecule] = useState<Molecule | null>(null);

  // 1. Instanciamos o cérebro de Filtros
  const { appliedFilters } = useAdmetFilters();

  // 2. Passamos os filtros para o motor de busca (TCHAU MOCK_DATA!)
  const { filteredMolecules, totalCount } = useMoleculeFilter(appliedFilters);

  // Lógica original para o modo single molecule
  React.useEffect(() => {
    if (!isBatch) {
      // Quando for apenas uma molécula, no futuro o backend trará ela na posição [0]
      // Por enquanto, não setamos uma molécula que não existe
      setIsSidebarOpen(false);
    }
  }, [isBatch]);

  return (
    <div className="w-full flex h-[calc(100vh-65px)] animate-fade-in bg-slate-50 mt-[-2rem] md:mt-0 overflow-hidden">

      {isBatch && (
        <aside
          className={`bg-white flex flex-col h-full shadow-[2px_0_8px_-4px_rgba(0,0,0,0.05)] z-20 shrink-0 overflow-hidden transition-all duration-300 ease-in-out border-r border-gray-200 ${
            isSidebarOpen ? 'w-[420px]' : 'w-16'
          }`}
        >
          <div className="w-[420px] min-w-[420px] flex flex-col h-full">
            <FilterSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          </div>
        </aside>
      )}

      {/* PAINEL 2: CENTRO (TABELA / DASHBOARD) */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">

        {/* Container que cria o "respiro" (Margem) em volta da tabela */}
        <div className="flex-1 p-6 h-full flex flex-col min-h-0">

          {/* O CARTÃO BRANCO (Onde a tabela e a topbar moram) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

            {/* TOPBAR ORIGINAL (Mantida e ligada aos hooks reais) */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <ViewListIcon fontSize="small" />
                </div>
                <div className="flex items-center gap-3">
                  <Typography className="font-nunito_sans font-extrabold text-gray-900 text-lg leading-none">
                    Análise em Lote
                  </Typography>
                  <Chip 
                    // Agora mostra o número real!
                    label={`${filteredMolecules.length} resultados`} 
                    size="small" 
                    className="bg-gray-100 text-gray-600 font-inter text-[11px] font-bold h-5" 
                  />
                  {/* Se houver filtro aplicado, mostramos o total do dataset */}
                  {filteredMolecules.length !== totalCount && (
                    <Typography className="font-inter text-xs text-gray-400">
                      (de {totalCount})
                    </Typography>
                  )}
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
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                  className="normal-case font-bold border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm px-4 rounded-lg"
                >
                  Exportar CSV
                </Button>
              </div>
            </div>

            {/* TABELA DE RESULTADOS (Passando os dados reais) */}
            <div className="flex-1 overflow-hidden min-h-0 bg-white">
              <ResultsTable
                molecules={filteredMolecules}
                onRowClick={(mol) => setSelectedMolecule(mol)}
                selectedMoleculeId={selectedMolecule?.id}
              />
            </div>

          </div> {/* Fim do Cartão Branco */}
        </div> {/* Fim do Container de Respiro */}
      </main>

      {/* PAINEL 3: DIREITA (PREVIEW DA MOLÉCULA - FASE 3) */}
      <aside
        className={`bg-white flex flex-col h-full shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20 shrink-0 overflow-hidden transition-all duration-300 ease-in-out border-l border-gray-200 ${
          selectedMolecule ? 'w-[420px]' : 'w-0'
        }`}
      >
        {/* Temporário até a Fase 3 */}
        <div className="p-4 text-center mt-20 font-inter text-gray-500">
            Preview em construção (Fase 3)
        </div>
      </aside>
    </div>
  );
};

export default ResultsLayout;