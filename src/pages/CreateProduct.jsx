import React, { useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { createProduct } from '../services/productService';

const NAVY = '#001D4A';
const SOFT_BG = '#F0F4FF';

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
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
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
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const MAX_PRICE = 1_000_000_000_000;

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
    if (!validateForm()) return;

    setLoading(true);
    try {
      const imageUrl = formData.imageUrl.trim();
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        condition: formData.condition,
        ...(imageUrl ? { imageUrl } : {}),
        ownerEmail: 'estudiante@unisabana.edu.co',
      };

      await createProduct(payload);
      alert('¡Producto publicado con éxito!');
      setFormData({
        title: '',
        price: '',
        category: '',
        description: '',
        condition: '',
        imageUrl: '',
      });
      setFieldErrors({});
    } catch (err) {
      setError(err.message || 'No se pudo publicar el producto');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors';
  const inputNormal = 'border-gray-200 focus:border-[#001D4A]';
  const inputError = 'border-red-400 focus:border-red-500';

  return (
    <div
      className="min-h-screen flex flex-col font-sans antialiased"
      style={{
        background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY} 38%, ${SOFT_BG} 38%)`,
      }}
    >
      <div className="shrink-0 px-4 pt-6 pb-4 md:pt-10 md:pb-6">
        <div className="max-w-lg mx-auto relative">
          <div className="relative flex min-h-[5.5rem] items-start justify-center px-10 md:px-14">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-80"
              aria-label="Volver"
            >
              <IoChevronBack className="h-7 w-7" />
            </button>
            <button
              type="button"
              className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/35 bg-white/10 text-white"
              aria-label="Menú"
            >
              <span className="text-lg leading-none opacity-90">✦</span>
            </button>
            <div className="text-center">
              <h1 className="font-serif text-2xl font-bold text-white md:text-[1.75rem] tracking-tight">
                Publicar producto
              </h1>
              <p className="mt-2 max-w-[20rem] text-sm leading-snug text-white/90 md:max-w-none">
                Completa la información de tu artículo para ofrecerlo en el marketplace.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-4 pb-10 md:pb-14 -mt-6 md:-mt-8">
        <div
          className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl md:p-8"
          style={{ boxShadow: '0 12px 40px rgba(0, 29, 74, 0.12)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">{error}</p>
            )}

            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
                Nombre del producto
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej. Calculadora científica"
                className={`${inputClass} ${fieldErrors.title ? inputError : inputNormal}`}
              />
              {fieldErrors.title && <p className="mt-1 text-xs text-red-500">{fieldErrors.title}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
                Descripción
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Detalle estado, accesorios, motivo de venta..."
                className={`${inputClass} resize-y min-h-[7rem] ${fieldErrors.description ? inputError : inputNormal}`}
              />
              {fieldErrors.description && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
                  Precio (COP)
                </label>
                <input
                  name="price"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  className={`${inputClass} ${fieldErrors.price ? inputError : inputNormal}`}
                />
                {fieldErrors.price && <p className="mt-1 text-xs text-red-500">{fieldErrors.price}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
                  Categoría
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none pr-10 ${fieldErrors.category ? inputError : inputNormal}`}
                  >
                    <option value="" disabled>
                      Selecciona
                    </option>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ▼
                  </span>
                </div>
                {fieldErrors.category && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.category}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
                Estado
              </label>
              <div className="relative">
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none pr-10 ${fieldErrors.condition ? inputError : inputNormal}`}
                >
                  <option value="" disabled>
                    Selecciona
                  </option>
                  <option value="NEW">Nuevo</option>
                  <option value="USED">Usado</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ▼
                </span>
              </div>
              {fieldErrors.condition && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.condition}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
                URL de imagen (opcional)
              </label>
              <input
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
                className={`${inputClass} ${fieldErrors.imageUrl ? inputError : inputNormal}`}
              />
              {fieldErrors.imageUrl && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.imageUrl}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-4 text-sm font-bold uppercase tracking-wide text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: NAVY }}
            >
              {loading ? 'Publicando…' : 'Publicar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
