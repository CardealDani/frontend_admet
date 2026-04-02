// src/components/results/ResultsTable.tsx
import { useState } from 'react';
import { Tooltip } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';

import type { Molecule } from '../../types/molecules.types';

// ─── Helpers ────────────────────────────────────────────────────────────────

type SortField = 'mw' | 'logp' | 'tpsa' | 'qed';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 15;

// Mapeia valores categóricos para cores de badge — seguindo o padrão semântico do sistema
const badgeClass = (value: string): string => {
  const v = value.toLowerCase();
  if (['seguro', 'excelente', 'pass', 'não', 'negativo'].includes(v))
    return 'bg-green-50 text-green-700 border border-green-200';
  if (['atenção', 'médio', 'moderado'].includes(v))
    return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
  if (['tóxico', 'ruim', 'fail', 'sim', 'positivo', 'alto'].includes(v))
    return 'bg-red-50 text-red-700 border border-red-200';
  return 'bg-gray-100 text-gray-600';
};

const StatusBadge = ({ value }: { value: string }) => (
  <span className={`px-2 py-0.5 text-[10px] font-bold rounded font-inter inline-block min-w-[56px] text-center ${badgeClass(value)}`}>
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
}

const SortHeader = ({ label, field, current, dir, onSort }: SortHeaderProps) => {
  const active = current === field;
  return (
    <th
      className="p-3 font-inter font-bold text-xs text-gray-600 uppercase tracking-wider cursor-pointer select-none hover:text-blue-600 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {active ? (
          dir === 'asc'
            ? <ArrowUpwardIcon sx={{ fontSize: 13 }} className="text-blue-500" />
            : <ArrowDownwardIcon sx={{ fontSize: 13 }} className="text-blue-500" />
        ) : (
          <SwapVertIcon sx={{ fontSize: 13 }} className="opacity-30" />
        )}
      </div>
    </th>
  );
};

// ─── Empty state ─────────────────────────────────────────────────────────────

const EmptyState = () => (
  <tr>
    <td colSpan={9} className="py-20 text-center">
      <FilterListOffIcon sx={{ fontSize: 40 }} className="text-gray-200 mb-3" />
      <p className="font-nunito_sans font-bold text-gray-400 text-sm">
        Nenhuma molécula corresponde aos filtros aplicados
      </p>
      <p className="font-inter text-xs text-gray-300 mt-1">
        Tente afrouxar os critérios ou clicar em "Resetar filtros"
      </p>
    </td>
  </tr>
);

// ─── Componente principal ────────────────────────────────────────────────────

interface ResultsTableProps {
  molecules: Molecule[];
  onRowClick: (mol: Molecule) => void;
  selectedMolId: string | null;
}

const ResultsTable = ({ molecules, onRowClick, selectedMolId }: ResultsTableProps) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir]     = useState<SortDir>('asc');
  const [page, setPage]           = useState(0);

  // ── Sort ────────────────────────────────────────────────────────────────
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
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
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageData   = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Reset página quando lista muda (filtros aplicados)
  // Evitamos useEffect aqui — pageData já corrige naturalmente
  const safePage   = Math.min(page, Math.max(0, totalPages - 1));
  const displayData = sorted.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  return (
    <div className="w-full h-full flex flex-col bg-white">

      {/* TABELA */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">

          <thead className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <tr>
              <th className="p-3 font-inter font-bold text-xs text-gray-600 uppercase tracking-wider text-center w-10">#</th>
              <th className="p-3 font-inter font-bold text-xs text-gray-600 uppercase tracking-wider text-center w-20">2D</th>
              <th className="p-3 font-inter font-bold text-xs text-gray-600 uppercase tracking-wider">Molécula</th>
              <SortHeader label="MW"   field="mw"   current={sortField} dir={sortDir} onSort={handleSort} />
              <SortHeader label="LogP" field="logp" current={sortField} dir={sortDir} onSort={handleSort} />
              <SortHeader label="QED"  field="qed"  current={sortField} dir={sortDir} onSort={handleSort} />
              <th className="p-3 font-inter font-bold text-xs text-gray-600 uppercase tracking-wider text-center">AMES</th>
              <th className="p-3 font-inter font-bold text-xs text-gray-600 uppercase tracking-wider text-center">Hepato</th>
              <th className="p-3 font-inter font-bold text-xs text-gray-600 uppercase tracking-wider text-center">Lipinski</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {displayData.length === 0 ? (
              <EmptyState />
            ) : (
              displayData.map((mol, idx) => {
                const isSelected = mol.id === selectedMolId;
                const globalIdx  = safePage * PAGE_SIZE + idx + 1;

                
                return (
                  <tr
                    key={mol.id}
                    onClick={() => onRowClick(mol)}
                    className={`cursor-pointer transition-colors group ${
                      isSelected
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-50/80 border-l-transparent'
                    }`}
                  >
                    {/* # */}
                    <td className={`p-3 text-center border-l-[3px] transition-colors ${isSelected ? 'border-blue-500' : 'border-transparent'}`}>
                      <span className="font-inter font-medium text-gray-400 text-xs">{globalIdx}</span>
                    </td>

                    {/* 2D */}
                    <td className="p-2">
                      <div className="w-14 h-10 flex items-center justify-center mx-auto">
                        <img
                          src={mol.imgUrl}
                          alt={mol.name}
                          className="max-w-full max-h-full object-contain opacity-80 group-hover:scale-110 transition-transform mix-blend-multiply"
                        />
                      </div>
                    </td>

                    {/* Nome + SMILES */}
                    <td className="p-3">
                      <p className={`font-nunito_sans font-bold text-sm leading-tight ${
                        isSelected ? 'text-blue-700' : 'text-gray-800'
                      }`}>
                        {mol.name}
                      </p>
                      <Tooltip title={mol.smiles} placement="bottom-start">
                        <p className="font-mono text-[10px] text-gray-400 truncate max-w-[160px] mt-0.5">
                          {mol.smiles}
                        </p>
                      </Tooltip>
                    </td>

                    {/* MW */}
                    <td className="p-3">
                      <span className={`font-mono text-xs ${mol.mw > 500 ? 'text-red-500 font-bold' : 'text-gray-700'}`}>
                        {mol.mw.toFixed(1)}
                      </span>
                    </td>

                    {/* LogP */}
                    <td className="p-3">
                      <span className={`font-mono text-xs ${mol.logp > 5 ? 'text-red-500 font-bold' : mol.logp < 0 ? 'text-blue-500' : 'text-gray-700'}`}>
                        {mol.logp.toFixed(2)}
                      </span>
                    </td>

                    {/* QED */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              mol.qed >= 0.7 ? 'bg-green-400' : mol.qed >= 0.4 ? 'bg-amber-400' : 'bg-red-400'
                            }`}
                            style={{ width: `${mol.qed * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-gray-500">
                          {mol.qed.toFixed(2)}
                        </span>
                      </div>
                    </td>

                    {/* AMES */}
                    <td className="p-3 text-center">
                      <StatusBadge value={mol.ames} />
                    </td>

                    {/* Hepato */}
                    <td className="p-3 text-center">
                      <StatusBadge value={mol.hepato} />
                    </td>

                    {/* Lipinski */}
                    <td className="p-3 text-center">
                      <StatusBadge value={mol.lipinski} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINAÇÃO */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-white">
        <span className="font-inter text-xs text-gray-400">
          Página {totalPages === 0 ? 0 : safePage + 1} de {totalPages}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="px-3 py-1 text-xs font-inter font-medium rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Ant
          </button>

          {/* Números de página — mostra até 5 */}
          {Array.from({ length: totalPages }, (_, i) => i)
            .filter(i => Math.abs(i - safePage) <= 2)
            .map(i => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-7 h-7 text-xs font-inter font-medium rounded-lg transition-colors ${
                  i === safePage
                    ? 'bg-blue-600 text-white border border-blue-600'
                    : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}

          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={safePage >= totalPages - 1}
            className="px-3 py-1 text-xs font-inter font-medium rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Próx
          </button>
        </div>
      </div>

    </div>
  );
};

export default ResultsTable;