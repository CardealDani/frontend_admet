import React from 'react';
import { Typography } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { FilterSection } from '../FilterSection';
import { RangeSliderControl } from '../RangeSliderControl';
import type { AdmetFilters } from '../../../../types/filters';

interface DistributionSectionProps {
  filters: AdmetFilters;
  count: number;
  updateFilter: (category: keyof AdmetFilters, field: string, value: any) => void;
  toggleArrayFilter: (category: keyof AdmetFilters, field: string, value: string) => void;
}

export const DistributionSection = ({ filters, count, updateFilter, toggleArrayFilter }: DistributionSectionProps) => {
  return (
    <FilterSection title="Distribuição" icon={<LocalShippingOutlinedIcon fontSize="small" className="text-gray-500" />} badgeCount={count > 0 ? count : undefined}>
      <div className="space-y-6 pt-2">
        
        <div>
           <Typography className="font-inter text-xs font-semibold text-gray-700 mb-2">Permeabilidade BBB (Alvo Periférico)</Typography>
           <div className="flex w-full bg-slate-50/50 p-1 rounded-[10px] border border-slate-200/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
              {['Alta', 'Média', 'Baixa'].map((lvl) => {
                 const isActive = filters.distribution.bbb.includes(lvl);
                 let colorClasses = 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-700'; 
                 
                 if (isActive) {
                   if (lvl === 'Alta') colorClasses = 'bg-rose-50/80 text-rose-700 border-rose-100 shadow-sm';
                   if (lvl === 'Média') colorClasses = 'bg-amber-50/80 text-amber-700 border-amber-100 shadow-sm';
                   if (lvl === 'Baixa') colorClasses = 'bg-emerald-50/80 text-emerald-700 border-emerald-100 shadow-sm';
                 }
                 return (
                   <button key={lvl} onClick={() => toggleArrayFilter('distribution', 'bbb', lvl)} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 border border-transparent ${colorClasses}`}>
                      {lvl}
                    </button>
                 )
              })}
           </div>
        </div>

        <RangeSliderControl label="Ligação a Proteínas (PPB)" value={filters.distribution.ppb} min={0} max={100} step={1} unit="%" onChange={(newVal) => updateFilter('distribution', 'ppb', newVal)} onReset={() => updateFilter('distribution', 'ppb', [0, 100])} />
        <RangeSliderControl label="Fração Livre no Plasma (Fu)" value={filters.distribution.fu} min={0} max={100} step={1} unit="%" onChange={(newVal) => updateFilter('distribution', 'fu', newVal)} onReset={() => updateFilter('distribution', 'fu', [0, 100])} />
        
      </div>
    </FilterSection>
  );
};