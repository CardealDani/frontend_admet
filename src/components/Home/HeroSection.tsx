// src/pages/Home/HeroSection.tsx
import { Button, Typography } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <div className="relative w-full min-h-[90vh] bg-white overflow-hidden flex flex-col items-center justify-center text-center">

            <div className="absolute inset-0 flex items-center justify-center opacity-70 pointer-events-none">
                <div className="absolute w-[600px] h-[600px] border border-blue-200 rounded-full" />
                <div className="absolute w-[900px] h-[900px] border border-blue-100 rounded-full" />
                <div className="absolute w-[1200px] h-[1200px] border border-gray-100 rounded-full" />
                <div className="absolute w-[1500px] h-[1500px] border border-gray-50 rounded-full" />
            </div>

            <div className="relative z-10 max-w-4xl px-4 animate-fade-in-up space-y-10">
                <div>
                    <Typography variant="h2" className="font-nunito_sans text-gray-900 mb-4 leading-tight">
                        Sua Solução Completa para <br /> Análise e 
                        <span className="font-medium text-blue-600"> Predição ADMET</span>
                    </Typography>

                    <Typography className="text-gray-500 mb-8 max-w-2xl mx-auto font-normal font-inter">
                        Simplifique a descoberta de medicamentos com nossa ferramenta.<br/>
                        Filtros personalizáveis, visualização 3D e relatórios instantâneos.
                    </Typography>
                </div>

                <div className="flex gap-4 justify-center">
                    <Button
                        variant="contained"
                        size="large"
                        className="w-fit rounded-full bg-blue-600 px-6 py-2 text-lg font-medium normal-case text-white shadow-lg flex items-center gap-2 font-nunito_sans transition-all duration-300 hover:bg-blue-700 hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
                        onClick={() => navigate('/analysis')}
                    >
                        Iniciar Análise Gratuita
                    </Button>
                </div>
            </div>

            {/* === 3. ELEMENTOS FLUTUANTES (Decorativos) === */}

            <div className="absolute left-[5%] top-[20%] hidden lg:flex flex-col items-center animate-float-slow opacity-70">
                {/* Linha pontilhada conectora */}
                <svg className="absolute -right-20 top-5 w-24 h-24 text-blue-200" style={{ transform: 'rotate(-20deg)' }}>
                    <path d="M0,50 Q50,0 100,50" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                </svg>

                <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100 w-full">
                    <div className="flex items-center gap-2 mb-2 border-b border-gray-50 pb-2">
                        <ScienceIcon className="text-blue-500" fontSize="small" />
                        <span className="text-xs font-bold text-gray-700">Structure</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                </div>
            </div>

            <div className="absolute left-[20%] top-[70%] hidden lg:flex flex-col items-center animate-float-slow opacity-30">
                {/* Linha pontilhada conectora */}
                <svg className="absolute -right-20 top-5 w-24 h-24 text-blue-200" style={{ transform: 'rotate(-20deg)' }}>
                    <path d="M0,50 Q50,0 100,50" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                </svg>

                <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100 w-full">
                    <div className="flex items-center gap-2 mb-2 border-b border-gray-50 pb-2">
                        <AutorenewIcon className="text-blue-500" fontSize="small" />
                        <span className="text-xs font-bold text-gray-700">Metabolism</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                </div>
            </div>

            <div className="absolute left-[75%] top-[10%] hidden lg:flex flex-col items-center animate-float-slow opacity-20">
                {/* Linha pontilhada conectora */}
                <svg className="absolute -left-20 top-10 w-24 h-24 text-blue-200" style={{ transform: 'rotate(20deg)' }}>
                    <path d="M0,50 Q50,0 100,10" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                </svg>

                <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100 w-full">
                    <div className="flex items-center gap-2 mb-2 border-b border-gray-50 pb-2">
                        <ControlCameraIcon className="text-blue-500" fontSize="small" />
                        <span className="text-xs font-bold text-gray-700">Distribution</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                </div>
            </div>

            <div className="absolute right-[5%] top-[50%] hidden lg:flex flex-col items-center animate-float-medium opacity-80">
                {/* Linha pontilhada conectora */}
                <svg className="absolute -left-20 top-10 w-24 h-24 text-blue-200" style={{ transform: 'rotate(20deg)' }}>
                    <path d="M0,50 Q50,100 100,50" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                </svg>

                <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100 w-full">
                    <div className="flex items-center gap-2 mb-3">
                        <AnalyticsIcon className="text-green-500" />
                        <div>
                            <p className="text-xs text-gray-400">Toxicity</p>
                            <p className="text-xs font-bold text-gray-800">Low Risk</p>
                        </div>
                    </div>
                    {/* Simulação de mini gráfico */}
                    <div className="flex items-end gap-1 h-6">
                        <div className="w-2 bg-blue-100 h-3 rounded-t"></div>
                        <div className="w-2 bg-blue-200 h-5 rounded-t"></div>
                        <div className="w-2 bg-blue-500 h-7 rounded-t"></div>
                        <div className="w-2 bg-blue-300 h-4 rounded-t"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;