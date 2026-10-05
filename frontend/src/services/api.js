const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000/api';
const apiUrl = new URL(configuredApiUrl);
if (!apiUrl.pathname.replace(/\/$/, '').endsWith('/api')) {
  apiUrl.pathname = `${apiUrl.pathname.replace(/\/$/, '')}/api`;
}
const API_URL = apiUrl.toString().replace(/\/$/, '');

let authToken = null;
let authExpiredHandler = null;
export function setAuthExpiredHandler(handler) { authExpiredHandler = handler; }

export function setAuthToken(token) {
  authToken = token;
}

export function clearAuthToken() {
  authToken = null;
}

export async function apiRequest(path, options = {}) {
  const { timeoutMs = 15000, ...fetchOptions } = options;
  const controller = new AbortController();
  let timedOut = false;
  const abort = () => controller.abort();
  if (options.signal?.aborted) controller.abort();
  options.signal?.addEventListener('abort', abort);
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...fetchOptions, signal: controller.signal,
      headers: { 'content-type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}), ...options.headers }
    });
    let body;
    try { body = await response.json(); } catch { throw new Error('La API devolvió una respuesta inválida.'); }
    if (!body || typeof body !== 'object') throw new Error('La API devolvió una respuesta inválida.');
    if (!response.ok || !body.success) {
      if (response.status === 401 && authToken) { clearAuthToken(); authExpiredHandler?.(); }
      const error = new Error(body.message ?? 'Error de API');
      error.status = response.status; error.details = body.details;
      throw error;
    }
    return body;
  } catch (error) {
    if (timedOut) throw new Error('La solicitud tardó demasiado. Intenta nuevamente.');
    throw error;
  } finally {
    clearTimeout(timer); options.signal?.removeEventListener('abort', abort);
  }
}

export const api = {
  createCategory: payload => apiRequest('/categories', { method: 'POST', body: JSON.stringify(payload) }),
  categories: (query, options) => apiRequest(`/categories?${new URLSearchParams(query).toString()}`, options),
  moduleData: (path, companyId, options, page = 1) => apiRequest(`/${path}?${new URLSearchParams({ companyId, limit: '100', page: String(page) }).toString()}`, options),
  health: () => apiRequest('/health'),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  forgotPassword: (email) =>
  apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
  resetPassword: (token, newPassword) =>
  apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword })
  }),
  dashboard: (companyId) => apiRequest(`/dashboard?companyId=${encodeURIComponent(companyId)}`),
  products: (query, options) => apiRequest(`/products?${new URLSearchParams(query).toString()}`, options),
  customers: (query, options) => apiRequest(`/customers?${new URLSearchParams(query).toString()}`, options),
  suppliers: (query, options) => apiRequest(`/suppliers?${new URLSearchParams(query).toString()}`, options),
  createCustomer: (payload) => apiRequest('/customers', { method: 'POST', body: JSON.stringify(payload) }),
  createSupplier: (payload) => apiRequest('/suppliers', { method: 'POST', body: JSON.stringify(payload) }),
  createProduct: (payload) => apiRequest('/products', { method: 'POST', body: JSON.stringify(payload) }),
  updateCustomer: (id, companyId, payload) => apiRequest(`/customers/${id}?companyId=${companyId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  updateSupplier: (id, companyId, payload) => apiRequest(`/suppliers/${id}?companyId=${companyId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  updateProduct: (id, companyId, payload) => apiRequest(`/products/${id}?companyId=${companyId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deactivateCustomer: (id, companyId) => apiRequest(`/customers/${id}?companyId=${companyId}`, { method: 'DELETE' }),
  deactivateSupplier: (id, companyId) => apiRequest(`/suppliers/${id}?companyId=${companyId}`, { method: 'DELETE' }),
  deactivateProduct: (id, companyId) => apiRequest(`/products/${id}?companyId=${companyId}`, { method: 'DELETE', body: JSON.stringify({}) })
};
