
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
                    min={0}
                    max={150}
                    step={1}
                    unit="mL/min/kg"
                    value={filters.excretion.clPlasma.value}
                    isActive={filters.excretion.clPlasma.active}
                    onChange={(newVal) => updateFilter('excretion', 'clPlasma', {
                        ...filters.excretion.clPlasma,
                        value: newVal
                    })}
                    onActiveChange={(newActive) => updateFilter('excretion', 'clPlasma', {
                        ...filters.excretion.clPlasma,
                        active: newActive
                    })}
                    onReset={() => updateFilter('excretion', 'clPlasma', {
                        value: [0, 150],
                        active: true
                    })}
                />
                <RangeSliderControl
                    label="Tempo de Meia-vida (T1/2)"
                    value={filters.excretion.tHalf.value}
                    isActive={filters.excretion.tHalf.active}
                    min={0} max={48} step={0.5} unit="h"
                    onChange={(newVal) => updateFilter('excretion', 'tHalf', {
                        ...filters.excretion.tHalf,
                        value: newVal
                    })}
                    onActiveChange={(newActive) => updateFilter('excretion', 'tHalf', {
                        ...filters.excretion.tHalf,
                        active: newActive
                    })}
                    onReset={() => updateFilter('excretion', 'tHalf', {
                        value: [0, 48],
                        active: true
                    })}
                />
            </div>
        </FilterSection>
    );
};