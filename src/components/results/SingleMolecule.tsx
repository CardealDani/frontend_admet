// src/components/results/SingleMolecule.tsx
import React from 'react';
import { Typography, Chip, Divider } from '@mui/material';

// Componentes Auxiliares (Apenas para a visualização individual)
const AdmetCard = ({ title, colorClass, children }: { title: string, colorClass: string, children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
    <div className={`px-4 py-2 border-b border-gray-100 font-nunito_sans font-bold text-sm ${colorClass}`}>
      {title}
    </div>
    <div className="p-4 flex flex-col gap-3 flex-1">
      {children}
    </div>
  </div>
);

const PropertyRow = ({ label, value, status }: { label: string, value: string, status?: 'good' | 'warning' | 'bad' }) => {
  let statusColor = "text-gray-900";
  if (status === 'good') statusColor = "text-green-600 font-bold";
  if (status === 'warning') statusColor = "text-yellow-600 font-bold";
  if (status === 'bad') statusColor = "text-red-600 font-bold";

  return (
    <div className="flex justify-between items-center border-b border-gray-50 pb-1 last:border-0 last:pb-0">
      <Typography className="font-inter text-xs text-gray-500">{label}</Typography>
      <Typography className={`font-mono text-sm ${statusColor}`}>{value}</Typography>
    </div>
  );
};

const SingleMolecule = () => {
  return (
    <div className="animate-fade-in-up">
      {/* Seção 1: Destaques Visuais (Imagem, Radar, Alertas Críticos) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Estrutura 2D */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 h-56 flex flex-col relative shadow-sm hover:shadow-md transition-shadow">
          <span className="absolute top-3 left-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estrutura 2D</span>
          <div className="flex-1 flex items-center justify-center mt-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Aspirin-skeletal.svg/1200px-Aspirin-skeletal.svg.png" alt="Molecula" className="h-32 object-contain opacity-90" />
          </div>
        </div>

        {/* ADMET Score / Radar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 h-56 flex flex-col relative shadow-sm">
          <span className="absolute top-3 left-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Drug-Likeness Score</span>
          <div className="flex-1 flex flex-col items-center justify-center">
            <Typography variant="h2" className="font-nunito_sans font-extrabold text-teal-500 leading-none">8.5</Typography>
            <Typography className="font-inter text-sm text-gray-500 font-medium mt-1">Alta viabilidade</Typography>
            <div className="mt-4 w-full px-8">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 w-[85%]"></div>
                </div>
            </div>
          </div>
        </div>

        {/* Alertas Rápidos (Semáforo) */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 h-56 flex flex-col shadow-sm justify-center gap-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Alertas Críticos</span>
          <div className="flex justify-between items-center p-2.5 bg-green-50 rounded-lg border border-green-100">
            <span className="font-inter text-sm font-medium text-green-900">Toxicidade (Ames)</span>
            <Chip label="Negativo" size="small" className="bg-white text-green-700 border border-green-200 font-bold h-6 text-xs" />
          </div>
          <div className="flex justify-between items-center p-2.5 bg-yellow-50 rounded-lg border border-yellow-100">
            <span className="font-inter text-sm font-medium text-yellow-900">Solubilidade Aquosa</span>
            <Chip label="Moderada" size="small" className="bg-white text-yellow-700 border border-yellow-200 font-bold h-6 text-xs" />
          </div>
          <div className="flex justify-between items-center p-2.5 bg-green-50 rounded-lg border border-green-100">
            <span className="font-inter text-sm font-medium text-green-900">Permeabilidade (BBB)</span>
            <Chip label="Alta" size="small" className="bg-white text-green-700 border border-green-200 font-bold h-6 text-xs" />
          </div>
        </div>
      </div>

      {/* Seção 2: Propriedades Detalhadas divididas por ADMET */}
      <Typography variant="h6" className="font-nunito_sans font-bold text-gray-800 mb-4 flex items-center gap-2">
        Análise Farmacocinética Detalhada
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <AdmetCard title="Físico-Química" colorClass="bg-gray-50 text-gray-700">
          <PropertyRow label="Peso Molecular" value="180.16 g/mol" status="good" />
          <PropertyRow label="LogP" value="1.19" status="good" />
          <PropertyRow label="TPSA" value="65.12 Å²" status="good" />
          <PropertyRow label="Doadores de H (HBD)" value="1" status="good" />
          <PropertyRow label="Aceptores de H (HBA)" value="4" status="good" />
        </AdmetCard>

        <AdmetCard title="A - Absorção" colorClass="bg-orange-50 text-orange-700">
          <PropertyRow label="Permeabilidade Caco-2" value="-4.8 cm/s" />
          <PropertyRow label="Absorção Intestinal (HIA)" value="98%" status="good" />
          <PropertyRow label="P-glicoproteína (P-gp)" value="Não Substrato" status="good" />
          <PropertyRow label="Biodisponibilidade (F20)" value="Alta" status="good" />
        </AdmetCard>

        <AdmetCard title="D - Distribuição" colorClass="bg-purple-50 text-purple-700">
          <PropertyRow label="Ligação a Proteínas (PPB)" value="49%" />
          <PropertyRow label="Volume de Dist. (VDss)" value="0.15 L/kg" />
          <PropertyRow label="Permeabilidade BBB" value="Alta" status="warning" />
          <PropertyRow label="Fração Livre (Fu)" value="0.51" />
        </AdmetCard>

        <AdmetCard title="M - Metabolismo" colorClass="bg-blue-50 text-blue-700">
          <PropertyRow label="Inibidor CYP1A2" value="Não" status="good" />
          <PropertyRow label="Inibidor CYP2C19" value="Não" status="good" />
          <PropertyRow label="Inibidor CYP2D6" value="Não" status="good" />
          <PropertyRow label="Substrato CYP3A4" value="Sim" status="warning" />
        </AdmetCard>

        <AdmetCard title="E/T - Excreção e Toxicidade" colorClass="bg-red-50 text-red-700">
          <PropertyRow label="Clearance Total" value="5.2 ml/min/kg" />
          <PropertyRow label="Meia-vida (T1/2)" value="3.1 h" />
          <Divider className="my-1" />
          <PropertyRow label="Mutagenicidade (Ames)" value="Negativo" status="good" />
          <PropertyRow label="Bloqueio hERG" value="Baixo Risco" status="good" />
          <PropertyRow label="Hepatotoxicidade" value="Alerta" status="warning" />
        </AdmetCard>
      </div>
    </div>
  );
};

export default SingleMolecule;