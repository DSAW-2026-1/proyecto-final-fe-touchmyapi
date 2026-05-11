import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Phone, Mail, Trash2, Plus, ArrowLeft, Pencil } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import smallLogo from '../assets/sabanalogo.png'; 
import downloadImg from '../assets/descargar.png';
import completeLogo from '../assets/unisabanalogocomplete.png';

const PersonalInventory = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const fetchProducts = async () => {
    try {
      // Sacamos el email que guardamos en el login
      const userEmail = localStorage.getItem('userEmail');
      
      if (!userEmail) {
        navigate('/login'); // Si no hay email, no debería estar aquí
        return;
      }

      // Llamamos al nuevo endpoint filtrado por email
      const response = await fetch(`http://localhost:8080/api/v1/products/owner/${userEmail}`);
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("No pude conectar con el server:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres borrar este producto?")) {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/products/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setProducts(products.filter(product => product.id !== id));
        }
      } catch (error) {
        alert("Error al intentar borrar.");
      }
    }
  };
  const CATEGORIES = [
    { value: 'ACADEMIC_SUPPLIES', label: 'Útiles académicos' },
    { value: 'BOOKS', label: 'Libros' },
    { value: 'ELECTRONICS', label: 'Electrónica' },
    { value: 'CLOTHING', label: 'Ropa' },
    { value: 'FOOD', label: 'Comida' },
    { value: 'SERVICES', label: 'Servicios' },
    { value: 'OTHER', label: 'Otros' },
  ];
  
  const EditModal = ({ product, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({ ...product });
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [hostMessage, setHostMessage] = useState('');
  
    if (!product) return null;
  
    const validateForm = () => {
      const newErrors = {};
      const MAX_PRICE = 1_000_000_000_000;
      
      // Validaciones de texto y selección
      if (!formData.title.trim()) newErrors.title = 'El nombre es obligatorio';
      if (!formData.category) newErrors.category = 'Selecciona una categoría';
      if (!formData.condition) newErrors.condition = 'Selecciona el estado';
  
      // Validación de Precio
      const numericPrice = Number(formData.price);
      if (formData.price === '' || Number.isNaN(numericPrice) || numericPrice <= 0 || numericPrice > MAX_PRICE) {
        newErrors.price = 'Indica un precio válido';
      }
  
      // Validación de Stock (Mínimo 1)
      const numericStock = Number(formData.stock);
      if (formData.stock === '' || Number.isNaN(numericStock) || numericStock < 1) {
        newErrors.stock = 'El stock debe ser al menos 1';
      }
  
      // Validación de Descripción
      if (!formData.description.trim() || formData.description.trim().length < 3) {
        newErrors.description = 'La descripción es muy corta';
      }
  
      // --- NUEVA VALIDACIÓN DE IMAGEN (URL) ---
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
        formData.category !== product.category ||
        Number(formData.stock) !== Number(product.stock) ||
        formData.description !== product.description ||
        formData.condition !== product.condition ||
        formData.imageUrl !== product.imageUrl
      );
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setHostMessage('');
  
      if (!validateForm()) return;
  
      if (!hasChanges()) {
        setHostMessage('No hay cambios nuevos para guardar.');
        setTimeout(() => setHostMessage(''), 3000);
        return;
      }
  
      setLoading(true);
      try {
        const payload = {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          title: formData.title.trim(),
          description: formData.description.trim(),
          imageUrl: (formData.imageUrl || '').trim()
        };
  
        const response = await fetch(`http://localhost:8080/api/v1/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
  
        if (response.ok) {
          const updatedProduct = await response.json();
          onUpdate(updatedProduct); 
          onClose();
          alert("Producto actualizado correctamente");
        }
      } catch (error) {
        alert("Error al conectar con el backend.");
      } finally {
        setLoading(false);
      }
    };
  
    const getInputClass = (fieldName) => `
      w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-medium
      ${fieldErrors[fieldName] 
        ? 'border-error-red bg-error-bg-red focus:border-error-red' 
        : 'border-defaultBorder-gray bg-default-white focus:border-sabana-softGold'}
    `;
  
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
        <div className="absolute inset-0 bg-sabana-blue/60 backdrop-blur-sm" onClick={onClose}></div>
        
        <form onSubmit={handleSubmit} className="relative bg-default-white w-full max-w-2xl rounded-[32px] p-8 shadow-2xl my-8">
          {hostMessage && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] z-[110]">
              <p className="bg-sabana-softGold text-sabana-blue text-xs font-black p-3 rounded-2xl text-center shadow-lg border border-sabana-blue/10">
                {hostMessage}
              </p>
            </div>
          )}
  
          <h2 className="text-2xl font-black text-sabana-blue mb-6 border-b pb-4">Editar Detalles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-sabana-blue uppercase ml-1 mb-1">Nombre</label>
                <input className={getInputClass('title')} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                {fieldErrors.title && <p className="mt-1 ml-1 text-[10px] text-error-red font-bold uppercase">{fieldErrors.title}</p>}
              </div>
  
              {/* --- NUEVO CAMPO DE IMAGEN --- */}
              <div>
                <label className="block text-[11px] font-bold text-sabana-blue uppercase ml-1 mb-1">URL de Imagen (Opcional)</label>
                <input 
                  type="url" 
                  placeholder="https://ejemplo.com/foto.jpg"
                  className={getInputClass('imageUrl')} 
                  value={formData.imageUrl || ''} 
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
                />
                {fieldErrors.imageUrl && <p className="mt-1 ml-1 text-[10px] text-error-red font-bold uppercase">{fieldErrors.imageUrl}</p>}
              </div>
  
              <div>
                <label className="block text-[11px] font-bold text-sabana-blue uppercase ml-1 mb-1">Categoría</label>
                <select className={getInputClass('category')} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
  
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-sabana-blue uppercase ml-1 mb-1">Precio</label>
                  <input type="number" className={getInputClass('price')} value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                  {fieldErrors.price && <p className="mt-1 ml-1 text-[10px] text-error-red font-bold uppercase">{fieldErrors.price}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-sabana-blue uppercase ml-1 mb-1">Stock</label>
                  <input type="number" className={getInputClass('stock')} value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                  {fieldErrors.stock && <p className="mt-1 ml-1 text-[10px] text-error-red font-bold uppercase">{fieldErrors.stock}</p>}
                </div>
              </div>
  
              <div>
                <label className="block text-[11px] font-bold text-sabana-blue uppercase ml-1 mb-1">Estado</label>
                <select className={getInputClass('condition')} value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})}>
                  <option value="NEW">Nuevo</option>
                  <option value="USED">Usado</option>
                </select>
              </div>
  
              <div>
                <label className="block text-[11px] font-bold text-sabana-blue uppercase ml-1 mb-1">Descripción</label>
                <textarea rows="3" className={`${getInputClass('description')} resize-none`} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                {fieldErrors.description && <p className="mt-1 ml-1 text-[10px] text-error-red font-bold uppercase">{fieldErrors.description}</p>}
              </div>
            </div>
          </div>
  
          <div className="flex gap-4 mt-8">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-default-gray font-black uppercase tracking-widest hover:bg-sabana-light rounded-xl transition-all">Descartar</button>
            <button type="submit" disabled={loading} className={`flex-1 py-4 rounded-xl font-black uppercase tracking-widest shadow-lg transition-all ${!hasChanges() ? 'bg-gray-200 text-gray-400' : 'bg-sabana-blue text-white hover:bg-sabana-blue-hover'}`}>
              {loading ? 'Sincronizando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-sabana-light font-sans flex flex-col antialiased">
      {/* NAVBAR */}
      <header className="bg-sabana-blue sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-default-white p-1.5 rounded-xl shadow-inner">
            <img src={smallLogo} alt="Logo Sabana" className="h-8 w-auto object-contain" />
          </div>
          <span className="hidden md:block text-default-white font-bold tracking-tight text-lg">Marketplace Sabana</span>
        </div>
        
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Buscar en tu inventario..." 
              className="w-full py-2.5 px-11 rounded-xl bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:bg-white focus:text-sabana-blue focus:outline-none transition-all"
            />
            <Search className="absolute left-3.5 top-3 text-white/60 group-focus-within:text-sabana-blue w-5 h-5 transition-colors" />
          </div>
        </div>

        {/* SECCIÓN DE ICONOS EN EL NAVBAR */}
        <div className="flex items-center gap-5">
          
          {/* BOTÓN VOLVER*/}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-xl transition-all group"
            title="Ir al Inicio"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden lg:block text-xs font-bold uppercase tracking-wider">Volver a Inicio</span>
          </button>

          {/* CAMPANA DE NOTIFICACIONES */}
          <div className="relative cursor-pointer hover:opacity-80 transition-opacity">
            <Bell className="text-default-white w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-sabana-softGold w-3 h-3 rounded-full border-2 border-sabana-blue"></span>
          </div>

          {/* USUARIO */}
          <div className="w-10 h-10 rounded-xl bg-sabana-softGold/20 border border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all">
            <User className="text-default-white w-6 h-6" />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow container mx-auto px-4 py-10 max-w-5xl">
        {/* Header de Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-sabana-blue tracking-tight">Tus productos</h1>
            <p className="text-default-gray mt-1">Gestiona los artículos que tienes publicados actualmente.</p>
          </div>
          
          <button 
            onClick={() => navigate('/create-product')} 
            className="flex items-center justify-center gap-2 bg-sabana-blue text-default-white px-8 py-3.5 rounded-2xl font-bold hover:bg-sabana-blue-hover transition-all shadow-[0_10px_20px_rgba(0,29,74,0.2)] active:scale-95"
          >
            <Plus size={20} /> Añadir productos
          </button>
        </div>

        {/* LISTADO ESTILO CARD */}
        <div className="space-y-4">
          {/* Cabecera Oculta en Mobile */}
          <div className="hidden md:grid grid-cols-12 px-8 py-3 text-sabana-blue/60 font-bold text-xs uppercase tracking-widest">
            <div className="col-span-6">Detalles del Producto</div>
            <div className="col-span-2 text-center">Precio Unitario</div>
            <div className="col-span-2 text-center">En Stock</div>
            <div className="col-span-2 text-right">Valor Total</div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-default-gray font-medium">Cargando productos...</div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-sm border-2 border-dashed border-defaultBorder-gray">
              <p className="text-default-gray text-lg">Aún no tienes productos publicados.</p>
            </div>
          ) : (
            products.map((product) => (
              <div 
                key={product.id} 
                className="group grid grid-cols-1 md:grid-cols-12 items-center bg-default-white p-4 md:px-8 rounded-3xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-sabana-softGold/30"
              >
                {/* Info Principal */}
                <div className="col-span-6 flex items-center gap-5">
                  <div className="relative">
                  <img
                    src={product.imageUrl || smallLogo}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-2xl shadow-inner border border-defaultBorder-gray"
                    onError={(e) => { e.target.src = smallLogo; }}
                  />
                    <button 
                      onClick={() => setEditingProduct(product)} // <--- Ahora guarda el producto para editarlo
                      className="absolute -top-2 -left-2 bg-sabana-blue text-white p-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-sabana-softGold hover:text-sabana-blue"
                      title="Editar publicación"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="absolute -top-2 -right-2 bg-error-bg-red text-error-red p-1.5 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-red hover:text-white"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-sabana-blue leading-tight">{product.title}</h3>
                    <span className="text-[10px] font-bold bg-sabana-light px-2 py-0.5 rounded text-sabana-blue uppercase tracking-wider">
                      {product.category || 'Otros'}
                    </span>
                  </div>
                </div>

                {/* Precio */}
                <div className="col-span-2 text-center mt-4 md:mt-0">
                  <span className="md:hidden text-[10px] block font-bold text-default-gray">PRECIO</span>
                  <span className="text-default-gray font-medium">${product.price.toLocaleString('es-CO')}</span>
                </div>

                {/* Stock */}
                <div className="col-span-2 flex flex-col items-center mt-4 md:mt-0">
                  <span className="md:hidden text-[10px] block font-bold text-default-gray">STOCK</span>
                  <div className="bg-sabana-light text-sabana-blue font-bold px-4 py-1 rounded-xl border border-sabana-blue/10">
                    {product.stock || 1}
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-2 text-right mt-4 md:mt-0">
                  <span className="md:hidden text-[10px] block font-bold text-default-gray">TOTAL</span>
                  <span className="text-xl font-black text-sabana-blue">
                    ${(product.price * (product.stock || 1)).toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* FOOTER PREMIUM */}
      <footer className="bg-sabana-blue text-default-white mt-auto">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/10 pb-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img src={completeLogo} alt="Logo Sabana" className="h-16 w-auto object-contain" />
              <div className="h-12 w-[1px] bg-white/20 hidden md:block"></div>
              <p className="max-w-xs text-center md:text-left text-sm opacity-80 leading-relaxed">
                ¿Deseas destacar tus productos? Contáctanos y te ayudamos a llegar a más estudiantes.
              </p>
            </div>

            <div className="flex gap-4">
              {[ {Icon: FaInstagram, link: '#'}, {Icon: Phone, link: '#'}, {Icon: Mail, link: '#'} ].map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.link} 
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-sabana-softGold hover:text-sabana-blue hover:-translate-y-1 transition-all"
                >
                  <item.Icon size={24} />
                </a>
              ))}
            </div>
          </div>
          <div className="text-center text-xs opacity-40 font-medium tracking-widest uppercase">
            © 2026 Universidad de La Sabana - Marketplace Estudiantil
          </div>
        </div>
      </footer>
      <EditModal 
        product={editingProduct} 
        onClose={() => setEditingProduct(null)} 
        onUpdate={handleUpdateProduct}
      />
    </div>
  );
};

export default PersonalInventory;