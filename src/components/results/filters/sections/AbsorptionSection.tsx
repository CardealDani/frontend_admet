
import { Typography } from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { FilterSection } from '../FilterSection';
import { RangeSliderControl } from '../RangeSliderControl';
import type { AdmetFilters } from '../../../../types/filters';
import { BinaryToggleControl } from '../BinaryToggleControl';

interface AbsorptionSectionProps {
    filters: AdmetFilters;
    count: number;
    updateFilter: (category: keyof AdmetFilters, field: string, value: any) => void;
    toggleArrayFilter: (category: keyof AdmetFilters, field: string, value: string) => void;
}

export const AbsorptionSection = ({ filters, count, updateFilter, toggleArrayFilter }: AbsorptionSectionProps) => {
    return (
        <FilterSection title="Absorção" icon={<ShieldOutlinedIcon fontSize="small" className="text-teal-500" />} defaultExpanded={true} badgeCount={count > 0 ? count : undefined}>
            <div className="space-y-6 pt-2">

                <RangeSliderControl
                    label="Absorção Intestinal (HIA)"
                    value={filters.absorption.absorptionPercent.value}
                    isActive={filters.absorption.absorptionPercent.active}
                    min={0} max={100} step={1} unit="%"
                    onChange={(newVal) => updateFilter('absorption', 'absorptionPercent', {
                        ...filters.absorption.absorptionPercent,
                        value: newVal
                    })}
                    onActiveChange={(newActive) => updateFilter('absorption', 'absorptionPercent', {
                        ...filters.absorption.absorptionPercent,
                        active: newActive
                    })}
                    onReset={() => updateFilter('absorption', 'absorptionPercent', {
                        value: [0, 100],
                        active: true
                    })}
                />

                <div>
                    <Typography className="font-inter text-xs font-semibold text-gray-700 mb-2">Permeabilidade Caco-2</Typography>
                    <div className="flex w-full bg-slate-50/50 p-1 rounded-[10px] border border-slate-200/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                        {['Alta', 'Média', 'Baixa'].map((lvl) => {
                            const isActive = filters.absorption.caco2.includes(lvl);
                            let colorClasses = 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-700';
                            if (isActive) {
                                if (lvl === 'Alta') colorClasses = 'bg-emerald-50/80 text-emerald-700 border-emerald-100 shadow-sm';
                                if (lvl === 'Média') colorClasses = 'bg-amber-50/80 text-amber-700 border-amber-100 shadow-sm';
                                if (lvl === 'Baixa') colorClasses = 'bg-rose-50/80 text-rose-700 border-rose-100 shadow-sm';
                            }
                            return (
                                <button key={lvl} onClick={() => toggleArrayFilter('absorption', 'caco2', lvl)} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 border border-transparent ${colorClasses}`}>
                                    {lvl}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* 3. Inibidor P-gp (Smart Toggle de 2 Botões) */}
                <BinaryToggleControl
                    label="Inibidor P-gp (Bomba de Efluxo)"
                    activeValues={filters.absorption.pgpInhibitor}
                    onChange={(newValues) => updateFilter('absorption', 'pgpInhibitor', newValues)}
                />
            </div>
        </FilterSection>
    );
};