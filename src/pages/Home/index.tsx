import React, { useState } from 'react';
import { Button, TextField, Paper, Typography } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [smiles, setSmiles] = useState('');

  const handleAnalyze = () => {
    // Lógica futura de envio
    console.log("Analyzing:", smiles);
    navigate('/analysis');
  };

  return (
    // Usando Tailwind para layout (flex, h-screen, bg-gray)
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      {/* Componente Paper do MUI estilizado com classes do Tailwind */}
      <Paper elevation={3} className="max-w-2xl w-full p-8 rounded-xl shadow-lg">
        
        <div className="text-center mb-8">
            <div className="flex justify-center mb-4 text-primary">
                <ScienceIcon style={{ fontSize: 60 }} />
            </div>
            <Typography variant="h4" className="font-bold text-gray-800 mb-2">
                ADMET Predictor
            </Typography>
            <p className="text-gray-500">
                Insira o código SMILES da molécula para prever propriedades farmacocinéticas e de toxicidade.
            </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* TextField do MUI (Funcionalidade complexa pronta) */}
          <TextField 
            label="SMILES String" 
            variant="outlined" 
            fullWidth 
            placeholder="Ex: CC(=O)OC1=CC=CC=C1C(=O)O"
            value={smiles}
            onChange={(e) => setSmiles(e.target.value)}
            // Tailwind para ajustes finos se necessário
            className="bg-white"
          />

          {/* Botão do MUI com largura total via Tailwind */}
          <Button 
            variant="contained" 
            size="large"
            onClick={handleAnalyze}
            className="w-full h-12 bg-primary hover:bg-teal-800" // Tailwind controlando cor e tamanho
            startIcon={<ScienceIcon />}
          >
            Iniciar Análise
          </Button>
        </div>

      </Paper>
    </div>
  );
};

export default Home;