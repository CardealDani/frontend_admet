// src/types/filters.ts

// 1. O TIPO GENÉRICO MÁGICO
// Ele encapsula qualquer valor (seja array, numero, string) adicionando o estado 'active'
export type ToggleableFilter<T> = {
  value: T;
  active: boolean;
};

// 2. AS INTERFACES ATUALIZADAS
export interface PhysioChemicalFilters {
  mw: ToggleableFilter<[number, number]>;     // Peso Molecular
  tpsa: ToggleableFilter<[number, number]>;   // TPSA
  logp: ToggleableFilter<[number, number]>;   // LogP
}

export type SliderConfig = {
  label: string;
  field: keyof PhysioChemicalFilters; // Garante que o campo exista na interface!
  min: number;
  max: number;
  step?: number; 
  unit?: string; 
};

export const PFQ_FILTERS_CONFIG: SliderConfig[] = [
  { label: 'Peso Molecular', field: 'mw', unit: 'g/mol', min: 0, max: 1000 },
  { label: 'LogP (Lipofilia)', field: 'logp', step: 0.1, min: -5, max: 10 },
  { label: 'TPSA', field: 'tpsa', unit: 'Å²', min: 0, max: 200 }
] as const;

export interface MedChemFilters {
  lipinski: boolean;          // Booleans já são chaves liga/desliga por natureza
  pfizer: boolean;            
  qed: ToggleableFilter<[number, number]>; // QED é um slider, então usa o Toggleable
}

export interface AbsorptionFilters {
  absorptionPercent: ToggleableFilter<[number, number]>; 
  caco2: string[];                    // Mantemos como array simples para os botões segmentados
  pgpInhibitor: string[];             
}

export interface DistributionFilters {
  bbb: string[];              
  ppb: ToggleableFilter<[number, number]>;      
  fu: ToggleableFilter<[number, number]>;       
}

export interface MetabolismFilters {
  cyp2d6Substrate: string[];  
  cyp1a2Substrate: string[];  
  cyp3a4Substrate: string[];  
}

export interface ExcretionFilters {
  clPlasma: ToggleableFilter<[number, number]>; 
  tHalf: ToggleableFilter<[number, number]>;    
}

export interface ToxicityFilters {
  ames: string[];             
  hepato: string[];           
  herg: string[];             
}

// O TIPO MESTRE
export interface AdmetFilters {
  pfq: PhysioChemicalFilters;
  medchem: MedChemFilters;
  absorption: AbsorptionFilters;
  distribution: DistributionFilters;
  metabolism: MetabolismFilters;
  excretion: ExcretionFilters;
  toxicity: ToxicityFilters;
}

// 3. O ESTADO DEFAULT (Tudo Desligado Limpo!)
export const defaultFilters: AdmetFilters = {
  pfq: {
    mw: { value: [0, 1000], active: false },
    tpsa: { value: [0, 200], active: false },
    logp: { value: [-5, 10], active: false },
  },
  medchem: {
    lipinski: false,
    pfizer: false,
    qed: { value: [0, 1], active: false },
  },
  absorption: {
    absorptionPercent: { value: [0, 100], active: false },
    caco2: ['', ''], 
    pgpInhibitor: ['', '', ''],
  },
  distribution: {
    bbb: ['', '', ''],
    ppb: { value: [0, 100], active: false },
    fu: { value: [0, 100], active: false },
  },
  metabolism: {
    cyp2d6Substrate: ['', ''],
    cyp1a2Substrate: ['',''],
    cyp3a4Substrate: ['',''],
  },
  excretion: {
    clPlasma: { value: [0, 150], active: false }, 
    tHalf: { value: [0, 48], active: false },    
  },
 toxicity: {
    ames: ['','',''],
    hepato: ['','',''],
    herg: ['','',''],
  }
};

// 4. PRESETS (Ligando as chaves automaticamente)
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
      // No preset, nós ativamos a chave e setamos o valor!
      mw: { value: [0, 500], active: true },
      logp: { value: [-5, 5], active: true },
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
      caco2: ['Alta'], 
    }
  }
};