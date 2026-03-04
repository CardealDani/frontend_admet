// src/components/common/PredictButton.tsx
import ScienceIcon from '@mui/icons-material/Science';
import { Button } from '@mui/material';

const PredictButton = ({ onClick, text }: { onClick?: () => void, text?: string }) => {
  return (
    <>
      <Button
        onClick={onClick}
        variant="contained"
        size="large"
        className="w-fit rounded-full bg-blue-600 px-7 py-2 text-lg font-bold normal-case text-white shadow-lg flex items-center gap-2 font-nunito_sans transition-all duration-300 hover:bg-blue-700 hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
      >
        {text || "Predict"}
        <ScienceIcon fontSize="small" className="group-hover:animate-bounce" />

      </Button>
    </>
  );
};

export default PredictButton;