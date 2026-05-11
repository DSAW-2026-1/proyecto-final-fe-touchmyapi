import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import completeLogo from '../assets/unisabanalogocomplete.png'; 
import smallLogo from '../assets/sabanalogo.png'; 

const SuccessPage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const REDIRECT_TIME = 5500; // Tiempo total en ms

  useEffect(() => {
    // 1. Temporizador para el redireccionamiento
    const timer = setTimeout(() => {
      navigate('/login');
    }, REDIRECT_TIME);

    // 2. Intervalo para la barrita de carga visual (opcional pero muy pro)
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, REDIRECT_TIME / 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <main className="h-screen w-full flex flex-col font-sans overflow-hidden bg-sabana-light">
      
      {/* SECCIÓN SUPERIOR (AZUL) - Identidad Institucional */}
      <div className="h-[45%] w-full bg-sabana-blue flex flex-col items-center justify-center relative px-4">
        {/* Escudo flotante con sutil animación de entrada */}
        <img 
          src={smallLogo} 
          alt="Escudo Sabana" 
          className="absolute top-6 right-6 h-10 md:h-14 object-contain animate-fade-in-down"
        />
        
        <div className="text-center animate-fade-in-up">
          <h1 className="text-white text-4xl md:text-6xl font-black mb-4 tracking-tight">
            ¡Registro Exitoso!
          </h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium max-w-md mx-auto leading-relaxed">
            Tu cuenta ha sido creada. En unos segundos podrás ingresar a la plataforma.
          </p>
        </div>
      </div>

      {/* SECCIÓN INFERIOR (CELESTE) */}
      <div className="h-[55%] w-full flex justify-center px-4 relative">
        
        {/* TARJETA DE BIENVENIDA */}
        <div className="absolute -top-20 bg-white p-10 md:p-16 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-[92%] max-w-2xl flex flex-col items-center border border-gray-100 z-20 transition-transform hover:scale-[1.01]">
          
          {/* Divider con texto */}
          <div className="w-full flex items-center justify-center gap-6 mb-10">
            <div className="h-[1px] bg-gradient-to-r from-transparent to-gray-200 flex-1"></div>
            <span className="text-gray-400 text-xs uppercase tracking-[0.3em] font-black whitespace-nowrap">
              Bienvenido
            </span>
            <div className="h-[1px] bg-gradient-to-l from-transparent to-gray-200 flex-1"></div>
          </div>

          {/* Logo Principal */}
          <div className="w-full mb-10 flex justify-center">
            <img 
              src={completeLogo} 
              alt="Universidad de La Sabana" 
              className="w-full max-w-md h-auto object-contain drop-shadow-sm"
            />
          </div>

          {/* BARRA DE PROGRESO (Feedback visual del tiempo) */}
          <div className="w-full max-w-sm">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-sabana-blue transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="mt-6 text-sabana-blue text-sm font-bold underline hover:text-sabana-blue-hover transition-colors w-full text-center"
            >
              Ir al inicio de sesión ahora
            </button>
          </div>
        </div>

      </div>
    </main>
  );
};

export default SuccessPage;