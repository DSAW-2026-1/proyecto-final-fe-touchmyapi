import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoCompleto from '../assets/unisabanalogocomplete.png'; 
import logoPequeno from '../assets/sabanalogo.png'; 

const LoginSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Aseguramos la sesión al montar el componente
    localStorage.setItem('isLoggedIn', 'true');

    // Redirección un poco más rápida para mejorar el UX
    const timer = setTimeout(() => {
      navigate('/home'); 
    }, 3500); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="h-screen w-full flex flex-col font-['Roboto'] overflow-hidden">
      
      {/* PARTE SUPERIOR (AZUL) */}
      <div className="h-[45%] w-full bg-sabana-blue flex flex-col items-center justify-center relative px-4">
        <img 
          src={logoPequeno} 
          alt="Escudo" 
          className="absolute top-6 right-6 h-10 md:h-12 object-contain"
        />
        
        <div className="animate-in fade-in zoom-in duration-700 text-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold font-['Roboto_Slab'] mb-2">
            ¡Ingreso exitoso!
          </h1>
          <p className="text-white text-lg md:text-xl opacity-90">
            Ahora puedes disfrutar de todos nuestros servicios.
          </p>
        </div>
      </div>

      {/* PARTE INFERIOR (CELESTE) */}
      <div className="h-[55%] w-full bg-sabana-light flex justify-center px-4 relative">
        
        {/* Tarjeta con una animación suave de subida */}
        <div className="absolute -top-24 bg-white p-8 md:p-12 rounded-[32px] shadow-2xl w-[90%] max-w-2xl flex flex-col items-center border border-defaultBorder-gray z-20 transition-all duration-500 transform hover:scale-[1.01]">
          
          {/* Línea de Bienvenido */}
          <div className="w-full flex items-center justify-center gap-4 mb-8">
            <div className="h-[1px] bg-gray-100 w-full"></div>
            <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-widest font-bold whitespace-nowrap">
              Bienvenido a la comunidad
            </span>
            <div className="h-[1px] bg-gray-100 w-full"></div>
          </div>

          <div className="w-full py-4 flex justify-center">
            <img 
              src={logoCompleto} 
              alt="Universidad de La Sabana" 
              className="w-full max-w-md h-auto object-contain"
            />
          </div>

          {/* Indicador de carga sutil */}
          <div className="mt-6 flex gap-2">
            <div className="w-2 h-2 bg-sabana-blue rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-sabana-blue rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-sabana-blue rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginSuccessPage;