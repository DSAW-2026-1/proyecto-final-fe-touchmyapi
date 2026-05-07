import React, { useState } from 'react';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
// IMPORTANTE: Importamos el logo así para que Vite lo reconozca
import logoSabana from '../assets/sabanalogo.png'; 

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    career: ''
  });

  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen w-full relative font-['Roboto'] overflow-hidden">
      {/* Fondo dividido */}
      <div className="absolute inset-0 z-0">
        <div className="h-1/2 w-full bg-[#001C64]"></div>
        <div className="h-1/2 w-full bg-[#E0EDFF]"></div>
      </div>

      {/* Contenido Principal */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        
        {/* Header con Iconos */}
        <header className="w-full max-w-xl flex justify-between items-start mb-6">
          <button className="text-white text-xl mt-2 hover:opacity-70 transition-opacity">
            <FaArrowLeft />
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white font-['Roboto_Slab'] mb-1">Regístrate</h1>
            <p className="text-[#9DC4FF] text-sm max-w-[280px] mx-auto leading-tight font-medium">
              ¡Hola! crea una cuenta con tu correo de la U para disfrutar de nuestros servicios.
            </p>
          </div>
          {/* LOGO CORREGIDO */}
          <img 
            src={logoSabana} 
            alt="Logo Sabana" 
            className="h-12 w-auto object-contain" 
          />
        </header>

        {/* ESTA ES LA CÁPSULA BLANCA PRINCIPAL QUE FALTABA */}
        <div className="w-full max-w-xl bg-white rounded-[32px] shadow-2xl p-8 border border-[#EDF1F3]">
          <form className="space-y-4">
            
            {/* Fila: Nombre y Apellido */}
            <div className="flex gap-4">
              <div className="flex-1 rounded-2xl border-2 border-[#EDF1F3] px-5 py-3">
                <label className="block text-gray-400 text-[10px] uppercase font-bold mb-1">Nombre</label>
                <input 
                  name="nombre"
                  type="text" 
                  className="w-full bg-transparent text-[#1A1C1E] font-medium outline-none"
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1 rounded-2xl border-2 border-[#EDF1F3] px-5 py-3">
                <label className="block text-gray-400 text-[10px] uppercase font-bold mb-1">Apellido</label>
                <input 
                  name="apellido"
                  type="text" 
                  className="w-full bg-transparent text-[#1A1C1E] font-medium outline-none"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Input: Correo */}
            <div className="rounded-2xl border-2 border-[#EDF1F3] px-5 py-4">
              <input 
                name="email"
                type="email" 
                placeholder="usuario@unisabana.edu.co"
                className="w-full bg-transparent text-[#1A1C1E] font-medium outline-none placeholder:text-gray-400"
                onChange={handleChange}
              />
            </div>

            {/* Input: Contraseña */}
            <div className="rounded-2xl border-2 border-[#EDF1F3] px-5 py-4 flex justify-between items-center">
              <input 
                name="password"
                type={showPass ? "text" : "password"} 
                placeholder="contraseña"
                className="w-full bg-transparent text-[#1A1C1E] font-medium outline-none placeholder:text-gray-400"
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400">
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Input: Confirmar Contraseña */}
            <div className="rounded-2xl border-2 border-[#EDF1F3] px-5 py-4 flex justify-between items-center">
              <input 
                name="confirmPassword"
                type={showPass ? "text" : "password"} 
                placeholder="confirmar contraseña"
                className="w-full bg-transparent text-[#1A1C1E] font-medium outline-none placeholder:text-gray-400"
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400">
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Seleccionador de Carrera */}
            <div className="rounded-2xl border-2 border-[#EDF1F3] px-5 py-4">
              <select 
                name="career"
                className="w-full bg-transparent text-[#1A1C1E] font-medium outline-none appearance-none"
                onChange={handleChange}
                defaultValue=""
              >
                <option value="" disabled>Selecciona tu carrera</option>
                <option value="Informatica">Ingeniería Informática</option>
                <option value="Industrial">Ingeniería Industrial</option>
                <option value="Civil">Ingeniería Civil</option>
                <option value="Derecho">Derecho</option>
              </select>
            </div>

            {/* Botón Registrarme */}
            <div className="pt-4">
              <button 
                type="submit"
                className="w-full bg-[#001C64] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-[#002a96] transition-all uppercase tracking-widest text-sm"
              >
                Registrarme
              </button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-sm text-[#001C64] font-medium">
          ¿Ya tienes una cuenta? <span className="font-bold underline cursor-pointer">Inicia sesión</span>
        </p>
      </section>
    </main>
  );
};

export default RegisterPage;