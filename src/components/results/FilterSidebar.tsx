// src/components/results/FilterSidebar.tsx
import { Typography, IconButton, Tooltip, Badge } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { LuFilter } from 'react-icons/lu';

import { usePresets }       from '../hooks/usePresets';
import type { UseAdmetFiltersReturn } from '../hooks/useAdmetFilters';

import { PresetBar }        from './filters/PresetBar';
import { DiffBanner }       from './filters/DiffBanner';
import { FooterActions }    from './filters/FooterActions';

import { PfqMedChemSection } from './filters/sections/PfqMedChemSection';
import { AbsorptionSection } from './filters/sections/AbsorptionSection';
import { DistributionSection } from './filters/sections/DistributionSection';
import { MetabolismSection } from './filters/sections/MetabolismSection';
import { ExcretionSection } from './filters/sections/ExcretionSection';
import { ToxicitySection } from './filters/sections/ToxicitySection';
import { useEffect } from 'react';

interface FilterSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  // A MÁGICA 1: Recebemos o motor de filtros do pai
  filterEngine: UseAdmetFiltersReturn; 
}

const FilterSidebar = ({ isSidebarOpen, toggleSidebar, filterEngine }: FilterSidebarProps) => {

  // Desestruturamos o motor que veio do pai
  const {
    stagedFilters,
    appliedFilters,
    hasDiff,
    updateFilter,
    toggleArrayFilter,
    handleLipinskiToggle,
    handlePfizerToggle,
    applyFilters,
    resetFilters,
    loadPreset,
    counts,
  } = filterEngine;

  const {
    allPresets,
    activePresetId,
    setActivePresetId,
    saveCurrentAsPreset,
    deleteUserPreset,
    updatePreset
  } = usePresets();

  // Os Handlers agora só acionam o motor do pai. O ResultsLayout se atualiza sozinho!
  const handleApply = () => applyFilters();
  const handleReset = () =>{
        setActivePresetId('default')
    resetFilters();
  } 

  const handleSelectPreset = (preset: (typeof allPresets)[number]) => {
    loadPreset(preset.filters);
    setActivePresetId(preset.id);
  };

  const handleSavePreset = (label: string) => {
    saveCurrentAsPreset(label, stagedFilters);
  };

  return (
    <div className="w-full flex flex-col h-full animate-fade-in bg-gray-50">

      {/* HEADER */}
      <div className="py-3 pl-3 shrink-0 z-10">
        <div className="flex justify-between items-center border-b border-gray-200 pb-2 mr-4">
          <div className="flex items-center">
            <Tooltip title={isSidebarOpen ? '' : 'Mostrar Filtros'} placement="right">
              <IconButton
                onClick={toggleSidebar}
                className={`transition-all duration-300 ${
                  !isSidebarOpen
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    : 'bg-transparent text-blue-500 hover:bg-gray-100'
                }`}
                sx={{ width: 40, height: 40 }}
              >
                <Badge
                  badgeContent={counts.total}
                  color="primary"
                  invisible={isSidebarOpen || counts.total === 0}
                  sx={{ '& .MuiBadge-badge': { backgroundColor: '#2563eb' } }}
                >
                  <LuFilter size={20} />
                </Badge>
              </IconButton>
            </Tooltip>

            <Typography
              variant="h6"
              className={`font-nunito_sans font-extrabold text-gray-800 text-lg transition-opacity duration-200 whitespace-nowrap ${
                isSidebarOpen ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Filtros
            </Typography>

            <div
              className={`font-inter w-6 h-6 mx-2 rounded-full bg-blue-500 transition-opacity duration-200 flex items-center justify-center ${
                isSidebarOpen && counts.total > 0 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Typography variant="body2" className="text-[11px] text-white font-bold leading-none">
                {counts.total}
              </Typography>
            </div>
          </div>

          <div
            className={`flex items-center transition-opacity duration-200 ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={toggleSidebar}
          >
            <Tooltip title="Ocultar Filtros" placement="left">
              <ArrowBackIosIcon fontSize="small" className="text-gray-400 hover:text-blue-600 cursor-pointer" />
            </Tooltip>
          </div>
        </div>
      </div>

      {/* CONTEÚDO SCROLLÁVEL */}
      <div
        className={`flex flex-col flex-1 min-h-0 transition-opacity duration-200 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex-1 overflow-y-auto pr-1 pl-3 custom-scrollbar">

          <PresetBar
            allPresets={allPresets}
            activePresetId={activePresetId}
            stagedFilters={stagedFilters}
            onSelectPreset={handleSelectPreset}
            onSavePreset={handleSavePreset}
            onDeletePreset={deleteUserPreset}
            onUpdatePreset={updatePreset}
          />

          <PfqMedChemSection
            filters={stagedFilters} count={counts.pfq} updateFilter={updateFilter}
            handleLipinskiToggle={handleLipinskiToggle} handlePfizerToggle={handlePfizerToggle}
          />
          <AbsorptionSection filters={stagedFilters} count={counts.absorption} updateFilter={updateFilter} toggleArrayFilter={toggleArrayFilter} />
          <DistributionSection filters={stagedFilters} count={counts.distribution} updateFilter={updateFilter} toggleArrayFilter={toggleArrayFilter} />
          <MetabolismSection filters={stagedFilters} count={counts.metabolism} toggleArrayFilter={toggleArrayFilter} />
          <ExcretionSection filters={stagedFilters} count={counts.excretion} updateFilter={updateFilter} />
          <ToxicitySection filters={stagedFilters} count={counts.toxicity} toggleArrayFilter={toggleArrayFilter} />

        </div>

        {/* DIFF BANNER + FOOTER */}
        <DiffBanner hasDiff={hasDiff} totalStagedCount={counts.total} />

        <FooterActions
          hasDiff={hasDiff}
          onApply={handleApply}
          totalActive={counts.total}
          onReset={handleReset}
        />
      </div>
    </div>
  );
};

export default FilterSidebar;