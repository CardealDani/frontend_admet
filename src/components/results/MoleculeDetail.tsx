// src/components/results/MoleculeDetail.tsx
// Relatório expandido de uma molécula. Recebe Molecule via props — zero hardcode.
// Usado quando o usuário clica em "Ver Relatório Completo" no MoleculePreview.

import { Typography, Divider, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ScienceIcon from '@mui/icons-material/Science';

import type { Molecule, CategoricalBinary,CategoricalYesNo, CategoricalTernary } from '../../types/molecules.types';

// ─── Helpers visuais ────────────────────────────────────────────────────────

const PropertyCard = ({
  title,
  value,
  unit,
  optimal,
}: {
  title: string;
  value: string | number;
  unit?: string;
  optimal: boolean;
}) => (
  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-2">
      <Typography className="font-inter text-[10px] text-gray-400 font-bold uppercase tracking-wide">
        {title}
      </Typography>
      {optimal
        ? <CheckCircleOutlineIcon sx={{ fontSize: 14 }} className="text-green-500" />
        : <WarningAmberIcon sx={{ fontSize: 14 }} className="text-amber-500" />}
    </div>
    <div className="flex items-baseline gap-1">
      <Typography className={`font-nunito_sans font-extrabold text-2xl leading-none ${optimal ? 'text-gray-900' : 'text-red-600'}`}>
        {value}
      </Typography>
      {unit && <Typography className="font-inter text-xs text-gray-400">{unit}</Typography>}
    </div>
  </div>
);

// Converte tox categórico para ícone + cor
const ToxRow = ({ label, value }: { label: string; value: CategoricalTernary }) => {
  const isGood   = value === 'Excelente';
  const isMedium = value === 'Médio';

  const borderColor = isGood ? 'border-green-200 bg-green-50/60' : isMedium ? 'border-yellow-200 bg-yellow-50/60' : 'border-red-200 bg-red-50/60';
  const Icon = isGood ? CheckCircleOutlineIcon : isMedium ? WarningAmberIcon : CancelOutlinedIcon;
  const iconColor = isGood ? 'text-green-600' : isMedium ? 'text-yellow-600' : 'text-red-600';
  const desc = isGood ? 'Nenhum risco detectado pelo modelo.' : isMedium ? 'Risco moderado — monitoramento recomendado.' : 'Risco elevado — cautela necessária.';

  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border ${borderColor}`}>
      <div className={`p-1.5 rounded-full ${isGood ? 'bg-green-100' : isMedium ? 'bg-yellow-100' : 'bg-red-100'}`}>
        <Icon sx={{ fontSize: 18 }} className={iconColor} />
      </div>
      <div>
        <Typography className="font-nunito_sans font-bold text-gray-900 text-sm">
          {label}: <span className="font-mono">{value}</span>
        </Typography>
        <Typography className="font-inter text-xs text-gray-500 mt-0.5">{desc}</Typography>
      </div>
    </div>
  );
};

const CypRow = ({ label, value }: { label: string; value: CategoricalYesNo }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
    <Typography className="font-inter text-xs text-gray-500">{label}</Typography>
    <span className={`px-2 py-0.5 text-[10px] font-bold rounded font-inter ${
      value === 'Não' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    }`}>
      {value}
    </span>
  </div>
);

const AbsRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
    <Typography className="font-inter text-xs text-gray-500">{label}</Typography>
    <Typography className="font-mono text-xs text-gray-800 font-medium">{value}</Typography>
  </div>
);

// ─── Componente principal ────────────────────────────────────────────────────

interface MoleculeDetailProps {
  molecule: Molecule;
}

const MoleculeDetail = ({ molecule: mol }: MoleculeDetailProps) => {
  const formula = `MW ${mol.mw.toFixed(1)} · TPSA ${mol.tpsa.toFixed(1)} Å²`;

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 animate-fade-in-up">

      {/* COLUNA ESQUERDA: Visualizações */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">

        {/* Estrutura 2D */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[240px] relative overflow-hidden group">
          <Typography className="absolute top-4 left-4 font-inter text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            Estrutura 2D
          </Typography>
          {mol.imgUrl ? (
            <img
              src={mol.imgUrl}
              alt={mol.name}
              className="max-w-full max-h-[180px] object-contain mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-gray-200">
              <ScienceIcon sx={{ fontSize: 80 }} />
            </div>
          )}
        </div>

        {/* QED Score */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[160px] relative">
          <Typography className="absolute top-4 left-4 font-inter text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            QED Score
          </Typography>
          <Typography className={`font-nunito_sans font-extrabold text-5xl leading-none mb-2 ${
            mol.qed >= 0.7 ? 'text-teal-500' : mol.qed >= 0.4 ? 'text-amber-500' : 'text-red-500'
          }`}>
            {mol.qed.toFixed(2)}
          </Typography>
          <Typography className="font-inter text-sm text-gray-400">
            {mol.qed >= 0.7 ? 'Alta viabilidade' : mol.qed >= 0.4 ? 'Viabilidade moderada' : 'Baixa viabilidade'}
          </Typography>
          <div className="mt-4 w-full px-4">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  mol.qed >= 0.7 ? 'bg-teal-400' : mol.qed >= 0.4 ? 'bg-amber-400' : 'bg-red-400'
                }`}
                style={{ width: `${mol.qed * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Absorção + Distribuição condensados */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <Typography className="font-inter text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">
            Absorção
          </Typography>
          <AbsRow label="HIA (%)" value={`${mol.absorptionPercent}%`} />
          <AbsRow label="Caco-2" value={mol.caco2} />
          <AbsRow label="Inibidor P-gp" value={mol.pgpInhibitor} />
          <Divider className="my-3" />
          <Typography className="font-inter text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">
            Distribuição
          </Typography>
          <AbsRow label="BBB" value={mol.bbb} />
          <AbsRow label="PPB (%)" value={`${mol.ppb}%`} />
          <AbsRow label="Fu (%)" value={`${mol.fu}%`} />
          <Divider className="my-3" />
          <Typography className="font-inter text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">
            Excreção
          </Typography>
          <AbsRow label="CL Plasmático" value={`${mol.clPlasma} mL/min/kg`} />
          <AbsRow label="T½" value={`${mol.tHalf} h`} />
        </div>

      </div>

      {/* COLUNA DIREITA: Dados e Alertas */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">

        {/* Cabeçalho */}
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <Typography variant="h4" className="font-nunito_sans font-extrabold text-gray-900 leading-tight">
              {mol.name}
            </Typography>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-lg font-inter border border-blue-100">
              {formula}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 w-fit">
            <Typography className="font-mono text-xs text-gray-700 max-w-[300px] truncate">
              {mol.smiles}
            </Typography>
            <Tooltip title="Copiar SMILES">
              <IconButton size="small" onClick={() => navigator.clipboard.writeText(mol.smiles)}>
                <ContentCopyIcon sx={{ fontSize: 14 }} className="text-gray-400 hover:text-blue-600" />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <Divider />

        {/* Propriedades Físico-Químicas */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Typography variant="h6" className="font-nunito_sans font-bold text-gray-800">
              Propriedades Físico-Químicas
            </Typography>
            <Tooltip title="Baseado na Regra dos 5 de Lipinski para biodisponibilidade oral.">
              <InfoOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-300 cursor-help" />
            </Tooltip>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <PropertyCard title="Peso Molecular" value={mol.mw.toFixed(1)} unit="g/mol" optimal={mol.mw <= 500} />
            <PropertyCard title="LogP"           value={mol.logp.toFixed(2)}             optimal={mol.logp <= 5 && mol.logp >= -2} />
            <PropertyCard title="TPSA"           value={mol.tpsa.toFixed(1)} unit="Å²"   optimal={mol.tpsa <= 140} />
            <PropertyCard title="QED Score"      value={mol.qed.toFixed(2)}              optimal={mol.qed >= 0.5} />
          </div>
        </div>

        {/* Metabolismo CYP */}
        <div>
          <Typography variant="h6" className="font-nunito_sans font-bold text-gray-800 mb-3">
            Perfil Metabólico CYP450
          </Typography>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <CypRow label="Substrato CYP1A2" value={mol.cyp1a2Substrate} />
            <CypRow label="Substrato CYP2D6" value={mol.cyp2d6Substrate} />
            <CypRow label="Substrato CYP3A4" value={mol.cyp3a4Substrate} />
          </div>
        </div>

        <Divider />

        {/* Toxicidade */}
        <div>
          <Typography variant="h6" className="font-nunito_sans font-bold text-gray-800 mb-3">
            Perfil de Segurança e Toxicidade
          </Typography>
          <div className="flex flex-col gap-2">
            <ToxRow label="Mutagenicidade (AMES)" value={mol.ames} />
            <ToxRow label="Cardiotoxicidade (hERG)" value={mol.herg} />
            <ToxRow label="Hepatotoxicidade" value={mol.hepato} />
          </div>
        </div>

        {/* Druglikeness pills */}
        <div className="flex gap-2 flex-wrap">
          <span className={`px-4 py-1.5 text-sm font-bold rounded-xl border font-nunito_sans ${
            mol.lipinski === 'Pass' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            Lipinski: {mol.lipinski}
          </span>
          <span className={`px-4 py-1.5 text-sm font-bold rounded-xl border font-nunito_sans ${
            mol.pfizer === 'Pass' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            Pfizer 3/75: {mol.pfizer}
          </span>
        </div>

      </div>
    </div>
  );
};

export default MoleculeDetail;