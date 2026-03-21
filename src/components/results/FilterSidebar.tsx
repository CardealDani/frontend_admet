// src/components/results/FilterSidebar.tsx
import React, { useState } from 'react';
import { 
  Typography, Slider, Switch, Checkbox, FormControlLabel,
  Accordion, AccordionSummary, AccordionDetails, Button, IconButton, Select, MenuItem,
  Tooltip, Badge
} from '@mui/material';

// Ícones do Material UI
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
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

interface FilterSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const FilterSidebar = ({ isSidebarOpen, toggleSidebar }: FilterSidebarProps) => {
  const [realTime, setRealTime] = useState(true);
  const [preset, setPreset] = useState('Presets salvos');

  // Estados dos Filtros
  const [mw, setMw] = useState<number[]>([200, 500]);
  const [logp, setLogp] = useState<number[]>([-1, 5]);
  const [tpsa, setTpsa] = useState<number[]>([20, 140]);
  const [caco2, setCaco2] = useState<string[]>(['Alta', 'Média']);

  const handleResetFilters = () => {
    setMw([0, 1000]);
    setLogp([-5, 10]);
    setTpsa([0, 200]);
    setCaco2(['Alta', 'Média', 'Baixa']);
  };

  const toggleCaco2 = (val: string) => {
    setCaco2(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const FilterSection = ({ title, icon, badgeCount, badgeType = 'default', children, defaultExpanded = false }: any) => {
    const badgeClass = badgeType === 'error' 
      ? 'bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold'
      : 'bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-gray-200';

    return (
      <div className="mb-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Accordion 
          defaultExpanded={defaultExpanded}
          disableGutters 
          elevation={0} 
          sx={{ backgroundColor: 'transparent', '&:before': { display: 'none' } }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon className="text-gray-400" />}
            sx={{ minHeight: '48px', '& .MuiAccordionSummary-content': { margin: '12px 0' }, paddingX: '16px' }}
            className="hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex items-center justify-between w-full pr-2">
              <div className="flex items-center gap-2 text-gray-800">
                {icon}
                <Typography className="font-nunito_sans font-extrabold text-[14px]">{title}</Typography>
              </div>
              {badgeCount && <span className={badgeClass}>{badgeCount}</span>}
            </div>
          </AccordionSummary>
          <AccordionDetails className="px-5 pt-0 pb-5">
            {children}
          </AccordionDetails>
        </Accordion>
      </div>
    );
  };

  const SliderInputDisplay = ({ min, max, unit }: { min: number, max: number, unit?: string }) => (
    <div className="flex items-center gap-2">
      <div className="border border-gray-200 rounded-md px-3 py-1 bg-white text-xs font-mono font-medium text-gray-700 w-14 text-center">{min}</div>
      <span className="text-gray-400 text-xs">-</span>
      <div className="border border-gray-200 rounded-md px-3 py-1 bg-white text-xs font-mono font-medium text-gray-700 w-14 text-center">{max}</div>
      {unit && <span className="text-gray-500 text-xs ml-1">{unit}</span>}
    </div>
  );

  return (
    <div className="w-full flex flex-col h-full animate-fade-in bg-gray-50/30">
      
      {/* 1. TOP BAR DO FILTRO (Header Mágico) */}
      <div className="pt-4 mb-2 pl-3 shrink-0 z-10">
        <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-2 mr-4">
          
          <div className="flex items-center gap-3">
            <Tooltip title={isSidebarOpen ? "Ocultar Filtros" : "Mostrar Filtros"} placement="right">
              <IconButton
                onClick={toggleSidebar}
                className={`transition-all duration-300 ${!isSidebarOpen ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-transparent text-blue-500 hover:bg-gray-100'}`}
                sx={{ width: 40, height: 40 }}
              >
                <Badge badgeContent={3} color="primary" invisible={isSidebarOpen} sx={{ '& .MuiBadge-badge': { backgroundColor: '#2563eb' } }}>
                  <LuFilter size={20} />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Typography 
              variant="h6" 
              className={`font-nunito_sans font-extrabold text-gray-800 text-lg transition-opacity duration-200 whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
            >
              Filtros Avançados
            </Typography>
          </div>

          <div 
             className={`flex items-center transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
             onClick={toggleSidebar}
          >
            <ArrowBackIosIcon fontSize="small" className="text-gray-400 hover:text-blue-600 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. CORPO DOS FILTROS (Acordeões e Rodapé) - OPACIDADE CONDICIONAL */}
      {/* ============================================================== */}
      <div className={`flex flex-col flex-1 min-h-0 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        <div className="flex-1 overflow-y-auto pr-1 pl-3 custom-scrollbar">
          
          {/* FÍSICO-QUÍMICA */}
          <FilterSection title="Físico-Química" icon={<ScienceIcon fontSize="small" className="text-blue-500" />} badgeCount="42" defaultExpanded={true}>
            <div className="space-y-6 pt-2">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Typography className="font-inter text-xs font-semibold text-gray-700">Peso Molecular</Typography>
                  <SliderInputDisplay min={mw[0]} max={mw[1]} unit="Da" />
                </div>
                <Slider value={mw} onChange={(_, v) => setMw(v as number[])} min={0} max={1000} size="small" sx={{ color: '#3b82f6' }} />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Typography className="font-inter text-xs font-semibold text-gray-700">LogP (Lipofilia)</Typography>
                  <SliderInputDisplay min={logp[0]} max={logp[1]} />
                </div>
                <Slider value={logp} onChange={(_, v) => setLogp(v as number[])} min={-5} max={10} step={0.1} size="small" sx={{ color: '#3b82f6' }} />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Typography className="font-inter text-xs font-semibold text-gray-700">TPSA</Typography>
                  <SliderInputDisplay min={tpsa[0]} max={tpsa[1]} unit="Å²" />
                </div>
                <Slider value={tpsa} onChange={(_, v) => setTpsa(v as number[])} min={0} max={200} size="small" sx={{ color: '#3b82f6' }} />
              </div>

              <div className="pt-2">
                 <Typography className="font-inter text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Regras MedChem</Typography>
                 <FormControlLabel control={<Checkbox defaultChecked size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} label={<Typography className="font-inter text-xs text-gray-700 font-medium">Regra de Lipinski</Typography>} className="w-full m-0" />
                 <FormControlLabel control={<Checkbox size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} label={<Typography className="font-inter text-xs text-gray-700 font-medium">QED &gt; 0.5</Typography>} className="w-full m-0" />
              </div>
            </div>
          </FilterSection>

          {/* Outras seções... (MANTIDAS COMO ESTAVAM) */}
          <FilterSection title="Absorção" icon={<ShieldOutlinedIcon fontSize="small" className="text-teal-500" />} badgeCount="18" defaultExpanded={true}>
             <div className="space-y-4 pt-2">
                <div>
                   <Typography className="font-inter text-xs font-semibold text-gray-700 mb-2">Permeabilidade Caco-2</Typography>
                   <div className="flex w-full bg-gray-50 p-1 rounded-lg border border-gray-200">
                      {['Alta', 'Média', 'Baixa'].map((lvl) => {
                         const active = caco2.includes(lvl);
                         return (
                           <button key={lvl} onClick={() => toggleCaco2(lvl)} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${active ? 'bg-white text-gray-800 shadow-sm border border-gray-200/50' : 'text-gray-400 hover:text-gray-600'}`}>{lvl}</button>
                         )
                      })}
                   </div>
                </div>
                <div>
                   <Typography className="font-inter text-xs font-semibold text-gray-700 mb-1">Substrato P-gp</Typography>
                   <div className="flex gap-4">
                      <FormControlLabel control={<Checkbox size="small" />} label={<Typography className="font-inter text-xs text-gray-600">Sim</Typography>} />
                      <FormControlLabel control={<Checkbox defaultChecked size="small" />} label={<Typography className="font-inter text-xs text-gray-600">Não</Typography>} />
                   </div>
                </div>
             </div>
          </FilterSection>

          <FilterSection title="Distribuição" icon={<LocalShippingOutlinedIcon fontSize="small" className="text-gray-500" />}>
             <div className="flex flex-col gap-1 pt-1">
              <FormControlLabel control={<Checkbox size="small" />} label={<Typography className="font-inter text-xs text-gray-700">Permeável na Barreira (BBB+)</Typography>} />
              <FormControlLabel control={<Checkbox size="small" />} label={<Typography className="font-inter text-xs text-gray-700">Baixa Ligação a Proteínas</Typography>} />
            </div>
          </FilterSection>

          <FilterSection title="Metabolismo" icon={<SyncOutlinedIcon fontSize="small" className="text-gray-500" />}>
             <div className="flex flex-col gap-1 pt-1">
              <FormControlLabel control={<Checkbox size="small" />} label={<Typography className="font-inter text-xs text-gray-700">Não Inibidor CYP1A2</Typography>} />
              <FormControlLabel control={<Checkbox size="small" />} label={<Typography className="font-inter text-xs text-gray-700">Não Inibidor CYP3A4</Typography>} />
            </div>
          </FilterSection>

          <FilterSection title="Excreção" icon={<LogoutOutlinedIcon fontSize="small" className="text-gray-500" />}>
             <div className="flex flex-col gap-1 pt-1">
              <FormControlLabel control={<Checkbox size="small" />} label={<Typography className="font-inter text-xs text-gray-700">Alto Clearance</Typography>} />
            </div>
          </FilterSection>

          <FilterSection title="Toxicidade" icon={<WarningAmberIcon fontSize="small" className="text-red-500" />} badgeCount="5 Alertas" badgeType="error" defaultExpanded={true}>
            <div className="flex flex-col gap-1 pt-1">
              <FormControlLabel control={<Checkbox defaultChecked size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#ef4444' } }}/>} label={<Typography className="font-inter text-xs text-gray-800 font-medium">Ames Negativo</Typography>} />
              <FormControlLabel control={<Checkbox size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#ef4444' } }}/>} label={<Typography className="font-inter text-xs text-gray-800 font-medium">Baixo Risco hERG</Typography>} />
              <FormControlLabel control={<Checkbox size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#ef4444' } }}/>} label={<Typography className="font-inter text-xs text-gray-800 font-medium">Sem Alertas Hepatotóxicos</Typography>} />
            </div>
          </FilterSection>
        </div>

        {/* 3. BOTÃO DE AÇÃO (Bottom) */}
        <div className="mt-auto pt-4 pb-4 px-3 shrink-0">
          <Button 
            variant="contained" 
            fullWidth 
            startIcon={<RefreshIcon />}
            onClick={handleResetFilters}
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