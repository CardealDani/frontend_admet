// src/components/results/filters/FilterButtonGroup.tsx

import { Typography } from '@mui/material';

// Limitamos as cores a um padrão semântico para manter a consistência em todo o sistema
export type FilterButtonColor = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface FilterOption {
    id: string;                 // O valor real que vai pro filtro (ex: 'Alta')
    label?: string;             // Opcional: O que aparece na tela (se omitido, usa o id)
    subtitle?: string;          // Opcional: O textinho de baixo (ex: '(> 0.7)')
    color: FilterButtonColor;   // Define a paleta de cores quando ativo
    icon?: React.ElementType;   // Opcional: O ícone do Material UI
}

interface FilterButtonGroupProps {
    title: string;
    options: FilterOption[];
    activeValues: string[];
    onToggle: (id: string) => void;
}

// 1. Estilos quando o botão está LIGADO (Forte e nítido)
const activeStyles: Record<FilterButtonColor, string> = {
    success: 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500',
    warning: 'border-amber-500 bg-amber-50 text-amber-700 ring-1 ring-amber-500',
    error: 'border-rose-500  bg-rose-50   text-rose-700   ring-1 ring-rose-500',
    info: 'border-blue-500  bg-blue-50   text-blue-700   ring-1 ring-blue-500',
    neutral: 'border-slate-500 bg-slate-100 text-slate-800  ring-1 ring-slate-500',
};

// 2. Estilos quando o botão está DESLIGADO, mas o mouse passa por cima (Hover Hinting)
const hoverStyles: Record<FilterButtonColor, string> = {
    success: 'hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-600',
    warning: 'hover:border-amber-300 hover:bg-amber-50/50 hover:text-amber-600',
    error: 'hover:border-rose-300 hover:bg-rose-50/50 hover:text-rose-600',
    info: 'hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600',
    neutral: 'hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700',
};

export const FilterButtonGroup = ({ title, options, activeValues, onToggle }: FilterButtonGroupProps) => {
    return (
        <div>
            <Typography className="font-inter text-xs font-semibold text-gray-700 mb-2">
                {title}
            </Typography>

            <div className="flex w-full gap-2">
                {options.map((opt) => {
                    const isActive = activeValues.includes(opt.id);
                    const Icon = opt.icon;

                    // Se estiver ativo, aplica as cores fortes. 
                    // Se estiver inativo, aplica a base cinza + o hover "colorido" sutil.
                    const buttonClass = isActive
                        ? activeStyles[opt.color]
                        : `border-gray-200 text-gray-500 bg-white ${hoverStyles[opt.color]}`;

                    return (
                        <div
                            key={opt.id}
                            onClick={() => onToggle(opt.id)}
                            // Colocamos a classe "group" aqui para que o subtítulo saiba quando o mouse está sobre o botão
                            className={`group flex-1 flex flex-col items-center justify-center py-2 px-1 text-center rounded-xl border transition-all duration-300 cursor-pointer select-none shadow-sm ${buttonClass} ${opt.subtitle ? '' : 'py-3'}`}
                        >
                            {/* LINHA 1: Ícone + Título */}
                            <div className="flex items-center justify-center gap-1.5">
                                {isActive && Icon && <Icon sx={{ fontSize: 16 }} className="animate-fade-in" />}
                                <span className="text-xs font-bold leading-none">
                                    {opt.label || opt.id}
                                </span>
                            </div>

                            {/* LINHA 2: Subtítulo Técnico (Se existir) */}
                            {opt.subtitle && (
                                <span className={`text-[10px] mt-1 font-medium transition-colors duration-300 ${isActive
                                    ? 'opacity-80' // Quando ativo, herda a cor forte e fica um pouco transparente
                                    : 'text-gray-400 group-hover:text-current group-hover:opacity-70' // Quando inativo/hover, pega a cor do hover do pai!
                                    }`}>
                                    {opt.subtitle}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};