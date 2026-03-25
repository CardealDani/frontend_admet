// src/components/results/ResultsLayout.tsx
import React, { useState } from 'react';
import { Typography, Chip, IconButton, Tooltip, Badge, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import DownloadIcon from '@mui/icons-material/Download';

import FilterSidebar from './FilterSidebar';
import ResultsTable from './ResultsTable';
import MoleculePreview from './MoleculePreview'; // O nosso novo painel direito!
import { LuFilter } from 'react-icons/lu';

// O MOCK SUPREMO (Com todos os dados definidos no seu prompt)
const MOCK_DATA = [
  {
    id: 'MOL-001', name: 'Aspirina', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Aspirin-skeletal.svg/200px-Aspirin-skeletal.svg.png',
    mw: 180.16, tpsa: 65.12, logp: 1.19,
    abs: 98, caco2: 12.4, pgp: 'Não',
    bbb: 'Permeável', ppb: 49, fu: 0.51,
    cyp2d6: 'Não', cyp1a2: 'Não', cyp3a4: 'Sim',
    clPlasma: 5.2, tHalf: 3.1,
    ames: 'Negativo', hepato: 'Seguro', herg: 'Baixo',
    lipinski: 'Pass', pfizer: 'Pass', qed: 0.72
  },
  {
    id: 'MOL-002', name: 'Ibuprofeno', smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ibuprofen_Structure.svg/200px-Ibuprofen_Structure.svg.png',
    mw: 206.28, tpsa: 37.30, logp: 3.97,
    abs: 100, caco2: 24.1, pgp: 'Não',
    bbb: 'Permeável', ppb: 99, fu: 0.01,
    cyp2d6: 'Não', cyp1a2: 'Não', cyp3a4: 'Não',
    clPlasma: 3.8, tHalf: 2.0,
    ames: 'Negativo', hepato: 'Seguro', herg: 'Baixo',
    lipinski: 'Pass', pfizer: 'Pass', qed: 0.81
  },
  {
    id: 'MOL-003', name: 'Sildenafil (Viagra)', smiles: 'CCCC1=NN(C2=C1N=C(NC2=O)C3=C(C=CC(=C3)S(=O)(=O)N4CCN(CC4)C)OCCC)C',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Sildenafil_structure.svg/200px-Sildenafil_structure.svg.png',
    mw: 474.58, tpsa: 115.17, logp: 2.26,
    abs: 41, caco2: 6.2, pgp: 'Sim',
    bbb: 'Baixa', ppb: 96, fu: 0.04,
    cyp2d6: 'Não', cyp1a2: 'Não', cyp3a4: 'Sim',
    clPlasma: 41.2, tHalf: 4.0,
    ames: 'Negativo', hepato: 'Atenção', herg: 'Médio',
    lipinski: 'Pass', pfizer: 'Fail', qed: 0.45
  },
  {
    id: 'MOL-004', name: 'Azobenzeno', smiles: 'C1=CC=C(C=C1)N=NC2=CC=CC=C2',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Azobenzene_structure.svg/200px-Azobenzene_structure.svg.png',
    mw: 182.22, tpsa: 24.78, logp: 3.82,
    abs: 99, caco2: 45.1, pgp: 'Não',
    bbb: 'Permeável', ppb: 85, fu: 0.15,
    cyp2d6: 'Não', cyp1a2: 'Sim', cyp3a4: 'Não',
    clPlasma: 12.0, tHalf: 6.5,
    ames: 'Positivo', hepato: 'Positivo', herg: 'Alto',
    lipinski: 'Pass', pfizer: 'Pass', qed: 0.55
  }
];

interface ResultsLayoutProps {
  onBack: () => void; // Esta é a função que dispara o Modal de Risco lá no PredictPage
  isBatch: boolean;
}

const ResultsLayout = ({ onBack, isBatch }: ResultsLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedMolecule, setSelectedMolecule] = useState<any | null>(null);


  React.useEffect(() => {
    if (!isBatch) {
      setSelectedMolecule(MOCK_DATA[0]);
      setIsSidebarOpen(false);
    }
  }, [isBatch]);

  return (
    <div className="w-full flex h-[calc(100vh-80px)] animate-fade-in bg-gray-50 mt-[-2rem] md:mt-0 overflow-hidden">

      {isBatch && (
        <aside
          className={`bg-white flex flex-col h-full shadow-[2px_0_8px_-4px_rgba(0,0,0,0.05)] z-20 shrink-0 overflow-hidden transition-all duration-300 ease-in-out border-r border-gray-200 ${isSidebarOpen ? 'w-[420px]' : 'w-16'
            }`}
        >
          {/* O min-w-[380px] impede que o conteúdo amasse. O que não cabe em 64px é apenas "cortado" pelo overflow-hidden do aside */}
          <div className="w-[420px] min-w-[420px] flex flex-col h-full">
            {/* Passamos o estado e a função para o FilterSidebar se autogerenciar */}
            <FilterSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          </div>
        </aside>
      )}

      {/* PAINEL 2: CENTRO (TABELA / DASHBOARD) */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50">

        {/* Container que cria o "respiro" (Margem) em volta da tabela */}
        <div className="flex-1 p-6 h-full flex flex-col min-h-0">

          {/* O CARTÃO BRANCO (Onde a tabela e a topbar moram) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

            {/* TOPBAR (Agora faz parte do cartão, atuando como o cabeçalho dele) */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <ViewListIcon fontSize="small" />
                </div>
                <div className="flex items-center gap-3">
                  <Typography className="font-nunito_sans font-extrabold text-gray-900 text-lg leading-none">
                    Análise em Lote
                  </Typography>
                  <Chip label="124 resultados" size="small" className="bg-gray-100 text-gray-600 font-inter text-[11px] font-bold h-5" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* O Botão de Nova Predição continua aqui, mas eu mudei o ícone para + para ficar mais universal */}
                <Button
                  onClick={onBack}
                  variant="text"
                  startIcon={<AddIcon />}
                  className="font-inter font-bold normal-case text-blue-600 hover:bg-blue-50 px-4"
                >
                  Nova Predição
                </Button>
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                  className="normal-case font-bold border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm px-4 rounded-lg"
                >
                  Exportar CSV
                </Button>
              </div>
            </div>

            {/* TABELA DE RESULTADOS */}
            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 bg-white">
              {/* DICA EXTRA DE UX: No seu ResultsTable.tsx, certifique-se de que a tag <table>
                  não esteja forçando um 'w-full' se não for necessário, ou defina larguras 
                  máximas (max-w) para as colunas de texto para elas não esticarem ao infinito. 
               */}
              <ResultsTable
                molecules={MOCK_DATA}
                onRowClick={(mol) => setSelectedMolecule(mol)}
                selectedMolId={selectedMolecule?.id || null}
              />
            </div>

          </div> {/* Fim do Cartão Branco */}
        </div> {/* Fim do Container de Respiro */}
      </main>

      {/* PAINEL 3: DIREITA (PREVIEW DA MOLÉCULA) */}
      <aside
        className={`bg-white flex flex-col h-full shadow-[2px_0_8px_-4px_rgba(0,0,0,0.05)] z-20 shrink-0 overflow-hidden transition-all duration-300 ease-in-out border-r border-gray-200 ${selectedMolecule ? 'w-[420px]' : 'w-0'
          }`}
      >

        {selectedMolecule && (
          <MoleculePreview
            molecule={selectedMolecule}
            onClose={() => setSelectedMolecule(null)}
            onViewFullReport={(mol) => console.log("Navegar para relatório completo", mol)}
          />
        )}

      </aside>
    </div>
  );
};

export default ResultsLayout;