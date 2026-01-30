// import { useState } from "react";

// export function PredictPage() {
//   const [input, setInput] = useState("");
//   const [result, setResult] = useState<any[]>([]);

//   async function handleSubmit() {
//     const smilesArray = input
//       .split("\n")
//       .map(s => s.trim())
//       .filter(Boolean); // tira linhas vazias
//     console.log("Smiles", smilesArray)
//     const res = await fetch("http://localhost:8000/api/smiles/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ smiles: smilesArray }),
//     });

//     const data = await res.json();
//     console.log("Data",data)
//     setResult(data.results);
//   }

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>ADMET Prediction</h1>

//       <textarea
//         style={{ width: "100%", height: 120 }}
//         placeholder="Digite SMILES (um por linha)"
//         value={input}
//         onChange={e => setInput(e.target.value)}
//       />

//       <button onClick={handleSubmit}>
//         Enviar
//       </button>

//       <div style={{ marginTop: 20 }}>
//         <h3>Resultados:</h3>
//         <pre>{JSON.stringify(result)}</pre>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { 
  TextField, Button, Paper, Typography, Chip, Divider, IconButton 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ScienceIcon from '@mui/icons-material/Science';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Importando o filtro que criamos antes
import RangeFilter from '../components/filters/RangeFilter';

const PredictPage = () => {
  // Estado: 'initial' (só busca) ou 'results' (dashboard completo)
  const [viewState, setViewState] = useState<'initial' | 'results'>('initial');
  const [smiles, setSmiles] = useState('');

  const handlePredict = () => {
    if (!smiles) return;
    // Aqui entraria a chamada da API (Loading state, etc)
    setViewState('results');
  };

  const handleReset = () => {
    setViewState('initial');
    setSmiles('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 text-primary font-bold text-xl cursor-pointer" onClick={handleReset}>
          <ScienceIcon />
          <span>ADMET<span className="text-secondary">Lab</span></span>
        </div>
        
        {/* Se estiver nos resultados, mostra a busca compacta no header */}
        {viewState === 'results' && (
           <div className="flex-1 max-w-xl mx-8 flex gap-2">
             <TextField 
               size="small" 
               fullWidth 
               value={smiles} 
               disabled
               className="bg-gray-50"
             />
             <Button variant="outlined" onClick={handleReset} startIcon={<SearchIcon />}>
               Nova
             </Button>
           </div>
        )}
      </header>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="flex-1 flex flex-col relative">
        
        {/* ESTADO INICIAL: BUSCA CENTRALIZADA */}
        {viewState === 'initial' && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 animate-fade-in">
            <div className="max-w-3xl w-full text-center space-y-8">
              <div className="space-y-2">
                <Typography variant="h3" className="font-bold text-gray-800">
                  Predição Farmacocinética
                </Typography>
                <Typography className="text-gray-500 text-lg">
                  Analise propriedades ADMET com inteligência artificial e filtros avançados.
                </Typography>
              </div>

              <Paper elevation={0} className="p-6 border border-gray-200 rounded-2xl shadow-lg bg-white">
                <TextField
                  label="Insira o código SMILES"
                  placeholder="Ex: CC(=O)OC1=CC=CC=C1C(=O)O"
                  fullWidth
                  multiline
                  rows={2}
                  value={smiles}
                  onChange={(e) => setSmiles(e.target.value)}
                  className="mb-4"
                />
                <div className="flex gap-4 justify-end mt-4">
                  <Button startIcon={<UploadFileIcon />} color="inherit">
                    Carregar .CSV
                  </Button>
                  <Button 
                    variant="contained" 
                    size="large" 
                    className="bg-primary px-8"
                    onClick={handlePredict}
                  >
                    Predizer
                  </Button>
                </div>
              </Paper>

              <div className="flex justify-center gap-4 text-sm text-gray-400">
                <span>Exemplos:</span>
                <button className="text-primary hover:underline" onClick={() => setSmiles('CC(=O)OC1=CC=CC=C1C(=O)O')}>Aspirina</button>
                <button className="text-primary hover:underline" onClick={() => setSmiles('CN1C=NC2=C1C(=O)N(C(=O)N2C)C')}>Cafeína</button>
              </div>
            </div>
          </div>
        )}

        {/* ESTADO DE RESULTADOS: DASHBOARD */}
        {viewState === 'results' && (
          <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
            
            {/* SIDEBAR DE FILTROS */}
            <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto p-4 flex flex-col gap-6 shadow-inner z-0">
               <div className="flex justify-between items-center">
                 <Typography variant="h6" className="font-bold">Filtros</Typography>
                 <Typography variant="caption" className="text-gray-400">Personalize a busca</Typography>
               </div>
               
               <RangeFilter 
                 label="Peso Molecular" 
                 min={0} max={1000} value={[150, 500]} unit="Da" 
                 onChange={() => {}} 
               />
               <RangeFilter 
                 label="LogP" 
                 min={-2} max={10} value={[0, 5]} 
                 onChange={() => {}} 
               />
               
               <Divider />
               
               <div className="bg-blue-50 p-4 rounded-lg">
                 <Typography variant="subtitle2" className="text-blue-800 font-bold mb-2">Dica do TCC:</Typography>
                 <Typography variant="body2" className="text-blue-600">
                   Use os filtros para encontrar candidatos "Drug-like" seguindo a regra de Lipinski.
                 </Typography>
               </div>
            </aside>

            {/* ÁREA DE RESULTADOS */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              
              {/* Resumo no Topo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                
                {/* Visualizador Molecular */}
                <Paper className="p-4 h-64 flex flex-col items-center justify-center border border-gray-200 rounded-xl relative">
                  <span className="absolute top-4 left-4 text-xs font-bold text-gray-400 uppercase">Estrutura 2D</span>
                  {/* Aqui virá o <MolViewer /> */}
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Aspirin-skeletal.svg/1200px-Aspirin-skeletal.svg.png" alt="Molecula" className="h-40 opacity-80" />
                </Paper>

                {/* Radar Chart / Score */}
                <Paper className="p-4 h-64 border border-gray-200 rounded-xl flex flex-col">
                   <span className="text-xs font-bold text-gray-400 uppercase mb-4">ADMET Score</span>
                   <div className="flex-1 flex items-center justify-center">
                     <div className="text-center">
                       <Typography variant="h2" className="font-bold text-teal-600">Good</Typography>
                       <Typography variant="body2" className="text-gray-500">Alta probabilidade de absorção</Typography>
                     </div>
                   </div>
                </Paper>

                {/* Propriedades Críticas (Semáforo) */}
                <Paper className="p-4 h-64 border border-gray-200 rounded-xl flex flex-col gap-3 justify-center">
                   <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg border border-green-100">
                      <span className="font-medium text-green-900">Toxicidade (Ames)</span>
                      <Chip label="Negativo" size="small" color="success" />
                   </div>
                   <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg border border-yellow-100">
                      <span className="font-medium text-yellow-900">Solubilidade</span>
                      <Chip label="Moderada" size="small" color="warning" />
                   </div>
                   <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg border border-green-100">
                      <span className="font-medium text-green-900">Absorção Intestinal</span>
                      <Chip label="Alta" size="small" color="success" />
                   </div>
                </Paper>
              </div>

              {/* Tabela Detalhada */}
              <Typography variant="h6" className="font-bold mb-4 text-gray-700">Propriedades Físico-Químicas Completas</Typography>
              <Paper className="h-96 w-full border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 bg-white">
                [DataGrid do MUI com todas as colunas aqui]
              </Paper>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PredictPage;