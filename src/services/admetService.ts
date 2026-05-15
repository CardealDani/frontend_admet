// src/services/admet.service.ts
import { MOCK_MOLECULES } from '../mocks/molecules.mock';
import type { Molecule } from '../types/molecules.types';

// Helper para simular atraso
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const CACHE_KEY = 'admet_predictions_cache';

// Interface para o nosso "Banco de Dados" local
type PredictionCache = Record<string, Molecule>;

export const AdmetService = {
  
  async predictSmiles(smilesList: string[]): Promise<Molecule[]> {
    console.log('Iniciando predição para:', smilesList);
    
    // 1. Carrega o banco de dados (cache) do LocalStorage
    const cache: PredictionCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const results: Molecule[] = [];
    let needsProcessing = false;

    // 2. Verifica molécula por molécula
    for (const smiles of smilesList) {
      const cleanSmiles = smiles.trim();
      if (!cleanSmiles) continue;

      if (cache[cleanSmiles]) {
        // Já existe no cache! Pega instantaneamente.
        console.log(`[Cache Hit] Molécula recuperada: ${cleanSmiles}`);
        results.push(cache[cleanSmiles]);
      } else {
        // Não existe. Vai precisar "rodar o modelo de ML".
        console.log(`[Cache Miss] Processando nova predição: ${cleanSmiles}`);
        needsProcessing = true;
        
        // MOCK INTELIGENTE: Pega propriedades reais de uma molécula aleatória do mock,
        // mas injeta o SMILES, um Nome e um ID baseados no input do utilizador.
        const randomMock = MOCK_MOLECULES[Math.floor(Math.random() * MOCK_MOLECULES.length)];
        const newMol: Molecule = {
          ...randomMock,
          id: `MOL-${Math.floor(Math.random() * 10000)}`,
          name: `Composto ${cleanSmiles.substring(0, 5)}...`,
          smiles: cleanSmiles,
        };
        
        results.push(newMol);
        cache[cleanSmiles] = newMol; // Salva no banco de dados temporário
      }
    }

    // 3. Aplica o delay dependendo de onde vieram os dados
    if (needsProcessing) {
      await delay(300); // Demora 2.5s simulando o backend/ML
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); // Salva o novo cache
    } else {
      await delay(300); // Se estava tudo no cache, é quase instantâneo!
    }

    /* LÓGICA FUTURA PARA A API REAL:
    const response = await axios.post('http://localhost:8000/api/predict', { smiles: smilesList });
    // Adicionar lógica de salvar o response.data no localStorage aqui
    return response.data;
    */

    return results;
  },

  async predictFile(file: File): Promise<Molecule[]> {
    console.log('Processando arquivo em lote:', file.name);
    
    // Processamento em lote demora mais
    await delay(300);

    // Como é um mock de arquivo, retornamos o banco de dados inteiro do mock
    return MOCK_MOLECULES;
  }
};