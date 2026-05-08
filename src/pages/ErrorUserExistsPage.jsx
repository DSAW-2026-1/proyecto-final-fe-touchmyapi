import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import completeLogo from '../assets/unisabanalogocomplete.png'; 
import smallLogo from '../assets/sabanalogo.png'; 

const ErrorUserExistsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigimos al Registro después de 4 segundos para que alcancen a leer el error
    const timer = setTimeout(() => {
      navigate('/register');
    }, 6500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="h-screen w-full flex flex-col font-['Roboto'] overflow-hidden">
      
      {/* PARTE SUPERIOR (AZUL) */}
      <div className="h-[45%] w-full bg-sabana-blue flex flex-col items-center justify-center relative px-4">
        {/* Escudo pequeño arriba a la derecha */}
        <img 
          src={smallLogo} 
          alt="Escudo" 
          className="absolute top-6 right-6 h-10 md:h-12 object-contain"
        />
        
        <h1 className="text-white text-4xl md:text-6xl font-bold font-['Roboto_Slab'] text-center mb-2">
          El usuario ya existe
        </h1>
        <p className="text-white text-lg md:text-xl opacity-90 text-center max-w-lg">
          ¡Ups! parece que este correo ya está registrado, te redigiremos para que lo intentes de nuevo.
        </p>
      </div>

      {/* PARTE INFERIOR (CELESTE) */}
      <div className="h-[55%] w-full bg-sabana-light flex justify-center px-4 relative">
        
        {/* LA TARJETA BLANCA - Sin el divisor de "Bienvenido" */}
        <div className="absolute -top-24 bg-white p-12 md:p-16 rounded-[32px] shadow-2xl w-[90%] max-w-2xl flex flex-col items-center justify-center border border-defaultBorder-gray z-20">
          
          {/* Logo Completo centrado directamente */}
          <div className="w-full flex justify-center">
            <img 
              src={completeLogo} 
              alt="Universidad de La Sabana" 
              className="w-full max-w-md h-auto object-contain"
            />
          </div>
          
          {/* Un pequeño mensaje de ayuda extra (Opcional) */}
          <p className="mt-8 text-gray-400 text-sm font-medium">
            Verifica tus datos e intenta nuevamente
          </p>
        </div>

      </div>
    </main>
  );
};

export default ErrorUserExistsPage;