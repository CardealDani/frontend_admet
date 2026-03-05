// src/components/results/FilterSidebar.tsx
import React, { useState } from 'react';
import { Typography, Slider, Switch, FormControlLabel, Checkbox, Button, Divider } from '@mui/material';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import HealingIcon from '@mui/icons-material/Healing';
import ScienceIcon from '@mui/icons-material/Science';
import SecurityIcon from '@mui/icons-material/Security';

const FilterSidebar = () => {
  // Estados locais para os filtros (futuramente, isso irá para um Context API ou Redux para filtrar a tabela real)
  const [lipinski, setLipinski] = useState(false);
  const [mw, setMw] = useState<number[]>([0, 1000]);
  const [logp, setLogp] = useState<number[]>([-5, 10]);
  const [tpsa, setTpsa] = useState<number[]>([0, 200]);
  
  const [ames, setAmes] = useState(false);
  const [herg, setHerg] = useState(false);

  // Função para resetar todos os filtros
  const handleResetFilters = () => {
    setLipinski(false);
    setMw([0, 1000]);
    setLogp([-5, 10]);
    setTpsa([0, 200]);
    setAmes(false);
    setHerg(false);
  };

  // Quando o usuário ativa a Regra de Lipinski, ajustamos os sliders automaticamente! (Ótimo para UX)
  const handleLipinskiToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setLipinski(isChecked);
    if (isChecked) {
      setMw([0, 500]);
      setLogp([-5, 5]);
      // Lipinski também envolve doadores/aceptores de hidrogênio, mas vamos focar nestes para o protótipo
    } else {
      setMw([0, 1000]);
      setLogp([-5, 10]);
    }
  };

  return (
    <div className="w-full flex flex-col h-full animate-fade-in-up">
      
      {/* 1. FILTROS RÁPIDOS */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 text-gray-800">
          <HealingIcon fontSize="small" className="text-blue-500" />
          <Typography className="font-nunito_sans font-bold text-sm uppercase tracking-wider">
            Filtros Rápidos
          </Typography>
        </div>
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 transition-colors hover:bg-blue-50">
          <FormControlLabel
            control={
              <Switch 
                checked={lipinski} 
                onChange={handleLipinskiToggle} 
                color="primary" 
              />
            }
            label={
              <div>
                <Typography className="font-nunito_sans font-bold text-gray-800 text-sm">
                  Regra de Lipinski (Rule of 5)
                </Typography>
                <Typography className="font-inter text-xs text-gray-500 mt-0.5">
                  Aplica limites de biodisponibilidade oral.
                </Typography>
              </div>
            }
            className="m-0 w-full"
          />
        </div>
      </div>

      <Divider className="mb-6" />

      {/* 2. PROPRIEDADES FÍSICO-QUÍMICAS */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4 text-gray-800">
          <ScienceIcon fontSize="small" className="text-indigo-500" />
          <Typography className="font-nunito_sans font-bold text-sm uppercase tracking-wider">
            Físico-Química
          </Typography>
        </div>

        {/* Range Slider: Peso Molecular */}
        <div className="mb-5 px-1">
          <div className="flex justify-between items-end mb-1">
            <Typography className="font-inter font-medium text-sm text-gray-700">Peso Molecular</Typography>
            <Typography className="font-inter text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {mw[0]} - {mw[1]} <span className="text-[10px] text-gray-400 font-normal">g/mol</span>
            </Typography>
          </div>
          <Slider
            value={mw}
            onChange={(_, newValue) => setMw(newValue as number[])}
            valueLabelDisplay="auto"
            min={0}
            max={1000}
            size="small"
            sx={{ color: '#2563eb' }} // blue-600 do Tailwind
          />
        </div>

        {/* Range Slider: LogP */}
        <div className="mb-5 px-1">
          <div className="flex justify-between items-end mb-1">
            <Typography className="font-inter font-medium text-sm text-gray-700">LogP</Typography>
            <Typography className="font-inter text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {logp[0]} a {logp[1]}
            </Typography>
          </div>
          <Slider
            value={logp}
            onChange={(_, newValue) => setLogp(newValue as number[])}
            valueLabelDisplay="auto"
            min={-5}
            max={10}
            step={0.1}
            size="small"
            sx={{ color: '#2563eb' }}
          />
        </div>

        {/* Range Slider: TPSA */}
        <div className="mb-2 px-1">
          <div className="flex justify-between items-end mb-1">
            <Typography className="font-inter font-medium text-sm text-gray-700">TPSA</Typography>
            <Typography className="font-inter text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {tpsa[0]} - {tpsa[1]} <span className="text-[10px] text-gray-400 font-normal">Å²</span>
            </Typography>
          </div>
          <Slider
            value={tpsa}
            onChange={(_, newValue) => setTpsa(newValue as number[])}
            valueLabelDisplay="auto"
            min={0}
            max={200}
            size="small"
            sx={{ color: '#2563eb' }}
          />
        </div>
      </div>

      <Divider className="mb-6" />

      {/* 3. SEGURANÇA E TOXICIDADE */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 text-gray-800">
          <SecurityIcon fontSize="small" className="text-red-500" />
          <Typography className="font-nunito_sans font-bold text-sm uppercase tracking-wider">
            Toxicidade (Limites Estritos)
          </Typography>
        </div>
        
        <div className="flex flex-col gap-2">
          <FormControlLabel
            control={<Checkbox checked={ames} onChange={(e) => setAmes(e.target.checked)} size="small" sx={{ color: '#2563eb', '&.Mui-checked': { color: '#2563eb' } }} />}
            label={<Typography className="font-inter text-sm text-gray-700">Apenas Ames Negativo (Não mutagênico)</Typography>}
          />
          <FormControlLabel
            control={<Checkbox checked={herg} onChange={(e) => setHerg(e.target.checked)} size="small" sx={{ color: '#2563eb', '&.Mui-checked': { color: '#2563eb' } }} />}
            label={<Typography className="font-inter text-sm text-gray-700">Apenas Baixo Risco hERG (Cardíaco)</Typography>}
          />
        </div>
      </div>

      {/* BOTÃO LIMPAR FILTROS */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <Button 
          variant="text" 
          fullWidth 
          startIcon={<FilterAltOffIcon />}
          onClick={handleResetFilters}
          className="text-gray-500 hover:text-red-600 hover:bg-red-50 font-inter normal-case transition-colors"
        >
          Limpar Todos os Filtros
        </Button>
      </div>

    </div>
  );
};

export default FilterSidebar;