// src/components/results/FilterSidebar.tsx
import React, { useState } from 'react';
import { Typography, Switch, Checkbox, FormControlLabel, Button, IconButton, Select, MenuItem, Tooltip, Badge } from '@mui/material';

// Ícones
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ScienceIcon from '@mui/icons-material/Science'; 
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'; 
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'; 
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined'; 
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'; 
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; 
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { LuFilter } from 'react-icons/lu';

// Componentes Refatorados e Tipos
import { FilterSection } from './filters/FilterSection';
import { RangeSliderControl } from './filters/RangeSliderControl';
import { defaultFilters, filterPresets, PFQ_FILTERS_CONFIG } from '../../types/filters';
import type { AdmetFilters } from '../../types/filters';

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

  const handlePresetChange = (newPreset: string) => {
    setPresetName(newPreset);
    if (filterPresets[newPreset]) {
      setFilters(filterPresets[newPreset]);
    }
  };
// ==========================================
  // LÓGICA INTELIGENTE DE CONTAGEM DE BADGES
  // ==========================================
  const countActiveFilters = (currentSection: any, defaultSection: any): number => {
    let count = 0;
    
    Object.keys(currentSection).forEach(key => {
      const cVal = currentSection[key];
      const dVal = defaultSection[key];

      if (Array.isArray(cVal) && Array.isArray(dVal)) {
        
        // 1. É um Slider? (Array de Números, ex: [0, 100]) -> A ordem importa!
        if (typeof dVal[0] === 'number') {
          if (cVal[0] !== dVal[0] || cVal[1] !== dVal[1]) {
            count++; 
          }
        } 
        // 2. É uma Categoria? (Array de Strings, ex: ['Alta', 'Baixa']) -> A ordem NÃO importa!
        else {
          if (cVal.length !== dVal.length) {
            count++; // Se a quantidade de itens mudou, com certeza o filtro tá ativo
          } else {
            // Se tem a mesma quantidade, checa se os itens são os mesmos (ignorando a ordem)
            const isDifferent = cVal.some((item: string) => !dVal.includes(item));
            if (isDifferent) {
              count++;
            }
          }
        }
        
      } else if (cVal !== dVal) {
        // Booleanos, Strings diretas ou outros tipos (ex: Lipinski: true)
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

  const handleLipinskiToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      
      setFilters(prev => ({
        ...prev,
        medchem: {
          ...prev.medchem,
          lipinski: isChecked
        },
        pfq: {
          ...prev.pfq,
          // Se ativou a chave, força o slider para o limite do Lipinski.
          // Se desativou, volta o slider para o limite máximo padrão.
          mw: isChecked ? [0, 500] : [0, 1000],
          logp: isChecked ? [-5, 5] : [-5, 10]
        }
      }));
      
      setPresetName('custom');
    };

    // Mágica do Efeito Macro: Atualiza a chave Pfizer e os sliders de LogP e TPSA
  const handlePfizerToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    
    setFilters(prev => ({
      ...prev,
      medchem: {
        ...prev.medchem,
        pfizer: isChecked
      },
      pfq: {
        ...prev.pfq,
        // Regra Pfizer "Pass" (Segura): LogP <= 3 e TPSA >= 75
        logp: isChecked ? [-5, 3] : [-5, 10], // Ajusta o máximo
        tpsa: isChecked ? [75, 200] : [0, 200] // Ajusta o mínimo
      }
    }));
    
    setPresetName('custom');
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

          {/* FÍSICO-QUÍMICA & MEDCHEM */}
          <FilterSection title="Físico-Química / MedChem" icon={<ScienceIcon fontSize="small" className="text-blue-500" />} defaultExpanded={true} badgeCount={countPfq > 0 ? countPfq : undefined} >
            <div className="space-y-4 pt-2">
              
             {PFQ_FILTERS_CONFIG.map((config) => (
                <RangeSliderControl
                  key={config.field} // Usar o nome do campo como Key é muito melhor que usar o 'idx'
                  label={config.label}
                  value={filters.pfq[config.field] as [number, number]} // Puxa o estado dinamicamente
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  unit={config.unit}
                  onChange={(newVal) => updateFilter('pfq', config.field, newVal)}
                  onReset={() => updateFilter('pfq', config.field, [config.min, config.max])}
                />
              ))}
              
              {/* SWITCHES DE REGRAS (DRUGLIKENESS) */}
              <div className="pt-4 border-t border-gray-100 mt-4">
                 <Typography className="font-inter text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-3">
                   Filtros de Druglikeness
                 </Typography>
                 
                 <div className="flex flex-col gap-2">
                   <FormControlLabel 
                      control={
                        <Switch 
                          checked={filters.medchem.lipinski} 
                          onChange={handleLipinskiToggle} // <-- Usando a nossa nova função!
                          size="small" 
                          // Estilizando a chavinha para ficar com o nosso azul padrão
                          sx={{ 
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#2563eb' }, 
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2563eb' } 
                          }} 
                        />
                      } 
                      label={<Typography className="font-inter text-xs text-gray-700 font-medium">Regra de Lipinski (Pass)</Typography>} 
                   />
                   
                   <FormControlLabel 
                      control={
                        <Switch 
                          checked={filters.medchem.pfizer} 
                          onChange={handlePfizerToggle} // Pfizer continua normal
                          size="small" 
                          sx={{ 
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#2563eb' }, 
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2563eb' } 
                          }} 
                        />
                      } 
                      label={<Typography className="font-inter text-xs text-gray-700 font-medium">Regra Pfizer (3/75)</Typography>} 
                   />
                 </div>
              </div>
            </div>
          </FilterSection>

        {/* ABSORÇÃO */}
          <FilterSection 
            title="Absorção" 
            icon={<ShieldOutlinedIcon fontSize="small" className="text-teal-500" />} 
            defaultExpanded={true}
            badgeCount={countAbs > 0 ? countAbs : undefined}
          >
             <div className="space-y-6 pt-2">
                
                {/* 1. Percentual de Absorção (Slider) */}
                <RangeSliderControl
                  label="Absorção Intestinal (HIA)"
                  value={filters.absorption.absorptionPercent}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                  onChange={(newVal) => updateFilter('absorption', 'absorptionPercent', newVal)}
                  onReset={() => updateFilter('absorption', 'absorptionPercent', [0, 100])}
                />

                {/* 2. Permeabilidade Caco-2 (Cores Semânticas Suaves) */}
                <div>
                   <Typography className="font-inter text-xs font-semibold text-gray-700 mb-2">
                     Permeabilidade Caco-2
                   </Typography>
                   <div className="flex w-full bg-slate-50/50 p-1 rounded-[10px] border border-slate-200/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                      {['Alta', 'Média', 'Baixa'].map((lvl) => {
                         const isActive = filters.absorption.caco2.includes(lvl);
                         
                         // Lógica de cores premium (Tinted Backgrounds)
                         // Normal state + Hover suave igual ao botão de Save
                         let colorClasses = 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-700'; 
                         
                         if (isActive) {
                           // Cores ativas muito mais pálidas e elegantes
                           if (lvl === 'Alta') colorClasses = 'bg-emerald-50/80 text-emerald-700 border-emerald-100 shadow-sm';
                           if (lvl === 'Média') colorClasses = 'bg-amber-50/80 text-amber-700 border-amber-100 shadow-sm';
                           if (lvl === 'Baixa') colorClasses = 'bg-rose-50/80 text-rose-700 border-rose-100 shadow-sm';
                         }

                         return (
                           <button 
                              key={lvl} 
                              onClick={() => toggleArrayFilter('absorption', 'caco2', lvl)} 
                              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 border border-transparent ${colorClasses}`}
                            >
                              {lvl}
                            </button>
                         )
                      })}
                   </div>
                </div>

                {/* 3. Inibidor P-gp (Radio Segmentado - Estilo Premium) */}
                <div>
                   <Typography className="font-inter text-xs font-semibold text-gray-700 mb-2">
                     Inibidor P-gp (Bomba de Efluxo)
                   </Typography>
                   <div className="flex w-full bg-slate-50/50 p-1 rounded-[10px] border border-slate-200/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                      
                      {['Sim', 'Não', 'Qualquer'].map((option) => {
                        const isAny = filters.absorption.pgpInhibitor.length === 2;
                        const isActive = isAny ? option === 'Qualquer' : filters.absorption.pgpInhibitor[0] === option;

                        return (
                          <button 
                            key={option}
                            onClick={() => {
                              const newValue = option === 'Qualquer' ? ['Sim', 'Não'] : [option];
                              updateFilter('absorption', 'pgpInhibitor', newValue);
                            }}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 border border-transparent ${
                              isActive 
                                ? 'bg-blue-50/80 text-blue-700 border-blue-100 shadow-sm' // Azul suave igual ao botão de Save
                                : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-700'
                            }`}
                          >
                            {option}
                          </button>
                        )
                      })}

                   </div>
                </div>

             </div>
          </FilterSection>

       {/* DISTRIBUIÇÃO */}
          <FilterSection 
            title="Distribuição" 
            icon={<LocalShippingOutlinedIcon fontSize="small" className="text-gray-500" />}
            badgeCount={countDist > 0 ? countDist : undefined}
          >
             <div className="space-y-6 pt-2">
                
                {/* 1. Permeabilidade BBB (Botões Segmentados - Alvo Periférico) */}
                <div>
                   <Typography className="font-inter text-xs font-semibold text-gray-700 mb-2">
                     Permeabilidade Barreira Hematoencefálica (BBB)
                   </Typography>
                   <div className="flex w-full bg-slate-50/50 p-1 rounded-[10px] border border-slate-200/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                      {['Alta', 'Média', 'Baixa'].map((lvl) => {
                         const isActive = filters.distribution.bbb.includes(lvl);
                         
                         // Lógica de cores baseada na sua Tabela de Decisão Empírica
                         let colorClasses = 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-700'; 
                         
                         if (isActive) {
                           // Alta (>0.7) = Ruim (Vermelho)
                           if (lvl === 'Alta') colorClasses = 'bg-rose-50/80 text-rose-700 border-rose-100 shadow-sm';
                           // Média (0.3 - 0.7) = Médio (Amarelo)
                           if (lvl === 'Média') colorClasses = 'bg-amber-50/80 text-amber-700 border-amber-100 shadow-sm';
                           // Baixa (0 - 0.3) = Excelente (Verde)
                           if (lvl === 'Baixa') colorClasses = 'bg-emerald-50/80 text-emerald-700 border-emerald-100 shadow-sm';
                         }

                         return (
                           <button 
                              key={lvl} 
                              onClick={() => toggleArrayFilter('distribution', 'bbb', lvl)} 
                              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 border border-transparent ${colorClasses}`}
                            >
                              {lvl}
                            </button>
                         )
                      })}
                   </div>
                </div>

                {/* 2. PPB - Plasma Protein Binding (Slider) */}
                <RangeSliderControl
                  label="Ligação a Proteínas (PPB)"
                  value={filters.distribution.ppb}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                  onChange={(newVal) => updateFilter('distribution', 'ppb', newVal)}
                  onReset={() => updateFilter('distribution', 'ppb', [0, 100])}
                />

                {/* 3. Fu - Fraction Unbound (Slider em Porcentagem) */}
                <RangeSliderControl
                  label="Fração Livre no Plasma (Fu)"
                  value={filters.distribution.fu}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                  onChange={(newVal) => updateFilter('distribution', 'fu', newVal)}
                  onReset={() => updateFilter('distribution', 'fu', [0, 100])}
                />

             </div>
          </FilterSection>

          {/* METABOLISMO */}
          <FilterSection title="Metabolismo" icon={<SyncOutlinedIcon fontSize="small" className="text-gray-500" />}>
             <div className="flex flex-col gap-1 pt-1">
              <FormControlLabel control={<Checkbox checked={filters.metabolism.cyp1a2Substrate.includes('Não')} onChange={() => toggleArrayFilter('metabolism', 'cyp1a2Substrate', 'Não')} size="small" />} label={<Typography className="font-inter text-xs text-gray-700">Não Substrato CYP1A2</Typography>} />
              <FormControlLabel control={<Checkbox checked={filters.metabolism.cyp3a4Substrate.includes('Não')} onChange={() => toggleArrayFilter('metabolism', 'cyp3a4Substrate', 'Não')} size="small" />} label={<Typography className="font-inter text-xs text-gray-700">Não Substrato CYP3A4</Typography>} />
            </div>
          </FilterSection>

          {/* EXCREÇÃO */}
          <FilterSection title="Excreção" icon={<LogoutOutlinedIcon fontSize="small" className="text-gray-500" />}>
             <div className="flex flex-col gap-1 pt-1">
               {/* Aqui seria um slider de CLPlasma/T1-2, mas como exemplo vou manter o visual limpo */}
               <Typography className="font-inter text-xs text-gray-500 italic">Configure na versão completa</Typography>
            </div>
          </FilterSection>

          {/* TOXICIDADE */}
          <FilterSection title="Toxicidade" icon={<WarningAmberIcon fontSize="small" className="text-red-500" />} badgeType="error" defaultExpanded={true}>
            <div className="flex flex-col gap-1 pt-1">
              <FormControlLabel 
                control={<Checkbox checked={filters.toxicity.ames.length === 1 && filters.toxicity.ames[0] === 'Negativo'} onChange={(e) => updateFilter('toxicity', 'ames', e.target.checked ? ['Negativo'] : ['Negativo', 'Positivo'])} size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#ef4444' } }} />} 
                label={<Typography className="font-inter text-xs text-gray-800 font-medium">Apenas Ames Negativo</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox checked={filters.toxicity.herg.length === 1 && filters.toxicity.herg[0] === 'Baixo'} onChange={(e) => updateFilter('toxicity', 'herg', e.target.checked ? ['Baixo'] : ['Baixo', 'Médio', 'Alto'])} size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#ef4444' } }} />} 
                label={<Typography className="font-inter text-xs text-gray-800 font-medium">Apenas hERG Baixo</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox checked={filters.toxicity.hepato.length === 1 && filters.toxicity.hepato[0] === 'Seguro'} onChange={(e) => updateFilter('toxicity', 'hepato', e.target.checked ? ['Seguro'] : ['Seguro', 'Atenção', 'Tóxico'])} size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#ef4444' } }} />} 
                label={<Typography className="font-inter text-xs text-gray-800 font-medium">Apenas Hepato Seguro</Typography>} 
              />
            </div>
          </FilterSection>
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