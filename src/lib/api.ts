const BASE = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:4000/api';

// ── token storage ─────────────────────────────────────────────
export const tokenStore = {
  getUser:    () => localStorage.getItem('manikya_user_token'),
  getAdmin:   () => localStorage.getItem('manikya_admin_token'),
  setUser:    (t: string) => localStorage.setItem('manikya_user_token', t),
  setAdmin:   (t: string) => localStorage.setItem('manikya_admin_token', t),
  clearUser:  () => { localStorage.removeItem('manikya_user_token'); localStorage.removeItem('user_logged_in'); },
  clearAdmin: () => { localStorage.removeItem('manikya_admin_token'); localStorage.removeItem('admin_logged_in'); },
};

// ── core fetch ────────────────────────────────────────────────
async function call<T>(path: string, opts: RequestInit = {}, auth?: 'user' | 'admin'): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers as Record<string, string>) };
  if (auth === 'user'  && tokenStore.getUser())  headers['Authorization'] = `Bearer ${tokenStore.getUser()}`;
  if (auth === 'admin' && tokenStore.getAdmin()) headers['Authorization'] = `Bearer ${tokenStore.getAdmin()}`;
  const res  = await fetch(`${BASE}${path}`, { ...opts, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data as T;
}

// ── auth ──────────────────────────────────────────────────────
export const authApi = {
  sendOTP: (method: 'email' | 'phone', identifier: string, type: 'otp' | 'magic_link' = 'otp') =>
    call<{ message: string }>('/auth/send-otp', { method: 'POST', body: JSON.stringify({ method, identifier, type }) }),

  verifyOTP: async (identifier: string, otp: string) => {
    const data = await call<{ token: string; user: { id: string } }>(
      '/auth/verify-otp', { method: 'POST', body: JSON.stringify({ identifier, token: otp }) }
    );
    tokenStore.setUser(data.token);
    localStorage.setItem('user_logged_in', 'true');
    return data;
  },

  resend: (method: 'email' | 'phone', identifier: string) =>
    call<{ message: string }>('/auth/send-otp', { method: 'POST', body: JSON.stringify({ method, identifier, type: 'otp' }) }),
};

// ── admin auth ────────────────────────────────────────────────
export const adminApi = {
  login: async (email: string, password: string) => {
    const data = await call<{ token: string }>('/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    tokenStore.setAdmin(data.token);
    localStorage.setItem('admin_logged_in', 'true');
    return data;
  },
};

// ── contact ───────────────────────────────────────────────────
export const contactApi = {
  submit: (body: { name: string; email?: string; phone?: string; interest?: string; message?: string }) =>
    call<{ message: string }>('/contact', { method: 'POST', body: JSON.stringify(body) }),

  getAll: () => call<ContactLead[]>('/contact', {}, 'admin'),
  updateStatus: (id: string, status: string) =>
    call<{ message: string }>(`/contact/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, 'admin'),
  delete: (id: string) => call<{ message: string }>(`/contact/${id}`, { method: 'DELETE' }, 'admin'),
};

// ── services ──────────────────────────────────────────────────
export const servicesApi = {
  getAll:     () => call<Service[]>('/services/all', {}, 'admin'),
  create:     (d: { title: string; description: string }) =>
    call<{ id: number }>('/services', { method: 'POST', body: JSON.stringify(d) }, 'admin'),
  update:     (id: number, d: { title: string; description: string }) =>
    call<{ message: string }>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(d) }, 'admin'),
  remove:     (id: number) => call<{ message: string }>(`/services/${id}`, { method: 'DELETE' }, 'admin'),
};

// ── gallery ───────────────────────────────────────────────────
export const galleryApi = {
  getAll: () => call<GalleryItem[]>('/gallery/all', {}, 'admin'),
  uploadImage: (id: number, image_data: string) =>
    call<{ message: string }>(`/gallery/${id}/image`, { method: 'PUT', body: JSON.stringify({ image_data }) }, 'admin'),
  // Backend rejects PUT with null image_data, so removal deletes the row.
  removeImage: (id: number) =>
    call<{ message: string }>(`/gallery/${id}`, { method: 'DELETE' }, 'admin'),
};

// ── analytics ─────────────────────────────────────────────────
export const analyticsApi = {
  overview: () => call<AnalyticsOverview>('/analytics/overview', {}, 'admin'),
};

// ── types ─────────────────────────────────────────────────────
export interface Service    { id: number; title: string; description: string; }
export interface ContactLead {
  id: string; name: string; email: string; phone: string;
  interest?: string; message: string; status: string; created_at: string;
}
export interface GalleryItem {
  id: number; title: string; category: string;
  image_url?: string; image_data?: string;
  is_active?: boolean; display_order?: number;
}
export interface AnalyticsOverview {
  services: number; contacts: number; gallery: number;
  products: number; verified_users: number; new_leads: number;
}
