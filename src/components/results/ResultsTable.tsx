// src/components/results/ResultsTable.tsx
import React, { useState, useMemo } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  TablePagination, Typography, Tooltip, TableSortLabel 
} from '@mui/material';
import type { Molecule } from '../../types/molecules.types';

interface ResultsTableProps {
  molecules: Molecule[];
  onRowClick: (molecule: Molecule) => void;
  selectedMoleculeId?: string; // Corrigido o nome da prop para bater com o layout
}

type Order = 'asc' | 'desc';

export const ResultsTable = ({ molecules, onRowClick, selectedMoleculeId }: ResultsTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof Molecule>('mw');
  const [order, setOrder] = useState<Order>('asc');

  // Lógica real de Ordenação
  const handleRequestSort = (property: keyof Molecule) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedMolecules = useMemo(() => {
    return [...molecules].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [molecules, order, orderBy]);

  // Lógica real de Paginação
  const paginatedMolecules = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedMolecules.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedMolecules, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Container da tabela que rola (Scroll) */}
      <TableContainer className="flex-1 overflow-y-auto custom-scrollbar">
        <Table stickyHeader size="small" className="min-w-[600px]">
          <TableHead>
            <TableRow>
              {/* O sticky header precisa de um fundo sólido e z-index para não sobrepor o conteúdo */}
              <TableCell className="bg-gray-50 border-b border-gray-200 font-inter font-bold text-gray-500 text-xs py-3 z-10 w-16">
                Estrutura
              </TableCell>
              
              <TableCell className="bg-gray-50 border-b border-gray-200 font-inter font-bold text-gray-500 text-xs py-3 z-10">
                <TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={() => handleRequestSort('name')}>
                  Nome / ID
                </TableSortLabel>
              </TableCell>
              
              <TableCell className="bg-gray-50 border-b border-gray-200 font-inter font-bold text-gray-500 text-xs py-3 z-10">
                <TableSortLabel active={orderBy === 'mw'} direction={orderBy === 'mw' ? order : 'asc'} onClick={() => handleRequestSort('mw')}>
                  MW (g/mol)
                </TableSortLabel>
              </TableCell>

              <TableCell className="bg-gray-50 border-b border-gray-200 font-inter font-bold text-gray-500 text-xs py-3 z-10">
                <TableSortLabel active={orderBy === 'logp'} direction={orderBy === 'logp' ? order : 'asc'} onClick={() => handleRequestSort('logp')}>
                  LogP
                </TableSortLabel>
              </TableCell>

              <TableCell className="bg-gray-50 border-b border-gray-200 font-inter font-bold text-gray-500 text-xs py-3 z-10">
                <TableSortLabel active={orderBy === 'lipinski'} direction={orderBy === 'lipinski' ? order : 'asc'} onClick={() => handleRequestSort('lipinski')}>
                  Lipinski
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedMolecules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16">
                  <Typography className="text-gray-400 font-inter text-sm">Nenhuma molécula atende aos filtros atuais.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedMolecules.map((mol) => {
                const isSelected = mol.id === selectedMoleculeId;
                
                return (
                  <TableRow 
                    key={mol.id} 
                    hover 
                    onClick={() => onRowClick(mol)}
                    className={`cursor-pointer transition-colors duration-150 ${isSelected ? 'bg-blue-50/50' : ''}`}
                  >
                    {/* Imagem (Mantive a sua lógica de imagem em caixa com mix-blend) */}
                    <TableCell className="py-2">
                      <div className={`w-12 h-12 bg-white rounded flex items-center justify-center p-1 transition-all ${isSelected ? 'border border-blue-300 shadow-sm' : 'border border-gray-100'}`}>
                        {/* Se não houver imgUrl, a gente poderia colocar um placeholder aqui no futuro */}
                        {mol.imgUrl ? (
                            <img src={mol.imgUrl} alt={mol.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                        ) : (
                            <span className="text-[10px] text-gray-300">2D</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Typography className={`font-inter font-bold text-sm ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                        {mol.name}
                      </Typography>
                      <Tooltip title={mol.smiles} placement="bottom-start">
                        <Typography className="font-mono text-[10px] text-gray-400 truncate max-w-[180px]">
                          {mol.smiles}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    <TableCell className="font-inter text-sm text-gray-600 font-medium">
                        {mol.mw.toFixed(2)}
                    </TableCell>
                    
                    <TableCell className="font-inter text-sm text-gray-600 font-medium">
                        {mol.logp.toFixed(2)}
                    </TableCell>

                    {/* Status Rápido */}
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                          mol.lipinski === 'Pass' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}
                      >
                        {mol.lipinski === 'Pass' ? 'Pass' : 'Fail'}
                      </span>
                    </TableCell>

                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginação Fixa no Rodapé da Tabela */}
      <TablePagination
        component="div"
        count={sortedMolecules.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
        labelRowsPerPage="Linhas:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        className="bg-white border-t border-gray-100 overflow-hidden shrink-0 font-inter shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.02)] z-10"
      />
    </div>
  );
};