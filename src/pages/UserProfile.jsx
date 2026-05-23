import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, BookOpen, ArrowLeft, ShieldCheck, Star, LogOut } from 'lucide-react';
import logoSabana from '../assets/sabanalogo.png';

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: '', email: '' });

  // Cargar datos del usuario desde el localStorage al montar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedEmail = localStorage.getItem('userEmail');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData({ name: parsedUser.name || '', email: parsedUser.email || storedEmail || '' });
      } catch (e) {
        console.error("Error al leer los datos del usuario");
      }
    } else if (storedEmail) {
      setUserData({ name: 'Estudiante Sabana', email: storedEmail });
    } else {
      // Si no hay sesión activa, lo devolvemos al login por seguridad
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId'); 
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased flex flex-col items-center py-10 px-4">
      
      {/* HEADER SIMPLE DE NAVEGACIÓN */}
      <div className="w-full max-w-md flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <button 
          onClick={() => navigate('/')} 
          className="p-2.5 bg-white rounded-xl shadow-sm text-[#002D72] hover:bg-[#002D72] hover:text-white transition-colors border border-gray-100"
          title="Volver"
        >
          <ArrowLeft size={20} />
        </button>
        <img src={logoSabana} alt="Logo Sabana" className="h-8 object-contain bg-white px-3 py-1 rounded-lg shadow-sm" />
        <div className="w-[42px]" /> {/* Spacer invisible para centrar el logo */}
      </div>

      {/* TARJETA DE PERFIL (Carnet Virtual) */}
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-xl overflow-hidden border border-gray-100 relative animate-in zoom-in-95 duration-500">
        
        {/* Banner Superior Azul */}
        <div className="h-32 bg-[#002D72] relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
          {/* Patrón decorativo opcional para el fondo */}
          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full border-4 border-white/10 opacity-50"></div>
          <div className="absolute right-10 top-10 w-16 h-16 rounded-full border-4 border-white/10 opacity-30"></div>
        </div>

        {/* Círculo del Avatar */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2">
          <div className="w-24 h-24 bg-white rounded-full p-2 shadow-lg">
            <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center text-[#002D72]">
              <User size={40} strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="pt-16 pb-8 px-8 flex flex-col items-center">
          
          <h1 className="text-2xl font-black text-[#002D72] text-center mb-1">
            {userData.name || 'Estudiante Sabana'}
          </h1>
          
          <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-8 border border-green-100">
            <ShieldCheck size={14} />
            <span>Cuenta Verificada</span>
          </div>

          {/* Bloques de Información */}
          <div className="w-full space-y-3 mb-8">
            <div className="flex items-center gap-4 p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
              <div className="bg-white p-2.5 rounded-xl shadow-sm text-gray-400">
                <Mail size={18} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Correo Institucional</p>
                <p className="text-sm font-semibold text-[#002D72] truncate">
                  {userData.email || 'correo@unisabana.edu.co'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
              <div className="bg-white p-2.5 rounded-xl shadow-sm text-amber-400">
                <Star size={18} className="fill-current" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-amber-600/70 uppercase tracking-widest mb-0.5">Reputación Campus</p>
                <p className="text-sm font-black text-amber-600">5.0 / 5.0 Excelente</p>
              </div>
            </div>
          </div>

          {/* --- SECCIÓN DE ACCIONES PRINCIPALES --- */}
          <div className="w-full space-y-3">
            
            {/* BOTÓN: GESTIONAR MI INVENTARIO */}
            <button
              onClick={() => navigate('/PersonalInventory')}
              className="w-full bg-amber-400 text-[#002D72] py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <BookOpen size={20} strokeWidth={3} />
              Gestionar Mi Inventario
            </button>

            {/* BOTÓN: VOLVER AL MARKETPLACE */}
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white text-gray-400 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:text-[#002D72] hover:border-[#002D72]/20 transition-all border border-gray-100 active:bg-gray-50"
            >
              Volver al Marketplace
            </button>
          </div>

          {/* BOTÓN: CERRAR SESIÓN */}
          <button 
            onClick={handleLogout}
            className="mt-8 flex items-center gap-2 text-red-400 hover:text-red-600 text-xs font-bold transition-colors group"
          >
            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
            Cerrar Sesión Segura
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default UserProfile;