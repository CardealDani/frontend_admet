import React from 'react';
import { Typography } from '@mui/material';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import { FilterSection } from '../FilterSection';
import type { AdmetFilters } from '../../../../types/filters';

interface MetabolismSectionProps {
  filters: AdmetFilters;
  count: number;
  updateFilter: (category: keyof AdmetFilters, field: string, value: any) => void;
}

export const MetabolismSection = ({ filters, count, updateFilter }: MetabolismSectionProps) => {
  const cypFilters = [
    { label: 'Substrato CYP1A2', field: 'cyp1a2Substrate' },
    { label: 'Substrato CYP2D6', field: 'cyp2d6Substrate' },
    { label: 'Substrato CYP3A4', field: 'cyp3a4Substrate' }
  ] as const;

  return (
    <FilterSection title="Metabolismo" icon={<SyncOutlinedIcon fontSize="small" className="text-gray-500" />} badgeCount={count > 0 ? count : undefined}>
       <div className="space-y-4 pt-2">
          {cypFilters.map(({ label, field }) => (
            <div key={field}>
               <Typography className="font-inter text-xs font-semibold text-gray-700 mb-2">{label}</Typography>
               <div className="flex w-full bg-slate-50/50 p-1 rounded-[10px] border border-slate-200/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                  {['Sim', 'Não', 'Qualquer'].map((option) => {
                    const currentArray = filters.metabolism[field];
                    const isAny = currentArray.length === 2;
                    const isActive = isAny ? option === 'Qualquer' : currentArray[0] === option;

                    return (
                      <button 
                        key={option} 
                        onClick={() => updateFilter('metabolism', field, option === 'Qualquer' ? ['Sim', 'Não'] : [option])} 
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 border border-transparent ${isActive ? 'bg-blue-50/80 text-blue-700 border-blue-100 shadow-sm' : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-700'}`}
                      >
                        {option}
                      </button>
                    )
                  })}
               </div>
            </div>
          ))}
       </div>
    </FilterSection>
  );
};