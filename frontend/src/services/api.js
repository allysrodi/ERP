const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000/api';
const apiUrl = new URL(configuredApiUrl);
if (!apiUrl.pathname.replace(/\/$/, '').endsWith('/api')) {
  apiUrl.pathname = `${apiUrl.pathname.replace(/\/$/, '')}/api`;
}
const API_URL = apiUrl.toString().replace(/\/$/, '');

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

export function clearAuthToken() {
  authToken = null;
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers
    }
  });
  const body = await response.json();
  if (!response.ok || !body.success) throw new Error(body.message ?? 'Error de API');
  return body;
}

export const api = {
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
  products: (query) => apiRequest(`/products?${new URLSearchParams(query).toString()}`),
  customers: (query) => apiRequest(`/customers?${new URLSearchParams(query).toString()}`),
  suppliers: (query) => apiRequest(`/suppliers?${new URLSearchParams(query).toString()}`),
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
