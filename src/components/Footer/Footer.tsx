// src/components/common/Footer.tsx

const Footer = () => {
  // Pegar o ano atual dinamicamente é uma boa prática (assim você não precisa mudar em 2027)
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center">
        
        {/* Você pode colocar o logo pequeno aqui se quiser, ou deixar só o texto */}
        
        <p className="font-inter text-sm text-gray-400 text-center">
          &copy; {currentYear} Daniel Cardeal. Todos os direitos reservados.
        </p>
        
        {/* Opcional: Um link sutil para o repositório do TCC ou seu LinkedIn */}
        <p className="font-inter text-xs text-gray-300 mt-2">
          Desenvolvido como Trabalho de Conclusão de Curso
        </p>
      </div>
    </footer>
  );
};

export default Footer;