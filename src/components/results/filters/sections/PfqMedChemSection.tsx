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

// Extraímos o estilo do Switch para uma constante para não repetir código (DRY)
const PREMIUM_SWITCH_SX = {
    width: 34, height: 20, padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: '2px',
        color: '#fff', // Bolinha SEMPRE branca
        '&.Mui-checked': {
            transform: 'translateX(14px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#2563eb', // Azul premium quando ON
                opacity: 1,
                border: 'none'
            }
        }
    },
    '& .MuiSwitch-thumb': {
        width: 16,
        height: 16,
        boxShadow: '0 1px 2px rgba(0,0,0,0.25)' // Sombra para a bolinha saltar do fundo
    },
    '& .MuiSwitch-track': {
        borderRadius: 10,
        backgroundColor: '#cbd5e1', // Cinza sólido (slate-300) quando OFF. Zero transparência!
        opacity: 1,
    },
};

export const PfqMedChemSection = ({ filters, count, updateFilter, handleLipinskiToggle, handlePfizerToggle }: PfqMedChemSectionProps) => {
    return (
        <FilterSection title="Físico-Química / MedChem" icon={<ScienceIcon fontSize="small" className="text-blue-500" />} defaultExpanded={true} badgeCount={count > 0 ? count : undefined}>
            <div className="space-y-4 pt-2">
                {PFQ_FILTERS_CONFIG.map((config) => {
                    const currentFilter = filters.pfq[config.field];

                    return (
                        <RangeSliderControl
                            key={config.field}
                            label={config.label}
                            value={currentFilter.value}
                            isActive={currentFilter.active}
                            min={config.min}
                            max={config.max}
                            step={config.step}
                            unit={config.unit}
                            onChange={(newVal) => updateFilter('pfq', config.field, {
                                ...currentFilter,
                                value: newVal
                            })}
                            onActiveChange={(newActive) => updateFilter('pfq', config.field, {
                                ...currentFilter,
                                active: newActive
                            })}
                            onReset={() => updateFilter('pfq', config.field, {
                                value: [config.min, config.max],
                                active: true
                            })}
                        />
                    );
                })}

                <div className="pt-4 border-t border-gray-100 mt-4">
                    <Typography className="font-inter text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-3">
                        Filtros de Druglikeness
                    </Typography>
                    
                    {/* Alterado gap e margens para alinhar perfeitamente com os sliders acima */}
                    <div className="flex flex-col gap-3 pl-1">
                        <FormControlLabel
                            // Remove a margem nativa do FormControlLabel para controle manual
                            sx={{ margin: 0, gap: '10px' }} 
                            control={
                                <Switch
                                    checked={filters.medchem.lipinski}
                                    onChange={handleLipinskiToggle}
                                    size="small"
                                    sx={PREMIUM_SWITCH_SX}
                                />
                            }
                            label={
                                <Typography className={'font-inter font-medium text-xs text-gray-700'}>
                                    Regra de Lipinski (Pass)
                                </Typography>
                            }
                        />
                        <FormControlLabel
                            sx={{ margin: 0, gap: '10px' }}
                            control={
                                <Switch
                                    checked={filters.medchem.pfizer}
                                    onChange={handlePfizerToggle}
                                    size="small"
                                    sx={PREMIUM_SWITCH_SX}
                                />
                            }
                            label={
                                <Typography className={'font-inter font-medium text-xs text-gray-700'}>
                                    Regra Pfizer (3/75)
                                </Typography>
                            }
                        />
                    </div>
                </div>
            </div>
        </FilterSection>
    );
};