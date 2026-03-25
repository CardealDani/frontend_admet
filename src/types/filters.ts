// src/types/filters.ts

export interface PhysioChemicalFilters {
  mw: [number, number];       // Peso Molecular (ex: 0 a 1000 Da)
  tpsa: [number, number];     // TPSA (ex: 0 a 200 Å²)
  logp: [number, number];     // LogP (ex: -5 a 10)
}

type SliderConfig = {
  label: string;
  field: 'mw' | 'logp' | 'tpsa'; // Isso garante que você não digite o nome do campo errado
  min: number;
  max: number;
  step?: number; // O sinal de interrogação (?) diz que é opcional
  unit?: string; // Opcional
};

export const PFQ_FILTERS_CONFIG: SliderConfig[] = [
  { label: 'Peso Molecular', field: 'mw', unit: 'g/mol', min: 0, max: 1000 },
  { label: 'LogP (Lipofilia)', field: 'logp', step: 0.1, min: -5, max: 10 },
  { label: 'TPSA', field: 'tpsa', unit: 'Å²', min: 0, max: 200 }
] as const;

export interface MedChemFilters {
  lipinski: boolean;          // true = Apenas os que passam na Regra dos 5
  pfizer: boolean;            // true = Apenas os que passam na regra da Pfizer (3/75)
  qed: [number, number];      // Quantitative Estimate of Druglikeness (ex: 0.0 a 1.0)
}

export interface AbsorptionFilters {
  absorptionPercent: [number, number]; // Percentual de absorção (ex: 0 a 100%)
  caco2: string[];                     // Endpoints: ['Alta', 'Média', 'Baixa']
  pgpInhibitor: string[];              // Endpoints: ['Sim', 'Não']
}

export interface DistributionFilters {
  bbb: string[];              // Blood-Brain Barrier (ex: ['Alta', 'Média', 'Baixa'])
  ppb: [number, number];      // Plasma Protein Binding (ex: 0 a 100%)
  fu: [number, number];       // Fraction unbound (ex: 0.0 a 1.0)
}

export interface MetabolismFilters {
  cyp2d6Substrate: string[];  // ['Sim', 'Não']
  cyp1a2Substrate: string[];  // ['Sim', 'Não']
  cyp3a4Substrate: string[];  // ['Sim', 'Não']
}

export interface ExcretionFilters {
  clPlasma: [number, number]; // Clearance plasmático
  tHalf: [number, number];    // Tempo de meia-vida (T1/2) em horas
}

export interface ToxicityFilters {
  ames: string[];             // ['Negativo', 'Positivo']
  hepato: string[];           // Human Hepatotoxicity: ['Seguro', 'Atenção', 'Tóxico']
  herg: string[];             // hERG Blockers: ['Baixo', 'Médio', 'Alto']
}

// O TIPO MESTRE (Agrupa todos os 7)
export interface AdmetFilters {
  pfq: PhysioChemicalFilters;
  medchem: MedChemFilters;
  absorption: AbsorptionFilters;
  distribution: DistributionFilters;
  metabolism: MetabolismFilters;
  excretion: ExcretionFilters;
  toxicity: ToxicityFilters;
}

export const defaultFilters: AdmetFilters = {
  pfq: {
    mw: [0, 1000],
    tpsa: [0, 200],
    logp: [-5, 10],
  },
  medchem: {
    lipinski: false, // false = não está filtrando obrigatoriamente
    pfizer: false,
    qed: [0, 1],
  },
  absorption: {
    absorptionPercent: [0, 100],
    caco2: ['Alta', 'Média', 'Baixa'], 
    pgpInhibitor: ['Sim', 'Não'],
  },
  distribution: {
    bbb: ['Alta', 'Média', 'Baixa'],
    ppb: [0, 100],
    fu: [0, 100],
  },
  metabolism: {
    cyp2d6Substrate: ['Sim', 'Não'],
    cyp1a2Substrate: ['Sim', 'Não'],
    cyp3a4Substrate: ['Sim', 'Não'],
  },
  excretion: {
    clPlasma: [0, 100], // Ajuste a escala conforme a sua base de dados real
    tHalf: [0, 48],     // Ex: 0 a 48 horas
  },
  toxicity: {
    ames: ['Negativo', 'Positivo'],
    hepato: ['Seguro', 'Atenção', 'Tóxico'],
    herg: ['Baixo', 'Médio', 'Alto'],
  }
};

export const filterPresets: Record<string, AdmetFilters> = {
  'default': defaultFilters,
  
  'lipinski_strict': {
    ...defaultFilters,
    medchem: {
      ...defaultFilters.medchem,
      lipinski: true,
    },
    pfq: {
      ...defaultFilters.pfq,
      mw: [0, 500],
      logp: [-5, 5],
    }
  },

  'high_safety_lead': {
    ...defaultFilters,
    toxicity: {
      ames: ['Negativo'],
      hepato: ['Seguro'],
      herg: ['Baixo'],
    },
    absorption: {
      ...defaultFilters.absorption,
      caco2: ['Alta'], // Exige boa permeabilidade
    }
  }
};