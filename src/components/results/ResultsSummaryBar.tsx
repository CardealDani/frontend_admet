// src/components/results/ResultsSummaryBar.tsx
// Barra entre topbar e tabela: mostra "X de Y moléculas" e sinaliza filtros ativos.

import { Chip } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

interface ResultsSummaryBarProps {
  filteredCount: number;
  totalCount: number;
}

const ResultsSummaryBar = ({ filteredCount, totalCount }: ResultsSummaryBarProps) => {
  const isFiltered = filteredCount < totalCount;

  return (
    <div className="px-6 py-2.5 border-b border-gray-100 flex items-center gap-3 shrink-0 bg-gray-50/50">
      <p className="font-inter text-sm text-gray-600">
        <span className="font-bold text-gray-900">{filteredCount}</span>
        {' '}de{' '}
        <span className="font-medium">{totalCount}</span>
        {' '}moléculas
      </p>

      {isFiltered && (
        <Chip
          icon={<FilterListIcon sx={{ fontSize: 13 }} />}
          label="Filtros ativos"
          size="small"
          className="bg-blue-50 text-blue-700 border border-blue-100 font-inter font-bold"
          sx={{ height: 20, fontSize: 11, '& .MuiChip-icon': { color: '#1d4ed8' } }}
        />
      )}

      {filteredCount === 0 && (
        <span className="font-inter text-xs text-amber-600 font-medium">
          Nenhuma molécula corresponde aos filtros aplicados
        </span>
      )}
    </div>
  );
};

export default ResultsSummaryBar;