const STORAGE_KEY = 'sabana-marketplace-products';

function normalizeBaseUrl(url) {
  if (!url || typeof url !== 'string') return '';
  return url.replace(/\/$/, '');
}

function readLocalProducts() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalProducts(products) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function parseJsonBody(text) {
  if (!text || !text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function errorMessageFromResponseBody(text) {
  const parsed = parseJsonBody(text);
  if (parsed && typeof parsed === 'object') {
    return (
      parsed.message ||
      parsed.error ||
      (Array.isArray(parsed.errors) ? parsed.errors.join(', ') : '') ||
      ''
    );
  }
  return typeof text === 'string' ? text.trim() : '';
}

/**
 * Crea un producto. Si existe VITE_API_URL, hace POST al backend.
 * Si no, guarda en localStorage para desarrollo sin API.
 *
 * @param {object} data - Campos del producto (title, description, price, etc.)
 * @returns {Promise<object>} Producto creado (con id y createdAt en modo local)
 */
export async function createProduct(data) {
  const base = normalizeBaseUrl(import.meta.env.VITE_API_URL);

  if (base) {
    let res;
    try {
      res = await fetch(`${base}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      throw new Error('No hay conexión con el servidor. Revisa tu red o VITE_API_URL.');
    }
    const text = await res.text().catch(() => '');
    if (!res.ok) {
      const msg = errorMessageFromResponseBody(text);
      throw new Error(msg || `No se pudo crear el producto (${res.status})`);
    }
    const parsed = parseJsonBody(text);
    return parsed ?? {};
  }

  const products = readLocalProducts();
  const product = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `local-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...data,
  };
  products.unshift(product);
  writeLocalProducts(products);
  return product;
}

/**
 * Lista productos (API o localStorage).
 * @returns {Promise<object[]>}
 */
export async function getProducts() {
  const base = normalizeBaseUrl(import.meta.env.VITE_API_URL);

  if (base) {
    let res;
    try {
      res = await fetch(`${base}/products`);
    } catch {
      throw new Error('No hay conexión con el servidor. Revisa tu red o VITE_API_URL.');
    }
    const text = await res.text().catch(() => '');
    if (!res.ok) {
      const msg = errorMessageFromResponseBody(text);
      throw new Error(msg || `No se pudieron obtener productos (${res.status})`);
    }
    const parsed = parseJsonBody(text);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.data)) return parsed.data;
    if (parsed && Array.isArray(parsed.products)) return parsed.products;
    return [];
  }

  return readLocalProducts();
}
