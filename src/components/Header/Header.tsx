// src/components/Header.tsx
import { useState } from "react";
import { SlChemistry } from "react-icons/sl";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PredictButton from "../common/PredictButton";

const Header = () => {
    // Estado para controlar o menu no celular
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Função para fechar o menu ao clicar em um link
    const handleCloseMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="fixed top-0 left-0 w-full h-20 bg-white/95 backdrop-blur-md z-50 border-b border-[#dee1e6] shadow-sm">
            {/* Reduzi o px-16 para px-6 em telas menores, e px-16 só no desktop (lg:px-16) */}
            <nav className="w-full h-full flex justify-between items-center max-w-7xl mx-auto px-6 lg:px-16">
                
                {/* Logo */}
                <a 
                    className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-50" 
                    href="#home"
                    onClick={handleCloseMenu}
                >
                    <SlChemistry className="text-3xl text-blue-600" />
                    <span className="font-nunito font-bold text-xl text-gray-800">
                        ADMET <span className="text-blue-600">Predictor</span>
                    </span>
                </a>
                
                {/* DESKTOP Menu (Some em telas menores que 'lg') */}
                <div className="hidden lg:flex items-center gap-8">
                    <a href="#home" className="font-inter text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Início</a>
                    <a href="#key_features" className="font-inter text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Funcionalidades</a>
                    <a href="#how_it_works" className="font-inter text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Como Funciona</a>
                    <a href="#about_project" className="font-inter text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Sobre o Projeto</a>
                    <PredictButton />
                </div>

                {/* MOBILE Menu Toggle Button (Aparece apenas em telas menores) */}
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
                    <a href="#home" onClick={handleCloseMenu} className="font-inter text-lg font-medium text-gray-800 hover:text-blue-600">Início</a>
                    <a href="#key_features" onClick={handleCloseMenu} className="font-inter text-lg font-medium text-gray-800 hover:text-blue-600">Funcionalidades</a>
                    <a href="#how_it_works" onClick={handleCloseMenu} className="font-inter text-lg font-medium text-gray-800 hover:text-blue-600">Como Funciona</a>
                    <a href="#about_project" onClick={handleCloseMenu} className="font-inter text-lg font-medium text-gray-800 hover:text-blue-600">Sobre o Projeto</a>
                    <div className="mt-4" onClick={handleCloseMenu}>
                        <PredictButton />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;