// src/services/admet.service.ts
import { MOCK_MOLECULES } from '../mocks/molecules.mock';
import type { Molecule } from '../types/molecules.types';

// Helper para simular atraso da rede/processamento
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const CACHE_KEY = 'admet_predictions_cache';
type PredictionCache = Record<string, Molecule>;

// Helper para ler arquivos no navegador (HTML5 FileReader API)
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const AdmetService = {
  
  async predictSmiles(smilesList: string[]): Promise<Molecule[]> {
    console.log('Iniciando predição para:', smilesList);
    
    const cache: PredictionCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const results: Molecule[] = [];
    let needsProcessing = false;

    for (const smiles of smilesList) {
      const cleanSmiles = smiles.trim();
      if (!cleanSmiles) continue;

      // 1. Se o SMILES for exatamente igual a um dos nossos Mocks de Ouro (ex: Paracetamol), retorna o Mock Perfeito
      const goldenMock = MOCK_MOLECULES.find(m => m.smiles === cleanSmiles);
      if (goldenMock) {
        results.push(goldenMock);
        continue;
      }

      // 2. Se já estiver no cache temporário
      if (cache[cleanSmiles]) {
        results.push(cache[cleanSmiles]);
      } else {
        // 3. Se for um SMILES novo, geramos um Mock determinístico baseado na string
        needsProcessing = true;
        
        // Criamos um hash simples do SMILES para escolher sempre o mesmo "molde" do MOCK_MOLECULES
        let hash = 0;
        for (let i = 0; i < cleanSmiles.length; i++) {
          hash = cleanSmiles.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % MOCK_MOLECULES.length;
        const baseMock = MOCK_MOLECULES[index];
        
        const newMol: Molecule = {
          ...baseMock,
          id: `MOL-${Math.abs(hash).toString().substring(0, 4)}`,
          name: `Composto ${cleanSmiles.substring(0, 5)}...`,
          smiles: cleanSmiles,
          // Renderiza a imagem real deste novo SMILES
          imgUrl: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(cleanSmiles)}/PNG?record_type=2d&image_size=large`,
        };
        
        results.push(newMol);
        cache[cleanSmiles] = newMol; 
      }
    }

    if (needsProcessing) {
      await delay(1200); // Delay maior para simular a IA a processar
      console.log("Predição concluída. Atualizando cache...");
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); 
    } else {
      await delay(300); // Quase instantâneo se estiver tudo em cache/ouro
    }

    return results;
  },

  async predictFile(file: File): Promise<Molecule[]> {
    console.log('Processando arquivo em lote:', file.name);
    
    try {
      // 1. Lemos o arquivo CSV como texto puro
      const text = await readFileAsText(file);
      
      // 2. Dividimos em linhas e removemos espaços/vazios
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length === 0) throw new Error("Arquivo vazio");

      // 3. Verificamos se a primeira linha é o cabeçalho ("smiles,name")
      let startIndex = 0;
      if (lines[0].toLowerCase().includes('smiles')) {
        startIndex = 1;
      }

      // 4. Extraímos apenas a coluna do SMILES (assumindo que é a primeira coluna separada por vírgula)
      const extractedSmiles: string[] = [];
      for (let i = startIndex; i < lines.length; i++) {
        const columns = lines[i].split(',');
        if (columns[0]) {
          extractedSmiles.push(columns[0].trim());
        }
      }

      // 5. Mágica: Passamos os SMILES do arquivo para a mesma função que processa a caixa de texto!
      return this.predictSmiles(extractedSmiles);

    } catch (error) {
      console.error("Erro ao fazer o parse do CSV:", error);
      // Fallback de segurança: Se o arquivo estiver mal formatado, retorna as 50 moléculas padrão
      await delay(800);
      return MOCK_MOLECULES;
    }
  }
};