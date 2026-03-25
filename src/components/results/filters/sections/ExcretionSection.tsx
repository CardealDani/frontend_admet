import React from 'react';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { FilterSection } from '../FilterSection';
import { RangeSliderControl } from '../RangeSliderControl';
import type { AdmetFilters } from '../../../../types/filters';

interface ExcretionSectionProps {
  filters: AdmetFilters;
  count: number;
  updateFilter: (category: keyof AdmetFilters, field: string, value: any) => void;
}

export const ExcretionSection = ({ filters, count, updateFilter }: ExcretionSectionProps) => {
  return (
    <FilterSection title="Excreção" icon={<LogoutOutlinedIcon fontSize="small" className="text-gray-500" />} badgeCount={count > 0 ? count : undefined}>
      <div className="space-y-6 pt-2">
        <RangeSliderControl 
          label="Clearance Plasmático (CL)" 
          value={filters.excretion.clPlasma} 
          min={0} max={150} step={1} unit="mL/min/kg" 
          onChange={(newVal) => updateFilter('excretion', 'clPlasma', newVal)} 
          onReset={() => updateFilter('excretion', 'clPlasma', [0, 150])} 
        />
        <RangeSliderControl 
          label="Tempo de Meia-vida (T1/2)" 
          value={filters.excretion.tHalf} 
          min={0} max={48} step={0.5} unit="h" 
          onChange={(newVal) => updateFilter('excretion', 'tHalf', newVal)} 
          onReset={() => updateFilter('excretion', 'tHalf', [0, 48])} 
        />
      </div>
    </FilterSection>
  );
};