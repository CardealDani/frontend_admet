import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import { FilterSection } from '../FilterSection';
import { FilterButtonGroup, type FilterOption } from '../FilterButtonGroup';
import type { AdmetFilters } from '../../../../types/filters';

interface ToxicitySectionProps {
    filters: AdmetFilters;
    count: number;
    toggleArrayFilter: (category: keyof AdmetFilters, field: string, value: string) => void;
}

export const ToxicitySection = ({ filters, count, toggleArrayFilter }: ToxicitySectionProps) => {

    // 1. Configuração do AMES (Mutagenicidade)
    const amesOptions: FilterOption[] = [
        { id: 'Excelente',  label: 'Excelente',     subtitle: '(0 - 0.3)',   color: 'success', icon: CheckCircleRoundedIcon },
        { id: 'Médio', label: 'Médio',    subtitle: '(0.3 - 0.7)', color: 'warning', icon: WarningRoundedIcon },
        { id: 'Ruim',  label: 'Ruim', subtitle: '(0.7 - 1.0)', color: 'error',   icon: CancelRoundedIcon }
    ];

    // 2. Configuração do hERG (Cardiotoxicidade)
    const hergOptions: FilterOption[] = [
        { id: 'Excelente',  label: 'Excelente',        subtitle: '(0 - 0.3)',   color: 'success', icon: CheckCircleRoundedIcon },
        { id: 'Médio', label: 'Médio',       subtitle: '(0.3 - 0.7)', color: 'warning', icon: WarningRoundedIcon },
        { id: 'Ruim',  label: 'Ruim   ',  subtitle: '(0.7 - 1.0)', color: 'error',   icon: CancelRoundedIcon }
    ];

    // 3. Configuração da Hepatotoxicidade
    const hepatoOptions: FilterOption[] = [
        { id: 'Excelente',  label: 'Excelente',        subtitle: '(0 - 0.3)',   color: 'success', icon: CheckCircleRoundedIcon },
        { id: 'Médio', label: 'Médio',       subtitle: '(0.3 - 0.7)', color: 'warning', icon: WarningRoundedIcon },
        { id: 'Ruim',  label: 'Ruim   ',  subtitle: '(0.7 - 1.0)', color: 'error',   icon: CancelRoundedIcon }
    ];

    return (
        <FilterSection 
            title="Toxicidade" 
            icon={<WarningAmberIcon fontSize="small" className="text-red-500" />} 
            badgeType="error" 
            defaultExpanded={true} 
            badgeCount={count > 0 ? count : undefined}
        >
            <div className="space-y-6 pt-2">

                <FilterButtonGroup 
                    title="Mutagenicidade (AMES)"
                    options={amesOptions}
                    activeValues={filters.toxicity.ames}
                    onToggle={(id) => toggleArrayFilter('toxicity', 'ames', id)}
                />

                <FilterButtonGroup 
                    title="Bloqueio hERG (Cardiotoxicidade)"
                    options={hergOptions}
                    activeValues={filters.toxicity.herg}
                    onToggle={(id) => toggleArrayFilter('toxicity', 'herg', id)}
                />

                <FilterButtonGroup 
                    title="Hepatotoxicidade Humana"
                    options={hepatoOptions}
                    activeValues={filters.toxicity.hepato}
                    onToggle={(id) => toggleArrayFilter('toxicity', 'hepato', id)}
                />

            </div>
        </FilterSection>
    );
};