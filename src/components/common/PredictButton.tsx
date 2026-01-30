// src/components/common/PredictButton.tsx
import ScienceIcon from '@mui/icons-material/Science';

const PredictButton = ({ onClick, text}: { onClick?: () => void, text?: string }) => {
  return (
    <button
      onClick={onClick}
      className="
        group relative rounded-md 
        bg-blue-500 px-8 py-3 text-xl font-bold text-white shadow-lg 
        transition-all duration-300 
        hover:bg-blue-600 hover:shadow-blue-500/50 hover:scale-105
        active:scale-95
      "
    >
      <span className="flex items-center gap-2">
        {text || "Predict"}
        <ScienceIcon fontSize="small" className="group-hover:animate-bounce" />
      </span>
    </button>
  );
};

export default PredictButton;