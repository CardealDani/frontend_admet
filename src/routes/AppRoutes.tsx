// src/routes/AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';       // Crie um arquivo index.tsx ou Home.tsx dentro da pasta
import PredictPage from '../pages/PredictPage';
// import Dashboard from '../pages/Dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/analysis" element={<PredictPage />} />
    </Routes>
  );
};

export default AppRoutes;