// src/components/filters/RangeFilter.tsx
import React from 'react';
import { Slider, TextField, Typography } from '@mui/material';

interface RangeFilterProps {
  label: string;
  min: number;
  max: number;
  value: number[];
  unit?: string;
  onChange: (newValue: number[]) => void;
}

const RangeFilter: React.FC<RangeFilterProps> = ({ 
  label, 
  min, 
  max, 
  value, 
  unit, 
  onChange 
}) => {
  
  // Handler para o Slider (MUI retorna event, value)
  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    onChange(newValue as number[]);
  };

  // Handler para os Inputs manuais
  const handleInputChange = (index: 0 | 1, val: string) => {
    const num = Number(val);
    if (isNaN(num)) return;
    
    const newValue = [...value];
    newValue[index] = num;
    onChange(newValue);
  };

  return (
    // Tailwind controlando o container (padding, borda, fundo)
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      
      <div className="flex justify-between items-center mb-2">
        <Typography variant="subtitle2" className="font-bold text-gray-700">
          {label}
        </Typography>
        {unit && <span className="text-xs text-gray-500 font-mono">({unit})</span>}
      </div>

      <div className="px-2">
        <Slider
          getAriaLabel={() => label}
          value={value}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          min={min}
          max={max}
          size="small"
          // Usando sx para customizar a cor da barra baseado no seu tema
          sx={{
            color: 'primary.main', 
            '& .MuiSlider-thumb': {
              borderRadius: '4px', // Deixando o "pino" quadrado para um look mais técnico
            },
          }}
        />
      </div>

      {/* Inputs para Min e Max */}
      <div className="flex justify-between gap-4 mt-2">
        <TextField
          label="Min"
          variant="outlined"
          size="small"
          type="number"
          value={value[0]}
          onChange={(e) => handleInputChange(0, e.target.value)}
          // Tailwind nas classes internas do input para reduzir o tamanho
          className="w-20"
          InputProps={{ style: { fontSize: 12 } }}
        />
        <TextField
          label="Max"
          variant="outlined"
          size="small"
          type="number"
          value={value[1]}
          onChange={(e) => handleInputChange(1, e.target.value)}
          className="w-20"
          InputProps={{ style: { fontSize: 12 } }}
        />
      </div>
    </div>
  );
};

export default RangeFilter;