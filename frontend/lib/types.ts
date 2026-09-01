

export interface Book {
  id: number;
  title: string;       // baslik
  author: string;      // yazar
  price: number;       // fiyat
  originalPrice?: number; // indirimliFiyat
  image: string;       // resimUrl (hem image hem coverImage için)
  coverImage?: string; // geriye dönük uyumluluk
  category: string;    // kategori.slug
  rating: number;      // puan
  reviewCount: number; // yorumSayisi
  description: string; // aciklama
  isbn: string;        // ISBN
  publisher: string;   // yayinevi
  pageCount: number;   // sayfaSayisi
  language: string;    // dil 
  publicationDate: string; // yayinTarihi
  stock: number;       // stok
}


export interface KitapResponse {
  id: number;
  baslik: string;
  yazar: string;
  fiyat: number;
  indirimliFiyat?: number;
  resimUrl: string;
  kategori?: { id: number; ad: string; slug: string };
  puan: number;
  yorumSayisi: number;
  aciklama: string;
  isbn: string;
  yayinevi: string;
  sayfaSayisi: number;
  yayinTarihi: string;
  stok: number;
}


export function kitapToBook(k: KitapResponse): Book {
  return {
    id: k.id,
    title: k.baslik,
    author: k.yazar,
    price: k.fiyat,
    originalPrice: k.indirimliFiyat,
    image: k.resimUrl,
    coverImage: k.resimUrl,
    category: k.kategori?.slug ?? '',
    rating: k.puan,
    reviewCount: k.yorumSayisi,
    description: k.aciklama,
    isbn: k.isbn,
    publisher: k.yayinevi,
    pageCount: k.sayfaSayisi,
    language: 'Türkçe',
    publicationDate: k.yayinTarihi,
    stock: k.stok,
  };
}

export interface CartItem {
  book: Book;
  quantity: number;
}


export interface User {
  id: number;
  email: string;
  name: string;        
  role: 'kullanici' | 'admin'; 
}


export interface AuthResponse {
  token: string;
  ad: string;
  email: string;
  rol: string;
}


export interface OrderItem {
  bookId: number;
  bookTitle: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: Address;
}

export interface Address {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  postalCode: string;
}


export interface Category {
  id: number;
  name: string;        
  slug: string;        
  
}


export interface KategoriResponse {
  id: number;
  ad: string;
  slug: string;
  kitapSayisi: number;
}

export function kategoriToCategory(k: KategoriResponse): Category {
  return {
    id: k.id,
    name: k.ad,
    slug: k.slug,
    
  };
}


export interface PaginatedResponse<T> {
  data: T[];
  toplam: number;
  sayfa: number;
}

