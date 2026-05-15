// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage          from '../pages/HomePage';
import PredictPage       from '../pages/PredictPage';

const AppRoutes = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <Routes>
      <Route path="/"                          element={<HomePage />} />
      <Route path="/analysis"                  element={<PredictPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;