// src/pages/Home/FeaturesSection.tsx
import { Typography } from '@mui/material';

import UploadFileIcon from '@mui/icons-material/UploadFile';
import MemoryIcon from '@mui/icons-material/Memory';
import AssessmentIcon from '@mui/icons-material/Assessment';

const steps = [
  {
    id: 1,
    title: 'Entrada de Dados',
    description: 'Insira códigos SMILES individualmente ou faça upload de um lote de moléculas via arquivo .CSV ou .SDF.',
    icon: <UploadFileIcon fontSize="large" className="text-white" />,
  },
  {
    id: 2,
    title: 'Estruturação Rápida', 
    description: 'O sistema calcula as propriedades ADMET e organiza as informações para uma exploração visual eficiente.',
    icon: <MemoryIcon fontSize="large" className="text-white" />,
  },
  {
    id: 3,
    title: 'Visualização e Filtragem',
    description: 'Explore um dashboard interativo. Aplique filtros dinâmicos personalizados para isolar os melhores candidatos.',
    icon: <AssessmentIcon fontSize="large" className="text-white" />,
  },
];


const HowItWorksSection = () => {
  return (
    // Mantendo o fundo branco limpo, com overflow hidden para decorações
    <section className="w-full py-24 bg-white relative overflow-hidden">
      
      {/* Decoração de fundo sutil (Blur Azul) para manter a identidade da Hero */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none"></div>

           <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Cabeçalho Padronizado */}
        <div className="text-center max-w-3xl mx-auto mb-20">
           <Typography variant="h3" className="font-nunito_sans font-bold text-gray-900 mb-4">
            Fluxo de Trabalho <span className="text-blue-600">Simplificado</span>
          </Typography>
          <Typography className="font-inter text-gray-500 text-lg">
            Do input cru ao insight acionável em apenas três passos.
          </Typography>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* LINHA TRACEJADA RESPONSIVA (Fluxo de Trabalho) */}
          <svg 
            className="hidden md:block absolute top-6 left-0 w-full h-16 text-blue-200 pointer-events-none -z-10" 
            preserveAspectRatio="none" 
            viewBox="0 0 1000 40"
          >
            <path 
              d="M 166,20 Q 333,50 500,20 T 863,20" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeDasharray="8 8" 
              vectorEffect="non-scaling-stroke" 
            />
          </svg>

          {steps.map((step) => (
            <div key={step.id} className="relative flex flex-col items-center text-center z-10 group">
              
              {/* Círculo do Ícone com sombra e cor da marca */}
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>

              {/* Conteúdo em um card sutil para padronizar */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-lg max-w-sm hover:-translate-y-1 transition-all">
                 <div className="text-blue-600 font-bold mb-2 font-nunito_sans">PASSO 0{step.id}</div>
                 <Typography variant="h5" className="font-nunito_sans font-bold text-gray-900 mb-3">
                    {step.title}
                 </Typography>
                 <Typography className="font-inter text-gray-500">
                    {step.description}
                 </Typography>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;