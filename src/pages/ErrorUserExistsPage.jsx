import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import completeLogo from '../assets/unisabanalogocomplete.png'; 
import smallLogo from '../assets/sabanalogo.png'; 

const ErrorUserExistsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Reducción de tiempo a 4 segundos para mejor fluidez
    const timer = setTimeout(() => {
      navigate('/register');
    }, 4000); 
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="h-screen w-full flex flex-col font-['Roboto'] overflow-hidden">
      
      {/* PARTE SUPERIOR (AZUL) */}
      <div className="h-[45%] w-full bg-sabana-blue flex flex-col items-center justify-center relative px-4">
        <img 
          src={smallLogo} 
          alt="Escudo" 
          className="absolute top-6 right-6 h-10 md:h-12 object-contain"
        />
        
        <h1 className="text-white text-4xl md:text-6xl font-bold font-['Roboto_Slab'] text-center mb-2 animate-in fade-in slide-in-from-top duration-700">
          El usuario ya existe
        </h1>
        <p className="text-white text-lg md:text-xl opacity-90 text-center max-w-lg">
          ¡Ups! Parece que este correo ya está registrado. Te redirigiremos para que lo intentes de nuevo.
        </p>
      </div>

      {/* PARTE INFERIOR (CELESTE) */}
      <div className="h-[55%] w-full bg-sabana-light flex justify-center px-4 relative">
        
        <div className="absolute -top-24 bg-white p-12 md:p-16 rounded-[32px] shadow-2xl w-[90%] max-w-2xl flex flex-col items-center justify-center border border-defaultBorder-gray z-20">
          
          <div className="w-full flex justify-center">
            <img 
              src={completeLogo} 
              alt="Universidad de La Sabana" 
              className="w-full max-w-md h-auto object-contain"
            />
          </div>
          
          <p className="mt-8 text-gray-400 text-sm font-medium mb-6">
            Verifica tus datos e intenta nuevamente
          </p>

          {/* BOTÓN MANUAL: Por si el usuario no quiere esperar */}
          <button 
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-sabana-blue text-white rounded-full font-bold text-sm hover:bg-sabana-blue-hover transition-all active:scale-95 shadow-md"
          >
            Volver al registro ahora
          </button>
        </div>
      </div>
    </main>
  );
};

export default ErrorUserExistsPage;