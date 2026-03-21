// src/components/results/BatchResults.tsx
import ResultsTable from './ResultsTable'; // Sua tabela feita anteriormente

const BatchResults = () => {
  return (
    <div className="animate-fade-in-up h-full w-full bg-white">
      {/* Como é em lote, a tabela ocupa todo o espaço, não precisa de paddings extras aqui */}
      <ResultsTable />
    </div>
  );
};

export default BatchResults;