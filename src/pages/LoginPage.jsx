import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import smallLogo from '../assets/sabanalogo.png';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const cleanEmail = email.toLowerCase().trim();
    const isEmailValid = cleanEmail.endsWith('@unisabana.edu.co');
    const isPasswordValid = password.length >= 6;

    if (!isEmailValid || !isPasswordValid) {
      setHasError(true);
      return;
    }

    setLoading(true);
    setHasError(false);

    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: password
        }),
      });

      if (response.ok) {
        const userData = await response.json();

       login(userData); 

        // REDIRECCIÓN SEGÚN ROL 
        if (userData.role === 'ADMIN') {
          navigate('/admin-control'); 
        } else {
          navigate('/login-success');
        }
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
      alert("No se pudo conectar con el servidor. Revisa si el backend está corriendo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full relative font-roboto overflow-hidden">
      {/* Fondo dual */}
      <div className="absolute inset-0 z-0">
        <div className="h-1/2 w-full bg-sabana-blue"></div>
        <div className="h-1/2 w-full bg-sabana-light"></div>
      </div>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        
        {/* Header */}
        <header className="w-full max-w-xl flex justify-between items-start mb-6">
          <img 
            src={smallLogo} 
            alt="Logo Sabana" 
            className="h-12 w-auto object-contain" 
          />
          <button 
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 flex items-center gap-2 text-sabana-blue font-bold text-sm hover:translate-x-[-4px] transition-all group"
          >
            <div className="bg-default-white p-2 rounded-xl shadow-sm group-hover:shadow-md transition-all">
              <ArrowLeft size={20} />
            </div>
            <span className="hidden sm:block">Volver al inicio</span>
          </button>
          
          <div className="text-center flex-1 pr-12">
            <h1 className="text-5xl font-bold text-white font-roboto-slab mb-2 tracking-tight">Ingresa a tu cuenta</h1>
            <p className={`text-sm max-w-[450px] mx-auto leading-tight font-medium transition-all duration-300 ${hasError ? 'text-sabana-softGold' : 'text-sabana-blue-light'}`}>
              {hasError 
                ? '¡Ups! Parece que algo salió mal. Verifica tus credenciales institucionales.'
                : '¡Hola! Por favor ingresa con tu correo de la U para poder acceder a nuestros servicios.'}
            </p>
          </div>
        </header>

        {/* Formulario */}
        <div className="w-full max-w-md bg-default-white rounded-[32px] shadow-2xl p-8 border border-defaultBorder-gray">
          
          <div className="flex items-center justify-center mb-6">
             <div className="h-[1px] bg-gray-100 flex-1"></div>
             <span className="px-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest whitespace-nowrap">
               Sesión Institucional
             </span>
             <div className="h-[1px] bg-gray-100 flex-1"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Input Correo */}
            <div className={`rounded-2xl border-2 px-5 py-4 transition-all duration-300 
                ${hasError ? 'border-error-red bg-error-bg-red' : 'border-defaultBorder-gray bg-default-white'}`}>
                <input 
                    type="email" 
                    placeholder="usuario@unisabana.edu.co"
                    className="w-full outline-none text-default-gray font-medium bg-transparent"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if(hasError) setHasError(false);
                    }}
                    required
                />
            </div>

            {/* Input Contraseña */}
            <div className={`rounded-2xl border-2 px-5 py-4 flex justify-between items-center transition-all duration-300 
                ${hasError ? 'border-error-red bg-error-bg-red' : 'border-defaultBorder-gray bg-default-white'}`}>
                <input 
                    type={showPass ? "text" : "password"} 
                    placeholder="*******"
                    className="w-full outline-none text-default-gray font-medium bg-transparent"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if(hasError) setHasError(false);
                    }}
                    required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-sabana-blue transition-colors">
                    {showPass ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
            </div>

            {/* Botón de Acción */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className={`w-full bg-sabana-blue text-default-white font-bold py-4 rounded-2xl shadow-lg transition-all uppercase tracking-widest text-sm
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-sabana-blue-hover active:scale-[0.98]'}`}
              >
                {loading ? 'Verificando...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-sm text-sabana-blue font-medium">
          ¿No tienes cuenta?{' '}
          <span 
            onClick={() => navigate('/register')} 
            className="font-black underline cursor-pointer hover:text-sabana-blue-hover transition-colors"
          >
            ¡Regístrate ahora!
          </span>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;