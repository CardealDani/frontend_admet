// src/components/results/FilterSidebar.tsx
import React, { useState } from 'react';
import { Typography, Button, IconButton, Select, MenuItem, Tooltip, Badge } from '@mui/material';

// Ícones
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { LuFilter } from 'react-icons/lu';

import { defaultFilters} from '../../types/filters';
import type { AdmetFilters } from '../../types/filters';

import { PfqMedChemSection } from './filters/sections/PfqMedChemSection';
import { AbsorptionSection } from './filters/sections/AbsorptionSection';
import { DistributionSection } from './filters/sections/DistributionSection';
import { MetabolismSection } from './filters/sections/MetabolismSection';
import { ExcretionSection } from './filters/sections/ExcretionSection';
import { ToxicitySection } from './filters/sections/ToxicitySection';

interface FilterSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const FilterSidebar = ({ isSidebarOpen, toggleSidebar }: FilterSidebarProps) => {

  const [filters, setFilters] = useState<AdmetFilters>(defaultFilters);
  const [presetName, setPresetName] = useState<string>('default');

  // Atualiza propriedades diretas (sliders, checkboxes únicos)
  const updateFilter = (category: keyof AdmetFilters, field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
    setPresetName('custom'); // Se mexeu na mão, sai do preset
  };

  // Atualiza propriedades em Array (Caco-2, etc)
  const toggleArrayFilter = (category: keyof AdmetFilters, field: string, value: string) => {
    console.log('Toggling filter:', category, field, value);

    setFilters(prev => {
      const currentArray = prev[category][field as keyof typeof prev[typeof category]] as string[];
      console.log('Current array before toggle:', currentArray);
      const newArray = currentArray.includes(value)
        ? currentArray.filter(v => v !== value)
        : [...currentArray, value];

      console.log('New array after toggle:', newArray);

      return { ...prev, [category]: { ...prev[category], [field]: newArray } };
    });
    setPresetName('custom');
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setPresetName('default');
  };


  // LÓGICA FINAL DE CONTAGEM (Inteligente)
  const countActiveFilters = (currentSection: any, defaultSection: any): number => {
    let count = 0;
    
    Object.keys(currentSection).forEach(key => {
      const cVal = currentSection[key];
      const dVal = defaultSection[key];

      // 1. Se for um ToggleableFilter (tem a propriedade 'active')
      if (cVal && typeof cVal === 'object' && 'active' in cVal) {
        if (cVal.active) count++;
      } 
      // 2. Se for um Array categórico (ex: caco2)
      else if (Array.isArray(cVal) && Array.isArray(dVal)) {
        if (cVal.length !== dVal.length) count++;
      } 
      // 3. Se for um Booleano direto (ex: lipinski)
      else if (cVal !== dVal) {
        count++;
      }
    });
    
    return count;
  };

    // Contagem por Acordeão (Seção)
    // Nota: A seção Físico-Química da sua UI junta o state 'pfq' e 'medchem'
    const countPfq = countActiveFilters(filters.pfq, defaultFilters.pfq) + countActiveFilters(filters.medchem, defaultFilters.medchem);
    const countAbs = countActiveFilters(filters.absorption, defaultFilters.absorption);
    const countDist = countActiveFilters(filters.distribution, defaultFilters.distribution);
    const countMet = countActiveFilters(filters.metabolism, defaultFilters.metabolism);
    const countExc = countActiveFilters(filters.excretion, defaultFilters.excretion);
    const countTox = countActiveFilters(filters.toxicity, defaultFilters.toxicity);

    // Contagem Total para o Ícone Principal do Header
    const totalActiveFilters = countPfq + countAbs + countDist + countMet + countExc + countTox;

// ==========================================
  // LÓGICA DE REGRAS MEDCHEM (INTERSEÇÃO)
  // ==========================================
  
 const handleLipinskiToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isLipinski = e.target.checked;
    
    setFilters(prev => {
      const isPfizer = prev.medchem.pfizer; 

      return {
        ...prev,
        medchem: { ...prev.medchem, lipinski: isLipinski },
        pfq: {
          ...prev.pfq,
          // Peso Molecular: Atualizamos o valor E ativamos a chave do slider!
          mw: {
            value: isLipinski ? [0, 500] : [0, 1000],
            active: isLipinski // Liga o slider se a regra estiver On
          },
          // LogP: Se qualquer uma das duas regras estiver ligada, o slider fica ativo
          logp: {
            value: isPfizer ? [-5, 3] : (isLipinski ? [-5, 5] : [-5, 10]),
            active: isPfizer || isLipinski 
          }
        }
      };
    });
  };

  const handlePfizerToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isPfizer = e.target.checked;
    
    setFilters(prev => {
      const isLipinski = prev.medchem.lipinski; 

      return {
        ...prev,
        medchem: { ...prev.medchem, pfizer: isPfizer },
        pfq: {
          ...prev.pfq,
          // TPSA: Atualizamos o valor E ativamos o slider
          tpsa: {
            value: isPfizer ? [75, 200] : [0, 200],
            active: isPfizer
          },
          // LogP Colisão (Mesma regra de cima)
          logp: {
            value: isPfizer ? [-5, 3] : (isLipinski ? [-5, 5] : [-5, 10]),
            active: isPfizer || isLipinski
          }
        }
      };
    });
  };

  return (
    <div className="w-full flex flex-col h-full animate-fade-in bg-gray-50">

      {/* ========================================== */}
      {/* 2. HEADER (TRILHO MÁGICO)                  */}
      {/* ========================================== */}
      <div className="py-3 pl-3 shrink-0 z-10">
        <div className={`flex justify-between items-center border-b border-gray-200 pb-2 mr-4`}>
          <div className="flex items-center">
            <Tooltip title={isSidebarOpen ? "" : "Mostrar Filtros"} placement="right">
              <IconButton onClick={toggleSidebar} className={`transition-all duration-300 ${!isSidebarOpen ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-transparent text-blue-500 hover:bg-gray-100'}`} sx={{ width: 40, height: 40 }}>
                <Badge badgeContent={totalActiveFilters} color="primary" invisible={isSidebarOpen || totalActiveFilters === 0} sx={{ '& .MuiBadge-badge': { backgroundColor: '#2563eb' } }}>
                  <LuFilter size={20} />
                </Badge>
              </IconButton>
            </Tooltip>

            <Typography variant="h6" className={`font-nunito_sans font-extrabold text-gray-800 text-lg transition-opacity duration-200 whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
              Filtros
            </Typography>

            <div className={`font-inter w-6 h-6 mx-2 rounded-full bg-blue-500 transition-opacity duration-200 flex items-center justify-center ${isSidebarOpen && totalActiveFilters > 0 ? 'opacity-100' : 'opacity-0'}`}>
              <Typography variant="body2" className={'text-[11px] text-white font-bold leading-none'}>{totalActiveFilters}</Typography>
            </div>
          </div>

          <div className={`flex items-center transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleSidebar}>
            <Tooltip title={!isSidebarOpen ? "" : "Ocultar Filtros"} placement="left">
              <ArrowBackIosIcon fontSize="small" className="text-gray-400 hover:text-blue-600 cursor-pointer" />
            </Tooltip>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 3. CONTEÚDO SCROLLÁVEL                     */}
      {/* ========================================== */}
      <div className={`flex flex-col flex-1 min-h-0 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex-1 overflow-y-auto pr-1 pl-3 custom-scrollbar">

          {/* BARRA DE PRESETS */}
          <div className="flex items-center gap-2 mx-2 mt-4 mb-6">
            <Select
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              size="small"
              displayEmpty // Permite controlar a exibição quando não há valor real
              IconComponent={(props) => (
                <KeyboardArrowDownIcon {...props} className={`${props.className} text-gray-400`} />
              )}
              className="bg-white font-inter text-sm text-gray-800 transition-all"
              sx={{
                flex: 1,
                borderRadius: '10px',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e2e8f0',
                  borderRadius: '10px',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#cbd5e1'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3b82f6',
                  borderWidth: '1px',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)' // Efeito de "Glow" azul no foco
                },
                '& .MuiSelect-select': {
                  paddingY: '8.5px', // Alinha a altura perfeitamente com o botão ao lado
                  fontWeight: presetName === 'PresetNames salvos' ? 400 : 600,
                  color: presetName === 'PresetNames salvos' ? '#94a3b8' : '#1e293b'
                }
              }}
              // MenuProps customiza a "caixinha" flutuante que abre com as opções
              MenuProps={{
                PaperProps: {
                  sx: {
                    mt: 1,
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #f1f5f9',
                    '& .MuiMenuItem-root': {
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      color: '#475569',
                      borderRadius: '6px',
                      mx: '8px',
                      my: '4px',
                      transition: 'all 0.2s ease',
                      '&:hover': { backgroundColor: '#f0f9ff', color: '#0284c7' }, // Hover azulzinho
                      '&.Mui-selected': { backgroundColor: '#bae6fd', color: '#0369a1', fontWeight: 700 }, // Item selecionado
                      '&.Mui-selected:hover': { backgroundColor: '#bae6fd' }
                    }
                  }
                }
              }}
            >
              <MenuItem value="default">Preset Padrão</MenuItem>
              <MenuItem value="custom" sx={{ display: 'none' }}>Configuração Customizada...</MenuItem>
              <MenuItem value="lipinski_strict">Filtro Lipinski Strict</MenuItem>
              <MenuItem value="high_safety_lead">Lead-Like (Alta Segurança)</MenuItem>
            </Select>

            <Tooltip title="Salvar combinação atual como Preset" placement="top">
              <IconButton
                className="bg-white border border-gray-200 rounded-[10px] hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm"
                sx={{ width: 40, height: 40 }}
              >
                <SaveOutlinedIcon fontSize="small" className="text-inherit" />
              </IconButton>
            </Tooltip>
          </div>

          <PfqMedChemSection
            filters={filters}
            count={countPfq}
            updateFilter={updateFilter}
            handleLipinskiToggle={handleLipinskiToggle}
            handlePfizerToggle={handlePfizerToggle}
          />

          <AbsorptionSection
            filters={filters}
            count={countAbs}
            updateFilter={updateFilter}
            toggleArrayFilter={toggleArrayFilter}
          />
          <DistributionSection filters={filters} count={countDist} updateFilter={updateFilter} toggleArrayFilter={toggleArrayFilter} />
          <MetabolismSection filters={filters} count={countMet} toggleArrayFilter={toggleArrayFilter} />
          <ExcretionSection filters={filters} count={countExc} updateFilter={updateFilter} />
          <ToxicitySection filters={filters} count={countTox} toggleArrayFilter={toggleArrayFilter} />

        </div>

        {/* ========================================== */}
        {/* 4. RODAPÉ (AÇÕES)                          */}
        {/* ========================================== */}
        <div className="mt-auto pt-4 pb-4 px-3 shrink-0">
          <Button
            variant="contained" fullWidth startIcon={<RefreshIcon />} onClick={handleResetFilters}
            className="bg-[#0ea5e9] text-white hover:bg-[#0284c7] font-nunito_sans font-extrabold normal-case py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
          >
            Resetar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;