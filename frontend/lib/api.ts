import {
  KitapResponse,
  KategoriResponse,
  kitapToBook,
  kategoriToCategory,
  Book,
  Category,
  PaginatedResponse,
  AuthResponse,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://bagdas-kitap-api.onrender.com/api';

// Token Yönetimi 
export const tokenManager = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },
  set: (token: string) => {
    localStorage.setItem('auth_token', token);
  },
  remove: () => {
    localStorage.removeItem('auth_token');
  },
};

// Temel fetch yardımcısı 
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenManager.get();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, errorText);
  }


  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Auth 
export const authApi = {
  giris: async (email: string, sifre: string): Promise<AuthResponse> => {
    const data = await apiFetch<AuthResponse>('/auth/giris', {
      method: 'POST',
      body: JSON.stringify({ email, sifre }),
    });
    tokenManager.set(data.token);
    return data;
  },

  kayit: async (ad: string, email: string, sifre: string): Promise<{ mesaj: string }> => {
    return apiFetch('/auth/kayit', {
      method: 'POST',
      body: JSON.stringify({ ad, email, sifre }),
    });
  },

  cikis: () => {
    tokenManager.remove();
  },
};

// Kitaplar
export const kitapApi = {
  getKitaplar: async (params?: {
    kategori?: string;
    arama?: string;
    sayfa?: number;
    limit?: number;
  }): Promise<{ data: Book[]; toplam: number; sayfa: number }> => {
    const query = new URLSearchParams();
    if (params?.kategori) query.append('kategori', params.kategori);
    if (params?.arama) query.append('arama', params.arama);
    if (params?.sayfa) query.append('sayfa', params.sayfa.toString());
    query.append('limit', (params?.limit ?? 100).toString());

    const raw = await apiFetch<PaginatedResponse<KitapResponse>>(
      `/kitap?${query}`
    );

    return {
      data: (raw.data ?? []).map(kitapToBook),
      toplam: raw.toplam,
      sayfa: raw.sayfa,
    };
  },

  getKitap: async (id: number): Promise<Book> => {
    const raw = await apiFetch<KitapResponse>(`/kitap/${id}`);
    return kitapToBook(raw);
  },
};

// Kategoriler 
export const kategoriApi = {
  getKategoriler: async (): Promise<Category[]> => {
    const raw = await apiFetch<KategoriResponse[]>('/kategori');
    return raw.map(kategoriToCategory);
  },
};

// Admin 
export const adminApi = {
  // Kitaplar
  getKitaplar: () => apiFetch<KitapResponse[]>('/admin/kitaplar'),
  kitapEkle: (kitap: Partial<KitapResponse>) =>
    apiFetch('/admin/kitap', { method: 'POST', body: JSON.stringify(kitap) }),
  kitapGuncelle: (id: number, kitap: Partial<KitapResponse>) =>
    apiFetch(`/admin/kitap/${id}`, { method: 'PUT', body: JSON.stringify(kitap) }),
  kitapSil: (id: number) =>
    apiFetch(`/admin/kitap/${id}`, { method: 'DELETE' }),

  // Kullanıcılar
  getKullanicilar: () =>
    apiFetch<{ id: number; ad: string; email: string; rol: string; kayitTarihi: string }[]>(
      '/admin/kullanicilar'
    ),
  rolDegistir: (id: number, rol: string) =>
    apiFetch(`/admin/kullanici/${id}/rol`, {
      method: 'PUT',
      body: JSON.stringify(rol),
    }),
};

export const api = {
  getKitaplar: kitapApi.getKitaplar,
  getKitap: kitapApi.getKitap,
  getKategoriler: kategoriApi.getKategoriler,
  giris: authApi.giris,
  kayit: authApi.kayit,
};
