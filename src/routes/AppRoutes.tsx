// src/routes/AppRoutes.tsx
import {BrowserRouter, Routes, Route } from 'react-router-dom';       // Crie um arquivo index.tsx ou Home.tsx dentro da pasta
import PredictPage from '../pages/PredictPage';
import HomePage from '../pages/HomePage';
// import Dashboard from '../pages/Dashboard';

const AppRoutes = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/analysis" element={<PredictPage />} />
    </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;