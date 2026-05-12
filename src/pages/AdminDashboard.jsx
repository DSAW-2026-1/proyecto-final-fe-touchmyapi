import React, { useState } from 'react';
import { Users, Package, LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminProducts from '../components/AdminProducts';
import AdminUsers from '../components/AdminUsers';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Sencillo */}
      <div className="w-64 bg-sabana-blue text-white p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-8 border-b border-white/20 pb-4">Panel Admin</h2>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <Package size={20} /> Publicaciones
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <Users size={20} /> Usuarios
          </button>
        </nav>

        <button 
          onClick={() => navigate('/')}
          className="mt-auto flex items-center gap-3 p-3 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Volver al Inicio
        </button>
      </div>

      {/* Contenido Principal */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Gestionar {activeTab === 'products' ? 'Publicaciones' : 'Usuarios'}
          </h1>
          <div className="bg-sabana-softGold text-sabana-blue px-4 py-1 rounded-full text-xs font-bold uppercase">
            Admin Mode
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[500px]">
        {activeTab === 'products' ? (
            <AdminProducts />
        ) : (
            <AdminUsers />
        )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;