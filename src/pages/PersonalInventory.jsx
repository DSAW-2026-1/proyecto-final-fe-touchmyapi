import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Trash2, Plus, ArrowLeft, Pencil, Clock, CheckCircle2, ShoppingBag, User, X, AlertCircle } from 'lucide-react';
import smallLogo from '../assets/sabanalogo.png'; 
import { useAuth } from '../context/AuthContext';

const PersonalInventory = () => {
  const navigate = useNavigate();
  // Traemos 'updateUserRole' para mantener viva la sincronización de roles del código viejo
  const { user, updateUserRole } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]); 
  const [activeTab, setActiveTab] = useState('inventory'); 
  const [loading, setLoading] = useState(true);
  const [loadingSales, setLoadingSales] = useState(false); 
  const [editingProduct, setEditingProduct] = useState(null);
  
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  // Traer Inventario de Productos (Funcionalidad Completa Vieja)
  const fetchProducts = async () => {
    if (!user || !user.email) {
      navigate('/login');
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/api/v1/products/owner/${user.email}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        
        // Sincronización automática de roles según stock / catálogo activo
        if (data.length > 0 && user.role === 'USER') {
          updateUserRole('SELLER');
        } else if (data.length === 0 && user.role === 'SELLER') {
          updateUserRole('USER');
        }
      }
    } catch (error) {
      console.error("No pude conectar con el server:", error);
    } finally {
      setLoading(false);
    }
  };

  // Traer Cola de Ventas del Vendedor (Función Nueva)
  const fetchSalesQueue = async () => {
    if (!user?.email) return;
    setLoadingSales(true);
    try {
      const response = await fetch(`${apiUrl}/api/v1/orders/seller/${user.email}`);
      if (response.ok) {
        const data = await response.json();
        setSales(data);
      }
    } catch (error) {
      console.error("Error cargando cola de ventas:", error);
    } finally {
      setLoadingSales(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchSalesQueue();
    }
  }, [user, navigate]);

  // Cambiar estado a Entregado en el Backend (Función Nueva)
  const handleMarkAsDelivered = async (orderId) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ENTREGADO' })
      });

      if (response.ok) {
        setSales(sales.map(sale => sale.id === orderId ? { ...sale, status: 'ENTREGADO' } : sale));
        alert("¡Pedido marcado como entregado! Ahora el comprador podrá calificar este producto.");
      } else {
        alert("No se pudo actualizar el estado de la orden.");
      }
    } catch (error) {
      console.error("Error actualizando orden:", error);
    }
  };

  // Eliminar producto (Mezcla de confirmación robusta y actualización de roles)
  const handleDeleteProduct = async (id) => {
    if (window.confirm("¿Seguro que quieres borrar este producto? Esta acción no se puede deshacer y modificará tu catálogo.")) {
      try {
        const response = await fetch(`${apiUrl}/api/v1/products/${id}`, { method: 'DELETE' });
        if (response.ok) {
          const updatedProducts = products.filter(product => product.id !== id);
          setProducts(updatedProducts);
          
          // Reevaluar rol si el catálogo se queda en 0 tras eliminar
          if (updatedProducts.length === 0 && user?.role === 'SELLER') {
            updateUserRole('USER');
          }
        } else {
          alert("El servidor no permitió borrar el producto.");
        }
      } catch (error) {
        console.error("Error al borrar:", error);
        alert("Error al intentar conectar con el servidor.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-sabana-light font-roboto flex flex-col">
      
      {/* HEADER DE CONTROL */}
      <header className="bg-sabana-blue text-white py-4 px-6 sticky top-0 z-50 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/publicshowcase')}>
          <img src={smallLogo} alt="Logo Unisabana" className="h-10 w-auto bg-white p-1 rounded-lg" />
          <h1 className="text-xl font-roboto-slab font-black uppercase tracking-wider">Panel de Control Vendedor</h1>
        </div>
        
        <button onClick={() => {
              // Revisamos la URL de la página inmediatamente anterior en el navegador
              const previousPage = document.referrer;

              // Si la página de la que viene incluye 'create-product', lo mandamos al perfil seguro
              if (previousPage.includes('create-product')) {
                navigate('/userprofile');
              } else {
                // Si viene de cualquier otra parte (del home, del perfil, etc.), hacemos el atrás normal
                navigate(-1);
              }
            }} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-sabana-blue-light bg-white/5 border border-white/20 hover:bg-white/10 hover:text-white px-4 py-2 rounded-xl transition-all">
            <ArrowLeft size={14} /> Atrás
          </button>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 space-y-6">
        
        {/* TITULAR Y PRESENTACIÓN */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-roboto-slab font-black text-slate-800 uppercase tracking-wide">
              ¡Hola, {user?.name || 'Vendedor Sabana'}!
            </h2>
            <p className="text-xs text-gray-500 font-bold mt-0.5">Gestiona tus artículos publicados y controla tus entregas pendientes en el campus.</p>
          </div>

          {activeTab === 'inventory' && (
            <button 
              onClick={() => navigate('/create-product')}
              className="bg-sabana-blue text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sabana-blue-hover transition-all shadow-md flex items-center gap-2 self-start sm:self-center active:scale-[0.98]"
            >
              <Plus size={16} /> Publicar Artículo
            </button>
          )}
        </div>

        {/* CONTROLLER DE TABS EN LÍNEA */}
        <div className="flex border-b border-gray-200 gap-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-5 py-3 font-roboto-slab text-xs font-black uppercase tracking-wider border-b-2 transition-all rounded-t-xl ${
              activeTab === 'inventory' 
                ? 'border-sabana-blue text-sabana-blue bg-white shadow-sm' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Mis Productos ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-5 py-3 font-roboto-slab text-xs font-black uppercase tracking-wider border-b-2 transition-all rounded-t-xl flex items-center gap-2 ${
              activeTab === 'sales' 
                ? 'border-sabana-blue text-sabana-blue bg-white shadow-sm' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Cola de Ventas ({sales.filter(s => s.status !== 'ENTREGADO').length} Pendientes)
          </button>
        </div>

        {/* RENDERIZADO DE CONTENIDO SEGÚN LA PESTAÑA SELECCIONADA */}
        {activeTab === 'inventory' ? (
          /* ================= PESTAÑA 1: INVENTARIO DE PRODUCTOS ================= */
          <div className="space-y-4">
            {loading ? (
              <p className="text-center py-10 text-xs font-bold text-gray-400 uppercase tracking-widest">Cargando tu inventario...</p>
            ) : products.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl text-center shadow-sabana-card max-w-md mx-auto space-y-3">
                <ShoppingBag className="mx-auto text-gray-300" size={40} />
                <p className="text-sm font-bold text-slate-700">No tienes productos publicados en este momento.</p>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="bg-white p-5 rounded-3xl shadow-sabana-card border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                  <img 
                    src={product.imageUrl && product.imageUrl.trim() !== '' ? product.imageUrl : smallLogo} 
                    alt={product.title} 
                    className="w-16 h-16 object-cover rounded-2xl border border-gray-200 shrink-0 bg-slate-50 p-1" 
                  />
                    <div className="text-center sm:text-left">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight line-clamp-1">{product.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 font-medium">{product.description}</p>
                      <span className="inline-block mt-2 text-[9px] font-black tracking-wider bg-sabana-light text-sabana-blue px-2.5 py-0.5 rounded uppercase">{product.category}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                    <div className="text-center min-w-[70px]">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Precio</p>
                      <p className="text-xs font-bold text-slate-800">${product.price?.toLocaleString('es-CO')}</p>
                    </div>
                    <div className="text-center min-w-[50px]">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Stock</p>
                      <p className="bg-sabana-light text-sabana-blue px-2.5 py-0.5 rounded-lg text-xs font-black mt-0.5">{product.stock}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingProduct(product)} className="p-2.5 rounded-xl bg-slate-50 border border-gray-200 text-gray-500 hover:text-sabana-blue hover:bg-sabana-light hover:border-transparent transition-all"><Pencil size={16} /></button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* ================= PESTAÑA 2: COLA DE VENTAS ================= */
          <div className="space-y-4">
            {loadingSales ? (
              <p className="text-center py-10 text-xs font-bold text-gray-400 uppercase tracking-widest">Cargando cola de ventas...</p>
            ) : sales.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl text-center shadow-sabana-card max-w-md mx-auto space-y-3">
                <Clock className="mx-auto text-gray-300" size={40} />
                <p className="text-sm font-bold text-slate-700">Aún no has registrado ventas de tus productos.</p>
              </div>
            ) : (
              sales.map((sale) => (
                <div 
                  key={sale.id} 
                  className={`bg-white p-5 rounded-3xl shadow-sabana-card border transition-all flex flex-col gap-4 animate-fadeIn ${
                    sale.status === 'ENTREGADO' ? 'border-emerald-100 bg-emerald-50/10 opacity-75' : 'border-gray-100'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <span className="text-[10px] font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">ORDEN #{sale.id}</span>
                      <h4 className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                        <User size={13} className="text-gray-400" /> Comprador: <span className="text-sabana-blue font-black">{sale.buyerEmail || sale.email}</span>
                      </h4>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">Punto de encuentro: {sale.address} ({sale.city})</p>
                    </div>

                    <div>
                      {sale.status === 'ENTREGADO' ? (
                        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                          <CheckCircle2 size={12} /> Entregado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                          <Clock size={12} /> Pendiente Entrega
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Artículos a entregar:</p>
                    {sale.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-50/50 p-2.5 rounded-2xl border border-gray-100 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg border bg-white overflow-hidden flex items-center justify-center shrink-0">
                          <img 
                            src={item.imageUrl && item.imageUrl.trim() !== '' ? item.imageUrl : smallLogo} 
                            alt={item.title} 
                            className="w-full h-full object-cover p-0.5" 
                          />
                          </div>
                          <div>
                            <p className="font-black text-slate-800 uppercase tracking-tight">{item.title || `Artículo ID: ${item.productId}`}</p>
                            <p className="text-[10px] text-gray-400 font-bold">Cantidad: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-extrabold text-sabana-blue">${(Number(item.price || 0) * Number(item.quantity)).toLocaleString('es-CO')}</p>
                      </div>
                    ))}
                  </div>

                  {sale.status !== 'ENTREGADO' && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleMarkAsDelivered(sale.id)}
                        className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] px-4 py-2.5 rounded-xl transition-all shadow-sm"
                      >
                        <CheckCircle2 size={14} /> Marcar como Entregado por Orden
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <footer className="bg-sabana-blue text-white py-6 text-center text-[10px] font-bold uppercase tracking-[0.25em] border-t-4 border-sabana-blue-hover mt-12">
        Personas que inspiran personas — Universidad de La Sabana
      </footer>

      {/* MODAL DE EDICIÓN COMPLETO CON VALIDACIONES ROBUSTAS VIEJAS */}
      {editingProduct && (
        <EditModal 
          product={editingProduct} 
          onClose={() => setEditingProduct(null)} 
          onUpdate={handleUpdateProduct}
          apiUrl={apiUrl}
        />
      )}
    </div>
  );
};

/* Sub-Componente de Edición Extraído y Acoplado con Estética Sabana */
const EditModal = ({ product, onClose, onUpdate, apiUrl }) => {
  const [formData, setFormData] = useState({ ...product });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [hostMessage, setHostMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    const MAX_PRICE = 1000000000;
    
    if (!formData.title?.trim()) newErrors.title = 'El nombre es obligatorio';
    if (!formData.category) newErrors.category = 'Selecciona una categoría';

    const numericPrice = Number(formData.price);
    if (formData.price === '' || Number.isNaN(numericPrice) || numericPrice <= 0 || numericPrice > MAX_PRICE) {
      newErrors.price = 'Indica un precio válido';
    }

    const numericStock = Number(formData.stock);
    if (formData.stock === '' || Number.isNaN(numericStock) || numericStock < 1) {
      newErrors.stock = 'El stock debe ser al menos 1';
    }

    if (!formData.description?.trim() || formData.description.trim().length < 3) {
      newErrors.description = 'La descripción es muy corta';
    }

    const urlTrim = (formData.imageUrl || '').trim();
    if (urlTrim) {
      try {
        const u = new URL(urlTrim);
        if (!['http:', 'https:'].includes(u.protocol)) {
          newErrors.imageUrl = 'La URL debe iniciar con http o https';
        }
      } catch {
        newErrors.imageUrl = 'Introduce una URL de imagen válida';
      }
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = () => {
    return (
      formData.title !== product.title ||
      Number(formData.price) !== Number(product.price) ||
      Number(formData.stock) !== Number(product.stock) ||
      formData.category !== product.category ||
      formData.description !== product.description ||
      formData.imageUrl !== product.imageUrl
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHostMessage('');
    

    if (!validateForm()) return;
    if (!hasChanges()) {
      setHostMessage('No hay cambios nuevos para sincronizar.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/v1/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: Number(formData.price),
          stock: Number(formData.stock),
          category: formData.category,
          imageUrl: formData.imageUrl ? formData.imageUrl.trim() : ''
        })
      });

      if (response.ok) {
        const updatedData = await response.json();
        onUpdate(updatedData);
        alert('¡Producto actualizado exitosamente!');
        onClose();
      } else {
        setHostMessage('El servidor rechazó los cambios de actualización.');
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      setHostMessage('Error crítico al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="font-roboto-slab font-black text-sabana-blue uppercase tracking-wide">Editar Producto</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        {hostMessage && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl flex items-center gap-2">
            <AlertCircle size={16} />
            <span className="font-medium">{hostMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-black text-gray-500 uppercase mb-1">Nombre del Producto</label>
            <input 
              type="text" 
              className={`w-full p-3 rounded-xl border bg-slate-50/50 ${fieldErrors.title ? 'border-rose-500' : 'border-gray-200'}`}
              value={formData.title} 
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            {fieldErrors.title && <p className="text-rose-500 font-bold mt-1">{fieldErrors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-black text-gray-500 uppercase mb-1">Precio (COP)</label>
              <input 
                type="number" 
                className={`w-full p-3 rounded-xl border bg-slate-50/50 ${fieldErrors.price ? 'border-rose-500' : 'border-gray-200'}`}
                value={formData.price} 
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
              {fieldErrors.price && <p className="text-rose-500 font-bold mt-1">{fieldErrors.price}</p>}
            </div>
            <div>
              <label className="block font-black text-gray-500 uppercase mb-1">Stock</label>
              <input 
                type="number" 
                className={`w-full p-3 rounded-xl border bg-slate-50/50 ${fieldErrors.stock ? 'border-rose-500' : 'border-gray-200'}`}
                value={formData.stock} 
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
              />
              {fieldErrors.stock && <p className="text-rose-500 font-bold mt-1">{fieldErrors.stock}</p>}
            </div>
          </div>

          <div>
            <label className="block font-black text-gray-500 uppercase mb-1">Categoría</label>
            <select 
              className="w-full p-3 rounded-xl border border-gray-200 bg-slate-50/50 font-medium text-gray-700"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="ACADEMIC_SUPPLIES">Útiles académicos</option>
              <option value="BOOKS">Libros</option>
              <option value="ELECTRONICS">Electrónica</option>
              <option value="CLOTHING">Ropa</option>
              <option value="FOOD">Comida</option>
              <option value="SERVICES">Servicios</option>
              <option value="OTHER">Otros</option>
            </select>
          </div>

          <div>
            <label className="block font-black text-gray-500 uppercase mb-1">URL de la Imagen</label>
            <input 
              type="text" 
              className={`w-full p-3 rounded-xl border bg-slate-50/50 ${fieldErrors.imageUrl ? 'border-rose-500' : 'border-gray-200'}`}
              value={formData.imageUrl} 
              onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            {fieldErrors.imageUrl && <p className="text-rose-500 font-bold mt-1">{fieldErrors.imageUrl}</p>}
          </div>

          <div>
            <label className="block font-black text-gray-500 uppercase mb-1">Descripción</label>
            <textarea 
              rows="3"
              className={`w-full p-3 rounded-xl border bg-slate-50/50 ${fieldErrors.description ? 'border-rose-500' : 'border-gray-200'}`}
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
            {fieldErrors.description && <p className="text-rose-500 font-bold mt-1">{fieldErrors.description}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="w-1/3 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold uppercase hover:bg-slate-200 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="w-2/3 bg-sabana-blue text-white py-3 rounded-xl font-black uppercase tracking-wider hover:bg-sabana-blue-hover transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Sincronizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInventory;