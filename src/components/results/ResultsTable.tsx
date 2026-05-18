// src/components/results/ResultsTable.tsx
import { useState } from 'react';
import { Tooltip } from '@mui/material';
import ArrowUpwardIcon   from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapVertIcon      from '@mui/icons-material/SwapVert';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';

import type { Molecule } from '../../types/molecules.types';

// ─── Constantes ──────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

type SortField = 'mw' | 'logp' | 'tpsa' | 'qed';
type SortDir   = 'asc' | 'desc';

// ─── Helpers de cor ──────────────────────────────────────────────────────────

const badgeCls = (value: string): string => {
  const v = value.toLowerCase();
  if (['seguro', 'excelente', 'pass', 'não', 'negativo'].includes(v))
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (['atenção', 'médio', 'moderado'].includes(v))
    return 'bg-amber-50 text-amber-700 border-amber-200';
  if (['tóxico', 'ruim', 'fail', 'sim', 'positivo', 'alto'].includes(v))
    return 'bg-red-50 text-red-700 border-red-200';
  return 'bg-gray-100 text-gray-500 border-transparent';
};

// ─── Badge ───────────────────────────────────────────────────────────────────

const Badge = ({ value }: { value: string }) => (
  <span className={`
    inline-flex items-center justify-center
    px-2 py-0.5 min-w-[58px]
    text-[10px] font-bold rounded-md border
    font-inter tracking-wide
    ${badgeCls(value)}
  `}>
    {value}
  </span>
);

// ─── Cabeçalho de coluna ordenável ──────────────────────────────────────────

interface SortHeaderProps {
  label: string;
  field: SortField;
  current: SortField | null;
  dir: SortDir;
  onSort: (f: SortField) => void;
  align?: 'left' | 'right' | 'center';
}

const SortHeader = ({ label, field, current, dir, onSort, align = 'left' }: SortHeaderProps) => {
  const active = current === field;
  return (
    <th
      className={`
        px-4 py-3 font-inter font-semibold text-[11px] uppercase tracking-wider
        text-gray-400 cursor-pointer select-none whitespace-nowrap
        hover:text-blue-500 transition-colors
        text-${align}
      `}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (
          dir === 'asc'
            ? <ArrowUpwardIcon sx={{ fontSize: 12 }} className="text-blue-500" />
            : <ArrowDownwardIcon sx={{ fontSize: 12 }} className="text-blue-500" />
        ) : (
          <SwapVertIcon sx={{ fontSize: 12 }} className="opacity-25" />
        )}
      </span>
    </th>
  );
};

// ─── Empty state ─────────────────────────────────────────────────────────────

const EmptyState = () => (
  <tr>
    <td colSpan={9} className="py-24 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center">
          <FilterListOffIcon sx={{ fontSize: 22 }} className="text-gray-300" />
        </div>
        <p className="font-nunito_sans font-bold text-gray-400 text-sm">
          Nenhuma molécula corresponde aos filtros
        </p>
        <p className="font-inter text-xs text-gray-300">
          Tente afrouxar os critérios ou clique em "Resetar filtros"
        </p>
      </div>
    </td>
  </tr>
);

// ─── QED mini-bar inline ──────────────────────────────────────────────────────

const QedBar = ({ qed }: { qed: number }) => {
  const color = qed >= 0.7 ? '#10b981' : qed >= 0.4 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${qed * 100}%`, background: color }}
        />
      </div>
      <span className="font-mono text-[11px] text-gray-500 tabular-nums">
        {qed.toFixed(2)}
      </span>
    </div>
  );
};

// ─── Componente principal ────────────────────────────────────────────────────

interface ResultsTableProps {
  molecules: Molecule[];
  onRowClick: (mol: Molecule) => void;
  selectedMolId: string | null;
}

const ResultsTable = ({ molecules, onRowClick, selectedMolId }: ResultsTableProps) => {
  console.log("Molecules in ResultsTable:", molecules);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir,   setSortDir]   = useState<SortDir>('asc');
  const [page,      setPage]      = useState(0);

  // ── Sort ────────────────────────────────────────────────────────────────
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(0);
  };

  const sorted = sortField
    ? [...molecules].sort((a, b) => {
        const va = a[sortField] as number;
        const vb = b[sortField] as number;
        return sortDir === 'asc' ? va - vb : vb - va;
      })
    : molecules;

  // ── Paginação ────────────────────────────────────────────────────────────
  const totalPages  = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage    = Math.min(page, totalPages - 1);
  const displayData = sorted.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  return (
    <div className="w-full h-full flex flex-col bg-white">

      {/* ── TABELA ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">

          {/* CABEÇALHO */}
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 sticky top-0 z-10">
              {/* # */}
              <th className="px-4 py-3 w-10 text-center font-inter font-semibold text-[11px] uppercase tracking-wider text-gray-400">
                #
              </th>
              {/* Imagem — coluna mais larga agora */}
              <th className="px-3 py-3 w-28 text-center font-inter font-semibold text-[11px] uppercase tracking-wider text-gray-400">
                Estrutura
              </th>
              {/* Nome */}
              <th className="px-4 py-3 font-inter font-semibold text-[11px] uppercase tracking-wider text-gray-400 text-left">
                Molécula
              </th>
              {/* Sortáveis */}
              <SortHeader label="MW"   field="mw"   current={sortField} dir={sortDir} onSort={handleSort} />
              <SortHeader label="LogP" field="logp" current={sortField} dir={sortDir} onSort={handleSort} />
              <SortHeader label="QED"  field="qed"  current={sortField} dir={sortDir} onSort={handleSort} />
              {/* Badges */}
               <th className="p-3 font-inter font-bold text-xs text-gray-600 uppercase tracking-wider text-center">AMES</th>
              <th className="p-3 font-inter font-bold text-xs text-gray-600 uppercase tracking-wider text-center">Hepato</th>
              <th className="p-3 font-inter font-bold text-xs text-gray-600 uppercase tracking-wider text-center">Lipinski</th>
            </tr>
          </thead>

          {/* CORPO */}
          <tbody>
            {displayData.length === 0 ? <EmptyState /> : displayData.map((mol, idx) => {
              const isSelected = mol.id === selectedMolId;
              const globalIdx  = safePage * PAGE_SIZE + idx + 1;

              // Indicadores numéricos
              const mwAlert  = mol.mw > 500;
              const logpAlert = mol.logp > 5 || mol.logp < -2;

              return (
                <tr
                  key={mol.id}
                  onClick={() => onRowClick(mol)}
                  className={`
                    group cursor-pointer transition-all duration-100
                    border-b border-gray-50 last:border-0
                    ${isSelected
                      ? 'bg-blue-50/60 border-l-2 border-l-blue-500'
                      : 'border-l-2 border-l-transparent hover:bg-gray-50/70'}
                  `}
                >
                  {/* # */}
                  <td className="px-4 py-3 text-center">
                    <span className="font-inter text-xs text-gray-300 tabular-nums font-medium">
                      {globalIdx}
                    </span>
                  </td>

                  {/* IMAGEM — maior e mais central */}
                  <td className="px-3 py-2">
                    <div className="
                      w-20 h-16 mx-auto
                      rounded-xl border border-gray-100
                      bg-white flex items-center justify-center
                      overflow-hidden
                      group-hover:border-blue-100 transition-colors
                    ">
                      <img
                        src={mol.imgUrl}
                        alt={mol.name}
                        className="
                          w-[68px] h-[56px] object-contain
                          mix-blend-multiply opacity-85
                          group-hover:scale-110 transition-transform duration-300
                        "
                      />
                    </div>
                  </td>

                  {/* NOME + SMILES */}
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className={`
                      font-nunito_sans font-bold text-sm leading-tight truncate
                      ${isSelected ? 'text-blue-700' : 'text-gray-800 group-hover:text-blue-600'}
                      transition-colors
                    `}>
                      {mol.name}
                    </p>
                    <Tooltip title={mol.smiles} placement="bottom-start">
                      <p className="font-mono text-[10px] text-gray-400 truncate mt-0.5 max-w-[190px]">
                        {mol.smiles}
                      </p>
                    </Tooltip>
                    {/* ID pill */}
                    <span className="
                      inline-block mt-1
                      font-mono text-[9px] font-semibold
                      px-1.5 py-0.5 rounded bg-gray-100 text-gray-400
                    ">
                      {mol.id}
                    </span>
                  </td>

                  {/* MW */}
                  <td className="px-4 py-3">
                    <span className={`font-mono text-xs tabular-nums ${mwAlert ? 'text-red-500 font-bold' : 'text-gray-700'}`}>
                      {mol.mw.toFixed(1)}
                    </span>
                    {mwAlert && (
                      <span className="block text-[9px] text-red-400 font-inter">{'>'} 500</span>
                    )}
                  </td>

                  {/* LogP */}
                  <td className="px-4 py-3 ">
                    <span className={`font-mono text-xs tabular-nums ${logpAlert ? 'text-amber-600 font-bold' : 'text-gray-700'}`}>
                      {mol.logp.toFixed(2)}
                    </span>
                  </td>

                  {/* QED bar */}
                  <td className="px-4 py-3">
                    <QedBar qed={mol.qed} />
                  </td>

                  {/* AMES */}
                  <td className="px-4 py-3 text-center">
                    <Badge value={mol.ames.category} />
                  </td>

                  {/* Hepato */}
                  <td className="px-4 py-3 text-center">
                    <Badge value={mol.hepato.category} />
                  </td>

                  {/* Lipinski */}
                  <td className="px-4 py-3 text-center">
                    <Badge value={mol.lipinski} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── PAGINAÇÃO ────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-white">
        <span className="font-inter text-xs text-gray-400">
          {sorted.length === 0
            ? 'Nenhum resultado'
            : `${safePage * PAGE_SIZE + 1}–${Math.min((safePage + 1) * PAGE_SIZE, sorted.length)} de ${sorted.length}`}
        </span>

        <div className="flex items-center gap-1">
          {/* Anterior */}
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="
              px-3 py-1.5 text-xs font-inter font-medium
              rounded-lg border border-gray-200 text-gray-500
              hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed
              transition-colors
            "
          >
            ← Anterior
          </button>

          {/* Números de página */}
          {Array.from({ length: totalPages }, (_, i) => i)
            .filter(i => Math.abs(i - safePage) <= 2)
            .map(i => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`
                  w-8 h-8 text-xs font-inter font-semibold rounded-lg transition-colors
                  ${i === safePage
                    ? 'bg-blue-600 text-white border border-blue-600 shadow-sm'
                    : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}
                `}
              >
                {i + 1}
              </button>
            ))}

          {/* Próximo */}
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={safePage >= totalPages - 1}
            className="
              px-3 py-1.5 text-xs font-inter font-medium
              rounded-lg border border-gray-200 text-gray-500
              hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed
              transition-colors
            "
          >
            Próximo →
          </button>
        </div>
      </div>

    </div>
  );
};

export default ResultsTable;