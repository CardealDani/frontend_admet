// src/pages/Home/HowItWorksSection.tsx
import React from 'react';
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
    // Fundo levemente diferente (blue-50 bem suave) para diferenciar seções, 
    // mas mantendo a paleta
    <section className="w-full py-24 bg-blue-50/30 relative overflow-hidden">
      
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
          {/* Linha conectora (estilo HeroSection) visível apenas em telas grandes */}
          <svg className="hidden md:block absolute top-12 left-0 w-full h-20 text-blue-200 pointer-events-none" style={{ zIndex: 0 }}>
             <path d="M100,20 Q300,80 500,20 T900,20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
          </svg>

          {steps.map((step, index) => (
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