// src/pages/PredictPage.tsx
import { useState } from 'react';
import { Button, Typography, Tooltip } from '@mui/material';

// Ícones
import ScienceIcon from '@mui/icons-material/Science';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DownloadIcon from '@mui/icons-material/Download';

// Componentes Globais e Layouts
import { Header } from '../components/Header';
import AppHeader from '../components/Header/AppHeader';
import Footer from '../components/Footer/Footer';
import ResultsLayout from '../components/results/ResultsLayout';
import SingleMoleculeLayout from '../components/results/SingleMoleculeLayout';
import type { Molecule } from '../types/molecules.types';

// Componentes e Hooks isolados da predição
import { usePredictManager } from '../hooks/usePredictManager';
import { WarningModal } from '../components/predict/WarningModal';
import { LoadingView } from '../components/predict/LoadingView';
import { useNavigate } from 'react-router-dom';

const PredictPage = () => {
  // Toda a lógica de estado e funções está agora blindada neste hook
  const manager = usePredictManager();
  const navigate = useNavigate();

  const [isDragging, setIsDragging] = useState(false);
  const [detailedMolecule, setDetailedMolecule] = useState<Molecule | null>(null);
const [pendingNavigation, setPendingNavigation] = useState<'reset' | 'home'>('reset');


  let currentView: 'predict' | 'results' | 'detail' = 'predict';

  if (manager.phase === 'results') {
    if (manager.activeTab === 'smiles' && manager.parsedSmilesList.length === 1) {
      currentView = 'results'; // Molécula única -> "Nova Predição"
    } else if (detailedMolecule) {
      currentView = 'detail';  // Dentro do Detalhe -> "Voltar à Tabela"
    } else {
      currentView = 'results'; // Tabela de Lote -> "Nova Predição"
    }
  }

// Quando clica em "Nova Predição"
  const handleNewAnalysis = () => {
    setDetailedMolecule(null);
    setPendingNavigation('reset'); // Intenção: Apenas limpar os resultados
    manager.setShowWarningModal(true);
  };

  // Quando clica no Logo
  const handleLogoClick = () => {
    if (manager.phase === 'results') {
      // Se estiver a ver resultados, abre o aviso e define a intenção para ir para a Home
      setPendingNavigation('home');
      manager.setShowWarningModal(true);
    } else {
      // Se estiver no Input vazio, vai direto sem avisar
      navigate('/');
    }
  };

  // O que acontece quando o utilizador clica em "Sim, quero sair" no Modal
  const handleConfirmWarning = () => {
    manager.handleConfirmReset(pendingNavigation); // Limpa a cache e os estados no manager
    
    if (pendingNavigation === 'home') {
      navigate('/'); // Vai para a Home
    } else {
      setPendingNavigation('reset'); // Fica na página limpa
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-hidden">
{/* ── HEADER INTELIGENTE ── */}
{manager.phase === 'results' ? <AppHeader currentView={currentView}
        onNewAnalysis={handleNewAnalysis}
        onBackToTable={() => setDetailedMolecule(null)} onLogoClick={handleLogoClick} /> : <Header />}
      {/* <AppHeader 
        currentView={currentView}
        onNewAnalysis={handleNewAnalysis}
        onBackToTable={() => setDetailedMolecule(null)}
      /> */}

      <main className={`flex-grow flex flex-col w-full ${manager.phase === 'results' ? 'pt-16' : 'pt-24 max-w-7xl mx-auto px-6 items-center justify-center'}`}>

        {/* FASE 1: INPUT */}
        {manager.phase === 'input' && (
          <div className="w-full flex flex-col items-center justify-center animate-fade-in-up h-full p-10">
            <div className="text-center mb-10 max-w-2xl">
              <Typography variant="h4" className="font-nunito_sans font-bold text-gray-900 mb-3">Nova <span className="text-blue-600">Análise ADMET</span></Typography>
              <Typography className="font-inter text-gray-500">Insira a representação da molécula para iniciar a predição.</Typography>
            </div>

            {manager.errorMessage && (
              <div className="w-full max-w-3xl mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in-up">
                <WarningAmberIcon /> <span className="font-inter text-sm font-medium">{manager.errorMessage}</span>
              </div>
            )}

            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* TABS */}
              <div className="relative flex w-full bg-gray-50/50 border-b border-gray-200">
                <div className={`absolute bottom-0 h-[3px] bg-blue-600 transition-all duration-300 w-1/2 ${manager.activeTab === 'smiles' ? 'left-0' : 'left-1/2'}`} />
                <button onClick={() => manager.setActiveTab('smiles')} className={`flex-1 py-4 flex items-center justify-center gap-2 font-nunito_sans font-bold z-10 ${manager.activeTab === 'smiles' ? 'text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}><KeyboardIcon fontSize="small" /> Entrada SMILES</button>
                <button onClick={() => manager.setActiveTab('file')} className={`flex-1 py-4 flex items-center justify-center gap-2 font-nunito_sans font-bold z-10 ${manager.activeTab === 'file' ? 'text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}><UploadFileIcon fontSize="small" /> Upload de Arquivo</button>
              </div>

              {/* CONTEÚDO DAS TABS */}
              <div className="p-8 min-h-[250px] flex flex-col justify-between">
                <div className="flex-grow">

                  {manager.activeTab === 'smiles' ? (
                    <div className="animate-fade-in-up flex flex-col h-full">
                      
                      {/* LABEL TOP */}
                      <label className="block text-sm font-bold text-slate-700 font-inter mb-2">
                        Código(s) SMILES
                      </label>

                      {/* ÁREA DE TEXTO (Premium Input) */}
                      <div className="relative group flex-1 flex flex-col">
                        <textarea
                        value={manager.smilesInput} onChange={(e) => manager.setSmilesInput(e.target.value)}
                        placeholder="Ex: CC(=O)OC1=CC=CC=C1C(=O)O&#10;Para múltiplas moléculas, separe por vírgula ou quebra de linha..."
                        className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-mono text-gray-800 custom-scrollbar"
                      />
                      </div>

                      {/* BARRA DE STATUS (Footer do Input) */}
                      <div className="flex justify-between items-center mt-3 px-1">
                        
                        {/* Botão Carregar Exemplos */}
                        <Tooltip title="Preencher com moléculas de teste seguras" placement="bottom-start">
                          <button
                            onClick={manager.handleLoadSmilesExamples}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50/50 border border-blue-100 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all font-inter text-[11px] font-bold shadow-sm"
                          >
                            <ScienceIcon sx={{ fontSize: 14 }} /> 
                            Carregar Exemplos
                          </button>
                        </Tooltip>

                        {/* Status / Badge de Contagem */}
                        {manager.parsedSmilesList.length > 0 ? (
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-inter text-[10px] font-extrabold uppercase tracking-wider transition-all shadow-sm ${
                            manager.parsedSmilesList.length === 1 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                              manager.parsedSmilesList.length === 1 ? 'bg-emerald-500' : 'bg-blue-500'
                            }`} />
                            {manager.parsedSmilesList.length} {manager.parsedSmilesList.length === 1 ? 'Molécula detectada' : 'Moléculas (Lote)'}
                          </div>
                        ) : (
                          <span className="font-inter text-[11px] font-medium text-slate-400">
                            Aguardando entrada...
                          </span>
                        )}

                      </div>
                    </div>
                  )  : (
                    <div className="animate-fade-in-up">
                      <label 
                        htmlFor="file-upload" 
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            manager.setUploadedFile(e.dataTransfer.files[0]);
                          }
                        }}
                        className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer ${
                          isDragging 
                            ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-inner' 
                            : manager.uploadedFile 
                              ? 'border-blue-400 bg-blue-50/50' 
                              : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400'
                        }`}
                      >
                        {manager.uploadedFile ? (
                          <div className="flex flex-col items-center animate-fade-in-up">
                            <InsertDriveFileIcon className="text-blue-500 mb-2" sx={{ fontSize: 40 }} />
                            <Typography className="font-inter text-blue-700 font-bold text-sm">
                              {manager.uploadedFile.name}
                            </Typography>
                            <Typography className="font-inter text-[10px] font-bold text-blue-400 mt-1 uppercase tracking-wider">
                              Clique ou arraste outro para substituir
                            </Typography>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center pointer-events-none">
                            <UploadFileIcon className={`mb-3 transition-colors duration-300 ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} sx={{ fontSize: 48 }} />
                            <Typography className={`font-inter font-bold text-sm transition-colors ${isDragging ? 'text-blue-600' : 'text-slate-600'}`}>
                              {isDragging ? 'Solte o ficheiro agora!' : 'Clique ou arraste o seu ficheiro aqui'}
                            </Typography>
                            <Typography className="font-inter text-[11px] text-slate-400 mt-1.5 font-medium">
                              Suporta .CSV, .SDF ou .TXT (Máx. 5MB)
                            </Typography>
                          </div>
                        )}
                        <input 
                          id="file-upload" 
                          type="file" 
                          className="hidden" 
                          accept=".csv, .sdf, .txt" 
                          onChange={(e) => e.target.files && manager.setUploadedFile(e.target.files[0])} 
                        />
                      </label>

                      {/* REDESIGN DO MODELO DE ARQUIVO (Helper Box Premium) */}
                      <div className="mt-6 p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
                        
                        {/* Lado Esquerdo: Ícone e Textos */}
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100/50 p-2 rounded-lg text-blue-600">
                            <InsertDriveFileIcon sx={{ fontSize: 18 }} />
                          </div>
                          <div className="flex flex-col">
                            <Typography className="font-inter text-xs font-bold text-slate-700">
                              Precisa de um modelo de teste?
                            </Typography>
                            <Typography className="font-inter text-[10px] text-slate-500">
                              Baixe um CSV formatado para testar a predição em lote.
                            </Typography>
                          </div>
                        </div>

                        {/* Lado Direito: Controles */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          
                          {/* Select Customizado com Tailwind */}
                          <div className="relative">
                            <select
                              value={manager.exampleCount}
                              onChange={(e) => manager.setExampleCount(Number(e.target.value))}
                              className="appearance-none bg-white border border-slate-200 text-slate-600 font-inter text-[11px] font-bold rounded-lg py-1.5 pl-3 pr-7 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer shadow-sm transition-all"
                            >
                              <option value={5}>5 moléculas</option>
                              <option value={10}>10 moléculas</option>
                              <option value={20}>20 moléculas</option>
                              <option value={50}>50 moléculas</option>
                            </select>
                            {/* Ícone de seta customizado que fica por cima do Select */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                              <KeyboardArrowDownIcon sx={{ fontSize: 14 }} />
                            </div>
                          </div>

                          {/* Botão de Download Moderno */}
                          <Tooltip title="Baixar CSV para upload">
                            <button
                              onClick={manager.handleDownloadExample}
                              className="flex items-center gap-1.5 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 font-inter font-bold text-[11px] py-1.5 px-3 rounded-lg transition-all shadow-sm shrink-0"
                            >
                              <DownloadIcon sx={{ fontSize: 14 }} />
                              Baixar Exemplo
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* BOTÃO EXECUTAR */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                  <Button
                    variant="contained"
                    size="large"
                    onClick={manager.handlePredict}
                    disabled={manager.isButtonDisabled}
                    className={`rounded-full px-8 py-3 normal-case font-bold flex items-center gap-2 transition-all duration-300 ${manager.isButtonDisabled
                        ? 'bg-slate-100 text-slate-400 shadow-none'
                        : 'bg-blue-600 text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:-translate-y-0.5'
                      }`}
                  >
                    <ScienceIcon fontSize="small" />
                    Executar Predição
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FASE 2: LOADING */}
        {manager.phase === 'loading' && <LoadingView />}

{/* FASE 3: RESULTADOS */}
        {manager.phase === 'results' && manager.activeTab === 'smiles' && manager.parsedSmilesList.length === 1 && (
          <SingleMoleculeLayout molecule={manager.predictedMolecules[0]} />
        )}
        
        {manager.phase === 'results' && ((manager.activeTab === 'smiles' && manager.parsedSmilesList.length > 1) || manager.activeTab === 'file') && (
          <ResultsLayout 
            isBatch={true} 
            molecules={manager.predictedMolecules}
            // Passamos o controle do detalhe para o Layout filho!
            detailedMolecule={detailedMolecule}
            setDetailedMolecule={setDetailedMolecule}
          />
        )}

      </main>

      {manager.phase !== 'results' && <Footer />}

     <WarningModal
        open={manager.showWarningModal}
        onCancel={() => manager.setShowWarningModal(false)}
        onConfirm={handleConfirmWarning} // Passamos o novo handler que decide o destino
      />
    </div>
  );
};

export default PredictPage;