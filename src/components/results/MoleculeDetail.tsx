// src/components/results/MoleculeDetail.tsx
import { useState } from 'react';
import { Tooltip, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ScienceIcon from '@mui/icons-material/Science';

import type { Molecule, ToxValue, TernaryValue, BinaryValue, YesNoValue } from '../../types/molecules.types';

type RiskLevel = 'good' | 'medium' | 'bad';

const DOMAIN_COLORS = ['#f97316', '#8b5cf6', '#3b82f6', '#14b8a6', '#f43f5e'];
const DOMAIN_NAMES  = ['Absorção', 'Distribuição', 'Metabolismo', 'Excreção', 'Toxicidade'];

// ─── Helpers de risco ────────────────────────────────────────────────────────

const toxRisk  = (v: ToxValue):     RiskLevel => v.category === 'Excelente'    ? 'good' : v.category === 'Médio' ? 'medium' : 'bad';
const ternRisk = (v: TernaryValue): RiskLevel => v.category === 'Excelente' ? 'good' : v.category === 'Médio'   ? 'medium' : 'bad';
// BBB invertido: Ruim (não penetra) = bom para alvo periférico
const bbbRisk  = (v: TernaryValue): RiskLevel => v.category === 'Ruim'      ? 'good' : v.category === 'Médio'   ? 'medium' : 'bad';
const binRisk  = (v: BinaryValue):  RiskLevel => v.category === 'Excelente' ? 'good' : 'bad';
const cypRisk  = (v: YesNoValue):   RiskLevel => v.category === 'Não'       ? 'good' : 'medium';

const BADGE_CLS: Record<RiskLevel, string> = {
  good:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  bad:    'bg-rose-50 text-rose-700 border-rose-200',
};
const ROW_BG: Record<RiskLevel, string> = {
  good:   'bg-emerald-50/50 border-emerald-100',
  medium: 'bg-amber-50/50 border-amber-100',
  bad:    'bg-rose-50/50 border-rose-100',
};
const ICON_BG: Record<RiskLevel, string> = {
  good:   'bg-emerald-100 text-emerald-600',
  medium: 'bg-amber-100 text-amber-600',
  bad:    'bg-rose-100 text-rose-600',
};

// ─── Score por domínio (usa .category) ───────────────────────────────────────

const scoreDomains = (mol: Molecule): number[] => {
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

// ─── Sub-componentes ─────────────────────────────────────────────────────────
const Badge = ({ text, level }: { text: string; level: RiskLevel }) => (
  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-inter shadow-sm ${BADGE_CLS[level]}`}>
    {text}
  </span>
);

// NOVO: Componente Premium para mostrar Categoria + Valor Bruto juntos
const SplitBadge = ({ text, subText, level }: { text: string; subText: string; level: RiskLevel }) => (
  <div className={`flex items-center overflow-hidden rounded-md border shadow-sm bg-white/50 ${
    level === 'good' ? 'border-emerald-200' : level === 'medium' ? 'border-amber-200' : 'border-rose-200'
  }`}>
    <span className={`font-inter text-[9px] font-extrabold px-2 py-1 uppercase tracking-wider ${
      level === 'good' ? 'bg-emerald-50 text-emerald-700' : level === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
    }`}>
      {text}
    </span>
    <span className={`bg-white font-mono text-[10px] font-bold px-2 py-1 border-l cursor-help transition-colors ${
      level === 'good' ? 'text-emerald-700 border-emerald-100 hover:bg-emerald-50' : 
      level === 'medium' ? 'text-amber-700 border-amber-100 hover:bg-amber-50' : 
      'text-rose-700 border-rose-100 hover:bg-rose-50'
    }`}>
      {subText}
    </span>
  </div>
);

const PropRow = ({
  label, value, badge, tooltip, subValue,
}: {
  label: string;
  value?: string;
  badge?: { text: string; level: RiskLevel };
  tooltip?: string;
  subValue?: string; 
}) => (
  <div className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0 group">
    <div className="flex items-center gap-1.5">
      <span className="font-inter text-xs font-medium text-slate-500 group-hover:text-slate-700 transition-colors">{label}</span>
      {tooltip && (
        <Tooltip title={tooltip} placement="top" arrow>
          <InfoOutlinedIcon sx={{ fontSize: 14 }} className="text-slate-300 hover:text-blue-500 cursor-help transition-colors" />
        </Tooltip>
      )}
    </div>
    <div className="flex items-center">
      {/* Se tiver badge E subValue, usa o design Premium SplitBadge */}
      {badge && subValue ? (
        <Tooltip title="Score / Valor Bruto da Predição" placement="top" arrow>
          <div>
            <SplitBadge text={badge.text} subText={subValue} level={badge.level} />
          </div>
        </Tooltip>
      ) : badge ? (
        <Badge text={badge.text} level={badge.level} />
      ) : (
        <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{value}</span>
      )}
    </div>
  </div>
);

// ... (Mantenha o DomainCard igual)
const DomainCard = ({ title, accentColor, children }: { title: string; accentColor: string; children: React.ReactNode }) => (
  <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
    <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2.5" style={{ backgroundColor: `${accentColor}1A` }}>
      <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: accentColor }} />
      <span className="font-inter text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>{title}</span>
    </div>
    <div className="px-5 py-3 flex-1 flex flex-col justify-center">{children}</div>
  </div>
);

const ToxRow = ({ label, value }: { label: string; value: ToxValue }) => {
  const level = toxRisk(value);
  const Icon  = level === 'good' ? CheckCircleIcon : level === 'medium' ? WarningAmberIcon : CancelIcon;
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border mb-2 last:mb-0 transition-all hover:scale-[1.01] ${ROW_BG[level]}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm ${ICON_BG[level]}`}>
        <Icon sx={{ fontSize: 16 }} />
      </div>
      <span className="font-inter text-xs font-bold text-slate-800 flex-1">{label}</span>
      <Tooltip title="Probabilidade / Score Bruto" placement="top" arrow>
        <div>
           {/* Usa o SplitBadge para Toxicidade também */}
          <SplitBadge text={value.category} subText={value.raw.toFixed(2)} level={level} />
        </div>
      </Tooltip>
    </div>
  );
};
// ─── Score Ring ───────────────────────────────────────────────────────────────

const CIRCUM = 2 * Math.PI * 36;

const ScoreRing = ({ score }: { score: number }) => {
  const offset = CIRCUM * (1 - score / 100);
  const color  = score >= 70 ? '#2563eb' : score >= 45 ? '#f59e0b' : '#f43f5e';
  const label  = score >= 70 ? 'Alta viabilidade' : score >= 45 ? 'Viabilidade moderada' : 'Baixa viabilidade';
  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <div className="relative w-24 h-24 drop-shadow-sm">
        <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="48" cy="48" r="36" fill="none" stroke="#f1f5f9" strokeWidth="8" />
          <circle cx="48" cy="48" r="36" fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${CIRCUM}`} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
          <span className="font-nunito_sans font-extrabold text-3xl leading-none text-slate-800">{score}</span>
          <span className="font-inter text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ADMET</span>
        </div>
      </div>
      <span className="font-inter text-xs font-medium text-slate-500 text-center leading-tight max-w-[110px]">{label}</span>
    </div>
  );
};

// ─── Radar ────────────────────────────────────────────────────────────────────

const toRad = (deg: number) => (deg * Math.PI) / 180;
const CX = 130, CY = 120, RMAX = 88;
const RADAR_AXES = [
  { label: 'Absorção',   angle: -90  },
  { label: 'Dist.',      angle: -18  },
  { label: 'Metab.',     angle:  54  },
  { label: 'Excreção',   angle: 126  },
  { label: 'Toxicidade', angle: 198  },
];
const axPt = (angle: number, r: number) => ({
  x: CX + r * Math.cos(toRad(angle)),
  y: CY + r * Math.sin(toRad(angle)),
});

const AdmetRadar = ({ scores }: { scores: number[] }) => {
  const pts  = RADAR_AXES.map((ax, i) => axPt(ax.angle, scores[i] * RMAX));
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + 'Z';
  return (
    <svg width="100%" viewBox="0 0 260 248" className="block mx-auto drop-shadow-sm">
      {[1, 0.66, 0.33].map(level => {
        const wpts = RADAR_AXES.map(ax => axPt(ax.angle, level * RMAX));
        const wd   = wpts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + 'Z';
        return <path key={level} d={wd} fill={level === 1 ? '#f8fafc' : 'none'} stroke="#e2e8f0" strokeWidth="1" />;
      })}
      {RADAR_AXES.map(ax => {
        const tip = axPt(ax.angle, RMAX);
        return <line key={ax.label} x1={CX} y1={CY} x2={tip.x.toFixed(1)} y2={tip.y.toFixed(1)} stroke="#e2e8f0" strokeWidth="1" />;
      })}
      <path d={path} fill="rgba(37,99,235,0.15)" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" className="transition-all duration-700" />
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="5" fill={DOMAIN_COLORS[i]} stroke="#fff" strokeWidth="2" />)}
      {RADAR_AXES.map(ax => {
        const tip = axPt(ax.angle, RMAX + 22);
        return (
          <text key={ax.label} x={tip.x.toFixed(1)} y={tip.y.toFixed(1)} fontSize="11" fill="#64748b" fontWeight="700"
            textAnchor="middle" dominantBaseline="central" fontFamily="Inter, sans-serif">
            {ax.label}
          </text>
        );
      })}
    </svg>
  );
};

const ScoreBar = ({ label, score, color }: { label: string; score: number; color: string }) => (
  <div className="flex items-center gap-3 group">
    <span className="font-inter text-xs font-semibold text-slate-500 w-24 shrink-0 group-hover:text-slate-700 transition-colors">{label}</span>
    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${score * 100}%`, background: color }} />
    </div>
    <span className="font-mono text-xs font-bold text-slate-600 w-8 text-right bg-slate-50 py-0.5 rounded">
      {Math.round(score * 100)}
    </span>
  </div>
);

// ─── Componente principal ────────────────────────────────────────────────────

const MoleculeDetail = ({ molecule: mol }: { molecule: Molecule }) => {
  const [copied, setCopied] = useState(false);
  const domainScores = scoreDomains(mol);
  const admetScore   = Math.round(domainScores.reduce((a, b) => a + b, 0) / domainScores.length * 100);

  const handleCopy = () => {
    navigator.clipboard.writeText(mol.smiles);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in pb-12 px-2">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-28 h-28 rounded-2xl border border-slate-100 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex items-center justify-center shrink-0 z-10">
          {mol.imgUrl
            ? <img src={mol.imgUrl} alt={mol.name} className="w-24 h-24 object-contain mix-blend-multiply opacity-90 hover:scale-105 transition-transform" />
            : <ScienceIcon sx={{ fontSize: 48 }} className="text-slate-200" />
          }
        </div>

        <div className="flex-1 min-w-0 flex flex-col items-center md:items-start z-10">
          <div className="flex items-end gap-3">
            <h1 className="font-nunito_sans font-black text-3xl text-slate-800 tracking-tight">{mol.name}</h1>
            <span className="font-mono text-sm font-bold text-slate-400 mb-1.5">{mol.id}</span>
          </div>

          <div className="flex items-center gap-2 mt-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 rounded-lg pl-3 pr-1 py-1 w-fit max-w-full transition-colors">
            <span className="font-mono text-[11px] font-medium text-slate-500 truncate max-w-[200px] sm:max-w-xs">{mol.smiles}</span>
            <Tooltip title={copied ? 'Copiado!' : 'Copiar SMILES'}>
              <IconButton size="small" onClick={handleCopy} className={`p-1.5 transition-colors ${copied ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-blue-50 text-slate-400 hover:text-blue-600'}`}>
                {copied ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
              </IconButton>
            </Tooltip>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
            {[
              { label: 'MW',   val: `${mol.mw.toFixed(1)} g/mol` },
              { label: 'LogP', val: mol.logp.toFixed(2) },
              { label: 'TPSA', val: `${mol.tpsa.toFixed(1)} Å²` },
              { label: 'QED',  val: mol.qed.toFixed(2) },
            ].map(t => (
              <div key={t.label} className="flex items-center overflow-hidden rounded-md border border-slate-200 shadow-sm">
                <span className="bg-slate-50 text-slate-500 font-inter text-[10px] font-bold px-2 py-1 uppercase tracking-wider">{t.label}</span>
                <span className="bg-white text-slate-700 font-mono text-[11px] font-bold px-2.5 py-1">{t.val}</span>
              </div>
            ))}
            {[
              { label: 'Lipinski', val: mol.lipinski },
              { label: 'Pfizer',   val: mol.pfizer },
            ].map(r => (
              <div key={r.label} className={`flex items-center overflow-hidden rounded-md border shadow-sm ${r.val === 'Pass' ? 'border-emerald-200' : 'border-rose-200'}`}>
                <span className={`font-inter text-[10px] font-bold px-2 py-1 uppercase tracking-wider ${r.val === 'Pass' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{r.label}</span>
                <span className={`bg-white font-mono text-[11px] font-bold px-2.5 py-1 ${r.val === 'Pass' ? 'text-emerald-700' : 'text-rose-700'}`}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:block"><ScoreRing score={admetScore} /></div>
      </div>

      {/* ── GRID ADMET linha 1 ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <DomainCard title="Físico-Química" accentColor={DOMAIN_COLORS[2]}>
          <PropRow label="Peso Molecular" value={`${mol.mw.toFixed(1)} g/mol`} />
          <PropRow label="LogP"           value={mol.logp.toFixed(2)} />
          <PropRow label="TPSA"           value={`${mol.tpsa.toFixed(1)} Å²`} />
          <PropRow label="QED Score"      badge={{ text: mol.qed.toFixed(2), level: mol.qed >= 0.7 ? 'good' : mol.qed >= 0.4 ? 'medium' : 'bad' }} />
        </DomainCard>

        <DomainCard title="Absorção" accentColor={DOMAIN_COLORS[0]}>
          <PropRow label="HIA" value={`${mol.absorptionPercent}%`} />
          <PropRow
            label="Caco-2"
            badge={{ text: mol.caco2.category, level: binRisk(mol.caco2) }}
            subValue={`${mol.caco2.raw.toFixed(2)} log cm/s`}
          />
          <PropRow
            label="Inibidor P-gp"
            badge={{ text: mol.pgpInhibitor.category, level: ternRisk(mol.pgpInhibitor) }}
            subValue={`prob ${mol.pgpInhibitor.raw.toFixed(2)}`}
          />
        </DomainCard>

        <DomainCard title="Distribuição" accentColor={DOMAIN_COLORS[1]}>
          <PropRow
            label="BBB"
            tooltip="Para alvos periféricos, baixa penetração BBB é excelente."
            badge={{ text: mol.bbb.category, level: bbbRisk(mol.bbb) }}
            subValue={`prob ${mol.bbb.raw.toFixed(2)}`}
          />
          <PropRow label="PPB"               value={`${mol.ppb}%`} />
          <PropRow label="Fração livre (Fu)"  value={`${mol.fu}%`} />
        </DomainCard>
      </div>

      {/* ── GRID ADMET linha 2 ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <DomainCard title="Metabolismo" accentColor={DOMAIN_COLORS[2]}>
          <PropRow
            label="CYP1A2"
            badge={{ text: mol.cyp1a2Substrate.category === 'Não' ? 'Não substrato' : 'Substrato', level: cypRisk(mol.cyp1a2Substrate) }}
            subValue={`prob ${mol.cyp1a2Substrate.raw.toFixed(2)}`}
          />
          <PropRow
            label="CYP2D6"
            badge={{ text: mol.cyp2d6Substrate.category === 'Não' ? 'Não substrato' : 'Substrato', level: cypRisk(mol.cyp2d6Substrate) }}
            subValue={`prob ${mol.cyp2d6Substrate.raw.toFixed(2)}`}
          />
          <PropRow
            label="CYP3A4"
            badge={{ text: mol.cyp3a4Substrate.category === 'Não' ? 'Não substrato' : 'Substrato', level: cypRisk(mol.cyp3a4Substrate) }}
            subValue={`prob ${mol.cyp3a4Substrate.raw.toFixed(2)}`}
          />
        </DomainCard>

        <DomainCard title="Excreção" accentColor={DOMAIN_COLORS[3]}>
          <PropRow label="CL plasmático"   value={`${mol.clPlasma} mL/min/kg`} />
          <PropRow label="Meia-vida (T½)"  value={`${mol.tHalf} h`} />
        </DomainCard>

        <DomainCard title="Toxicidade" accentColor={DOMAIN_COLORS[4]}>
          <ToxRow label="Mutagênico (AMES)"    value={mol.ames} />
          <ToxRow label="Cardiotóxico (hERG)"  value={mol.herg} />
          <ToxRow label="Hepatotóxico"         value={mol.hepato} />
        </DomainCard>
      </div>

      {/* ── RADAR + SCORE BARS ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-6">
          <div className="mb-4 text-center">
            <h3 className="font-nunito_sans font-extrabold text-slate-800 text-lg">Impressão Digital ADMET</h3>
            <p className="font-inter text-xs text-slate-400 mt-1">Perfil multi-domínio normalizado — quanto maior a área, melhor.</p>
          </div>
          <AdmetRadar scores={domainScores} />
        </div>

        <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="font-nunito_sans font-extrabold text-slate-800 text-lg">Desempenho por Categoria</h3>
            <p className="font-inter text-xs text-slate-400 mt-1">Viabilidade farmacocinética pontuada de 0 a 100.</p>
          </div>
          <div className="flex flex-col gap-5 flex-1 justify-center">
            {DOMAIN_NAMES.map((name, i) => (
              <ScoreBar key={name} label={name} score={domainScores[i]} color={DOMAIN_COLORS[i]} />
            ))}
          </div>
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-end justify-between">
            <div>
              <p className="font-inter text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Score ADMET Global</p>
              <p className="font-nunito_sans font-black text-4xl text-slate-800 leading-none mt-1">
                {admetScore}<span className="font-inter text-base font-bold text-slate-300 ml-1">/100</span>
              </p>
            </div>
            <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner mb-1.5">
              <div className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${admetScore}%`, background: admetScore >= 70 ? '#2563eb' : admetScore >= 45 ? '#f59e0b' : '#f43f5e' }} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MoleculeDetail;