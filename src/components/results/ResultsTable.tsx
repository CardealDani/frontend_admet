// src/components/results/ResultsTable.tsx
import { Typography, IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ScienceIcon from '@mui/icons-material/Science';

// 1. MOCK DE DADOS: Simulando o retorno do seu backend Django
const mockMolecules = [
  {
    id: 'MOL-001',
    name: 'Aspirina',
    smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
    mw: 180.16,
    logp: 1.19,
    tpsa: 65.12,
    ames: 'Negativo', // Mutagenicidade
    herg: 'Baixo',    // Risco Cardíaco
  },
  {
    id: 'MOL-002',
    name: 'Ibuprofeno',
    smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O',
    mw: 206.28,
    logp: 3.97,
    tpsa: 37.30,
    ames: 'Negativo',
    herg: 'Baixo',
  },
  {
    id: 'MOL-003',
    name: 'Composto X-104',
    smiles: 'C1=CC=C(C=C1)C2=CC=CC=C2',
    mw: 450.55,
    logp: 5.80, // Alto LogP (Lipofílico)
    tpsa: 120.40,
    ames: 'Positivo', // Alerta de Toxicidade!
    herg: 'Alto',     // Alerta de Toxicidade!
  },
  {
    id: 'MOL-004',
    name: 'Paracetamol',
    smiles: 'CC(=O)NC1=CC=C(C=C1)O',
    mw: 151.16,
    logp: 0.46,
    tpsa: 49.33,
    ames: 'Negativo',
    herg: 'Médio',
  },
];

// Componente auxiliar para renderizar as "Etiquetas" de status visualmente
const StatusBadge = ({ status }: { status: string, type: 'ames' | 'herg' }) => {
  let colorClass = "bg-gray-100 text-gray-600"; // Default

  if (status === 'Negativo' || status === 'Baixo') {
    colorClass = "bg-green-50 text-green-700 border border-green-200";
  } else if (status === 'Médio') {
    colorClass = "bg-yellow-50 text-yellow-700 border border-yellow-200";
  } else if (status === 'Positivo' || status === 'Alto') {
    colorClass = "bg-red-50 text-red-700 border border-red-200";
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-bold rounded-full font-inter ${colorClass}`}>
      {status}
    </span>
  );
};

const ResultsTable = () => {
  return (
    <div className="w-full flex flex-col h-full animate-fade-in-up">
      
      {/* Container da Tabela com Scroll Horizontal (para não quebrar em telas menores) */}
      <div className="overflow-x-auto rounded-t-xl border border-gray-200">
        <table className="w-full text-left border-collapse">
          
          {/* CABEÇALHO DA TABELA */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-inter font-bold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">
                ID / Molécula
              </th>
              <th className="p-4 font-inter font-bold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">
                <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                  MW (g/mol) <SwapVertIcon fontSize="small" className="opacity-50" />
                </div>
              </th>
              <th className="p-4 font-inter font-bold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">
                <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                  LogP <SwapVertIcon fontSize="small" className="opacity-50" />
                </div>
              </th>
              <th className="p-4 font-inter font-bold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">
                <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                  TPSA (Å²) <SwapVertIcon fontSize="small" className="opacity-50" />
                </div>
              </th>
              <th className="p-4 font-inter font-bold text-xs text-gray-500 uppercase tracking-wider text-center">
                Ames (Mutagênico)
              </th>
              <th className="p-4 font-inter font-bold text-xs text-gray-500 uppercase tracking-wider text-center">
                hERG (Cardíaco)
              </th>
              <th className="p-4 font-inter font-bold text-xs text-gray-500 uppercase tracking-wider text-center">
                Ação
              </th>
            </tr>
          </thead>

          {/* CORPO DA TABELA */}
          <tbody className="divide-y divide-gray-100 bg-white">
            {mockMolecules.map((mol) => (
              <tr 
                key={mol.id} 
                className="hover:bg-blue-50/50 transition-colors group cursor-default"
              >
                {/* Coluna: Identificação */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <ScienceIcon fontSize="small" />
                    </div>
                    <div>
                      <Typography className="font-nunito_sans font-bold text-gray-900 text-sm">
                        {mol.name}
                      </Typography>
                      <Typography className="font-inter text-xs text-gray-400 truncate w-24 md:w-32 lg:w-40" title={mol.smiles}>
                        {mol.smiles}
                      </Typography>
                    </div>
                  </div>
                </td>

                {/* Colunas: Propriedades Físico-Químicas */}
                <td className="p-4 font-inter text-sm text-gray-700">{mol.mw}</td>
                
                {/* Destaque visual para LogP alto (>5 quebra a regra de Lipinski) */}
                <td className={`p-4 font-inter text-sm font-medium ${mol.logp > 5 ? 'text-red-600' : 'text-gray-700'}`}>
                  {mol.logp}
                </td>
                
                <td className="p-4 font-inter text-sm text-gray-700">{mol.tpsa}</td>

                {/* Colunas: Toxicidade (Usando os Badges) */}
                <td className="p-4 text-center">
                  <StatusBadge status={mol.ames} type="ames" />
                </td>
                <td className="p-4 text-center">
                  <StatusBadge status={mol.herg} type="herg" />
                </td>

                {/* Coluna: Ação */}
                <td className="p-4 text-center">
                  <Tooltip title="Ver Detalhes ADMET" placement="top">
                    <IconButton 
                      size="small" 
                      className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      // Aqui futuramente você passaria o ID da molécula para abrir o MoleculeDetail
                      onClick={() => console.log(`Abrir detalhes de ${mol.id}`)} 
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RODAPÉ DA TABELA (Paginação Simples) */}
      <div className="flex items-center justify-between p-4 border-b border-l border-r border-gray-200 rounded-b-xl bg-gray-50/50 mt-[-1px]">
        <Typography className="font-inter text-sm text-gray-500">
          Mostrando <span className="font-bold text-gray-900">1</span> a <span className="font-bold text-gray-900">4</span> de <span className="font-bold text-gray-900">150</span> moléculas
        </Typography>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm font-inter font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
            Anterior
          </button>
          <button className="px-3 py-1 text-sm font-inter font-medium text-blue-600 bg-white border border-blue-300 rounded hover:bg-blue-50">
            Próxima
          </button>
        </div>
      </div>

    </div>
  );
};

export default ResultsTable;