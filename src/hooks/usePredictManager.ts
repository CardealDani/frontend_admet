// src/hooks/usePredictManager.ts
import { useState, useEffect, useRef } from 'react';
import { AdmetService } from '../services/admetService';
import { SAFE_EXAMPLES } from '../mocks/smilesExamples';
import type { Molecule } from '../types/molecules.types';

export type Phase = 'input' | 'loading' | 'results';


export const usePredictManager = () => {
  const [phase, setPhase] = useState<Phase>('input');
  const [activeTab, setActiveTab] = useState<'smiles' | 'file'>('file');
  const [smilesInput, setSmilesInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [exampleCount, setExampleCount] = useState(5);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [predictedMolecules, setPredictedMolecules] = useState<Molecule[]>([]);

  const isProgrammaticBack = useRef(false);

  // Tratamento do SMILES
  const parsedSmilesList = smilesInput.split(/[,\n]+/).map(s => s.trim()).filter(s => s.length > 0);
  const isButtonDisabled = (activeTab === 'smiles' && parsedSmilesList.length === 0) || (activeTab === 'file' && uploadedFile === null);

  // History Trapping
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (isProgrammaticBack.current) {
        isProgrammaticBack.current = false;
        return;
      }
      if (phase === 'results') {
        const newPage = e.state?.page;
        if (newPage === 'results' || newPage === 'detail') return;

        window.history.pushState({ page: 'results' }, '', window.location.pathname);
        setShowWarningModal(true);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [phase]);

  // Ações Principais
  const handlePredict = async () => {
    if (activeTab === 'smiles') {
      const sanitized = smilesInput.replace(/<[^>]*>?/gm, '');
      if (sanitized !== smilesInput) return setErrorMessage("Caracteres inválidos detectados.");
    }
    if (activeTab === 'file' && uploadedFile) {
      if (uploadedFile.size > 5 * 1024 * 1024) return setErrorMessage("Arquivo muito grande. O limite é 5MB.");
      const ext = uploadedFile.name.split('.').pop()?.toLowerCase();
      if (!ext || !['csv', 'sdf', 'txt'].includes(ext)) return setErrorMessage("Formato não suportado.");
    }

    setPhase('loading');
    setErrorMessage(null);

    try {
      let results: Molecule[] = [];

      if (activeTab === 'smiles') {
        results = await AdmetService.predictSmiles(parsedSmilesList);
      } else if (activeTab === 'file' && uploadedFile) {
        results = await AdmetService.predictFile(uploadedFile);
      }
      
      // Guarda os resultados no estado!
      setPredictedMolecules(results);
      
      window.history.pushState({ page: 'results' }, '', window.location.pathname);
      setPhase('results');
    } catch (error) {
      setErrorMessage("Erro ao comunicar com os modelos de predição.");
      setPhase('input');
    }
  };

  const handleConfirmReset = (pendingNavigation: 'reset' | 'home') => {
    setShowWarningModal(false);
    setSmilesInput('');
    setUploadedFile(null);
    isProgrammaticBack.current = true;
    if (pendingNavigation === 'reset') {
      setPhase('input');
      window.history.back();
    }
  };

  const handleDownloadExample = () => {
    const count = Math.min(exampleCount, SAFE_EXAMPLES.length);
    console.log(`Gerando CSV com ${count} exemplos...`);
    const rows = SAFE_EXAMPLES.slice(0, count).map(m => `${m.smiles},${m.name}`);
    const csvContent = ['smiles,name', ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `exemplo_admet_${count}_mols.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return {
    phase, activeTab, setActiveTab, smilesInput, setSmilesInput, uploadedFile, setUploadedFile,
    exampleCount, setExampleCount, showWarningModal, setShowWarningModal, errorMessage, predictedMolecules,
    parsedSmilesList, isButtonDisabled, handlePredict, handleConfirmReset, handleDownloadExample,
    handleLoadSmilesExamples: () => {setSmilesInput(SAFE_EXAMPLES.slice(25, 35).map(m => m.smiles).join(',\n'))},
  };
};