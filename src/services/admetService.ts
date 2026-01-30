// // src/services/admetService.ts
// import api from '../api/api';
// import { AdmetPrediction } from '../types/AdmetTypes';

// export const predictAdmet = async (smiles: string): Promise<AdmetPrediction> => {
//   const response = await api.post<AdmetPrediction>('/predict/', { smiles });
//   return response.data;
// };