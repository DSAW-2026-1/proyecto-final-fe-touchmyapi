import React, { useState, useEffect } from 'react';
import { UserMinus, ShieldCheck, RefreshCw, GraduationCap } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // Tu correo maestro para las protecciones
  const MAIN_ADMIN_EMAIL = "jusselth@unisabana.edu.co";

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/v1/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (email, name) => {
    if (email === MAIN_ADMIN_EMAIL) return; // Doble check de seguridad

    const confirmed = window.confirm(`¿Seguro que quieres banear a ${name}? Ya no podrá entrar al Marketplace.`);
    if (confirmed) {
      try {
        const response = await fetch(`${apiUrl}/api/v1/users/${email}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setUsers(users.filter(user => user.email !== email));
          alert("Usuario eliminado.");
        }
      } catch (error) {
        alert("Error al eliminar.");
      }
    }
  };

  // NUEVA FUNCIÓN: Promover a Admin
  const handleToggleRole = async (email, currentRole) => {
    const action = currentRole === 'ADMIN' ? 'quitar permisos de admin a' : 'promover a admin a';
    
    if (window.confirm(`¿Seguro que quieres ${action} ${email}?`)) {
        try {
            const response = await fetch(`${apiUrl}/api/v1/users/${email}/toggle-role`, {
            method: 'PATCH',
            });
    
            if (response.ok) {
            // Actualizamos el estado local
            fetchUsers(); 
            } else {
            const errorMsg = await response.text();
            alert(errorMsg);
            }
        } catch (error) {
            alert("Error de conexión al cambiar el rango.");
        }
        }
    };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return (
    <div className="flex flex-col justify-center items-center py-20 gap-4">
      <RefreshCw className="animate-spin text-sabana-blue" size={40} />
      <p className="text-gray-500 font-medium">Cargando comunidad Sabana...</p>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr className="text-sabana-blue text-[10px] uppercase tracking-widest">
            <th className="px-6 py-4 font-black">Estudiante</th>
            <th className="px-6 py-4 font-black">Correo Institucional</th>
            <th className="px-6 py-4 font-black">Carrera</th>
            <th className="px-6 py-4 font-black text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            // Lógica de protección dentro del map
            const isMainAdmin = u.email === MAIN_ADMIN_EMAIL;
            const isAdmin = u.role === 'ADMIN';

            return (
              <tr key={u.id || u.email} className="bg-white shadow-sm hover:shadow-md transition-all rounded-xl">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isAdmin ? 'bg-sabana-blue text-white' : 'bg-sabana-light text-sabana-blue'}`}>
                      {u.name?.charAt(0)}{u.lastName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 flex items-center gap-2">
                        {u.name} {u.lastName}
                        {isAdmin && <ShieldCheck size={14} className="text-sabana-blue" title="Administrador" />}
                      </p>
                      <span className="text-[9px] font-black text-gray-400 uppercase">ID: {u.id?.substring(0, 8)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm font-medium">{u.email}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <GraduationCap size={16} className="text-sabana-blue/40" />
                    <span className="text-xs font-bold uppercase">{u.career || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    {/* Botón Promover */}
                    <button 
                    onClick={() => handleToggleRole(u.email, u.role)}
                    disabled={isMainAdmin}
                    className={`p-2 rounded-lg transition-all ${
                        isMainAdmin 
                        ? 'text-gray-100' 
                        : isAdmin 
                            ? 'text-sabana-blue bg-blue-50 hover:bg-blue-100' 
                            : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={isAdmin ? "Quitar rango Admin" : "Hacer Admin"}
                    >
                    <ShieldCheck size={20} className={isAdmin ? "fill-current" : ""} />
                    </button>

                    {/* Botón Eliminar */}
                    <button 
                      onClick={() => handleDeleteUser(u.email, u.name)}
                      disabled={isMainAdmin}
                      className={`p-2 rounded-lg transition-all ${isMainAdmin ? 'text-gray-100 cursor-not-allowed' : 'text-red-400 hover:bg-red-50'}`}
                      title={isMainAdmin ? "Admin Principal (Protegido)" : "Eliminar Estudiante"}
                    >
                      <UserMinus size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;