// src/pages/Home/FeaturesSection.tsx
import React from 'react';
import { Typography } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import ScienceIcon from '@mui/icons-material/Science';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';

const features = [
  {
    title: 'Filtros Personalizáveis',
    description: 'Ajuste parâmetros como LogP, Peso Molecular e TPSA com precisão milimétrica.',
    icon: <TuneIcon className="text-blue-600" fontSize="medium" />,
  },
  {
    title: 'Visualização Molecular 2D/3D',
    description: 'Renderização interativa das estruturas químicas diretamente no navegador.',
    icon: <ScienceIcon className="text-blue-600" fontSize="medium" />,
  },
  {
    title: 'Análise de Toxicidade AI',
    description: 'Identifique riscos precocemente com alertas claros (Ames, hERG, Hepatotoxicidade).',
    icon: <SecurityIcon className="text-blue-600" fontSize="medium" />,
  },
  {
    title: 'Predição Instantânea',
    description: 'Backend otimizado em Django para entregar resultados em tempo real.',
    icon: <SpeedIcon className="text-blue-600" fontSize="medium" />,
  },
];

const FeaturesSection = () => {
  return (
    // Mantendo o fundo branco limpo, com overflow hidden para decorações
    <section className="w-full py-24 bg-white relative overflow-hidden">
      
      {/* Decoração de fundo sutil (Blur Azul) para manter a identidade da Hero */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Cabeçalho Padronizado */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Typography variant="h3" className="font-nunito_sans font-bold text-gray-900 mb-4">
            Recursos de <span className="text-blue-600">Bioinformática de Precisão</span>
          </Typography>
          <Typography className="font-inter text-gray-500 text-lg">
            Nossa ferramenta elimina a complexidade da análise manual com features projetadas para pesquisadores.
          </Typography>
        </div>

        {/* Grid de Cards usando o estilo da Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              // ESTILO PADRONIZADO: bg-white, rounded-xl, shadow-lg (suave), border-gray-100
              className="group bg-white p-6 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              
              <Typography variant="h6" className="font-nunito_sans font-bold text-gray-900 mb-2">
                {feature.title}
              </Typography>
              <Typography className="font-inter text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </Typography>
              
              {/* Elemento decorativo interno (opcional, similar às barras de progresso da Hero) */}
              <div className="mt-4 h-1 w-1/3 bg-blue-100 rounded-full group-hover:w-1/2 transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;