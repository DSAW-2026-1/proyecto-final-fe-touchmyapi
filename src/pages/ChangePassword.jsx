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
    
    // Obtenemos el email del usuario logueado
    const userEmail = localStorage.getItem('userEmail'); 
    
    if (!userEmail) {
      alert("No se encontró sesión activa. Por favor, inicia sesión.");
      return;
    }
  
    try {
      console.log("Enviando al backend:", {
        email: userEmail,
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
    });
      // Realizamos la petición (agregamos el email al body como espera tu backend)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });
  
      // Validamos la respuesta
      const data = await response.json();
  
      if (response.ok) {
        alert("¡Contraseña actualizada con éxito!");
        setPasswords({ currentPassword: '', newPassword: '' });
        navigate('/userprofile');
      } else {
        // Si el servidor responde con error (ej: 401), mostramos el mensaje del backend
        alert(data.message || "Error al cambiar la contraseña");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión con el servidor");
    }
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

export default ChangePassword; // ¡IMPORTANTE: Asegúrate de tener esta línea al final!o