
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

import { FilterSection } from '../FilterSection';
import { FilterButtonGroup, type FilterOption } from '../FilterButtonGroup';
import type { AdmetFilters } from '../../../../types/filters';

interface MetabolismSectionProps {
    filters: AdmetFilters;
    count: number;
    // Precisamos do toggleArray porque os CYPs usam arrays ['Sim', 'Não']
    toggleArrayFilter: (category: keyof AdmetFilters, field: string, value: string) => void;
}

export const MetabolismSection = ({ filters, count, toggleArrayFilter }: MetabolismSectionProps) => {

    // Configuração Universal para todas as Enzimas CYP
    // Como queremos evitar substratos, o 'Não' é o sucesso (Verde) e o 'Sim' é o alerta (Amarelo/Laranja)
    const cypOptions: FilterOption[] = [
        { id: 'Não', label: 'Não Substrato', color: 'success', icon: CheckCircleRoundedIcon },
        { id: 'Sim', label: 'Substrato', color: 'warning', icon: WarningRoundedIcon }
    ];

    // Mapeamento das 3 principais Enzimas
    const cypFilters = [
        { label: 'CYP1A2', field: 'cyp1a2Substrate' },
        { label: 'CYP2D6', field: 'cyp2d6Substrate' },
        { label: 'CYP3A4', field: 'cyp3a4Substrate' }
    ] as const;

    return (
        <FilterSection
            title="Metabolismo"
            icon={<SyncOutlinedIcon fontSize="small" className="text-gray-500" />}
            badgeCount={count > 0 ? count : undefined}
        >
            <div className="space-y-6 pt-2">
                {cypFilters.map(({ label, field }) => (
                    <FilterButtonGroup
                        key={field}
                        title={`Status Metabólico: ${label}`}
                        options={cypOptions}
                        // O TS entende que 'field' é uma chave válida graças ao 'as const' ali em cima
                        activeValues={filters.metabolism[field as keyof typeof filters.metabolism]}
                        onToggle={(id) => toggleArrayFilter('metabolism', field, id)}
                    />
                ))}
            </div>
        </FilterSection>
    );
};