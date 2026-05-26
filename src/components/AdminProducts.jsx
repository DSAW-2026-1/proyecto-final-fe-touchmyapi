import React, { useState, useEffect } from 'react';
// 🚀 CAMBIO: Importamos 'Star' y 'X' para el sistema de moderación de reseñas
import { Trash2, Edit, RefreshCw, Package, User, Hash, Star, X } from 'lucide-react';

const CATEGORIES = [
  { value: 'ACADEMIC_SUPPLIES', label: 'Útiles académicos' },
  { value: 'BOOKS', label: 'Libros' },
  { value: 'ELECTRONICS', label: 'Electrónica' },
  { value: 'CLOTHING', label: 'Ropa' },
  { value: 'FOOD', label: 'Comida' },
  { value: 'SERVICES', label: 'Servicios' },
  { value: 'OTHER', label: 'Otros' },
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // 🚀 NUEVO ESTADO: Controla qué producto se está moderando en el visor de reseñas
  const [moderatingProductReviews, setModeratingProductReviews] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/v1/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás completamente seguro de eliminar este producto del sistema de forma permanente?")) return;
    try {
      const response = await fetch(`${apiUrl}/api/v1/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert("Error al intentar eliminar el producto.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 font-roboto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-roboto-slab font-black text-sabana-blue uppercase tracking-wide">Catálogo Global de Productos</h2>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Consola de supervisión de artículos, inventarios y moderación de comentarios.</p>
        </div>
        <button 
          onClick={fetchProducts}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl font-black text-[10px] tracking-widest uppercase text-slate-600 transition-all active:scale-95"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Sincronizar
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Consultando base de datos activa...</div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center text-xs font-bold text-gray-400 uppercase tracking-wider bg-slate-50 rounded-2xl border border-dashed">No hay artículos cargados en la plataforma.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-sabana-blue/60 uppercase tracking-widest">
                <th className="p-4">Artículo</th>
                <th className="p-4">Propietario / Categoría</th>
                <th className="p-4 text-center">Precio</th>
                <th className="p-4 text-center">Stock</th>
                <th className="p-4 text-right">Acciones de Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.imageUrl || '/sabanalogo.png'} 
                        alt={product.title} 
                        className="w-12 h-12 object-cover rounded-xl bg-slate-100 border p-0.5 shrink-0" 
                        onError={(e) => { e.target.src = '/sabanalogo.png'; }}
                      />
                      <div>
                        <span className="text-[9px] font-black tracking-widest text-sabana-blue/40 uppercase">ID: #{product.id}</span>
                        <h4 className="font-black text-slate-800 uppercase tracking-tight line-clamp-1">{product.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-700 flex items-center gap-1"><User size={12} className="text-gray-300" /> {product.ownerEmail}</p>
                      <span className="inline-block text-[9px] font-black tracking-wider bg-sabana-light text-sabana-blue px-2 py-0.5 rounded uppercase">
                        {CATEGORIES.find(c => c.value === product.category)?.label || product.category}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center font-extrabold text-slate-800">${product.price?.toLocaleString('es-CO')}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block font-black px-2 py-0.5 rounded-lg text-[11px] ${product.stock === 0 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      {/* Ver/Moderar Reseñas de este producto */}
                      <button 
                        onClick={() => setModeratingProductReviews(product)}
                        title="Moderar Reseñas"
                        className="p-2 bg-amber-50 border border-amber-100 text-amber-500 hover:bg-amber-100 hover:text-amber-600 rounded-xl transition-all flex items-center gap-1"
                      >
                        <Star size={14} fill="currentColor" />
                      </button>

                      <button onClick={() => setSelectedProduct(product)} title="Editar Producto" className="p-2 bg-slate-50 border border-slate-200 text-slate-500 hover:bg-sabana-light hover:text-sabana-blue hover:border-transparent rounded-xl transition-all"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(product.id)} title="Eliminar Producto" className="p-2 bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100 rounded-xl transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedProduct && (
        <EditModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onUpdate={(updated) => {
            setProducts(products.map(p => p.id === updated.id ? updated : p));
            setSelectedProduct(null);
          }}
          apiUrl={apiUrl}
        />
      )}

      {/*Renderizado del panel de moderación de comentarios */}
      {moderatingProductReviews && (
        <AdminReviewsReviewsModal 
          product={moderatingProductReviews}
          onClose={() => setModeratingProductReviews(null)}
          apiUrl={apiUrl}
        />
      )}
    </div>
  );
};

/* ================= SUB-COMPONENTE NUEVO: PANEL DE CONTROL DE RESEÑAS PARA EL ADMIN ================= */
const AdminReviewsReviewsModal = ({ product, onClose, apiUrl }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProductReviews = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/reviews/product/${product.id}`);
      if (response.ok) {
        const data = await response.json();
        // Consumimos directo la propiedad de la base de datos
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error cargando calificaciones en consola admin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product?.id) {
      fetchProductReviews();
    }
  }, [product, apiUrl]);

  // Función ejecutada por el Admin para forzar el borrado de un comentario inapropiado
  const handleAdminDeleteReview = async (reviewId) => {
    if (!window.confirm("¿Deseas eliminar permanentemente esta reseña? El comentario desaparecerá de la vitrina pública.")) return;
    
    try {
      const response = await fetch(`${apiUrl}/api/v1/reviews/${reviewId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Removemos de la vista actual inmediatamente
        setReviews(reviews.filter(r => r.id !== reviewId));
        alert("Reseña removida de la plataforma exitosamente.");
      } else {
        alert("El servidor no pudo procesar la eliminación de la calificación.");
      }
    } catch (error) {
      console.error("Error eliminando comentario:", error);
      alert("Fallo de red al conectar con el servidor.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white p-6 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl flex flex-col max-h-[80vh]">
        
        {/* Encabezado del visor */}
        <div className="flex justify-between items-center border-b pb-3 shrink-0">
          <div>
            <h3 className="font-roboto-slab font-black text-rose-600 uppercase tracking-wide text-sm flex items-center gap-1.5">
              Moderación de Comentarios
            </h3>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight line-clamp-1">{product.title}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Lista de comentarios interactivos con botón de borrado */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
          {loading ? (
            <p className="text-center py-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Consultando registros...</p>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Star className="mx-auto text-gray-200" size={32} />
              <p className="text-xs font-bold text-slate-400">Este artículo no registra calificaciones actualmente.</p>
            </div>
          ) : (
            reviews.map((rev, index) => (
              <div key={rev.id || index} className="bg-slate-50 p-4 rounded-2xl border border-gray-100 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sabana-blue text-[11px]">{rev.buyerEmail || 'Estudiante Sabana'}</span>
                    <div className="flex items-center text-amber-400 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={11} 
                          fill={i < rev.rating ? "currentColor" : "none"} 
                          className={i < rev.rating ? "text-amber-400" : "text-gray-200"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed italic">"{rev.comment || 'Sin comentario escrito.'}"</p>
                  {rev.date && (
                    <p className="text-[9px] text-gray-400 font-bold">
                      Publicado: {new Date(rev.date).toLocaleDateString('es-CO')}
                    </p>
                  )}
                </div>

                {/* BOTÓN CRUCIAL: Eliminar reseña desde el rol Administrador */}
                <button
                  onClick={() => handleAdminDeleteReview(rev.id)}
                  title="Eliminar Reseña Inapropiada"
                  className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl transition-all shrink-0 align-middle active:scale-95"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cierre */}
        <div className="pt-2 shrink-0 border-t">
          <button 
            onClick={onClose}
            className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-200 transition-colors"
          >
            Salir del Visor
          </button>
        </div>

      </div>
    </div>
  );
};

// --- SUB-COMPONENTE MODAL CON VALIDACIONES COMPLETAS ---
const EditModal = ({ product, onClose, onUpdate, apiUrl }) => {
  const [formData, setFormData] = useState({ ...product });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [hostMessage, setHostMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    const MAX_PRICE = 1_000_000_000;
    
    if (!formData.title?.trim()) newErrors.title = 'El nombre es obligatorio';
    if (!formData.category) newErrors.category = 'Selecciona una categoría';
    if (!formData.condition) newErrors.condition = 'Selecciona el estado';

    const numericPrice = Number(formData.price);
    if (formData.price === '' || isNaN(numericPrice) || numericPrice <= 0 || numericPrice > MAX_PRICE) {
      newErrors.price = 'Precio inválido (1 - 1MM)';
    }

    const numericStock = Number(formData.stock);
    if (formData.stock === '' || isNaN(numericStock) || numericStock < 1) {
      newErrors.stock = 'Mínimo 1 unidad';
    }

    if (!formData.description?.trim() || formData.description.trim().length < 3) {
      newErrors.description = 'Descripción demasiado corta';
    }

    const urlTrim = (formData.imageUrl || '').trim();
    if (urlTrim) {
      try {
        const u = new URL(urlTrim);
        if (!['http:', 'https:'].includes(u.protocol)) {
          newErrors.imageUrl = 'Debe empezar con http/https';
        }
      } catch {
        newErrors.imageUrl = 'URL de imagen no válida';
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
      formData.imageUrl !== product.imageUrl ||
      formData.condition !== product.condition
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!hasChanges()) {
      setHostMessage('No has realizado ningún cambio.');
      setTimeout(() => setHostMessage(''), 3000);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        title: formData.title.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description.trim(),
        imageUrl: (formData.imageUrl || '').trim()
      };

      const response = await fetch(`${apiUrl}/api/v1/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updated = await response.json();
        onUpdate(updated);
        onClose();
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName) => `
    w-full px-4 py-2 rounded-xl border-2 transition-all outline-none text-sm font-medium
    ${fieldErrors[fieldName] ? 'border-red-400 bg-red-50' : 'border-gray-100 focus:border-sabana-softGold'}
  `;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-sabana-blue/60 backdrop-blur-sm" onClick={onClose}></div>
      <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-xl rounded-[32px] p-8 shadow-2xl my-auto">
        {hostMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3/4">
            <p className="bg-sabana-softGold text-sabana-blue text-[10px] font-black p-2 rounded-xl text-center shadow-lg border border-sabana-blue/10">
              {hostMessage}
            </p>
          </div>
        )}
        
        <h2 className="text-2xl font-black text-sabana-blue mb-6">Ficha Técnica</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-sabana-blue/50 uppercase ml-1">Título del Producto</label>
              <input className={getInputClass('title')} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              {fieldErrors.title && <p className="text-[9px] text-red-500 font-bold ml-1 uppercase">{fieldErrors.title}</p>}
            </div>

            <div>
              <label className="text-[10px] font-black text-sabana-blue/50 uppercase ml-1">URL Imagen</label>
              <input className={getInputClass('imageUrl')} value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
              {fieldErrors.imageUrl && <p className="text-[9px] text-red-500 font-bold ml-1 uppercase">{fieldErrors.imageUrl}</p>}
            </div>

            <div>
              <label className="text-[10px] font-black text-sabana-blue/50 uppercase ml-1">Categoría</label>
              <select className={getInputClass('category')} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-sabana-blue/50 uppercase ml-1">Precio ($)</label>
                <input type="number" className={getInputClass('price')} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                {fieldErrors.price && <p className="text-[9px] text-red-500 font-bold ml-1 uppercase">{fieldErrors.price}</p>}
              </div>
              <div>
                <label className="text-[10px] font-black text-sabana-blue/50 uppercase ml-1">Stock</label>
                <input type="number" className={getInputClass('stock')} value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                {fieldErrors.stock && <p className="text-[9px] text-red-500 font-bold ml-1 uppercase">{fieldErrors.stock}</p>}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-sabana-blue/50 uppercase ml-1">Estado</label>
              <select className={getInputClass('condition')} value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
                <option value="NEW">Nuevo</option>
                <option value="USED">Usado</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-sabana-blue/50 uppercase ml-1">Descripción</label>
              <textarea rows="2" className={`${getInputClass('description')} resize-none`} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              {fieldErrors.description && <p className="text-[9px] text-red-500 font-bold ml-1 uppercase">{fieldErrors.description}</p>}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button type="button" onClick={onClose} className="flex-1 py-4 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 rounded-2xl transition-all">Descartar</button>
          <button type="submit" disabled={loading} className="flex-1 py-4 bg-sabana-blue text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-sabana-blue-hover transition-all disabled:opacity-50">
            {loading ? 'Sincronizando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProducts;