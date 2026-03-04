// src/pages/Home/AboutSection.tsx
import React from 'react';
import { Button, Typography } from '@mui/material';
import BiotechIcon from '@mui/icons-material/Biotech';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';

const AboutSection = () => {
    return (
        <section className="w-full py-16 md:py-24 bg-white relative overflow-hidden">
            {/* Decoração de fundo */}
            <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">

                {/* Coluna da Esquerda: Texto */}
                <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-blue-600 mb-4">
                        <SchoolIcon />
                        <span className="font-inter font-bold uppercase tracking-wider text-xs md:text-sm">Contexto Acadêmico</span>
                    </div>
                    {/* Tamanho da fonte dinâmico (text-3xl no mobile, maior no desktop) */}
                    <Typography variant="h3" className="font-nunito_sans font-bold text-gray-900 mb-6 leading-tight text-3xl md:text-4xl lg:text-5xl">
                        <span className="text-blue-600">Design Centrado no Usuário</span> para Análise ADMET
                    </Typography>
                    <Typography className="font-inter text-gray-500 text-base md:text-lg mb-6 leading-relaxed">
                        Desenvolvido como um projeto de conclusão de curso, esta plataforma atua como uma camada de apresentação visual avançada para a análise de propriedades ADMET.
                    </Typography>
                    <Typography className="font-inter text-gray-500 text-base md:text-lg mb-8 leading-relaxed">
                        Projetada sob os princípios do Design Thinking, a interface resolve o desafio da sobrecarga de dados ao oferecer visualização interativa e critérios de filtragem altamente personalizáveis. Nosso compromisso é entregar uma solução centrada no usuário, com usabilidade e aceitação rigorosamente avaliadas por especialistas da área, facilitando o cotidiano de pesquisas farmacocinéticas.
                    </Typography>

                    <Button
                        variant="outlined"
                        size="large"
                        className="rounded-full border-blue-600 text-blue-600 px-8 font-nunito_sans normal-case hover:bg-blue-50 w-full md:w-auto"
                    >
                        Ler Documentação do TCC
                    </Button>
                </div>

                {/* Coluna da Direita: Composição Visual estilo Hero */}
                {/* Reduzi a altura mínima no mobile (h-[350px]) para não ficar um buraco vazio */}
                <div className="relative h-[350px] md:h-[500px] flex items-center justify-center mt-8 lg:mt-0">

                    {/* Card Central Principal */}
                    {/* No mobile, ocupa quase tudo (w-11/12). No desktop, w-4/5 */}
                    <div className="relative z-20 bg-white p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-100 w-11/12 md:w-4/5 animate-float-medium">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 text-center sm:text-left">
                            <div className="p-3 bg-blue-100 rounded-lg text-blue-600 flex-shrink-0">
                                <BiotechIcon fontSize="large" />
                            </div>
                            <div>
                                <Typography variant="h6" className="font-nunito_sans font-bold text-lg md:text-xl">Objetivo Central</Typography>
                                <Typography className="font-inter text-xs md:text-sm text-gray-500">Facilitar a consulta e filtragem ADMET</Typography>
                            </div>
                        </div>
                        <div className="space-y-3 hidden sm:block"> {/* Escondi as barras no mobile pra não poluir */}
                            <div className="h-3 bg-gray-100 rounded-full w-full"></div>
                            <div className="h-3 bg-gray-100 rounded-full w-5/6"></div>
                            <div className="h-3 bg-gray-100 rounded-full w-4/6"></div>
                        </div>
                    </div>

                    {/* Card Flutuante Secundário (Tech Stack) */}
                    {/* Ajuste de posição para não vazar da tela no celular */}
                    <div className="absolute -bottom-5 right-2 md:-bottom-10 md:right-0 z-30 bg-white p-4 md:p-6 rounded-xl shadow-xl border border-gray-100 w-56 md:w-64 animate-float-slow" style={{ animationDelay: '1s' }}>
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-3 md:mb-4 text-gray-700">
                            <CodeIcon className="text-blue-500" fontSize="small" />
                            <span className="font-nunito_sans font-bold text-sm md:text-base">Tech Stack</span>
                        </div>
                        <div className="flex justify-center md:justify-start gap-2 flex-wrap">
                            <span className="px-2 py-1 md:px-3 md:py-1 bg-blue-50 text-blue-600 text-[10px] md:text-xs rounded-full font-medium">React/Tailwind</span>
                            <span className="px-2 py-1 md:px-3 md:py-1 bg-green-50 text-green-600 text-[10px] md:text-xs rounded-full font-medium">Django/Python</span>
                            <span className="px-2 py-1 md:px-3 md:py-1 bg-purple-50 text-purple-600 text-[10px] md:text-xs rounded-full font-medium">RDKit</span>
                        </div>
                    </div>

                    {/* Elementos de conexão (linhas pontilhadas) - ocultos em telas muito pequenas */}
                    <svg className="hidden md:block absolute top-1/4 left-0 w-32 h-32 text-blue-200 opacity-50 animate-pulse" style={{ zIndex: 0 }}>
                        <path d="M0,0 Q50,50 100,20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;