
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import { FilterSection } from '../FilterSection';
import { RangeSliderControl } from '../RangeSliderControl';
import { FilterButtonGroup, type FilterOption } from '../FilterButtonGroup';
import type { AdmetFilters } from '../../../../types/filters';

interface AbsorptionSectionProps {
    filters: AdmetFilters;
    count: number;
    updateFilter: (category: keyof AdmetFilters, field: string, value: any) => void;
    toggleArrayFilter: (category: keyof AdmetFilters, field: string, value: string) => void;
}

export const AbsorptionSection = ({ filters, count, updateFilter, toggleArrayFilter }: AbsorptionSectionProps) => {

    // 1. Configuração do Caco-2 (Binário segundo documentação)
    const caco2Options: FilterOption[] = [
        { id: 'Excelente', subtitle: '(> -5.15)', color: 'success', icon: CheckCircleRoundedIcon },
        { id: 'Ruim', subtitle: '(≤ -5.15)', color: 'error', icon: CancelRoundedIcon }
    ];

    // 2. Configuração do P-gp (Ternário segundo probabilidade)
    // Nota de UX: Adicionei o label explicitando o que significa ser Excelente/Ruim nesse contexto
    const pgpOptions: FilterOption[] = [
        { id: 'Excelente', label: 'Não Inibe', subtitle: '(0 - 0.3)', color: 'success', icon: CheckCircleRoundedIcon },
        { id: 'Médio', label: 'Médio', subtitle: '(0.3 - 0.7)', color: 'warning', icon: WarningRoundedIcon },
        { id: 'Ruim', label: 'Inibe', subtitle: '(0.7 - 1.0)', color: 'error', icon: CancelRoundedIcon }
    ];

    return (
        <FilterSection
            title="Absorção"
            icon={<ShieldOutlinedIcon fontSize="small" className="text-teal-500" />}
            defaultExpanded={true}
            badgeCount={count > 0 ? count : undefined}
        >
            <div className="space-y-6 pt-2">

                <RangeSliderControl
                    label="Absorção Intestinal (HIA)"
                    value={filters.absorption.absorptionPercent.value}
                    isActive={filters.absorption.absorptionPercent.active}
                    min={0} max={100} step={1} unit="%"
                    onChange={(newVal) => updateFilter('absorption', 'absorptionPercent', { ...filters.absorption.absorptionPercent, value: newVal })}
                    onActiveChange={(newActive) => updateFilter('absorption', 'absorptionPercent', { ...filters.absorption.absorptionPercent, active: newActive })}
                    onReset={() => updateFilter('absorption', 'absorptionPercent', { value: [0, 100], active: true })}
                />

                <FilterButtonGroup
                    title="Permeabilidade Caco-2"
                    options={caco2Options}
                    activeValues={filters.absorption.caco2}
                    onToggle={(id) => toggleArrayFilter('absorption', 'caco2', id)}
                />

                <FilterButtonGroup
                    title="Inibidor P-gp (Bomba de Efluxo)"
                    options={pgpOptions}
                    activeValues={filters.absorption.pgpInhibitor}
                    onToggle={(id) => toggleArrayFilter('absorption', 'pgpInhibitor', id)}
                />

            </div>
        </FilterSection>
    );
};