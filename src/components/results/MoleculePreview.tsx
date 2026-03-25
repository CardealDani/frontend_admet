// src/components/results/MoleculePreview.tsx

import { Typography, IconButton, Button, Divider, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LaunchIcon from '@mui/icons-material/Launch';

// Componente Auxiliar para os Indicadores de Risco (Semáforo visual)
const RiskIndicator = ({ label, value, tooltip, type }: { label: string, value: string, tooltip: string, type: 'good' | 'medium' | 'bad' }) => {
   let colorClass = "bg-gray-100 text-gray-700"; // Default
   if (type === 'good') colorClass = "bg-green-50 text-green-700 border border-green-200";
   if (type === 'medium') colorClass = "bg-yellow-50 text-yellow-800 border border-yellow-200";
   if (type === 'bad') colorClass = "bg-red-50 text-red-700 border border-red-200";

   return (
      <div className={`p-4 rounded-xl border flex items-center justify-between shadow-inner ${colorClass}`}>
         <div className="flex items-center gap-2">
            <Typography className="font-nunito_sans font-extrabold text-[15px]">
               {label}
            </Typography>
            <Tooltip title={tooltip} placement="top">
               <InfoOutlinedIcon sx={{ fontSize: 16 }} className="opacity-60 cursor-help" />
            </Tooltip>
         </div>

         <div className="flex items-center gap-2">
            {type === 'good' && <CheckCircleIcon fontSize="small" className="text-green-600" />}
            {type === 'bad' && <WarningAmberIcon fontSize="small" className="text-red-500" />}

            <Typography className="font-mono text-sm font-bold uppercase tracking-wider">
               {value}
            </Typography>
         </div>
      </div>
   );
};

const MoleculePreview = ({ molecule, onClose, onViewFullReport }: { molecule: any, onClose: () => void, onViewFullReport: (mol: any) => void }) => {
   if (!molecule) return null;

   return (
      // Largura maior (w-96 ou até 420px) para respirar bem
      <div className="w-[420px] h-full bg-white border-l border-gray-200 flex flex-col shadow-2xl z-20 shrink-0 animate-slide-in-right ">

         {/* 1. HEADER DO PREVIEW (Nome e SMILES) */}
         <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-slate-50/50 shrink-0">
            <div className="flex-1 min-w-0">
               <Typography variant="h5" className="font-nunito_sans font-extrabold text-gray-900 leading-tight truncate" title={molecule.name}>
                  {molecule.name}
               </Typography>
               <div className="flex items-center gap-2 mt-1.5">
                  <Typography className="font-mono text-xs text-gray-500 truncate" title={molecule.smiles}>
                     {molecule.smiles}
                  </Typography>
                  <Tooltip title="Copiar SMILES">
                     <IconButton size="small" onClick={() => navigator.clipboard.writeText(molecule.smiles)} className="p-0.5">
                        <ContentCopyIcon sx={{ fontSize: 14 }} className="text-gray-400 hover:text-blue-600" />
                     </IconButton>
                  </Tooltip>
               </div>
            </div>
            <IconButton onClick={onClose} size="small" className="ml-4 bg-gray-100 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0">
               <CloseIcon fontSize="small" />
            </IconButton>
         </div>

         {/* CORPO SCROLLÁVEL DO PREVIEW */}
         <div className="flex-1 overflow-y-auto p-6 pb-12 custom-scrollbar space-y-8">

            {/* 2. IMAGEM DA ESTRUTURA (Prominente) */}
            <div className="w-full h-56 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center p-3 mb-8 shadow-inner overflow-hidden">
               <img src={molecule.imgUrl} alt={molecule.name} className="max-w-full max-h-full object-contain mix-blend-multiply opacity-95 group-hover:scale-110 transition-transform duration-500" />
            </div>

            {/* 3. RESUMO FÍSICO-QUÍMICO (badges grandes igual sua imagem) */}
            <div className="flex gap-4">
               <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <Typography className="font-inter text-xs text-gray-500 mb-1">Peso Molecular</Typography>
                  <Typography className="font-mono text-lg font-bold text-gray-900 leading-none">
                     {molecule.mw} <span className="text-xs font-normal text-gray-400">Da</span>
                  </Typography>
               </div>
               <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <Typography className="font-inter text-xs text-gray-500 mb-1">LogP (Lipofilicidade)</Typography>
                  <Typography className="font-mono text-lg font-bold text-gray-900 leading-none">
                     {molecule.logp.toFixed(2)}
                  </Typography>
               </div>
            </div>

            <Divider />

            {/* 4. PERFIL ADMET (Gráfico de Radar) */}
            <div className="mb-6 flex flex-col items-center bg-gray-50/50 p-5 rounded-xl border border-gray-100">
               <div className="w-full flex justify-between items-center mb-5">
                  <Typography className="font-inter text-[12px] font-bold text-gray-500 uppercase tracking-wider">Perfil Multi-Domínio ADMET</Typography>
                  <Tooltip title="Gráfico mostra o equilíbrio das propriedades. Forma mais 'cheia' é melhor.">
                     <InfoOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-400 cursor-help" />
                  </Tooltip>
               </div>

               <svg width="220" height="200" viewBox="0 0 220 200" className="mx-auto">
                  {/* Fundo e Teias (Simuladas - Estático) */}
                  <polygon points="110,10 206,80 169,190 51,190 14,80" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                  <polygon points="110,32 187,88 157,176 63,176 33,88" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                  <polygon points="110,55 167,96 145,162 75,162 53,96" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                  {/* Eixos */}
                  <line x1="110" y1="100" x2="110" y2="10" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="110" y1="100" x2="206" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="110" y1="100" x2="169" y2="190" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="110" y1="100" x2="51" y2="190" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="110" y1="100" x2="14" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                  {/* Forma da Molécula (Simulação Estática - No real você calcularia os pontos) */}
                  <polygon points="110,30 160,85 155,170 80,180 25,100" fill="rgba(37, 99, 235, 0.25)" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" />

                  {/* Labels das Pontas */}
                  <text x="110" y="5" fontSize="11" fill="#475569" textAnchor="middle" fontWeight="bold">Absorção</text>
                  <text x="212" y="83" fontSize="11" fill="#475569" textAnchor="start" fontWeight="bold">Dist.</text>
                  <text x="175" y="200" fontSize="11" fill="#475569" textAnchor="middle" fontWeight="bold">Metab.</text>
                  <text x="45" y="200" fontSize="11" fill="#475569" textAnchor="middle" fontWeight="bold">Excreção</text>
                  <text x="5" y="83" fontSize="11" fill="#475569" textAnchor="end" fontWeight="bold">Toxicidade</text>
               </svg>
            </div>

            <Divider />

            {/* 5. INDICADORES DE RISCO (Ames, hERG, Hepato - Semáforo) */}
            <div className="space-y-4 pt-1">
               <Typography className="font-inter text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-3">Indicadores de Risco Crítico</Typography>

               <RiskIndicator
                  label="Mutagenicidade AMES"
                  value={molecule.ames}
                  tooltip="Predição de mutagenicidade do composto (Ames Test)"
                  type={molecule.ames === 'Negativo' ? 'good' : 'bad'}
               />

               <RiskIndicator
                  label="Cardiotoxicidade hERG"
                  value={molecule.herg}
                  tooltip="Risco de bloqueio de canais hERG e prolongamento do intervalo QT"
                  type={molecule.herg === 'Baixo' ? 'good' : molecule.herg === 'Médio' ? 'medium' : 'bad'}
               />

               <RiskIndicator
                  label="Hepatotoxicidade Humana"
                  value={molecule.hepato}
                  tooltip="Risco de dano hepático induzido pelo composto"
                  type={molecule.hepato === 'Seguro' ? 'good' : molecule.hepato === 'Atenção' ? 'medium' : 'bad'}
               />
            </div>

         </div>

         {/* RODAPÉ DO PREVIEW COM AÇÃO PRINCIPAL */}
         <div className="p-5 border-t border-gray-200 bg-white shrink-0 shadow-lg mt-auto">
            <Button
               variant="contained"
               fullWidth
               size="large"
               onClick={() => onViewFullReport(molecule)}
               startIcon={<LaunchIcon />}
               className="bg-blue-600 text-white font-nunito_sans font-extrabold normal-case shadow-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all py-3 rounded-full text-sm"
            >
               Ver Relatório ADMET Completo
            </Button>
         </div>

      </div>
   );
};

export default MoleculePreview;