// src/components/results/filters/sections/BinaryToggleControl.tsx
import { Typography, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface BinaryToggleControlProps {
  label: string;
  // O estado atual do filtro (ex: ['Sim', 'Não'] significa filtro desligado/todos)
  activeValues: string[]; 
  tooltipText?: string;
  onChange: (newValues: string[]) => void;
}

export const BinaryToggleControl = ({ label, activeValues, tooltipText, onChange }: BinaryToggleControlProps) => {
  // Se o array tem 2 itens (Sim e Não), o filtro está "Neutro/Desligado"
  const isFilterOff = activeValues.length === 2;

  const handleToggle = (clickedOption: string) => {
    if (!isFilterOff && activeValues[0] === clickedOption) {
      // O usuário clicou no botão que já estava aceso. 
      // Ação: DESLIGAR O FILTRO (mandamos o array completo de volta)
      onChange(['Sim', 'Não']);
    } else {
      // O usuário clicou em uma opção nova.
      // Ação: LIGAR O FILTRO apenas nessa opção
      onChange([clickedOption]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1.5">
          <Typography className="font-inter text-xs font-semibold text-gray-700">
            {label}
          </Typography>
          {tooltipText && (
            <Tooltip title={tooltipText} placement="top" sx={{ '& .MuiTooltip-tooltip': { backgroundColor: '#f0f9ff', color: '#1e293b' } }}>
              <InfoOutlinedIcon fontSize="inherit" className="text-gray-400 hover:text-blue-500 cursor-help" />
            </Tooltip>
          )}
        </div>

      </div>

      <div className="flex w-full bg-slate-50/50 p-1 rounded-[10px] border border-slate-200/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
        {['Sim', 'Não'].map((option) => {
          // O botão só fica ativo se o filtro NÃO estiver desligado E a opção for a escolhida
          const isActive = !isFilterOff && activeValues[0] === option;

          return (
            <Tooltip key={option} title={isActive ? "Clique novamente para remover este filtro" : `Filtrar apenas por ${option}`} placement="top">
              <button 
                onClick={() => handleToggle(option)} 
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 border border-transparent ${
                  isActive 
                    ? 'bg-blue-50/80 text-blue-700 border-blue-100 shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-700'
                }`}
              >
                {option}
              </button>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};