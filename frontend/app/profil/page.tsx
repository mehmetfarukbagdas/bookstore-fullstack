'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Package, 
  MapPin, 
  ChevronRight, 
  Trash2, 
  Loader2, 
  Save,
  LogOut,
  AlertTriangle,
  CheckCircle2 
} from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useStore } from '@/lib/store-context'; 

export default function ProfilPage() {
  const router = useRouter();
  const { logout } = useStore(); 
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false); 
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user') || localStorage.getItem('book-user');
    
    if (!userString) {
      router.push('/giris');
      return;
    }

    try {
      const userData = JSON.parse(userString);
      setUser(userData);
      
      if (userData.ad) {
        const parts = userData.ad.trim().split(' ');
        if (parts.length > 1) {
          setFirstName(parts[0]);
          setLastName(parts.slice(1).join(' '));
        } else {
          setFirstName(userData.ad);
          setLastName('');
        }
      } else {
        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
      }
      
      setEmail(userData.email || '');
      setPhone(userData.telefon || userData.phone || '');
    } catch (error) {
      console.error("Kullanıcı verisi ayrıştırma hatası:", error);
    }
  }, [router]);

  const handleCikisYapModalAc = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    
    if (logout) {
      logout();
    }
    
    
    localStorage.removeItem('book-user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    
    window.location.href = '/giris';
  };

  const handleGuncelle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedUser = {
      ...user,
      firstName,
      lastName,
      ad: `${firstName} ${lastName}`.trim(),
      email,
      telefon: phone
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessToast(true); 
      
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
    }, 800);
  };

  const handleHesapSil = () => {
    setIsDeleting(true);
    setTimeout(() => {
      
      if (logout) logout();
      localStorage.removeItem('book-user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      window.location.href = '/kayit';
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfcfb] relative">
      <Header />
      
      {showSuccessToast && (
        <div className="fixed top-24 right-4 z-[100] animate-in slide-in-from-right duration-300">
          <div className="bg-[#4a2e2b] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <p className="font-bold text-sm tracking-tight">Bilgileriniz başarıyla güncellendi!</p>
          </div>
        </div>
      )}

      <main className="flex-1 container mx-auto py-10 px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          <aside className="w-full md:w-80 shrink-0 md:sticky md:top-24">
            <div className="border rounded-2xl bg-white shadow-sm overflow-hidden border-gray-100">
              <div className="p-6 bg-[#4a2e2b] text-white">
                <p className="text-xs opacity-70 uppercase tracking-widest mb-1 font-bold">Hesabım</p>
                <h2 className="text-xl font-serif font-bold truncate">{firstName} {lastName}</h2>
              </div>
              <nav className="flex flex-col">
                <Link href="/profil">
                  <button className="flex items-center justify-between px-6 py-5 w-full text-left bg-gray-50 border-l-4 border-[#4a2e2b] text-[#4a2e2b] font-bold">
                    <div className="flex items-center"><User className="w-5 h-5 mr-3" /> Hesap Bilgileri</div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/profil/siparisler">
                  <button className="flex items-center justify-between px-6 py-5 w-full text-left hover:bg-gray-50 transition-colors border-l-4 border-transparent text-gray-600 font-bold">
                    <div className="flex items-center"><Package className="w-5 h-5 mr-3" /> Siparişlerim</div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/profil/adreslerim">
                  <button className="flex items-center justify-between px-6 py-5 w-full text-left hover:bg-gray-50 transition-colors border-l-4 border-transparent text-gray-600 font-bold">
                    <div className="flex items-center"><MapPin className="w-5 h-5 mr-3" /> Adreslerim</div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
                <button onClick={handleCikisYapModalAc} className="flex items-center justify-between px-6 py-5 w-full text-left hover:bg-red-50 transition-colors border-l-4 border-transparent text-red-600 border-t font-bold">
                  <div className="flex items-center"><LogOut className="w-5 h-5 mr-3" /> Güvenli Çıkış</div>
                </button>
              </nav>
            </div>
          </aside>

          <section className="flex-1 w-full bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8">
            <h1 className="text-2xl font-serif font-bold mb-8 flex items-center text-[#4a2e2b]">
              <User className="mr-3" /> Hesap Bilgileri
            </h1>

            <form onSubmit={handleGuncelle} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-1">Adınız</label>
                  <Input 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-12 rounded-xl border-gray-200 focus:border-[#4a2e2b] focus:ring-[#4a2e2b]/10 font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-1">Soyadınız</label>
                  <Input 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-12 rounded-xl border-gray-200 focus:border-[#4a2e2b] focus:ring-[#4a2e2b]/10 font-medium" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-1">E-Posta Adresi</label>
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl border-gray-200 focus:border-[#4a2e2b] focus:ring-[#4a2e2b]/10 font-medium" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-1">Telefon Numarası</label>
                  <Input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 rounded-xl border-gray-200 focus:border-[#4a2e2b] focus:ring-[#4a2e2b]/10 font-medium" 
                  />
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-50">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-[#4a2e2b] hover:bg-[#3a2422] text-white px-10 h-12 rounded-xl font-bold shadow-lg shadow-[#4a2e2b]/20 transition-all flex items-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Değişiklikleri Kaydet
                </Button>

                <Button 
                  type="button"
                  variant="ghost" 
                  onClick={() => setShowDeleteModal(true)}
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50 font-bold"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Hesabı Sil
                </Button>
              </div>
            </form>
          </section>
        </div>
      </main>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Çıkış Yapıyorsunuz!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Hesabınızdan güvenli bir şekilde çıkış yapmak istediğinize emin misiniz?
            </p>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold" onClick={() => setShowLogoutModal(false)}>Vazgeç</Button>
              <Button variant="destructive" className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 font-bold" onClick={handleConfirmLogout}>
                Evet, Çıkış Yap
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Hesabınızı Siliyorsunuz!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Hesabınızı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem <strong>geri alınamaz</strong> ve tüm verileriniz silinir.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold" onClick={() => setShowDeleteModal(false)}>Vazgeç</Button>
              <Button variant="destructive" className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 font-bold" onClick={handleHesapSil} disabled={isDeleting}>
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Evet, Sil"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}