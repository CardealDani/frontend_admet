// src/components/results/MoleculePreview.tsx
import { Typography, IconButton, Button, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LaunchIcon from '@mui/icons-material/Launch';
import CheckIcon from '@mui/icons-material/Check';

import type { Molecule, ToxValue } from '../../types/molecules.types';
import { useState } from 'react';

type RiskLevel = 'good' | 'medium' | 'bad';

const toxRisk = (v: ToxValue): RiskLevel =>
  v.category === 'Excelente' ? 'good' : v.category === 'Médio' ? 'medium' : 'bad';

const riskStyles: Record<RiskLevel, string> = {
  good:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  bad:    'bg-rose-50 text-rose-700 border-rose-200',
};

const RiskIcon = ({ level }: { level: RiskLevel }) => {
  if (level === 'good')   return <CheckCircleIcon fontSize="small" className="text-emerald-500 shrink-0" />;
  if (level === 'medium') return <WarningRoundedIcon fontSize="small" className="text-amber-500 shrink-0" />;
  return <CancelIcon fontSize="small" className="text-rose-500 shrink-0" />;
};

const RiskIndicator = ({
  label, value, tooltip, level,
}: {
  label: string; value: ToxValue; tooltip: string; level: RiskLevel;
}) => (
  <div className={`p-2.5 rounded-xl border flex items-center justify-between shadow-sm transition-transform hover:scale-[1.01] ${riskStyles[level]}`}>
    
    {/* Lado Esquerdo: Label e Tooltip */}
    <div className="flex items-center gap-2">
      <Typography className="font-inter font-bold text-[12px]">{label}</Typography>
      <Tooltip title={tooltip} placement="top">
        <InfoOutlinedIcon sx={{ fontSize: 14 }} className="opacity-50 cursor-help hover:opacity-100 transition-opacity" />
      </Tooltip>
    </div>

    {/* Lado Direito: Badge Split Premium (Categoria + Score Numérico) */}
    <div className={`flex items-center overflow-hidden rounded-lg border shadow-sm bg-white/50 ${
      level === 'good' ? 'border-emerald-200' : level === 'medium' ? 'border-amber-200' : 'border-rose-200'
    }`}>
      
      {/* Parte 1: Ícone + Categoria */}
      <div className={`flex items-center gap-1 px-2 py-1 ${
        level === 'good' ? 'bg-emerald-100/40' : level === 'medium' ? 'bg-amber-100/40' : 'bg-rose-100/40'
      }`}>
        <RiskIcon level={level} />
        <span className="font-inter text-[9px] font-extrabold uppercase tracking-wider mt-[1px]">
          {value.category}
        </span>
      </div>

      {/* Parte 2: Valor Numérico (Score Bruto) */}
      <Tooltip title="Score / Probabilidade da Predição" placement="top">
        <div className={`px-2 py-1 bg-white border-l font-mono text-[10px] font-bold cursor-help transition-colors ${
          level === 'good' ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50' 
          : level === 'medium' ? 'border-amber-200 text-amber-700 hover:bg-amber-50' 
          : 'border-rose-200 text-rose-700 hover:bg-rose-50'
        }`}>
          {value.raw.toFixed(2)}
        </div>
      </Tooltip>

    </div>
  </div>
);

// ─── Radar ────────────────────────────────────────────────────────────────────

const toRad = (deg: number) => (deg * Math.PI) / 180;
const AXES = [
  { label: 'Absorção',    angle: -90  },
  { label: 'Distribuição', angle: -18  },
  { label: 'Metabolismo', angle:  54  },
  { label: 'Excreção',    angle: 126  },
  { label: 'Toxicidade',  angle: 198  },
];
const CX = 140, CY = 110, R = 74;
const axisPoint = (angle: number, r: number) => ({
  x: CX + r * Math.cos(toRad(angle)),
  y: CY + r * Math.sin(toRad(angle)),
});

const scoreMolecule = (mol: Molecule): number[] => {
  const abs = Math.min(1,
    (mol.absorptionPercent / 100) * 0.7 +
    (mol.caco2.category === 'Excelente' ? 0.3 : 0)
  );
  const ppbScore = 1 - Math.abs(mol.ppb - 50) / 50;
  const dist = Math.min(1,
    ppbScore * 0.5 +
    (mol.bbb.category === 'Excelente' ? 0.5 : mol.bbb.category === 'Médio' ? 0.3 : 0.1)
  );
  const cypCount = [mol.cyp1a2Substrate, mol.cyp2d6Substrate, mol.cyp3a4Substrate]
    .filter(v => v.category === 'Sim').length;
  const met = Math.max(0, 1 - cypCount / 3);
  const halfScore = mol.tHalf >= 2 && mol.tHalf <= 24 ? 1
    : mol.tHalf < 2 ? mol.tHalf / 2
    : Math.max(0, 1 - (mol.tHalf - 24) / 48);
  const exc = Math.min(1, halfScore * 0.6 + (mol.clPlasma < 30 ? 0.4 : mol.clPlasma < 80 ? 0.2 : 0));
  const tox = Math.min(1, (
    (mol.ames.category   === 'Excelente' ? 1 : mol.ames.category   === 'Médio' ? 0.5 : 0) +
    (mol.hepato.category === 'Excelente' ? 1 : mol.hepato.category === 'Médio' ? 0.5 : 0) +
    (mol.herg.category   === 'Excelente' ? 1 : mol.herg.category   === 'Médio' ? 0.5 : 0)
  ) / 3);
  return [abs, dist, met, exc, tox];
};

const AdmetRadar = ({ mol }: { mol: Molecule }) => {
  const scores    = scoreMolecule(mol);
  const molPoints = AXES.map((ax, i) => axisPoint(ax.angle, scores[i] * R));
  const molPath   = molPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';
  return (
    <svg width="100%" height="220" viewBox="0 0 280 220" className="mx-auto drop-shadow-sm">
      {[1, 0.66, 0.33].map(level => {
        const pts = AXES.map(ax => axisPoint(ax.angle, level * R));
        const d   = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';
        return <path key={level} d={d} fill={level === 1 ? '#f8fafc' : 'none'} stroke="#e2e8f0" strokeWidth="1" />;
      })}
      {AXES.map(ax => {
        const tip = axisPoint(ax.angle, R);
        return <line key={ax.label} x1={CX} y1={CY} x2={tip.x.toFixed(1)} y2={tip.y.toFixed(1)} stroke="#e2e8f0" strokeWidth="1" />;
      })}
      <path d={molPath} fill="rgba(37,99,235,0.15)" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" className="transition-all duration-700" />
      {molPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#2563eb" stroke="#fff" strokeWidth="1" />)}
      {AXES.map(ax => {
        const tip = axisPoint(ax.angle, R + 24);
        return (
          <text key={ax.label} x={tip.x.toFixed(1)} y={tip.y.toFixed(1)} fontSize="10" fill="#64748b"
            textAnchor="middle" dominantBaseline="central" fontWeight="700" fontFamily="Inter, sans-serif">
            {ax.label}
          </text>
        );
      })}
    </svg>
  );
};

// ─── Componente principal ────────────────────────────────────────────────────

interface MoleculePreviewProps {
  molecule: Molecule;
  onClose: () => void;
  onViewFullReport: (mol: Molecule) => void;
}

const MoleculePreview = ({ molecule: mol, onClose, onViewFullReport }: MoleculePreviewProps) => {
const [copied, setCopied] = useState(false);

const handleCopySmiles = (moleculeSmiles: string) => {
    navigator.clipboard.writeText(moleculeSmiles);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

return (
  <div className="w-full h-full bg-white flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] relative z-10">

    {/* HEADER */}
    <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/80 shrink-0">
      <div className="flex-1 min-w-0">
        <Typography variant="h6" className="font-nunito_sans font-extrabold text-slate-800 leading-tight truncate">
          {mol.name}
        </Typography>
        <div className="flex items-center gap-2 mt-1.5">
          <Typography className="font-mono text-[11px] text-slate-500 truncate max-w-[220px] bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">
            {mol.smiles}
          </Typography>
          <Tooltip title="Copiar SMILES">
            <IconButton size="small" onClick={() => handleCopySmiles(mol.smiles)} className="p-1 hover:bg-blue-50 transition-colors">
{copied ? (
                  <CheckIcon sx={{ fontSize: 13 }} className="text-emerald-500 scale-110 transition-transform" />
                ) : (
                  <ContentCopyIcon sx={{ fontSize: 13 }} className="text-slate-400 hover:text-blue-600 transition-colors" />
                )}            </IconButton>
          </Tooltip>
        </div>
      </div>
      <IconButton onClick={onClose} size="small" className="ml-3 bg-white border border-slate-200 shadow-sm hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all shrink-0">
        <CloseIcon fontSize="small" />
      </IconButton>
    </div>

    {/* BODY */}
    <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">

      {/* ESTRUTURA 2D */}
      <div className="p-5">

     <div className="relative w-full aspect-square bg-white border border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden p-2">
  <img 
    src={mol.imgUrl} 
    alt={mol.name} 
    className="
    w-full h-full object-contain 
    mix-blend-multiply contrast-[1.05] brightness-[1.04]
    opacity-90 transition-transform duration-300
    scale-[1.08] hover:scale-[1.12]
    " 
    />
    </div>
</div>

      {/* CARDS FÍSICO-QUÍMICOS */}
      <div className="flex gap-3 px-5 mb-5">
        {[
          { label: 'MW',   val: mol.mw.toFixed(1),   unit: 'Da' },
          { label: 'LogP', val: mol.logp.toFixed(2),  unit: ''   },
          { label: 'TPSA', val: mol.tpsa.toFixed(1),  unit: 'Å²' },
        ].map(stat => (
          <div key={stat.label} className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-3 flex flex-col items-center justify-center shadow-sm transition-transform hover:scale-[1.03]">
            <p className="font-inter text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
            <p className="font-mono text-sm font-black text-slate-700">
              {stat.val}{stat.unit && <span className="text-[10px] font-bold text-slate-400 ml-0.5">{stat.unit}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* DRUG-LIKENESS */}
      <div className="mx-5 mb-5 flex flex-col gap-3 bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm transition-transform hover:scale-[1.01]">
        <div className="flex items-center gap-1.5 px-0.5">
          <span className="font-inter text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Drug-likeness</span>
          <Tooltip title="Regras empíricas de viabilidade oral (Lipinski Rule of 5 e Pfizer 3/75)">
            <InfoOutlinedIcon sx={{ fontSize: 14 }} className="text-slate-300 cursor-help hover:text-blue-500 transition-colors" />
          </Tooltip>
        </div>
        <div className="flex gap-2.5 w-full">
          {[{ label: 'Lipinski', val: mol.lipinski }, { label: 'Pfizer', val: mol.pfizer }].map(r => (
            <div key={r.label} className={`flex flex-1 items-center overflow-hidden rounded-lg border shadow-sm ${r.val === 'Pass' ? 'border-emerald-200' : 'border-rose-200'}`}>
              <span className={`flex-1 text-center font-inter text-[9px] font-bold py-1.5 uppercase tracking-wider ${r.val === 'Pass' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{r.label}</span>
              <span className={`px-2.5 py-1.5 bg-white border-l font-mono text-[10px] font-bold ${r.val === 'Pass' ? 'text-emerald-700 border-emerald-100' : 'text-rose-700 border-rose-100'}`}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RADAR ADMET */}
      <div className="mx-5 mb-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 shadow-sm transition-transform hover:scale-[1.01]">
        <div className="flex justify-between items-center mb-1">
          <p className="font-inter text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Perfil ADMET</p>
          <Tooltip title="Impressão digital normalizada. Quanto maior a área, melhor o perfil geral.">
            <InfoOutlinedIcon sx={{ fontSize: 15 }} className="text-slate-300 cursor-help" />
          </Tooltip>
        </div>
        <AdmetRadar mol={mol} />
      </div>

      {/* ALERTAS DE TOXICIDADE */}
      <div className="px-5 mb-2">
        <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2.5">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
          <p className="font-inter text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Alertas de Toxicidade</p>
        </div>
        <div className="space-y-2.5">
          <RiskIndicator label="Mutagenicidade (AMES)" value={mol.ames}   tooltip="Avalia o potencial mutagênico. 'Excelente' indica um resultado Negativo (sem risco de dano ao DNA)." level={toxRisk(mol.ames)} />
          <RiskIndicator label="Cardiotóxico (hERG)"   value={mol.herg}   tooltip="Inibição do canal hERG. 'Excelente' indica baixo risco de arritmias cardíacas."           level={toxRisk(mol.herg)} />
          <RiskIndicator label="Hepatotoxicidade"      value={mol.hepato} tooltip="Risco de lesão hepática (DILI). 'Excelente' indica baixa probabilidade de toxicidade no fígado."                            level={toxRisk(mol.hepato)} />
        </div>
      </div>
    </div>

    {/* FOOTER */}
    <div className="p-5 border-t border-slate-200 bg-slate-50/50 shrink-0">
      <Button variant="contained" fullWidth onClick={() => onViewFullReport(mol)}
        startIcon={<LaunchIcon fontSize="small" />}
        className="bg-blue-600 text-white font-nunito_sans font-extrabold normal-case hover:bg-blue-700 hover:shadow-md transition-all py-3 rounded-xl text-sm"
        sx={{ boxShadow: 'none' }}
      >
        Abrir Relatório Completo
      </Button>
    </div>
  </div>
);
}

export default MoleculePreview;