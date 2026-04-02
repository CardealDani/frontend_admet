
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import { FilterSection } from '../FilterSection';
import { RangeSliderControl } from '../RangeSliderControl';
import { FilterButtonGroup, type FilterOption } from '../FilterButtonGroup';
import type { AdmetFilters } from '../../../../types/filters';

interface DistributionSectionProps {
    filters: AdmetFilters;
    count: number;
    updateFilter: (category: keyof AdmetFilters, field: string, value: any) => void;
    toggleArrayFilter: (category: keyof AdmetFilters, field: string, value: string) => void;
}

export const DistributionSection = ({ filters, count, updateFilter, toggleArrayFilter }: DistributionSectionProps) => {

    // Configuração do BBB (Alvo Periférico)
    // Mantemos os IDs 'Baixa', 'Média', 'Alta' para o estado, mas exibimos os Labels da documentação
    const bbbOptions: FilterOption[] = [
        { id: 'Excelente', label: 'Excelente', subtitle: '(0 - 0.3)', color: 'success', icon: CheckCircleRoundedIcon },
        { id: 'Médio', label: 'Médio', subtitle: '(0.3 - 0.7)', color: 'warning', icon: WarningRoundedIcon },
        { id: 'Ruim', label: 'Ruim', subtitle: '(0.7 - 1.0)', color: 'error', icon: CancelRoundedIcon }
    ];

    return (
        <FilterSection
            title="Distribuição"
            icon={<LocalShippingOutlinedIcon fontSize="small" className="text-gray-500" />}
            badgeCount={count > 0 ? count : undefined}
        >
            <div className="space-y-6 pt-2">

                {/* 1. Permeabilidade BBB (Componente Universal) */}
                <FilterButtonGroup
                    title="Permeabilidade BBB (Alvo Periférico)"
                    options={bbbOptions}
                    activeValues={filters.distribution.bbb}
                    onToggle={(id) => toggleArrayFilter('distribution', 'bbb', id)}
                />

                {/* 2. Slider PPB */}
                <RangeSliderControl
                    label="Ligação a Proteínas (PPB)"
                    value={filters.distribution.ppb.value}
                    isActive={filters.distribution.ppb.active}
                    min={0} max={100} step={1} unit="%"
                    onChange={(newVal) => updateFilter('distribution', 'ppb', {
                        ...filters.distribution.ppb,
                        value: newVal
                    })}
                    onActiveChange={(newActive) => updateFilter('distribution', 'ppb', {
                        ...filters.distribution.ppb,
                        active: newActive
                    })}
                    onReset={() => updateFilter('distribution', 'ppb', {
                        value: [0, 100],
                        active: true
                    })}
                />

                {/* 3. Slider Fu */}
                <RangeSliderControl
                    label="Fração Livre no Plasma (Fu)"
                    value={filters.distribution.fu.value}
                    isActive={filters.distribution.fu.active}
                    min={0} max={100} step={1} unit="%"
                    onChange={(newVal) => updateFilter('distribution', 'fu', {
                        ...filters.distribution.fu,
                        value: newVal
                    })}
                    onActiveChange={(newActive) => updateFilter('distribution', 'fu', {
                        ...filters.distribution.fu,
                        active: newActive
                    })}
                    onReset={() => updateFilter('distribution', 'fu', {
                        value: [0, 100],
                        active: true
                    })}
                />

            </div>
        </FilterSection>
    );
};