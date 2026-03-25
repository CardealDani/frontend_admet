import React from 'react';
import { Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { FilterSection } from '../FilterSection';
import type { AdmetFilters } from '../../../../types/filters';

interface ToxicitySectionProps {
  filters: AdmetFilters;
  count: number;
  updateFilter: (category: keyof AdmetFilters, field: string, value: any) => void;
  toggleArrayFilter: (category: keyof AdmetFilters, field: string, value: string) => void;
}

export const ToxicitySection = ({ filters, count, updateFilter, toggleArrayFilter }: ToxicitySectionProps) => {
  
  // Função auxiliar para renderizar botões segmentados de toxicidade
  const renderToxButtons = (field: keyof AdmetFilters['toxicity'], options: string[], colors: Record<string, string>) => (
    <div className="flex w-full bg-slate-50/50 p-1 rounded-[10px] border border-slate-200/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
      {options.map((lvl) => {
        const isActive = filters.toxicity[field].includes(lvl);
        let colorClasses = 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-700'; 
        
        if (isActive) {
          colorClasses = colors[lvl] || 'bg-slate-200 text-slate-800';
        }
        return (
          <button key={lvl} onClick={() => toggleArrayFilter('toxicity', field, lvl)} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 border border-transparent ${colorClasses}`}>
            {lvl}
          </button>
        )
      })}
    </div>
  );

  return (
    <FilterSection title="Toxicidade" icon={<WarningAmberIcon fontSize="small" className="text-red-500" />} badgeType="error" defaultExpanded={true} badgeCount={count > 0 ? count : undefined}>
      <div className="space-y-4 pt-2">
        
        <div>
          <Typography className="font-inter text-xs font-semibold text-gray-700 mb-2">Mutagenicidade (AMES)</Typography>
          {renderToxButtons('ames', ['Negativo', 'Positivo'], {
            'Negativo': 'bg-emerald-50/80 text-emerald-700 border-emerald-100 shadow-sm',
            'Positivo': 'bg-rose-50/80 text-rose-700 border-rose-100 shadow-sm'
          })}
        </div>

        <div>
          <Typography className="font-inter text-xs font-semibold text-gray-700 mb-2">Bloqueio hERG (Cardiotoxicidade)</Typography>
          {renderToxButtons('herg', ['Baixo', 'Médio', 'Alto'], {
            'Baixo': 'bg-emerald-50/80 text-emerald-700 border-emerald-100 shadow-sm',
            'Médio': 'bg-amber-50/80 text-amber-700 border-amber-100 shadow-sm',
            'Alto': 'bg-rose-50/80 text-rose-700 border-rose-100 shadow-sm'
          })}
        </div>

        <div>
          <Typography className="font-inter text-xs font-semibold text-gray-700 mb-2">Hepatotoxicidade Humana</Typography>
          {renderToxButtons('hepato', ['Seguro', 'Atenção', 'Tóxico'], {
            'Seguro': 'bg-emerald-50/80 text-emerald-700 border-emerald-100 shadow-sm',
            'Atenção': 'bg-amber-50/80 text-amber-700 border-amber-100 shadow-sm',
            'Tóxico': 'bg-rose-50/80 text-rose-700 border-rose-100 shadow-sm'
          })}
        </div>

      </div>
    </FilterSection>
  );
};