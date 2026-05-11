import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import smallLogo from '../assets/sabanalogo.png';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [errorType, setErrorType] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para evitar doble envío
  
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    career: ''
  });

  // 1. Mensajes de error centralizados para limpieza del JSX
  const errorMessages = useMemo(() => ({
    EMPTY_FIELDS: "¡Ups! parece que hay algún dato sin registrar, por favor verifica y vuelve a intentarlo.",
    DOMAIN_ERROR: "¡Ups! parece que algo salió mal, por favor verifica que el correo sea @unisabana.edu.co.",
    NAME_ERROR: "¡Ups! parece que algo salió mal, verifica que el nombre y apellido sean válidos.",
    PASS_LENGTH_ERROR: "¡Ups! algo salió mal, la contraseña debe tener mínimo seis caracteres.",
    PASS_MATCH_ERROR: "¡Ups! las contraseñas no coinciden, por favor verifica e intenta de nuevo.",
    DEFAULT: "¡Hola! crea una cuenta con tu correo de la U para disfrutar de nuestros servicios."
  }), []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiamos el error mientras el usuario escribe para mejorar la UX
    setErrorType(null);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Evita múltiples clics

    const { name, lastName, email, password, confirmPassword, career } = formData;
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,}$/;

    // --- Validaciones Lógicas ---
    if (!name || !lastName || !email || !password || !confirmPassword || !career) {
      return setErrorType('EMPTY_FIELDS');
    }
    if (!email.toLowerCase().endsWith('@unisabana.edu.co')) {
      return setErrorType('DOMAIN_ERROR');
    }
    if (!nameRegex.test(name) || !nameRegex.test(lastName)) {
      return setErrorType('NAME_ERROR');
    }
    if (password.length < 6) {
      return setErrorType('PASS_LENGTH_ERROR');
    }
    if (password !== confirmPassword) {
      return setErrorType('PASS_MATCH_ERROR');
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, lastName, email, password, career }),
      });

      const data = await response.text();

      if (response.ok && data.includes("Usuario registrado con éxito")) {
        navigate('/success');
      } else if (data.includes("ya está registrado")) {
        navigate('/error-user-exists');
      } else {
        alert(`Aviso: ${data}`);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión con el servidor. Por favor, verifica tu internet o el estado del servicio.");
    } finally {
      setLoading(false);
    }
  };

  // Función de estilos optimizada
  const getInputStyles = (errorKeys, fieldName = null) => {
    const hasError = errorKeys.includes(errorType) || (errorType === 'EMPTY_FIELDS' && fieldName && !formData[fieldName]);
    return hasError 
      ? "bg-red-50 border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]" 
      : "bg-transparent border-gray-200 focus-within:border-sabana-blue";
  };

  return (
    <main className="min-h-screen w-full relative font-sans overflow-hidden bg-sabana-light">
      {/* Fondo dividido */}
      <div className="absolute inset-0 z-0">
        <div className="h-1/2 w-full bg-sabana-blue"></div>
      </div>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        
        {/* Header */}
        <header className="w-full max-w-xl flex justify-between items-start mb-8">
          <button 
            onClick={() => navigate('/login')} 
            className="text-white text-xl p-2 hover:bg-white/10 rounded-full transition-all"
          >
            <FaArrowLeft />
          </button>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Regístrate</h1>
            <p className={`text-sm max-w-[300px] mx-auto leading-snug font-medium transition-colors duration-300 ${errorType ? 'text-sabana-softGold' : 'text-blue-100'}`}>
              {errorMessages[errorType] || errorMessages.DEFAULT}
            </p>
          </div>
          <img src={smallLogo} alt="Logo Sabana" className="h-12 w-auto object-contain" />
        </header>

        {/* Form Container */}
        <div className="w-full max-w-xl bg-white rounded-[40px] shadow-2xl p-10 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="flex gap-4">
              <div className={`flex-1 rounded-2xl border-2 px-5 py-3 transition-all ${getInputStyles(['NAME_ERROR'], 'name')}`}>
                <label className="block text-gray-400 text-[10px] uppercase font-black mb-1">Nombre</label>
                <input name="name" type="text" className="w-full bg-transparent text-gray-800 font-semibold outline-none" onChange={handleChange} value={formData.name} />
              </div>
              <div className={`flex-1 rounded-2xl border-2 px-5 py-3 transition-all ${getInputStyles(['NAME_ERROR'], 'lastName')}`}>
                <label className="block text-gray-400 text-[10px] uppercase font-black mb-1">Apellido</label>
                <input name="lastName" type="text" className="w-full bg-transparent text-gray-800 font-semibold outline-none" onChange={handleChange} value={formData.lastName} />
              </div>
            </div>

            <div className={`rounded-2xl border-2 px-5 py-4 transition-all ${getInputStyles(['DOMAIN_ERROR'], 'email')}`}>
              <label className="block text-gray-400 text-[10px] uppercase font-black mb-1">Correo Institucional</label>
              <input name="email" type="email" placeholder="usuario@unisabana.edu.co" className="w-full bg-transparent text-gray-800 font-semibold outline-none placeholder:text-gray-300" onChange={handleChange} value={formData.email} />
            </div>

            <div className={`rounded-2xl border-2 px-5 py-4 flex justify-between items-center transition-all ${getInputStyles(['PASS_LENGTH_ERROR', 'PASS_MATCH_ERROR'], 'password')}`}>
              <div className="flex-1">
                <label className="block text-gray-400 text-[10px] uppercase font-black mb-1">Contraseña</label>
                <input name="password" type={showPass ? "text" : "password"} placeholder="••••••••" className="w-full bg-transparent text-gray-800 font-semibold outline-none placeholder:text-gray-300" onChange={handleChange} value={formData.password} />
              </div>
              <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-sabana-blue transition-colors">
                {showPass ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            <div className={`rounded-2xl border-2 px-5 py-4 flex justify-between items-center transition-all ${getInputStyles(['PASS_MATCH_ERROR'], 'confirmPassword')}`}>
              <div className="flex-1">
                <label className="block text-gray-400 text-[10px] uppercase font-black mb-1">Confirmar Contraseña</label>
                <input name="confirmPassword" type={showPass ? "text" : "password"} placeholder="••••••••" className="w-full bg-transparent text-gray-800 font-semibold outline-none placeholder:text-gray-300" onChange={handleChange} value={formData.confirmPassword} />
              </div>
            </div>

            <div className={`rounded-2xl border-2 px-5 py-4 transition-all ${getInputStyles(['EMPTY_FIELDS'], 'career')}`}>
              <label className="block text-gray-400 text-[10px] uppercase font-black mb-1">Carrera</label>
              <select name="career" className="w-full bg-transparent text-gray-800 font-semibold outline-none appearance-none cursor-pointer" onChange={handleChange} value={formData.career}>
                <option value="" disabled>Selecciona tu carrera</option>
                <optgroup label="Ingeniería">
                  <option value="Data Science">Ciencia de Datos</option>
                  <option value="Bioproduction Engineering">Ingeniería de Bioproducción</option>
                  <option value="Design and Innovation Engineering">Ingeniería de Diseño e Innovación</option>
                  <option value="Mechanical Engineering">Ingeniería Mecánica</option>
                  <option value="Chemical Engineering">Ingeniería Química</option>
                  <option value="Computer Engineering">Ingeniería Informática</option>
                  <option value="Industrial Engineering">Ingeniería Industrial</option>
                  <option value="Civil Engineering">Ingeniería Civil</option>
                </optgroup>
                <optgroup label="EICEA">
                  <option value="Business Administration">Administración de Empresas</option>
                  <option value="Gastronomy">Gastronomía</option>
                  <option value="International Economics">Economía y Finanzas</option>
                </optgroup>
                <optgroup label = "Gatronomía">
                  <option value="Gastronomy">Gastronomía</option>
                </optgroup>
                <optgroup label = "Facultad de Ciencias del Comportamiento">
                  <option value="" disabled>Facultad de Ciencias del Comportamiento:</option>
                  <option value="Organizational Behavior">Comportamiento Organizacional</option>
                  <option value="Psychology">Psicología</option>
                </optgroup>
                <optgroup label="Facultad de Comunicación">
                <option value="" disabled>Facultad de Comunicación:</option>
                  <option value="Audiovisual and Multimedia Communication">Comunicación Audiovisual y Multimedios</option>
                  <option value="Corporate Communication">Comunicación Corporativa</option>
                  <option value="Social Communication and Journalism">Comunicación Social y Periodismo</option>
                </optgroup>
                <optgroup label = "Facultad de Educación">
                  <option value="Early Childhood Education Teaching Degree">Licenciatura en Educación Infantil</option>
                  <option value="Unisabana College">Unisabana College</option>
                </optgroup>
                <optgroup label = "Facultad de Ciencias de la Vida y el Bienestar">
                  <option value="Nursing">Enfermería</option>
                  <option value="Physiotherapy">Fisioterapia</option>
                </optgroup>
                <optgroup label = "Facultad de Estudios Jurídicos, Políticos e Internacionales">
                  <option value="Political Science">Ciencias Políticas</option>
                  <option value="Law">Derecho</option>
                  <option value="International Relations">Relaciones Internacionales</option>
                </optgroup>
                <optgroup label = "Facultad de Filosofía y Ciencias Humanas">
                  <option value="Philosophy">Filosofía</option>
                </optgroup>
                <optgroup label="Facultad de Medicina">
                  <option value="Medicine">Medicina</option>
                </optgroup>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full ${loading ? 'bg-gray-400' : 'bg-sabana-blue hover:bg-sabana-blue-hover'} text-white font-black py-5 rounded-[20px] shadow-xl transition-all uppercase tracking-[0.2em] text-xs active:scale-95`}
            >
              {loading ? 'Procesando...' : 'Crear Cuenta'}
            </button>
          </form>
        </div>

        <p className="mt-8 text-sm text-sabana-blue font-medium">
          ¿Ya tienes una cuenta?{' '}
          <span onClick={() => navigate('/login')} className="font-black underline cursor-pointer hover:text-sabana-blue-hover transition-colors">
            Inicia sesión
          </span>
        </p>
      </section>
    </main>
  );
};

export default RegisterPage;