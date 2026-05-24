import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

const ChangePassword = () => {
  const navigate = useNavigate();
  
  // Estados para los campos del formulario
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", passwords);
    
    // AQUÍ iría tu lógica de fetch a tu API:
    // await fetch('/api/change-password', { method: 'POST', body: JSON.stringify(passwords) });
    
    alert("Funcionalidad de API pendiente de conectar");
  };

  return (
    <div className="min-h-screen bg-sabana-light p-6 flex flex-col items-center">
      <button 
        onClick={() => navigate('/userprofile')} 
        className="self-start flex items-center gap-2 text-sabana-blue font-bold mb-8 hover:text-sabana-blue-hover transition-colors"
      >
        <ArrowLeft size={20} /> Volver al perfil
      </button>

      <div className="w-full max-w-md bg-white p-8 rounded-[40px] shadow-lg">
        <div className="flex justify-center mb-6 text-sabana-blue">
            <Lock size={48} />
        </div>
        <h2 className="text-2xl font-black text-sabana-blue text-center mb-6">Cambiar Contraseña</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contraseña actual</label>
            <input 
              type="password" 
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChange}
              className="w-full p-3 bg-sabana-light rounded-xl focus:ring-2 focus:ring-sabana-blue outline-none" 
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nueva contraseña</label>
            <input 
              type="password" 
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              className="w-full p-3 bg-sabana-light rounded-xl focus:ring-2 focus:ring-sabana-blue outline-none" 
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-sabana-blue text-white py-3 rounded-xl font-bold hover:bg-sabana-blue-hover transition-all"
          >
            Actualizar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword; // ¡IMPORTANTE: Asegúrate de tener esta línea al final!