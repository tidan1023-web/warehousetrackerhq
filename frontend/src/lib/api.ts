import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach JWT to every request
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — redirect to login
apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      sessionStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string; details?: Array<{ message: string }> };
    if (data?.details?.length) return data.details.map((d) => d.message).join(', ');
    if (data?.error) return data.error;
    if (err.message) return err.message;
  }
  return 'An unexpected error occurred';
}

// ---- Auth ----
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }).then((r) => r.data),
  refresh: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }).then((r) => r.data),
  getMe: () => apiClient.get('/auth/me').then((r) => r.data),
  createUser: (data: unknown) => apiClient.post('/auth/users', data).then((r) => r.data),
  listUsers: () => apiClient.get('/auth/users').then((r) => r.data),
  deactivateUser: (id: string) => apiClient.patch(`/auth/users/${id}/deactivate`).then((r) => r.data),
};

// ---- Products ----
export const productsApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get('/products', { params }).then((r) => r.data),
  get: (id: string) => apiClient.get(`/products/${id}`).then((r) => r.data),
  create: (data: unknown) => apiClient.post('/products', data).then((r) => r.data),
  update: (id: string, data: unknown) => apiClient.patch(`/products/${id}`, data).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/products/${id}`).then((r) => r.data),
  uploadImage: (id: string, formData: FormData) =>
    apiClient.post(`/products/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  verify: (id: string) => apiClient.post(`/products/${id}/verify`).then((r) => r.data),
  dispatch: (id: string, trackingNumber?: string) =>
    apiClient.post(`/products/${id}/dispatch`, { trackingNumber }).then((r) => r.data),
  getCategories: () => apiClient.get('/products/categories').then((r) => r.data),
};

// ---- Defects ----
export const defectsApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get('/defects', { params }).then((r) => r.data),
  create: (data: unknown) => apiClient.post('/defects', data).then((r) => r.data),
  uploadImage: (id: string, formData: FormData) =>
    apiClient.post(`/defects/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  acknowledge: (id: string) => apiClient.patch(`/defects/${id}/acknowledge`).then((r) => r.data),
  resolve: (id: string, resolution: string) =>
    apiClient.patch(`/defects/${id}/resolve`, { resolution }).then((r) => r.data),
};

// ---- Audit ----
export const auditApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get('/audit', { params }).then((r) => r.data),
  getEntityTrail: (entityType: string, entityId: string) =>
    apiClient.get(`/audit/${entityType}/${entityId}`).then((r) => r.data),
};

// ---- Dashboard ----
export const dashboardApi = {
  getStats: () => apiClient.get('/dashboard/stats').then((r) => r.data),
};

// ---- eBay ----
export const ebayApi = {
  getStatus: () => apiClient.get('/ebay/status').then((r) => r.data),
  getAuthUrl: () => apiClient.get('/ebay/auth-url').then((r) => r.data),
  syncProduct: (id: string, data: unknown) =>
    apiClient.post(`/ebay/products/${id}/sync`, data).then((r) => r.data),
};
