// src/components/Header/AppHeader.tsx
import React from 'react';
import { SlChemistry } from "react-icons/sl";
import { Button, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useNavigate } from 'react-router-dom';

interface AppHeaderProps {
    onNewAnalysis?: () => void;
}

const AppHeader = ({ onNewAnalysis }: AppHeaderProps) => {
    const navigate = useNavigate();

    return (
        // Header branco limpo, com borda sutil e sombra leve (Padrão SaaS Moderno)
        <header className="fixed top-0 left-0 w-full h-16 bg-white z-50 border-b border-gray-100 flex items-center justify-between px-6 shadow-sm overflow-hidden">
            
            {/* LADO ESQUERDO: LOGO (Contexto da Marca) */}
            <div 
                className="flex items-center gap-2.5 cursor-pointer group shrink-0" 
                onClick={() => navigate('/')}
            >
                <SlChemistry className="text-2xl text-blue-600 transition-transform group-hover:rotate-12" />
                <span className="font-nunito_sans font-extrabold text-[19px] text-gray-950 tracking-tight">
                    ADMET <span className="text-blue-600">Predictor</span>
                </span>
            </div>

            {/* CENTRO: BARRA DE BUSCA (Inspirada na imagem de referência) */}
            {/* Vital para UX quando o pesquisador está analisando centenas de moléculas */}
            <div className="flex-1 max-w-lg px-8">
                <div className="relative w-full">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" sx={{ fontSize: 18 }} />
                    <input 
                        type="search" 
                        placeholder="Buscar moléculas no lote (Nome, ID ou SMILES)..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm font-inter text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:bg-white transition-all outline-none"
                    />
                </div>
            </div>

            {/* LADO DIREITO: AÇÕES GLOBAIS (Sempre visíveis) */}
            <div className="flex items-center gap-3 shrink-0">
                
                {/* BOTÃO NOTIFICAÇÃO (Visual, sem lógica por enquanto) */}
                <Tooltip title="Notificações">
                    <IconButton size="small" className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <NotificationsNoneIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                {/* DIVISOR VISUAL */}
                <div className="w-px h-6 bg-gray-200 mx-1"></div>

                {/* BOTÃO PRINCIPAL: NOVA PREDIÇÃO (O "Call to Action" Global) */}
                {/* Usei variante 'contained' (azul cheio) porque é a ação principal da tela agora */}
                {onNewAnalysis && (
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={onNewAnalysis}
                        className="font-nunito_sans font-extrabold normal-case text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-none hover:shadow-md rounded-lg px-4 py-1.5 text-[13px]"
                    >
                        Nova Predição
                    </Button>
                )}
            </div>
        </header>
    );
};

export default AppHeader;