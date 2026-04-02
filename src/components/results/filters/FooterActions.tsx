import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';

interface FooterActionsProps {
  hasDiff: boolean;
  totalActive: number; // Nova prop
  onApply: () => void;
  onReset: () => void;
}

export const FooterActions = ({ hasDiff, totalActive, onApply, onReset }: FooterActionsProps) => {
  // O Reset só faz sentido se existir algum filtro ativo OU se houver um diff (ex: o usuário limpou tudo no rascunho, mas ainda não aplicou)
  const canReset = totalActive > 0 || hasDiff;

  return (
    <div className="mt-auto pt-3 pb-3 px-3 shrink-0 border-t border-gray-200/60 flex flex-col gap-2">

      <Button
        variant="contained"
        fullWidth
        disabled={!hasDiff}
        startIcon={<CheckIcon fontSize="small" />}
        onClick={onApply}
        className="font-nunito_sans font-extrabold normal-case py-2.5 rounded-xl text-sm transition-all"
        sx={{
          backgroundColor: hasDiff ? '#2563eb' : undefined,
          boxShadow: 'none',
          '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' },
          '&.Mui-disabled': {
            backgroundColor: '#e2e8f0',
            color: '#94a3b8',
          },
        }}
      >
        {hasDiff ? 'Aplicar filtros' : 'Filtros aplicados'}
      </Button>

      <Button
        variant="outlined"
        fullWidth
        disabled={!canReset} // Desativa se não houver o que resetar
        startIcon={<RefreshIcon fontSize="small" />}
        onClick={onReset}
        className="font-nunito_sans font-bold normal-case py-2 rounded-xl text-sm transition-all"
        sx={{
          borderColor: '#e2e8f0',
          color: '#64748b',
          boxShadow: 'none',
          '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc', boxShadow: 'none' },
          '&.Mui-disabled': {
            borderColor: '#e2e8f0',
            color: '#cbd5e1',
          },
        }}
      >
        Resetar filtros
      </Button>

    </div>
  );
};