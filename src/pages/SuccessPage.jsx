import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import completeLogo from '../assets/unisabanalogocomplete.png'; 
import smallLogo from '../assets/sabanalogo.png'; 

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="h-screen w-full flex flex-col font-['Roboto'] overflow-hidden">
      
      {/* PARTE SUPERIOR (AZUL) - 45% de la pantalla */}
      <div className="h-[45%] w-full bg-sabana-blue flex flex-col items-center justify-center relative px-4">
        {/* Escudo pequeño arriba a la derecha */}
        <img 
          src={smallLogo} 
          alt="Escudo" 
          className="absolute top-6 right-6 h-10 md:h-12 object-contain"
        />
        
        <h1 className="text-white text-4xl md:text-6xl font-bold font-['Roboto_Slab'] text-center mb-2">
          Creaste tu cuenta
        </h1>
        <p className="text-sabana-blue-light text-lg md:text-xl opacity-90 text-center">
          ¡Genial! ahora te redigiremos para que inicies sesión.
        </p>
      </div>

      {/* PARTE INFERIOR (CELESTE) - 55% de la pantalla */}
      <div className="h-[55%] w-full bg-sabana-light flex justify-center px-4 relative">
        
        {/* LA TARJETA BLANCA - Con margen negativo para subirla */}
        <div className="absolute -top-24 bg-white p-8 md:p-12 rounded-[32px] shadow-2xl w-[90%] max-w-2xl flex flex-col items-center border border-defaultBorder-gray z-20">
          
          {/* Línea de Bienvenido */}
          <div className="w-full flex items-center justify-center gap-4 mb-8">
            <div className="h-[1px] bg-gray-200 w-full"></div>
            <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-widest font-bold whitespace-nowrap">
              Bienvenido
            </span>
            <div className="h-[1px] bg-gray-200 w-full"></div>
          </div>

          {/* Logo Completo */}
          <div className="w-full py-4 flex justify-center">
            <img 
              src={completeLogo} 
              alt="Universidad de La Sabana" 
              className="w-full max-w-md h-auto object-contain"
            />
          </div>
        </div>

      </div>
    </main>
  );
};

export default SuccessPage;