import React from 'react';
import { Typography, Switch, FormControlLabel } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science'; 
import { FilterSection } from '../FilterSection';
import { RangeSliderControl } from '../RangeSliderControl';
import { PFQ_FILTERS_CONFIG } from '../../../../types/filters';
import type { AdmetFilters } from '../../../../types/filters';

interface PfqMedChemSectionProps {
  filters: AdmetFilters;
  count: number;
  updateFilter: (category: keyof AdmetFilters, field: string, value: any) => void;
  handleLipinskiToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePfizerToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PfqMedChemSection = ({ filters, count, updateFilter, handleLipinskiToggle, handlePfizerToggle }: PfqMedChemSectionProps) => {
  return (
    <FilterSection title="Físico-Química / MedChem" icon={<ScienceIcon fontSize="small" className="text-blue-500" />} defaultExpanded={true} badgeCount={count > 0 ? count : undefined}>
      <div className="space-y-4 pt-2">
        {PFQ_FILTERS_CONFIG.map((config) => (
          <RangeSliderControl
            key={config.field}
            label={config.label}
            value={filters.pfq[config.field] as [number, number]}
            min={config.min}
            max={config.max}
            step={config.step}
            unit={config.unit}
            onChange={(newVal) => updateFilter('pfq', config.field, newVal)}
            onReset={() => updateFilter('pfq', config.field, [config.min, config.max])}
          />
        ))}
        
        <div className="pt-4 border-t border-gray-100 mt-4">
           <Typography className="font-inter text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-3">
             Filtros de Druglikeness
           </Typography>
           <div className="flex flex-col gap-2">
             <FormControlLabel 
                control={
                  <Switch 
                    checked={filters.medchem.lipinski} 
                    onChange={handleLipinskiToggle} 
                    size="small" 
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#2563eb' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2563eb' } }} 
                  />
                } 
                label={<Typography className="font-inter text-xs text-gray-700 font-medium">Regra de Lipinski (Pass)</Typography>} 
             />
             <FormControlLabel 
                control={
                  <Switch 
                    checked={filters.medchem.pfizer} 
                    onChange={handlePfizerToggle} 
                    size="small" 
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#2563eb' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2563eb' } }} 
                  />
                } 
                label={<Typography className="font-inter text-xs text-gray-700 font-medium">Regra Pfizer (3/75)</Typography>} 
             />
           </div>
        </div>
      </div>
    </FilterSection>
  );
};