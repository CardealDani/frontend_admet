// src/components/results/ResultsTable.tsx

import { Typography, Tooltip } from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';

const StatusBadge = ({ status }: { status: string }) => {
  let colorClass = "bg-gray-100 text-gray-600";
  if (status === 'Negativo' || status === 'Pass' || status === 'Seguro') colorClass = "bg-green-50 text-green-700 border border-green-200";
  else if (status === 'Médio' || status === 'Atenção') colorClass = "bg-yellow-50 text-yellow-700 border border-yellow-200";
  else if (status === 'Positivo' || status === 'Alto' || status === 'Fail') colorClass = "bg-red-50 text-red-700 border border-red-200";

  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold rounded font-inter inline-block min-w-[60px] text-center ${colorClass}`}>
      {status}
    </span>
  );
};

interface ResultsTableProps {
  molecules: any[];
  onRowClick: (mol: any) => void;
  selectedMolId: string | null;
}

const ResultsTable = ({ molecules, onRowClick, selectedMolId }: ResultsTableProps) => {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse relative">

          <thead className="bg-white border-b-2 border-gray-200 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-3 font-inter font-bold text-xs text-gray-800 uppercase tracking-wider text-center w-12">#</th>
              <th className="p-3 font-inter font-bold text-xs text-gray-800 uppercase tracking-wider text-center w-24">2D</th>
              <th className="p-3 font-inter font-bold text-xs text-gray-800 uppercase tracking-wider">Molecule</th>
              <th className="p-3 font-inter font-bold text-xs text-gray-800 uppercase tracking-wider"><div className="flex items-center gap-1 cursor-pointer">MW <SwapVertIcon fontSize="small" className="opacity-50" /></div></th>
              <th className="p-3 font-inter font-bold text-xs text-gray-800 uppercase tracking-wider"><div className="flex items-center gap-1 cursor-pointer">LogP <SwapVertIcon fontSize="small" className="opacity-50" /></div></th>
              <th className="p-3 font-inter font-bold text-xs text-gray-800 uppercase tracking-wider text-center">Ames</th>
              <th className="p-3 font-inter font-bold text-xs text-gray-800 uppercase tracking-wider text-center">Hepato</th>
              <th className="p-3 font-inter font-bold text-xs text-gray-800 uppercase tracking-wider text-center">Lipinski</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {molecules.map((mol, index) => {
              const isSelected = mol.id === selectedMolId;
              return (
                <tr
                  key={mol.id}
                  onClick={() => onRowClick(mol)}
                  // A linha inteira é clicável. Fica azulada se estiver selecionada.
                  className={`cursor-pointer transition-colors group ${isSelected ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
                >
                  <td className="p-3 text-center border-r border-gray-50">
                    <Typography className="font-inter font-medium text-gray-400 text-xs">{index + 1}</Typography>
                  </td>
                  <td className="p-2 flex items-center justify-center">
                    <div className="w-16 h-12 bg-transparent flex items-center justify-center mix-blend-multiply">
                      <img src={mol.imgUrl} alt={mol.name} className="max-w-full max-h-full object-contain opacity-80 group-hover:scale-110 transition-transform" />
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <Typography className={`font-nunito_sans font-bold text-sm ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                        {mol.name}
                      </Typography>
                      <Tooltip title={mol.smiles} placement="bottom-start">
                        <Typography className="font-mono text-[10px] text-gray-400 truncate max-w-[150px]">
                          {mol.smiles}
                        </Typography>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="p-3"><Typography className={`font-mono text-xs ${mol.mw > 500 ? 'text-red-500 font-bold' : 'text-gray-700'}`}>{mol.mw.toFixed(2)}</Typography></td>
                  <td className="p-3"><Typography className={`font-mono text-xs ${mol.logp > 5 ? 'text-red-500 font-bold' : 'text-gray-700'}`}>{mol.logp.toFixed(2)}</Typography></td>
                  <td className="p-3 text-center"><StatusBadge status={mol.ames} /></td>
                  <td className="p-3 text-center"><StatusBadge status={mol.hepato} /></td>
                  <td className="p-3 text-center"><StatusBadge status={mol.lipinski} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="shrink-0 flex items-center justify-between p-3 border-t border-gray-200 bg-white">
        <Typography className="font-inter text-xs text-gray-500">Mostrando {molecules.length} resultados</Typography>
        <div className="flex gap-2">
          <button className="px-2 py-1 text-xs font-inter text-gray-400 border border-gray-200 rounded cursor-not-allowed">Ant</button>
          <button className="px-2 py-1 text-xs font-inter text-blue-600 border border-blue-200 hover:bg-blue-50 rounded">Próx</button>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;