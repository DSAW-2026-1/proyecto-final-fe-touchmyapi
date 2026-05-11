import React, { useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import smallLogo from '../assets/sabanalogo.png';

const CATEGORIES = [
  { value: 'ACADEMIC_SUPPLIES', label: 'Útiles académicos' },
  { value: 'BOOKS', label: 'Libros' },
  { value: 'ELECTRONICS', label: 'Electrónica' },
  { value: 'CLOTHING', label: 'Ropa' },
  { value: 'FOOD', label: 'Comida' },
  { value: 'SERVICES', label: 'Servicios' },
  { value: 'OTHER', label: 'Otros' },
];

const CreateProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    stock: '1',
    description: '',
    condition: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const MAX_PRICE = 1_000_000_000_000;
    const numericStock = Number(formData.stock);
    if (formData.stock === '' || Number.isNaN(numericStock) || numericStock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    // --- VALIDACIONES ORIGINALES ---
    if (!formData.title.trim()) newErrors.title = 'El nombre del producto es obligatorio';
    if (!formData.category) newErrors.category = 'Selecciona una categoría';
    if (!formData.condition) newErrors.condition = 'Selecciona el estado';

    const numericPrice = Number(formData.price);
    if (
      formData.price === '' ||
      Number.isNaN(numericPrice) ||
      numericPrice <= 0 ||
      numericPrice > MAX_PRICE
    ) {
      newErrors.price = 'Indica un precio válido (mayor a 0)';
    }

    if (!formData.description.trim() || formData.description.trim().length < 3) {
      newErrors.description = 'La descripción debe tener al menos 3 caracteres';
    }

    const urlTrim = formData.imageUrl.trim();
    if (urlTrim) {
      try {
        const u = new URL(urlTrim);
        if (!['http:', 'https:'].includes(u.protocol)) {
          newErrors.imageUrl = 'Usa una URL que comience con http o https';
        }
      } catch {
        newErrors.imageUrl = 'Introduce una URL válida';
      }
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // 1. Validamos el formulario antes de seguir
    if (!validateForm()) return;

    // 2. Sacamos el correo de quien inició sesión
    const loggedUserEmail = localStorage.getItem('userEmail');

    if (!loggedUserEmail) {
      setError("No hay una sesión activa. Por favor inicia sesión.");
      return;
    }

    setLoading(true);
    
    try {
      const imageUrl = formData.imageUrl.trim();
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        condition: formData.condition,
        ...(imageUrl ? { imageUrl } : {}),
        ownerEmail: loggedUserEmail, // <--- El correo dinámico
      };

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

      if (response.ok) {
        alert('¡Producto publicado con éxito!');
        navigate('/inventory'); 
      } else {
        const errorData = await response.text();
        throw new Error(errorData || 'No se pudo publicar el producto');
      }
    } catch (err) {
      setError(err.message);
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
    <div className="min-h-screen bg-sabana-light font-sans antialiased">
      {/* Header Estilo Sabana */}
      <div className="bg-sabana-blue px-4 pt-10 pb-24">
        <div className="max-w-lg mx-auto relative text-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-0 top-0 text-default-white hover:opacity-70 transition-opacity p-2"
          >
            <IoChevronBack size={28} />
          </button>
          
          <img src={smallLogo} alt="Logo Sabana" className="h-10 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-default-white tracking-tight">
            Publicar producto
          </h1>
          <p className="text-sabana-light opacity-80 mt-2 text-sm">
            Completa la información para ofrecerlo en el marketplace.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-lg mx-auto px-4 -mt-16 pb-12">
        <div className="bg-default-white rounded-3xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {error && (
              <p className="p-3 bg-error-bg-red text-error-red rounded-xl text-xs font-bold border border-error-red/20">
                {error}
              </p>
            )}

            <div>
              <label className="block text-[11px] font-bold text-sabana-blue uppercase tracking-wider mb-1.5 ml-1">
                Nombre del producto
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej. Calculadora científica"
                className={getInputClass('title')}
              />
              {fieldErrors.title && <p className="mt-1.5 ml-1 text-xs text-error-red font-medium">{fieldErrors.title}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-sabana-blue uppercase tracking-wider mb-1.5 ml-1">
                Descripción
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Detalle estado, accesorios, motivo de venta..."
                className={`${getInputClass('description')} resize-none`}
              />
              {fieldErrors.description && <p className="mt-1.5 ml-1 text-xs text-error-red font-medium">{fieldErrors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* PRECIO */}
            <div>
              <label className="block text-[11px] font-bold text-sabana-blue uppercase tracking-wider mb-1.5 ml-1">
                Precio (COP)
              </label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                className={getInputClass('price')}
              />
              {fieldErrors.price && <p className="mt-1.5 ml-1 text-xs text-error-red font-medium">{fieldErrors.price}</p>}
            </div>

            {/* STOCK - ¡El nuevo integrante! */}
            <div>
              <label className="block text-[11px] font-bold text-sabana-blue uppercase tracking-wider mb-1.5 ml-1">
                Cantidad (Stock)
              </label>
              <input
                name="stock"
                type="number"
                min="1"
                value={formData.stock}
                onChange={handleChange}
                placeholder="1"
                className={getInputClass('stock')}
              />
              {fieldErrors.stock && <p className="mt-1.5 ml-1 text-xs text-error-red font-medium">{fieldErrors.stock}</p>}
            </div>

            {/* ESTADO */}
            <div>
              <label className="block text-[11px] font-bold text-sabana-blue uppercase tracking-wider mb-1.5 ml-1">
                Estado
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className={getInputClass('condition')}
              >
                <option value="">Selecciona</option>
                <option value="NEW">Nuevo</option>
                <option value="USED">Usado</option>
              </select>
              {fieldErrors.condition && <p className="mt-1.5 ml-1 text-xs text-error-red font-medium">{fieldErrors.condition}</p>}
            </div>
          </div>

              <div>
                <label className="block text-[11px] font-bold text-sabana-blue uppercase tracking-wider mb-1.5 ml-1">
                  Categoría
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={getInputClass('category')}
                >
                  <option value="">Selecciona</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                {fieldErrors.category && <p className="mt-1.5 ml-1 text-xs text-error-red font-medium">{fieldErrors.category}</p>}
              </div>

            <div>
              <label className="block text-[11px] font-bold text-sabana-blue uppercase tracking-wider mb-1.5 ml-1">
                URL de imagen (opcional)
              </label>
              <input
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                className={getInputClass('imageUrl')}
              />
              {fieldErrors.imageUrl && <p className="mt-1.5 ml-1 text-xs text-error-red font-medium">{fieldErrors.imageUrl}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sabana-blue text-default-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-sabana-blue-hover transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? 'Publicando...' : 'Publicar Producto'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;