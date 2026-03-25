// src/components/results/filters/RangeSliderControl.tsx
import React, { useState, useEffect } from 'react';
import { Typography, Slider, IconButton, Tooltip } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface RangeSliderControlProps {
  label: string;
  value: [number, number]; // Valor GLOBAL (vem do cérebro)
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (newValue: [number, number]) => void; // Atualiza o GLOBAL
  onReset: () => void;
}

export const RangeSliderControl = ({ label, value, min, max, step = 1, unit, onChange, onReset }: RangeSliderControlProps) => {
  // O Estado Local controla a animação suave e os inputs sem travar a tela inteira
  const [localRange, setLocalRange] = useState<[number, number]>(value);
  const [localMinInput, setLocalMinInput] = useState<string | number>(value[0]);
  const [localMaxInput, setLocalMaxInput] = useState<string | number>(value[1]);

  // Sincroniza o local com o global caso venha uma ordem de fora (ex: botão de Reset ou Preset)
  useEffect(() => {
    setLocalRange(value);
    setLocalMinInput(value[0]);
    setLocalMaxInput(value[1]);
  }, [value[0], value[1]]);

  // ==========================================
  // FUNÇÕES DE INPUT (Textos)
  // ==========================================
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMinInput(e.target.value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMaxInput(e.target.value);
  };

  // Quando tira o foco do input, valida e manda para o Global
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
    
    // Manda para o cérebro
    onChange([finalMin, finalMax]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') finalizeInputChanges();
  };

  const isModified = value[0] !== min || value[1] !== max;

  return (
    <div className="mb-5 px-1 group">
      <div className="flex justify-between items-end mb-1">
        
        <div className="flex items-center gap-1">
          <Typography className="font-inter font-medium text-sm text-gray-700">
            {label}
          </Typography>
          {isModified && (
            <Tooltip title="Restaurar padrão" placement="top">
              <IconButton size="small" onClick={onReset} className="p-0.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors animate-fade-in">
                <RestartAltIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </div>

        <div className="flex items-center font-inter text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-lg border border-blue-100/50 transition-all">
          <input
            type="text"
            value={localMinInput}
            onChange={handleMinChange}
            onBlur={finalizeInputChanges}
            onKeyDown={handleKeyDown}
            className="w-[42px] px-1 py-0.5 bg-transparent text-center rounded outline-none transition-all cursor-text hover:bg-blue-100/60 focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-400 focus:text-blue-900"
          />
          <span className="text-blue-400/60 font-normal mx-0.5">-</span>
          <input
            type="text"
            value={localMaxInput}
            onChange={handleMaxChange}
            onBlur={finalizeInputChanges}
            onKeyDown={handleKeyDown}
            className="w-[42px] px-1 py-0.5 bg-transparent text-center rounded outline-none transition-all cursor-text hover:bg-blue-100/60 focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-400 focus:text-blue-900"
          />
          {unit && <span className="text-[10px] text-gray-400 font-normal ml-1">{unit}</span>}
        </div>
      </div>
      
      {/* MÁGICA DA PERFORMANCE AQUI:
        1. O 'value' lido pelo slider é o 'localRange' (atualiza a 60fps sem travar a tela).
        2. O 'onChange' só altera os states locais.
        3. O 'onChangeCommitted' dispara o 'onChange' global APENAS quando o mouse solta a bolinha!
      */}
      <Slider 
        value={localRange} 
        onChange={(_, v) => {
          const vals = v as [number, number];
          setLocalRange(vals);
          setLocalMinInput(vals[0]);
          setLocalMaxInput(vals[1]);
        }} 
        onChangeCommitted={(_, v) => {
          // Avisa o estado global (FilterSidebar) só no final do movimento
          onChange(v as [number, number]);
        }}
        valueLabelDisplay="auto"
        min={min} 
        max={max} 
        step={step} 
        disableSwap
        size="small" 
        sx={{ color: '#2563eb', padding: '10px 0' }} 
      />
    </div>
  );
};