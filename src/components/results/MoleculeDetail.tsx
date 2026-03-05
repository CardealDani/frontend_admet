// src/components/results/MoleculeDetail.tsx
import { Typography, Divider, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ScienceIcon from '@mui/icons-material/Science';

// Mock dos dados de uma única molécula (ex: Aspirina)
const moleculeData = {
  name: 'Aspirina (Ácido Acetilsalicílico)',
  smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
  formula: 'C9H8O4',
  properties: {
    mw: { value: 180.16, unit: 'g/mol', optimal: true },
    logp: { value: 1.19, unit: '', optimal: true },
    tpsa: { value: 65.12, unit: 'Å²', optimal: true },
    hbd: { value: 1, unit: 'doadores', optimal: true }, // Hydrogen Bond Donors
    hba: { value: 4, unit: 'aceptores', optimal: true }, // Hydrogen Bond Acceptors
  },
  toxicity: {
    ames: { status: 'Negativo', risk: 'low', desc: 'Não apresenta risco mutagênico.' },
    herg: { status: 'Baixo Risco', risk: 'low', desc: 'Baixa inibição dos canais de potássio.' },
    hepatotoxicity: { status: 'Alerta Moderado', risk: 'medium', desc: 'Possível dano hepático em altas doses.' }
  }
};

// Componente auxiliar para os Cards de Propriedade Físico-Química
const PropertyCard = ({ title, value, unit, optimal }: any) => (
  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-2">
      <Typography className="font-inter text-xs text-gray-500 font-bold uppercase">{title}</Typography>
      {optimal ? (
        <CheckCircleOutlineIcon fontSize="inherit" className="text-green-500" />
      ) : (
        <WarningAmberIcon fontSize="inherit" className="text-red-500" />
      )}
    </div>
    <div className="flex items-baseline gap-1">
      <Typography className={`font-nunito_sans font-extrabold text-2xl ${optimal ? 'text-gray-900' : 'text-red-600'}`}>
        {value}
      </Typography>
      <Typography className="font-inter text-xs text-gray-500">{unit}</Typography>
    </div>
  </div>
);

const MoleculeDetail = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 animate-fade-in-up">
      
      {/* COLUNA ESQUERDA: Visualizações (Imagens e Gráficos) */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        
        {/* Placeholder: Estrutura 2D */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[250px] relative group overflow-hidden">
          <Typography className="absolute top-4 left-4 font-inter text-xs font-bold text-gray-400 uppercase">
            Estrutura 2D
          </Typography>
          {/* No futuro, aqui entra o componente do RDKit (ex: SmilesDrawer) */}
          <div className="text-gray-300 group-hover:scale-110 transition-transform duration-500">
             <ScienceIcon sx={{ fontSize: 100 }} />
          </div>
          <Typography className="font-inter text-sm text-gray-400 mt-4">
            Visualização Molecular
          </Typography>
        </div>

        {/* Placeholder: Gráfico de Radar (Drug-likeness) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[250px] relative">
           <Typography className="absolute top-4 left-4 font-inter text-xs font-bold text-gray-400 uppercase">
            Drug-Likeness (Radar)
          </Typography>
          <div className="w-32 h-32 rounded-full border-4 border-dashed border-blue-200 flex items-center justify-center">
            <Typography className="font-nunito_sans font-bold text-blue-400 text-sm text-center px-2">
              [Gráfico Radar RDKit]
            </Typography>
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA: Dados e Alertas */}
      <div className="w-full lg:w-2/3 flex flex-col">
        
        {/* Cabeçalho da Molécula */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Typography variant="h4" className="font-nunito_sans font-extrabold text-gray-900">
              {moleculeData.name}
            </Typography>
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded">
              {moleculeData.formula}
            </span>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-fit">
            <Typography className="font-mono text-sm text-gray-700">
              {moleculeData.smiles}
            </Typography>
            <Tooltip title="Copiar SMILES">
              <IconButton size="small" onClick={() => navigator.clipboard.writeText(moleculeData.smiles)}>
                <ContentCopyIcon fontSize="small" className="text-gray-400 hover:text-blue-600" />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <Divider className="mb-6" />

        {/* Seção 1: Propriedades Físico-Químicas (Regras de Lipinski) */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Typography variant="h6" className="font-nunito_sans font-bold text-gray-800">
              Propriedades Físico-Químicas
            </Typography>
            <Tooltip title="Valores baseados na Regra dos 5 de Lipinski para biodisponibilidade oral.">
              <InfoOutlinedIcon fontSize="small" className="text-gray-400 cursor-help" />
            </Tooltip>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PropertyCard title="Peso Molecular" value={moleculeData.properties.mw.value} unit={moleculeData.properties.mw.unit} optimal={moleculeData.properties.mw.optimal} />
            <PropertyCard title="LogP" value={moleculeData.properties.logp.value} unit={moleculeData.properties.logp.unit} optimal={moleculeData.properties.logp.optimal} />
            <PropertyCard title="Doadores de H" value={moleculeData.properties.hbd.value} unit={moleculeData.properties.hbd.unit} optimal={moleculeData.properties.hbd.optimal} />
            <PropertyCard title="Aceptores de H" value={moleculeData.properties.hba.value} unit={moleculeData.properties.hba.unit} optimal={moleculeData.properties.hba.optimal} />
          </div>
        </div>

        {/* Seção 2: Alertas de Segurança e Toxicidade */}
        <div>
           <Typography variant="h6" className="font-nunito_sans font-bold text-gray-800 mb-4">
              Perfil de Segurança e Toxicidade
            </Typography>
            
            <div className="flex flex-col gap-3">
              {/* Alerta Ames (Seguro) */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-green-200 bg-green-50/50">
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <CheckCircleOutlineIcon />
                </div>
                <div>
                  <Typography className="font-nunito_sans font-bold text-gray-900">
                    Mutagenicidade (Teste de Ames): {moleculeData.toxicity.ames.status}
                  </Typography>
                  <Typography className="font-inter text-sm text-gray-600 mt-1">
                    {moleculeData.toxicity.ames.desc}
                  </Typography>
                </div>
              </div>

              {/* Alerta Hepatotoxicidade (Atenção) */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-yellow-200 bg-yellow-50/50">
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                  <WarningAmberIcon />
                </div>
                <div>
                  <Typography className="font-nunito_sans font-bold text-gray-900">
                    Hepatotoxicidade: {moleculeData.toxicity.hepatotoxicity.status}
                  </Typography>
                  <Typography className="font-inter text-sm text-gray-600 mt-1">
                    {moleculeData.toxicity.hepatotoxicity.desc}
                  </Typography>
                </div>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default MoleculeDetail;