// src/components/Header/Header.tsx
import { useState } from "react";
import { SlChemistry } from "react-icons/sl";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PredictButton from "../common/PredictButton";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
        e.preventDefault(); 
        setIsMobileMenuOpen(false); // Fecha o menu no celular

        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(hash.replace('#', ''));
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, '', `/${hash}`);
            }
        }
    };
    const navigateToAnalysis = () => {
        navigate('/analysis')
    };

    return (
        <header className="fixed top-0 left-0 w-full h-20 bg-white/95 backdrop-blur-md z-50 border-b border-[#dee1e6] shadow-sm">
            <nav className="w-full h-full flex justify-between items-center max-w-7xl mx-auto px-6 lg:px-16">
                
                {/* Logo */}
                <a 
                    className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-50" 
                    href="/#home"
                    onClick={(e) => handleNavigation(e, '#home')}
                >
                    <SlChemistry className="text-3xl text-blue-600" />
                    <span className="font-nunito font-bold text-xl text-gray-800">
                        ADMET <span className="text-blue-600">Predictor</span>
                    </span>
                </a>
                
                {/* DESKTOP Menu */}
                <div className="hidden lg:flex items-center gap-8">
                    <a href="/#home" onClick={(e) => handleNavigation(e, '#home')} className="font-inter text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">Início</a>
                    <a href="/#key_features" onClick={(e) => handleNavigation(e, '#key_features')} className="font-inter text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">Funcionalidades</a>
                    <a href="/#how_it_works" onClick={(e) => handleNavigation(e, '#how_it_works')} className="font-inter text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">Como Funciona</a>
                    <a href="/#about_project" onClick={(e) => handleNavigation(e, '#about_project')} className="font-inter text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">Sobre o Projeto</a>
                    <PredictButton onClick={navigateToAnalysis} />
                </div>

                {/* MOBILE Menu Toggle Button */}
                <button 
                    className="lg:hidden p-2 text-gray-600 hover:text-blue-600 z-50"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
            </nav>

            {/* MOBILE Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-xl flex flex-col items-center py-8 gap-6 animate-fade-in-down">
                    <a href="/#home" onClick={(e) => handleNavigation(e, '#home')} className="font-inter text-lg font-medium text-gray-800 hover:text-blue-600">Início</a>
                    <a href="/#key_features" onClick={(e) => handleNavigation(e, '#key_features')} className="font-inter text-lg font-medium text-gray-800 hover:text-blue-600">Funcionalidades</a>
                    <a href="/#how_it_works" onClick={(e) => handleNavigation(e, '#how_it_works')} className="font-inter text-lg font-medium text-gray-800 hover:text-blue-600">Como Funciona</a>
                    <a href="/#about_project" onClick={(e) => handleNavigation(e, '#about_project')} className="font-inter text-lg font-medium text-gray-800 hover:text-blue-600">Sobre o Projeto</a>
                    <div className="mt-4" onClick={() => setIsMobileMenuOpen(false)}>
                        <PredictButton onClick={navigateToAnalysis} />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;