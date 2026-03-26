// src/components/results/filters/RangeSliderControl.tsx
import { useState, useEffect } from 'react';
import { Typography, Slider, IconButton, Tooltip, Switch } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface RangeSliderControlProps {
  label: string;
  value: [number, number]; // Valor GLOBAL (do cérebro)
  min: number;
  max: number;
  isActive: boolean; // NOVO: Estado de ativação
  step?: number;
  unit?: string;
  onChange: (newValue: [number, number]) => void;
  onReset: () => void;
  onActiveChange: (isActive: boolean) => void; // NOVO: Callback de ativação
}

export const RangeSliderControl = ({ label, value, min, max, isActive, step = 1, unit, onChange, onReset, onActiveChange }: RangeSliderControlProps) => {
  const [localRange, setLocalRange] = useState<[number, number]>(value);
  const [localMinInput, setLocalMinInput] = useState<string | number>(value[0]);
  const [localMaxInput, setLocalMaxInput] = useState<string | number>(value[1]);

  useEffect(() => {
    setLocalRange(value);
    setLocalMinInput(value[0]);
    setLocalMaxInput(value[1]);
  }, [value[0], value[1]]);

  // Correção final no Input
  const finalizeInputChanges = () => {
    let finalMin = Number(localMinInput);
    let finalMax = Number(localMaxInput);

    if (isNaN(finalMin)) finalMin = min;
    if (isNaN(finalMax)) finalMax = max;

    finalMin = Math.max(min, Math.min(finalMin, max));
    finalMax = Math.max(min, Math.min(finalMax, max));

    if (finalMin > finalMax) {
      const temp = finalMin;
      finalMin = finalMax;
      finalMax = temp;
    }

    setLocalMinInput(finalMin);
    setLocalMaxInput(finalMax);
    setLocalRange([finalMin, finalMax]);
    onChange([finalMin, finalMax]);
  };

  const isModified = value[0] !== min || value[1] !== max;
  
  // Cores visuais baseadas no estado ativo/inativo
  const textColor = isActive ? 'text-gray-700' : 'text-gray-400';
  const inputBg = isActive ? 'bg-blue-50' : 'bg-gray-100';
  const inputTextColor = isActive ? 'text-blue-600' : 'text-gray-500';

  return (
    <div className="mb-5 px-1 group transition-all duration-200">
      <div className="flex justify-between items-center mb-1.5 gap-2">
        
        {/* LADO ESQUERDO: SWITCH + LABEL */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Tooltip title={isActive ? "Desativar este filtro" : "Ativar este filtro"} placement="top">
            <Switch 
              size="small" 
              checked={isActive} 
              onChange={(e) => onActiveChange(e.target.checked)}
              sx={{ 
                width: 34, height: 20, padding: 0,
                '& .MuiSwitch-switchBase': { 
                  padding: '2px', 
                  color: '#fff', // Bolinha SEMPRE branca
                  '&.Mui-checked': { 
                    transform: 'translateX(14px)', 
                    color: '#fff', 
                    '& + .MuiSwitch-track': { 
                      backgroundColor: '#2563eb', // Azul premium quando ON
                      opacity: 1, 
                      border: 'none' 
                    } 
                  } 
                },
                '& .MuiSwitch-thumb': { 
                  width: 16, 
                  height: 16,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.25)' // Sombra para a bolinha saltar do fundo
                },
                '& .MuiSwitch-track': { 
                  borderRadius: 10, 
                  backgroundColor: '#cbd5e1', // Cinza sólido (slate-300) quando OFF. Zero transparência!
                  opacity: 1, 
                },
              }}
            />
          </Tooltip>
          <Typography className={`font-inter font-medium text-xs whitespace-nowrap overflow-hidden text-ellipsis ${textColor}`}>
            {label}
          </Typography>
          {isActive && isModified && (
            <Tooltip title="Restaurar padrão" placement="top">
              <IconButton size="small" onClick={onReset} className="p-0.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors animate-fade-in">
                <RestartAltIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          )}
        </div>

        {/* LADO DIREITO: BADGE COM INPUTS */}
        <div className={`flex items-center font-inter text-[11px] font-bold ${inputTextColor} ${inputBg} px-1.5 py-0.5 rounded-lg border border-gray-100/50 transition-all shrink-0`}>
          <input
            type="text"
            value={localMinInput}
            onChange={(e) => setLocalMinInput(e.target.value)}
            onBlur={finalizeInputChanges}
            onKeyDown={(e) => e.key === 'Enter' && finalizeInputChanges()}
            disabled={!isActive} // DESABILITADO SE INATIVO
            className="w-[38px] px-1 py-0.5 bg-transparent text-center rounded outline-none transition-all cursor-text [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:bg-white focus:ring-1 focus:ring-blue-300 disabled:cursor-not-allowed"
          />
          <span className="text-gray-300 font-normal mx-0.5">-</span>
          <input
            type="text"
            value={localMaxInput}
            onChange={(e) => setLocalMaxInput(e.target.value)}
            onBlur={finalizeInputChanges}
            onKeyDown={(e) => e.key === 'Enter' && finalizeInputChanges()}
            disabled={!isActive} // DESABILITADO SE INATIVO
            className="w-[38px] px-1 py-0.5 bg-transparent text-center rounded outline-none transition-all cursor-text [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:bg-white focus:ring-1 focus:ring-blue-300 disabled:cursor-not-allowed"
          />
          {unit && <span className="text-[10px] text-gray-400 font-normal ml-1">{unit}</span>}
        </div>
      </div>
      
      {/* Slider Físico */}
      <Slider 
        value={localRange} 
        onChange={(_, v) => {
          const vals = v as [number, number];
          setLocalRange(vals);
          setLocalMinInput(vals[0]);
          setLocalMaxInput(vals[1]);
        }} 
        onChangeCommitted={(_, v) => onChange(v as [number, number])}
        valueLabelDisplay="auto"
        min={min} 
        max={max} 
        step={step} 
        disableSwap
        disabled={!isActive} // DESABILITADO SE INATIVO
        size="small" 
        sx={{ color: isActive ? '#2563eb' : '#e2e8f0', padding: '10px 0', '& .MuiSlider-thumb': { backgroundColor: isActive ? '#2563eb' : '#cbd5e1', border: isActive ? '2px solid #fff' : '2px solid #e2e8f0' } }} 
      />
    </div>
  );
};