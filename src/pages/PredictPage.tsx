// src/pages/PredictPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import AppHeader from '../components/Header/AppHeader';
import Footer from '../components/Footer/Footer';
import {
  Button, Typography, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';

// Ícones
import ScienceIcon from '@mui/icons-material/Science';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// IMPORTAÇÃO DO NOVO LAYOUT DE RESULTADOS
import ResultsLayout from '../components/results/ResultsLayout';
import { Header } from '../components/Header';

type Phase = 'input' | 'loading' | 'results';

const PredictPage = () => {
  const [phase, setPhase] = useState<Phase>('results');

  const [activeTab, setActiveTab] = useState<'smiles' | 'file'>('file');
  const [smilesInput, setSmilesInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // =========================================================================
  // ESTADOS DO MODAL DE AVISO (PREVENÇÃO DE ERROS)
  // =========================================================================
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'browser_back' | 'button_reset' | null>(null);

  // Ref para evitar conflito entre o nosso botão de voltar e o botão do navegador
  const isProgrammaticBack = useRef(false);

  // =========================================================================
  // MÁGICA DO HISTÓRICO: Interceptando o botão Voltar do Navegador
  // =========================================================================
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Se fomos nós que mandamos voltar via código, apenas ignora
      if (isProgrammaticBack.current) {
        isProgrammaticBack.current = false;
        return;
      }

      // Se o usuário clicou no voltar do navegador durante os resultados:
      if (phase === 'results') {
        setPendingAction('browser_back');
        setShowWarningModal(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [phase]);

  // Função para capturar o arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const isButtonDisabled =
    (activeTab === 'smiles' && smilesInput.trim() !== '') ||
    (activeTab === 'file' && uploadedFile !== null);

  const handlePredict = () => {
    setPhase('loading');
    setTimeout(() => {
      // Injeta um registro falso no histórico para habilitar o botão "Voltar" do navegador
      window.history.pushState({ page: 'results' }, '', window.location.pathname);
      setPhase('results');
    }, 100);
  };

  // Quando o usuário clica no botão "Nova Análise" do nosso layout
  const handleResetRequest = () => {
    setPendingAction('button_reset');
    setShowWarningModal(true);
  };

  // Ação: Usuário confirmou que quer perder os dados
  const handleConfirmReset = () => {
    setShowWarningModal(false);
    setPhase('input');
    setSmilesInput('');
    setUploadedFile(null);

    // Se ele clicou no nosso botão UI, precisamos limpar o histórico que criamos
    if (pendingAction === 'button_reset') {
      isProgrammaticBack.current = true;
      window.history.back();
    }
    setPendingAction(null);
  };

  // Ação: Usuário desistiu de voltar
  const handleCancelReset = () => {
    setShowWarningModal(false);

    // Se ele tentou voltar pelo navegador e desistiu, o navegador já alterou a URL. 
    // Precisamos recriar o estado do histórico para mantê-lo na página.
    if (pendingAction === 'browser_back') {
      window.history.pushState({ page: 'results' }, '', window.location.pathname);
    }
    setPendingAction(null);
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-hidden">
      {phase === 'results' && (
        <AppHeader onNewAnalysis={phase === 'results' ? handleResetRequest : handleConfirmReset} />
      ) || (<Header />)}

      {/* Como o novo header é mais fino (h-16), ajustamos os paddings do main */}
      <main className={`flex-grow flex flex-col w-full ${phase === 'results' ? 'pt-16' : 'pt-24 pb-12 max-w-7xl mx-auto px-6 items-center justify-center'}`}>

        {/* FASE 1: INPUT */}
        {phase === 'input' && (
          <div className="w-full flex flex-col items-center justify-center animate-fade-in-up h-full">
            <div className="text-center mb-10 max-w-2xl">
              <Typography variant="h4" className="font-nunito_sans font-bold text-gray-900 mb-3">
                Nova <span className="text-blue-600">Análise ADMET</span>
              </Typography>
              <Typography className="font-inter text-gray-500">
                Insira a representação da molécula para iniciar a predição das propriedades farmacocinéticas e de toxicidade.
              </Typography>
            </div>

            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="relative flex w-full bg-gray-50/50 border-b border-gray-200">
                <div
                  className={`absolute bottom-0 h-[3px] bg-blue-600 transition-all duration-300 ease-in-out w-1/2 ${activeTab === 'smiles' ? 'left-0' : 'left-1/2'
                    }`}
                />

                <button
                  onClick={() => setActiveTab('smiles')}
                  className={`flex-1 py-4 flex items-center justify-center gap-2 font-nunito_sans font-bold transition-colors z-10 ${activeTab === 'smiles' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <KeyboardIcon fontSize="small" /> Entrada SMILES
                </button>

                <button
                  onClick={() => setActiveTab('file')}
                  className={`flex-1 py-4 flex items-center justify-center gap-2 font-nunito_sans font-bold transition-colors z-10 ${activeTab === 'file' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <UploadFileIcon fontSize="small" /> Upload de Arquivo
                </button>
              </div>

              <div className="p-8 min-h-[250px] flex flex-col justify-between">
                <div className="flex-grow">
                  {activeTab === 'smiles' ? (
                    <div className="animate-fade-in-up">
                      <label className="block text-sm font-bold text-gray-700 mb-2 font-inter">
                        Código SMILES da Molécula
                      </label>
                      <textarea
                        value={smilesInput}
                        onChange={(e) => setSmilesInput(e.target.value)}
                        placeholder="Ex: CC(=O)OC1=CC=CC=C1C(=O)O (Aspirina)"
                        className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-mono text-gray-800"
                      ></textarea>
                    </div>
                  ) : (
                    <div className="animate-fade-in-up">
                      <label
                        htmlFor="file-upload"
                        className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${uploadedFile ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400'
                          }`}
                      >
                        {uploadedFile ? (
                          <>
                            <InsertDriveFileIcon className="text-blue-500 mb-2" fontSize="large" />
                            <Typography className="font-inter text-blue-700 font-bold">
                              {uploadedFile.name}
                            </Typography>
                            <Typography className="font-inter text-xs text-blue-500 mt-1">
                              Clique para trocar de arquivo
                            </Typography>
                          </>
                        ) : (
                          <>
                            <UploadFileIcon className="text-gray-400 mb-2" fontSize="large" />
                            <Typography className="font-inter text-gray-600 font-medium">
                              Clique ou arraste seu arquivo aqui
                            </Typography>
                            <Typography className="font-inter text-xs text-gray-400 mt-1">
                              Suporta .CSV, .SDF ou .TXT (Máx. 5MB)
                            </Typography>
                          </>
                        )}
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept=".csv, .sdf, .txt"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handlePredict}
                    disabled={isButtonDisabled}
                    className={`rounded-full px-8 py-3 normal-case font-bold flex items-center gap-2 transition-all ${isButtonDisabled
                        ? 'bg-gray-200 text-gray-400 shadow-none'
                        : 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105 active:scale-95'
                      }`}
                  >
                    <ScienceIcon fontSize="small" /> Executar Predição
                  </Button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* FASE 2: LOADING */}
        {phase === 'loading' && (
          <div className="flex-grow flex flex-col items-center justify-center animate-fade-in-up w-full h-full">
            <CircularProgress size={60} thickness={4} className="text-blue-600 mb-6" />
            <Typography variant="h5" className="font-nunito_sans font-bold text-gray-800 mb-2">
              Processando Estruturas...
            </Typography>
            <Typography className="font-inter text-gray-500 max-w-md text-center">
              Nossos modelos de Machine Learning estão calculando propriedades de Absorção, Distribuição, Metabolismo, Excreção e Toxicidade.
            </Typography>
          </div>
        )}

        {/* FASE 3: RESULTADOS */}
        {phase === 'results' && (
          <ResultsLayout
            onBack={handleResetRequest} // Passamos a função que aciona o modal, não o reset direto
            isBatch={activeTab === 'file'}
          />
        )}

      </main>

      {phase !== 'results' && (
        <Footer />
      )}

      {/* ========================================================================= */}
      {/* MODAL DE CONFIRMAÇÃO (POPUP)                                              */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* MODAL DE CONFIRMAÇÃO (POPUP)                                              */}
      {/* ========================================================================= */}
      <Dialog
        open={showWarningModal}
        onClose={handleCancelReset}
        // SlotProps permite adicionar aquele fundo levemente desfocado muito elegante
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: 'blur(3px)',
              backgroundColor: 'rgba(15, 23, 42, 0.4)', // Fundo escuro sutil
            }
          }
        }}
        // PaperProps controla a "caixa branca" do modal usando o sistema do MUI
        PaperProps={{
          sx: {
            borderRadius: 4, // Bordas bem arredondadas
            p: 1, // Padding interno extra
            minWidth: { xs: '90vw', sm: '420px' },
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // Sombra super suave
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 1, pt: 4 }}>
          {/* Ícone gigante e centralizado para chamar atenção ao risco */}
          <div className="bg-red-50 text-red-500 p-4 rounded-full mb-4">
            <WarningAmberIcon sx={{ fontSize: 48 }} />
          </div>
          <Typography variant="h5" sx={{ fontFamily: 'Nunito Sans, sans-serif', fontWeight: 800, color: '#0f172a' }}>
            Descartar resultados?
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center', pb: 4 }}>
          <DialogContentText sx={{ fontFamily: 'Inter, sans-serif', color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Você está prestes a sair desta análise. Todos os <strong>filtros aplicados</strong> e <strong>cálculos gerados</strong> serão perdidos. Deseja realmente iniciar uma nova predição?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', gap: 2, px: 3, pb: 3 }}>
          <Button
            onClick={handleCancelReset}
            variant="outlined"
            color="inherit"
            disableElevation
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              py: 1.2,
              color: '#64748b',
              borderColor: '#e2e8f0',
              '&:hover': { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmReset}
            variant="contained"
            color="error"
            disableElevation
            sx={{
              fontFamily: 'Nunito Sans, sans-serif',
              fontWeight: 800,
              textTransform: 'none',
              borderRadius: 2,
              px: 4,
              py: 1.2,
              backgroundColor: '#ef4444',
              '&:hover': { backgroundColor: '#dc2626' }
            }}
          >
            Sim, descartar
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default PredictPage;