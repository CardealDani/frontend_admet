// src/components/Header/AppHeader.tsx

import { SlChemistry } from "react-icons/sl";
import { Button, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
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

            {/* LADO ESQUERDO: Rota de Fuga (Nova Predição / Voltar) */}
            {/* Usamos flex-1 para garantir que o centro fique perfeitamente alinhado */}
            <div className="flex justify-start">
                {onNewAnalysis && (
                    <Button
                        variant="text"
                        size="small"
                        startIcon={<ArrowBackIosIcon sx={{ fontSize: 12, mb: '1px' }} />}
                        onClick={onNewAnalysis}
                        className="font-inter font-semibold normal-case text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg px-3 py-1.5 text-[13px]"
                    >
                        Nova Predição
                    </Button>
                )}
            </div>

            {/* CENTRO: LOGO (Focado) */}
            <div
                className="flex-1 flex items-center justify-center gap-2.5 cursor-pointer group shrink-0"
                onClick={() => navigate('/')}
            >
                <div className="bg-blue-50/50 p-1.5 rounded-lg">
                    <SlChemistry className="text-xl text-blue-600 transition-transform group-hover:rotate-12" />
                </div>
                <span className="font-nunito_sans font-extrabold text-[19px] text-gray-950 tracking-tight">
                    ADMET <span className="text-blue-600">Predictor</span>
                </span>
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