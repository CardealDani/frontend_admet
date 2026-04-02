// src/components/results/filters/DiffBanner.tsx
// Aparece apenas quando staged !== applied.
// Dá ao usuário clareza sobre o que ainda não foi aplicado na tabela.

import { Typography } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';

interface DiffBannerProps {
  hasDiff: boolean;
  totalStagedCount: number;   // total de filtros ativos no staged
}

export const DiffBanner = ({ hasDiff, totalStagedCount }: DiffBannerProps) => {
  if (!hasDiff) return null;

  return (
    <div className="mx-3 mb-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-2 animate-fade-in">
      <TuneIcon sx={{ fontSize: 14 }} className="text-blue-500 shrink-0" />
      <Typography className="font-inter text-[11px] text-blue-700 leading-tight">
        {totalStagedCount > 0
          ? `${totalStagedCount} filtro${totalStagedCount > 1 ? 's' : ''} pendente${totalStagedCount > 1 ? 's' : ''} — clique em Aplicar`
          : 'Filtros resetados — clique em Aplicar para atualizar'}
      </Typography>
    </div>
  );
};