import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
// IMPORTANTE: Importamos el logo así para que Vite lo reconozca
import smallLogo from '../assets/sabanalogo.png'; 

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    career: ''
  });

  const [showPass, setShowPass] = useState(false);
  // 1. Nuevo estado para manejar el tipo de error actual
  const [errorType, setErrorType] = useState(null); 

  // 2. Función de validación y envío
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorType(null); // Reiniciamos errores al intentar enviar

    const { name, lastName, email, password, confirmPassword, career } = formData;

    // --- NUEVA VALIDACIÓN: CAMPOS VACÍOS (DEBE SER LA PRIMERA) ---
    if (!name || !lastName || !email || !password || !confirmPassword || !career) {
      setErrorType('EMPTY_FIELDS');
      return;
    }
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,}$/; // Solo letras y min 2 caracteres

    // Validación 1: Dominio Sabana
    if (!email.endsWith('@unisabana.edu.co')) {
      setErrorType('DOMAIN_ERROR');
      return;
    }

    // Validación 2: Nombre y Apellido
    if (!nameRegex.test(name) || !nameRegex.test(lastName)) {
      setErrorType('NAME_ERROR');
      return;
    }

    // Validación 3: Longitud Contraseña
    if (password.length < 6) {
      setErrorType('PASS_LENGTH_ERROR');
      return;
    }

    // Validación 4: Match de Contraseñas
    if (password !== confirmPassword) {
      setErrorType('PASS_MATCH_ERROR');
      return;
    }

    // Si pasa todo, aquí va tu fetch al backend (Épica 1)
    console.log("Datos listos para el ConcurrentHashMap:", formData);
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Enviamos los datos. Ojo: quitamos confirmPassword porque el backend no lo necesita
        body: JSON.stringify({
          name,
          lastName,
          email,
          password,
          career
        }),
      });

      const data = await response.text(); // El backend devuelve un String

      if (response.ok && data === "Usuario registrado con éxito") {
        navigate('/success');
      } else {
        // Si el backend responde con un error (ej: usuario ya existe)
        alert(data); 
      }
    } catch (error) {
      console.error("Error conectando al servidor:", error);
      alert("No se pudo conectar con el servidor. Verificar estado de Backend");
    }
  };

  const getInputStyles = (fields, fieldName = null) => {
    // Si hay un error de "campos vacíos", solo pintamos de rojo los que REALMENTE están vacíos
    if (errorType === 'EMPTY_FIELDS') {
      if (fieldName && !formData[fieldName]) {
        return "bg-error-bg-red border-error-red";
      }
      // Si el campo tiene datos, no debe ponerse rojo aunque el error sea EMPTY_FIELDS
      return "bg-transparent border-defaultBorder-gray";
    }

    // Para los demás errores específicos (dominio, nombre, contraseñas)
    const isError = fields.includes(errorType);
    return isError 
      ? "bg-error-bg-red border-error-red" 
      : "bg-transparent border-defaultBorder-gray";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen w-full relative font-['Roboto'] overflow-hidden">
      {/* Fondo dividido */}
      <div className="absolute inset-0 z-0">
        <div className="h-1/2 w-full bg-sabana-blue"></div>
        <div className="h-1/2 w-full bg-sabana-light"></div>
      </div>

      {/* Contenido Principal */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        
        {/* Header con Iconos */}
        <header className="w-full max-w-xl flex justify-between items-start mb-6">
          <button 
            onClick={() => navigate('/login')} 
            className="text-white text-xl mt-2 hover:opacity-70 transition-opacity"
          >
            <FaArrowLeft />
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white font-['Roboto_Slab'] mb-1">Regístrate</h1>
              <p className={`text-sm max-w-[280px] mx-auto leading-tight font-medium ${errorType ? 'text-sabana-softGold' : 'text-sabana-blue-light'}`}>
                {!errorType && "¡Hola! crea una cuenta con tu correo de la U para disfrutar de nuestros servicios."}
                {errorType === 'EMPTY_FIELDS' && "¡Ups! parece que hay algún dato sin registrar, por favor verifica y vuelve a intentarlo."}
                {errorType === 'DOMAIN_ERROR' && "¡Ups! parece que algo salió mal, por favor verifica que el correo tenga dominio de la Universidad de la Sabana."}
                {errorType === 'NAME_ERROR' && "¡Ups! parece que algo salió mal, por favor verifica que el nombre y/o apellido sea válido y vuelve a intentarlo."}
                {errorType === 'PASS_LENGTH_ERROR' && "¡Ups! parece que algo salió mal, recuerda que la contraseña debe tener mínimo seis dígitos."}
                {errorType === 'PASS_MATCH_ERROR' && "¡Ups! parece que algo salió mal, por favor verifica que la contraseña sea la misma en ambos campos y vuelve a intentarlo."}
              </p>
          </div>
          {/* LOGO CORREGIDO */}
          <img 
            src={smallLogo} 
            alt="Logo Sabana" 
            className="h-12 w-auto object-contain" 
          />
        </header>

        {/* ESTA ES LA CÁPSULA BLANCA PRINCIPAL QUE FALTABA */}
        <div className="w-full max-w-xl bg-white rounded-[32px] shadow-2xl p-8 border border-defaultBorder-gray">
          <form onSubmit={handleSubmit} className="space-y-4">  
            
            {/* Fila: Nombre y Apellido */}
            <div className="flex gap-4">
              <div className={`flex-1 rounded-2xl border-2 px-5 py-3 transition-all ${getInputStyles(['NAME_ERROR'], 'name')}`}>  
                <label className="block text-gray-400 text-[10px] uppercase font-bold mb-1">Nombre</label>
                <input 
                  name="name"
                  type="text" 
                  className="w-full bg-transparent text-default-black font-medium outline-none"
                  onChange={handleChange}
                />
              </div>
              <div className={`flex-1 rounded-2xl border-2 px-5 py-3 transition-all ${getInputStyles(['NAME_ERROR'], 'lastName')}`}>
                <label className="block text-gray-400 text-[10px] uppercase font-bold mb-1">Apellido</label>
                <input 
                  name="lastName"
                  type="text" 
                  className="w-full bg-transparent text-default-black font-medium outline-none"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Input: Correo */}
            <div className={`rounded-2xl border-2 px-5 py-4 transition-all ${getInputStyles(['DOMAIN_ERROR'], 'email')}`}>
              <input 
                name="email"
                type="email" 
                placeholder="usuario@unisabana.edu.co"
                className="w-full bg-transparent text-default-black font-medium outline-none placeholder:text-gray-400"
                onChange={handleChange}
              />
            </div>

            {/* Input: Contraseña */}
            <div className={`rounded-2xl border-2 px-5 py-4 flex justify-between items-center transition-all ${getInputStyles(['PASS_LENGTH_ERROR', 'PASS_MATCH_ERROR'], 'password')}`}>
              <input 
                name="password"
                type={showPass ? "text" : "password"} 
                placeholder="contraseña"
                className="w-full bg-transparent text-default-black font-medium outline-none placeholder:text-gray-400"
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400">
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Input: Confirmar Contraseña */}
            <div className={`rounded-2xl border-2 px-5 py-4 flex justify-between items-center transition-all ${getInputStyles(['PASS_MATCH_ERROR'], 'confirmPassword')}`}>
              <input 
                name="confirmPassword"
                type={showPass ? "text" : "password"} 
                placeholder="confirmar contraseña"
                className="w-full bg-transparent text-default-black font-medium outline-none placeholder:text-gray-400"
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400">
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Seleccionador de Carrera */}
            <div className={`rounded-2xl border-2 px-5 py-4 transition-all ${getInputStyles(['EMPTY_FIELDS'], 'career')}`}>
              <select 
                name="career"
                className="w-full bg-transparent text-default-black font-medium outline-none appearance-none"
                onChange={handleChange}
                defaultValue=""
              >
                <option value="" disabled>Selecciona tu carrera</option>
                <option value="" disabled>Escuela Internacional de Ciencias Económicas y Administrativas:</option>
                <option value="Business Administration">Administración de Empresas</option>
                <option value="Administration & Service">Administración & Servicio</option>
                <option value="Marketing and International Logistics Administration">Administración de Mercadeo y Logística Internacionales</option>
                <option value="International Business Administration">Administración de Negocios Internacionales</option>
                <option value="International Economics and Finance">Economía y Finanzas Internacionales</option>
                <option value="International Economics and Finance (Online)">Economía y Finanzas Internacionales Virtual</option>
                <option value="Gastronomy">Gastronomía</option>
                <option value="" disabled>Facultad de Ciencias del Comportamiento:</option>
                <option value="Organizational Behavior">Comportamiento Organizacional</option>
                <option value="Psychology">Psicología</option>
                <option value="" disabled>Facultad de Comunicación:</option>
                <option value="Audiovisual and Multimedia Communication">Comunicación Audiovisual y Multimedios</option>
                <option value="Corporate Communication">Comunicación Corporativa</option>
                <option value="Social Communication and Journalism">Comunicación Social y Periodismo</option>
                <option value="" disabled>Facultad de Educación:</option>
                <option value="Early Childhood Education Teaching Degree">Licenciatura en Educación Infantil</option>
                <option value="Unisabana College">Unisabana College</option>
                <option value="" disabled>Facultad de Ciencias de la Vida y el Bienestar:</option>
                <option value="Nursing">Enfermería</option>
                <option value="Physiotherapy">Fisioterapia</option>
                <option value="" disabled>Facultad de Estudios Jurídicos, Políticos e Internacionales:</option>
                <option value="Political Science">Ciencias Políticas</option>
                <option value="Law">Derecho</option>
                <option value="International Relations">Relaciones Internacionales</option>
                <option value="" disabled>Facultad de Filosofía y Ciencias Humanas:</option>
                <option value="Philosophy">Filosofía</option>
                <option value="" disabled>Facultad de Ingeniería:</option>
                <option value="Data Science">Ciencia de Datos</option>
                <option value="Bioproduction Engineering">Ingeniería de Bioproducción</option>
                <option value="Design and Innovation Engineering">Ingeniería de Diseño e Innovación</option>
                <option value="Mechanical Engineering">Ingeniería Mecánica</option>
                <option value="Chemical Engineering">Ingeniería Química</option>
                <option value="Computer Engineering">Ingeniería Informática</option>
                <option value="Industrial Engineering">Ingeniería Industrial</option>
                <option value="Civil Engineering">Ingeniería Civil</option>
                <option value="" disabled>Facultad de Medicina:</option>
                <option value="Medicine">Medicina</option>
                
              </select>
            </div>

            {/* Botón Registrarme */}
            <div className="pt-4">
              <button 
                type="submit"
                className="w-full bg-sabana-blue text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-sabana-blue-hover transition-all uppercase tracking-widest text-sm"
              >
                Registrarme
              </button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-sm text-sabana-blue font-medium">
          ¿Ya tienes una cuenta?{' '}
          <span 
            onClick={() => navigate('/login')} 
            className="font-bold underline cursor-pointer"
          >
            Inicia sesión
          </span>
        </p>
      </section>
    </main>
  );
};

export default RegisterPage;