// src/components/results/ResultsLayout.tsx
import { Typography, Button, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TuneIcon from '@mui/icons-material/Tune';
import ViewListIcon from '@mui/icons-material/ViewList';
import ScienceIcon from '@mui/icons-material/Science';
import FilterSidebar from './FilterSidebar';
import ResultsTable from './ResultsTable';
import MoleculeDetail from './MoleculeDetail';
interface ResultsLayoutProps {
    onBack: () => void;
    isBatch: boolean;
}

const ResultsLayout = ({ onBack, isBatch }: ResultsLayoutProps) => {
    return (
        // Container principal com a animação de entrada e posição relativa para o fundo decorativo
        <div className="relative w-full min-h-full flex flex-col animate-fade-in-up z-10">

            {/* Decoração de fundo (Signature Design da sua aplicação) */}
            <div className="fixed top-0 right-0 translate-x-1/3 -translate-y-1/4 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div className="fixed bottom-0 left-0 -translate-x-1/3 translate-y-1/3 w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

            {/* 1. TOP BAR (Agora como um Card Premium) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-4">
                    <IconButton
                        onClick={onBack}
                        className="bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-500 transition-colors mt-1"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-bold font-nunito_sans uppercase tracking-wider">
                                {isBatch ? 'Análise em Lote' : 'Análise Individual'}
                            </span>
                            <span className="text-xs font-inter text-gray-400">Processado em 2.4s</span>
                        </div>
                        <Typography variant="h5" className="font-nunito_sans font-bold text-gray-900">
                            Dashboard de <span className="text-blue-600">Resultados</span>
                        </Typography>
                        <Typography className="font-inter text-sm text-gray-500 mt-1">
                            {isBatch
                                ? 'Exibindo 150 moléculas. Utilize os filtros laterais para refinar sua busca.'
                                : 'Propriedades farmacocinéticas e de toxicidade calculadas com sucesso.'}
                        </Typography>
                    </div>
                </div>

                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    className="bg-blue-600 text-white rounded-xl px-6 py-2.5 normal-case font-bold font-nunito_sans shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
                >
                    Exportar Dados
                </Button>
            </div>

            {/* 2. CORPO DO DASHBOARD (Grid 1/4 e 3/4) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                {/* COLUNA ESQUERDA: Sidebar de Filtros */}
                <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:sticky lg:top-28">
                    {/* Header da Sidebar */}
                    <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <TuneIcon fontSize="small" />
                        </div>
                        <Typography variant="h6" className="font-nunito_sans font-bold text-gray-900 text-lg">
                            Filtros ADMET
                        </Typography>
                    </div>

                    {/* Corpo da Sidebar (Placeholder) */}
                    <div className="p-6 space-y-6 min-h-[400px]">

                        <div className="p-6">
                            <FilterSidebar />
                        </div>
                    </div>
                </div>

                {/* COLUNA DIREITA: Área de Visualização dos Dados */}
                <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">

                    {/* Card da Área de Dados */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">

                        {/* Header da Área de Dados */}
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isBatch ? 'bg-indigo-50 text-indigo-600' : 'bg-teal-50 text-teal-600'}`}>
                                    {isBatch ? <ViewListIcon fontSize="small" /> : <ScienceIcon fontSize="small" />}
                                </div>
                                <Typography variant="h6" className="font-nunito_sans font-bold text-gray-900 text-lg">
                                    {/* Muda o título dinamicamente */}
                                    {isBatch ? 'Resultados do Lote (Tabela)' : 'Relatório Analítico da Molécula'}
                                </Typography>
                            </div>

                            {/* Botões de visualização extra (se for lote) */}
                            {isBatch && (
                                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
                                    <button className="px-3 py-1 text-sm font-nunito_sans font-bold text-blue-600 bg-white rounded shadow-sm">
                                        Tabela
                                    </button>
                                    <button className="px-3 py-1 text-sm font-nunito_sans font-bold text-gray-500 hover:text-gray-700 transition-colors">
                                        Gráficos
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Corpo da Área de Dados (Placeholder) */}
                        <div className={`flex-grow bg-white ${isBatch ? '' : 'p-6'}`}>
                            {isBatch ? <ResultsTable /> : <MoleculeDetail />}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default ResultsLayout;