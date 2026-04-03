// src/components/results/MoleculePreview.tsx
import { Typography, IconButton, Button, Divider, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LaunchIcon from '@mui/icons-material/Launch';

import type { Molecule, CategoricalTernary } from '../../types/molecules.types';

// ─── Helpers ────────────────────────────────────────────────────────────────

type RiskLevel = 'good' | 'medium' | 'bad';

const toxToRisk = (val: CategoricalTernary): RiskLevel => {
  if (val === 'Excelente') return 'good';
  if (val === 'Médio') return 'medium';
  return 'bad';
};

const riskStyles: Record<RiskLevel, string> = {
  good:   'bg-green-50 text-green-800 border-green-200',
  medium: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  bad:    'bg-red-50 text-red-800 border-red-200',
};

const RiskIcon = ({ level }: { level: RiskLevel }) => {
  if (level === 'good')   return <CheckCircleIcon fontSize="small" className="text-green-500 shrink-0" />;
  if (level === 'medium') return <WarningAmberIcon fontSize="small" className="text-yellow-500 shrink-0" />;
  return <CancelIcon fontSize="small" className="text-red-500 shrink-0" />;
};

interface RiskIndicatorProps {
  label: string;
  value: string;
  tooltip: string;
  level: RiskLevel;
}

const RiskIndicator = ({ label, value, tooltip, level }: RiskIndicatorProps) => (
  <div className={`p-3 rounded-xl border flex items-center justify-between ${riskStyles[level]}`}>
    <div className="flex items-center gap-2">
      <Typography className="font-nunito_sans font-extrabold text-[14px]">{label}</Typography>
      <Tooltip title={tooltip} placement="top">
        <InfoOutlinedIcon sx={{ fontSize: 14 }} className="opacity-50 cursor-help" />
      </Tooltip>
    </div>
    <div className="flex items-center gap-1.5">
      <RiskIcon level={level} />
      <Typography className="font-mono text-xs font-bold uppercase tracking-wide">{value}</Typography>
    </div>
  </div>
);

// ─── Radar ADMET dinâmico ────────────────────────────────────────────────────
// Normaliza os 5 domínios para [0,1] e calcula os pontos do polígono.
// Centro: (110, 100). Raio máximo: 80px.

const toRad = (deg: number) => (deg * Math.PI) / 180;

// Eixos: Absorção (topo), Distribuição, Metabolismo, Excreção, Toxicidade
const AXES = [
  { label: 'Absorção',    angle: -90  },
  { label: 'Dist.',       angle: -18  },
  { label: 'Metab.',      angle:  54  },
  { label: 'Excreção',    angle: 126  },
  { label: 'Toxicidade',  angle: 198  },
];

const CX = 110, CY = 105, R = 78;

const axisPoint = (angle: number, r: number) => ({
  x: CX + r * Math.cos(toRad(angle)),
  y: CY + r * Math.sin(toRad(angle)),
});

const scoreMolecule = (mol: Molecule): number[] => {
  // Absorção: baseado em absorptionPercent e caco2
  const abs = (mol.absorptionPercent / 100) * 0.7
    + (mol.caco2 === 'Excelente' ? 0.3 : mol.caco2 === 'Ruim' ? 0.15 : 0);

  // Distribuição: ppb moderado é melhor (não 0%, não 100%)
  const ppbScore = 1 - Math.abs(mol.ppb - 50) / 50;
  const dist = ppbScore * 0.5
    + (mol.bbb === 'Excelente' ? 0.5 : mol.bbb === 'Médio' ? 0.3 : 0.1);

  // Metabolismo: menos substratos = melhor
  const cypCount = [mol.cyp1a2Substrate, mol.cyp2d6Substrate, mol.cyp3a4Substrate]
    .filter(v => v === 'Sim').length;
  const met = 1 - cypCount / 3;

  // Excreção: tHalf razoável (2–24h ideal)
  const halfScore = mol.tHalf >= 2 && mol.tHalf <= 24 ? 1
    : mol.tHalf < 2 ? mol.tHalf / 2
    : Math.max(0, 1 - (mol.tHalf - 24) / 48);
  const exc = halfScore * 0.6 + (mol.clPlasma < 30 ? 0.4 : mol.clPlasma < 80 ? 0.2 : 0);

  // Toxicidade: ames + hepato + herg
  const toxScore = (
    (mol.ames   === 'Excelente' ? 1 : mol.ames   === 'Médio' ? 0.5 : 0) +
    (mol.hepato === 'Excelente' ? 1 : mol.hepato === 'Médio' ? 0.5 : 0) +
    (mol.herg   === 'Excelente' ? 1 : mol.herg   === 'Médio' ? 0.5 : 0)
  ) / 3;

  return [
    Math.min(1, Math.max(0, abs)),
    Math.min(1, Math.max(0, dist)),
    Math.min(1, Math.max(0, met)),
    Math.min(1, Math.max(0, exc)),
    Math.min(1, Math.max(0, toxScore)),
  ];
};

interface RadarProps { mol: Molecule }

const AdmetRadar = ({ mol }: RadarProps) => {
  const scores = scoreMolecule(mol);

  // Pontos do polígono da molécula
  const molPoints = AXES.map((ax, i) => axisPoint(ax.angle, scores[i] * R));
  const molPath = molPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';

  // Teia de fundo (3 níveis: 100%, 66%, 33%)
  const webLevels = [1, 0.66, 0.33];

  return (
    <svg width="300" height="210" viewBox="0 0 220 210" className="mx-auto">
      {/* Teias */}
      {webLevels.map(level => {
        const pts = AXES.map(ax => axisPoint(ax.angle, level * R));
        const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';
        return <path key={level} d={d} fill={level === 1 ? '#f8fafc' : 'none'} stroke="#e2e8f0" strokeWidth="0.75" />;
      })}

      {/* Eixos */}
      {AXES.map(ax => {
        const tip = axisPoint(ax.angle, R);
        return <line key={ax.label} x1={CX} y1={CY} x2={tip.x.toFixed(1)} y2={tip.y.toFixed(1)} stroke="#e2e8f0" strokeWidth="0.75" />;
      })}

      {/* Polígono da molécula */}
      <path d={molPath} fill="rgba(37,99,235,0.18)" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />

      {/* Pontos nos vértices */}
      {molPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#2563eb" />
      ))}

      {/* Labels dos eixos */}
      {AXES.map((ax, i) => {
        const tip = axisPoint(ax.angle, R + 16);
        return (
          <text
            key={ax.label}
            x={tip.x.toFixed(1)}
            y={tip.y.toFixed(1)}
            fontSize="10"
            fill="#64748b"
            textAnchor="middle"
            dominantBaseline="central"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
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
  return (
    <div className="w-full h-full bg-white flex flex-col">

      {/* HEADER */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-start bg-slate-50/50 shrink-0">
        <div className="flex-1 min-w-0">
          <Typography variant="h6" className="font-nunito_sans font-extrabold text-gray-900 leading-tight truncate">
            {mol.name}
          </Typography>
          <div className="flex items-center gap-1.5 mt-1">
            <Typography className="font-mono text-[11px] text-gray-400 truncate max-w-[240px]">
              {mol.smiles}
            </Typography>
            <Tooltip title="Copiar SMILES">
              <IconButton size="small" onClick={() => navigator.clipboard.writeText(mol.smiles)} className="p-0.5">
                <ContentCopyIcon sx={{ fontSize: 13 }} className="text-gray-400 hover:text-blue-600" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <IconButton onClick={onClose} size="small" className="ml-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0">
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">

        {/* ESTRUTURA 2D */}
        <div className="mx-4 mt-4 mb-2 h-44 bg-white border border-gray-100 rounded-xl flex items-center justify-center p-3 overflow-hidden">
          <img
            src={mol.imgUrl}
            alt={mol.name}
            className="max-w-full max-h-full object-contain mix-blend-multiply opacity-90"
          />
        </div>

        {/* CARDS MW + LOGP */}
        <div className="flex gap-3 px-4 py-3">
          <div className="flex-1 bg-gray-50 rounded-xl border border-gray-100 p-3">
            <p className="font-inter text-[10px] text-gray-400 uppercase tracking-wide mb-1">Peso Molecular</p>
            <p className="font-mono text-base font-bold text-gray-900">
              {mol.mw.toFixed(1)} <span className="text-xs font-normal text-gray-400">Da</span>
            </p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl border border-gray-100 p-3">
            <p className="font-inter text-[10px] text-gray-400 uppercase tracking-wide mb-1">LogP</p>
            <p className="font-mono text-base font-bold text-gray-900">{mol.logp.toFixed(2)}</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl border border-gray-100 p-3">
            <p className="font-inter text-[10px] text-gray-400 uppercase tracking-wide mb-1">TPSA</p>
            <p className="font-mono text-base font-bold text-gray-900">
              {mol.tpsa.toFixed(1)} <span className="text-xs font-normal text-gray-400">Å²</span>
            </p>
          </div>
        </div>

        <Divider className="mx-4" />

        {/* RADAR ADMET */}
        <div className="mx-4 my-3 bg-gray-50/50 rounded-xl border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="font-inter text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Perfil ADMET
            </p>
            <Tooltip title="Quanto mais preenchido, melhor o perfil farmacocinético geral.">
              <InfoOutlinedIcon sx={{ fontSize: 14 }} className="text-gray-300 cursor-help" />
            </Tooltip>
          </div>
          <AdmetRadar mol={mol} />
        </div>

        <Divider className="mx-4" />

        {/* SEMÁFORO DE RISCO */}
        <div className="px-4 py-3 space-y-2 pb-6">
          <p className="font-inter text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            Indicadores de Risco Crítico
          </p>

          <RiskIndicator
            label="Mutagenicidade AMES"
            value={mol.ames}
            tooltip="Predição de mutagenicidade pelo Teste de Ames"
            level={toxToRisk(mol.ames)}
          />
          <RiskIndicator
            label="Cardiotoxicidade hERG"
            value={mol.herg}
            tooltip="Risco de bloqueio dos canais hERG — prolongamento do intervalo QT"
            level={toxToRisk(mol.herg)}
          />
          <RiskIndicator
            label="Hepatotoxicidade"
            value={mol.hepato}
            tooltip="Risco de dano hepático induzido pelo composto"
            level={toxToRisk(mol.hepato)}
          />

          {/* Lipinski + Pfizer pills */}
          <div className="flex gap-2 pt-1 justify-center">
            <span className={`px-3 py-1 text-xs font-bold rounded-lg border font-inter ${
              mol.lipinski === 'Pass' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              Lipinski: {mol.lipinski}
            </span>
            <span className={`px-3 py-1 text-xs font-bold rounded-lg border font-inter ${
              mol.pfizer === 'Pass' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              Pfizer 3/75: {mol.pfizer}
            </span>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-100 shrink-0">
        <Button
          variant="contained"
          fullWidth
          onClick={() => onViewFullReport(mol)}
          startIcon={<LaunchIcon fontSize="small" />}
          className="bg-blue-600 text-white font-nunito_sans font-extrabold normal-case hover:bg-blue-700 py-2.5 rounded-xl text-sm"
          sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
        >
          Ver Relatório Completo
        </Button>
      </div>

    </div>
  );
};

export default MoleculePreview;