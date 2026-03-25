// src/components/results/filters/filterStyles.ts
export const premiumSliderStyles = {
  color: '#3b82f6', 
  height: 4, // <-- Reduzido para ficar mais slim
  padding: '13px 0',
  '& .MuiSlider-thumb': {
    height: 16, // <-- Bolinha menor
    width: 16,  // <-- Bolinha menor
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover, &.Mui-focusVisible, &.Mui-active': {
      boxShadow: '0 0 0 8px rgba(59, 130, 246, 0.16)', 
    },
  },
  '& .MuiSlider-track': { height: 4, borderRadius: 10 }, // <-- Barra menor
  '& .MuiSlider-rail': { color: '#e2e8f0', opacity: 1, height: 4, borderRadius: 2 }, // <-- Barra menor
};