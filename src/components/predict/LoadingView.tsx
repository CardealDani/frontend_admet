// src/components/predict/LoadingView.tsx
import { CircularProgress, Typography } from '@mui/material';

export const LoadingView = () => (
  <div className="flex-grow flex flex-col items-center justify-center animate-fade-in-up w-full h-full">
    <CircularProgress size={60} thickness={4} className="text-blue-600 mb-6" />
    <Typography variant="h5" className="font-nunito_sans font-bold text-gray-800 mb-2">
      Processando Estruturas...
    </Typography>
    <Typography className="font-inter text-gray-500 max-w-md text-center">
      Nossos modelos de Machine Learning estão calculando propriedades ADMET.
    </Typography>
  </div>
);