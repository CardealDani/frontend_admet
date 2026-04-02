import React from 'react';
import { Typography, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

interface ResultsSummaryBarProps {
  totalMolecules: number;
  filteredCount: number;
}

export const ResultsSummaryBar = ({ totalMolecules, filteredCount }: ResultsSummaryBarProps) => {
  return (
    <div className="flex justify-between items-center py-3 px-4 bg-white border-b border-gray-200">
      <div className="flex items-baseline gap-2">
        <Typography variant="h6" className="font-nunito_sans font-extrabold text-gray-800">
          Resultados
        </Typography>
        <Typography className="font-inter text-sm text-gray-500 font-medium">
          Mostrando <span className="font-bold text-blue-600">{filteredCount}</span> de {totalMolecules} moléculas
        </Typography>
      </div>

      <div className="flex gap-2">
        {/* Futura funcionalidade de exportação para CSV/SDF */}
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<DownloadIcon fontSize="small" />}
          className="font-inter font-semibold text-sm border-gray-300 text-gray-600 hover:bg-gray-50 normal-case"
        >
          Exportar Dados
        </Button>
      </div>
    </div>
  );
};