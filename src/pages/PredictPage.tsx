// src/pages/PredictPage.tsx
import React, { useState } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { Button, Typography, CircularProgress } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

// IMPORTAÇÃO DO NOVO LAYOUT DE RESULTADOS (que criamos no passo anterior)
import ResultsLayout from '../components/results/ResultsLayout';

// Tipagem para controlar as fases da tela
type Phase = 'input' | 'loading' | 'results';

const PredictPage = () => {
  // Controle de Fases da Tela
  const [phase, setPhase] = useState<Phase>('input');

  // Estados do Formulário Original
  const [activeTab, setActiveTab] = useState<'smiles' | 'file'>('smiles');
  const [smilesInput, setSmilesInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Função para capturar o arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  // Lógica de desativação do botão
  const isButtonDisabled =
    (activeTab === 'smiles' && smilesInput.trim() !== '') ||
    (activeTab === 'file' && uploadedFile !== null);

  // Função disparada ao clicar em "Executar Predição"
  const handlePredict = () => {
    // 1. Muda a tela para "Loading"
    setPhase('loading');

    // Simulação de chamada de API com atraso (timeout)
    // No futuro, isso será substituído por um axios.post() pro seu Django
    setTimeout(() => {
      // 2. Após 2.5 segundos, exibe os Resultados
      setPhase('results');
    }, 2500);
  };

  // Função para limpar tudo e voltar pro início (chamada pelo botão "Nova Análise" no ResultsLayout)
  const handleReset = () => {
    setSmilesInput('');
    setUploadedFile(null);
    setPhase('input');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow pt-28 pb-12 px-6 flex flex-col items-center max-w-7xl mx-auto w-full">

        {/* ========================================================================= */}
        {/* FASE 1: INPUT (Seu formulário original, exibido apenas se phase === 'input') */}
        {/* ========================================================================= */}
        {phase === 'input' && (
          <div className="w-full flex flex-col items-center justify-center animate-fade-in-up ">
            <div className="text-center mb-10 max-w-2xl">
              <Typography variant="h4" className="font-nunito_sans font-bold text-gray-900 mb-3">
                Nova <span className="text-blue-600">Análise ADMET</span>
              </Typography>
              <Typography className="font-inter text-gray-500">
                Insira a representação da molécula para iniciar a predição das propriedades farmacocinéticas e de toxicidade.
              </Typography>
            </div>

            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

              {/* ABAS COM ANIMAÇÃO SLIDE */}
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
                {/* CONTEÚDO DA ABA */}
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

                {/* BOTÃO DE AÇÃO */}
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

        {/* ========================================================================= */}
        {/* FASE 2: LOADING (Exibido enquanto simula a API)                           */}
        {/* ========================================================================= */}
        {phase === 'loading' && (
          <div className="flex-grow flex flex-col items-center justify-center animate-fade-in-up w-full h-full my-auto">
            <CircularProgress size={60} thickness={4} className="text-blue-600 mb-6" />
            <Typography variant="h5" className="font-nunito_sans font-bold text-gray-800 mb-2">
              Processando Estruturas...
            </Typography>
            <Typography className="font-inter text-gray-500 max-w-md text-center">
              Nossos modelos de Machine Learning estão calculando propriedades de Absorção, Distribuição, Metabolismo, Excreção e Toxicidade.
            </Typography>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FASE 3: RESULTADOS (Chama o componente ResultsLayout)                     */}
        {/* ========================================================================= */}
        {phase === 'results' && (
          <ResultsLayout
            onBack={handleReset}
            isBatch={activeTab === 'file'} // Diz pro layout se é lote (true) ou individual (false)
          />
        )}

      </main>

      <Footer />
    </div>
  );
};

export default PredictPage;