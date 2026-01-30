// src/routes/AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';       // Crie um arquivo index.tsx ou Home.tsx dentro da pasta
import PredictPage from '../pages/PredictPage';
import HomePage from '../pages/HomePage';
// import Dashboard from '../pages/Dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/analysis" element={<PredictPage />} />
    </Routes>
  );
};

export default AppRoutes;