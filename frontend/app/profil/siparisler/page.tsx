'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, User, MapPin, LogOut, Clock, Eye, X, Loader2, CheckCircle2, Truck } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SiparislerPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userString || !token) {
      router.push('/giris');
      return;
    }

    const userData = JSON.parse(userString);
    setUser(userData);

    const siparisleriGetir = async () => {
      try {
        const response = await fetch(`https://bagdas-kitap-api.onrender.com/api/Siparis/kullanici/${userData.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setMyOrders(data);
        } else {
          const allOrders = JSON.parse(localStorage.getItem("bagdas_orders") || "[]");
          const filtered = allOrders.filter((o: any) => String(o.userId) === String(userData.id));
          setMyOrders(filtered);
        }
      } catch (error) {
        const allOrders = JSON.parse(localStorage.getItem("bagdas_orders") || "[]");
        const filtered = allOrders.filter((o: any) => String(o.userId) === String(userData.id));
        setMyOrders(filtered);
      } finally {
        setIsLoading(false);
      }
    };

    siparisleriGetir();
  }, [router]);

  const handleCikisYap = () => {
    localStorage.clear();
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/giris');
  };

  
  const getProgressPercentage = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return 100;
    if (s === 'shipped') return 66;
    if (s === 'processing') return 33;
    return 10; 
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || 'pending';
    const styles: Record<string, string> = {
      pending: "bg-gray-100 text-gray-700",
      processing: "bg-yellow-100 text-yellow-700",
      shipped: "bg-blue-100 text-blue-700",
      delivered: "bg-green-100 text-green-700",
    };
    const labels: Record<string, string> = {
      pending: "Beklemede",
      processing: "Hazırlanıyor",
      shipped: "Kargoda",
      delivered: "Teslim Edildi",
    };

    const styleClass = styles[normalizedStatus] || styles.pending;
    const labelText = labels[normalizedStatus] || "Beklemede";

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${styleClass}`}>
        {normalizedStatus === 'delivered' && <CheckCircle2 className="w-3 h-3" />}
        {normalizedStatus === 'shipped' && <Truck className="w-3 h-3" />}
        {normalizedStatus === 'processing' && <Clock className="w-3 h-3" />}
        {labelText}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfcfb]">
      <Header />
      <main className="flex-1 container mx-auto py-10 px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <aside className="w-full md:w-80 shrink-0 md:sticky md:top-24">
            <div className="border rounded-2xl bg-white shadow-sm overflow-hidden border-gray-100">
              <div className="p-6 bg-[#4a2e2b] text-white">
                <p className="text-xs opacity-70 uppercase tracking-widest mb-1 font-bold">Hesabım</p>
                <h2 className="text-xl font-serif font-bold truncate">{user?.ad || user?.name || "Mehmet Faruk"}</h2>
              </div>
              <nav className="flex flex-col">
                <Link href="/profil">
                  <button className="flex items-center justify-between px-6 py-5 w-full text-left hover:bg-gray-50 transition-colors border-l-4 border-transparent text-gray-600">
                    <div className="flex items-center font-bold"><User className="w-5 h-5 mr-3" /> Hesap Bilgileri</div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/profil/siparisler">
                  <button className="flex items-center justify-between px-6 py-5 w-full text-left bg-gray-50 border-l-4 border-[#4a2e2b] text-[#4a2e2b] font-bold">
                    <div className="flex items-center"><Package className="w-5 h-5 mr-3" /> Siparişlerim</div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/profil/adreslerim">
                  <button className="flex items-center justify-between px-6 py-5 w-full text-left hover:bg-gray-50 transition-colors border-l-4 border-transparent text-gray-600">
                    <div className="flex items-center font-bold"><MapPin className="w-5 h-5 mr-3" /> Adreslerim</div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
                <button onClick={handleCikisYap} className="flex items-center justify-between px-6 py-5 w-full text-left hover:bg-red-50 transition-colors border-l-4 border-transparent text-red-600 border-t font-bold">
                  <div className="flex items-center"><LogOut className="w-5 h-5 mr-3" /> Güvenli Çıkış</div>
                </button>
              </nav>
            </div>
          </aside>

          <section className="flex-1 w-full bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8">
            <h1 className="text-2xl font-serif font-bold mb-8 flex items-center text-[#4a2e2b]">
              <Package className="mr-3" /> Siparişlerim
            </h1>
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20"><Loader2 className="animate-spin mb-4 text-[#4a2e2b]" size={40} /></div>
              ) : myOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 italic font-medium">Henüz bir siparişiniz bulunmamaktadır.</p>
                  <Link href="/">
                    <Button className="mt-6 bg-[#4a2e2b] hover:bg-[#3a2422] rounded-xl">Alışverişe Başla</Button>
                  </Link>
                </div>
              ) : (
                myOrders.map((siparis) => (
                  <div 
                    key={siparis.id} 
                    className="border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-[#4a2e2b]/20 transition-all bg-white group cursor-pointer"
                    onClick={() => setSelectedOrder(siparis)}
                  >
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex items-center gap-5">
                          <div className="p-4 bg-[#fdfcfb] rounded-2xl text-[#4a2e2b] shadow-inner group-hover:bg-[#4a2e2b] group-hover:text-white transition-colors duration-300">
                            <Clock className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-lg text-gray-800">Sipariş #{siparis.id}</p>
                            <p className="text-sm text-gray-400 font-medium">
                              {new Date(siparis.createdAt || siparis.tarih).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        
                        {/* Ürün Görsel Önizlemeleri */}
                        <div className="flex -space-x-3 overflow-hidden py-1">
                          {siparis.items?.slice(0, 3).map((item: any, idx: number) => (
                            <div key={idx} className="w-10 h-14 rounded-md border-2 border-white shadow-sm overflow-hidden bg-gray-50">
                              <img src={item.coverImage || item.image || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {siparis.items?.length > 3 && (
                            <div className="w-10 h-14 rounded-md border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 shadow-sm">
                              +{siparis.items.length - 3}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between w-full lg:w-auto gap-8" onClick={(e) => e.stopPropagation()}>
                          <div className="text-right">
                            <p className="font-bold text-[#4a2e2b] text-xl">{(siparis.totalAmount || siparis.tutar).toFixed(2)} TL</p>
                            <div className="mt-1 flex justify-end">{getStatusBadge(siparis.status || siparis.durum)}</div>
                          </div>
                          <Button
                            onClick={() => setSelectedOrder(siparis)}
                            className="bg-white text-[#4a2e2b] border border-[#4a2e2b] hover:bg-[#4a2e2b] hover:text-white transition-all rounded-xl h-11 px-6 font-bold"
                          >
                            <Eye className="w-4 h-4 mr-2" /> Detaylar
                          </Button>
                        </div>
                      </div>

                      {/* İlerleme Çubuğu Bölümü */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                          <span className={siparis.status?.toLowerCase() === 'processing' ? 'text-[#4a2e2b]' : ''}>Hazırlanıyor</span>
                          <span className={siparis.status?.toLowerCase() === 'shipped' ? 'text-[#4a2e2b]' : ''}>Kargoda</span>
                          <span className={siparis.status?.toLowerCase() === 'delivered' ? 'text-[#4a2e2b]' : ''}>Teslim Edildi</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#4a2e2b] transition-all duration-700 ease-out" 
                            style={{ width: `${getProgressPercentage(siparis.status || siparis.durum)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <Card className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl rounded-3xl bg-white border-none animate-in zoom-in-95 duration-200">
            <CardHeader className="border-b border-gray-50 p-6 flex justify-between flex-row items-center bg-white">
              <div>
                <CardTitle className="font-serif text-2xl text-[#4a2e2b]">Sipariş Detayı</CardTitle>
                <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">No: #{selectedOrder.id}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)} className="rounded-full hover:bg-gray-100">
                <X className="w-6 h-6 text-gray-400" />
              </Button>
            </CardHeader>
            <CardContent className="p-8 overflow-y-auto space-y-8 bg-white">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#fdfcfb] p-6 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tarih</p>
                  <p className="font-bold text-gray-800 text-sm">{new Date(selectedOrder.createdAt || selectedOrder.tarih).toLocaleDateString("tr-TR")}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Durum</p>
                  <div className="mt-0.5">{getStatusBadge(selectedOrder.status || selectedOrder.durum)}</div>
                </div>
                <div className="md:col-span-2 md:text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Toplam Tutar</p>
                  <p className="font-bold text-[#4a2e2b] text-2xl">{(selectedOrder.totalAmount || selectedOrder.tutar).toFixed(2)} TL</p>
                </div>
              </div>

              <div>
                <h3 className="font-serif font-bold text-lg mb-6 text-gray-800 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#4a2e2b]" /> Sipariş İçeriği
                </h3>
                <div className="space-y-4">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-6 p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all group">
                        <div className="w-16 h-24 bg-[#fdfcfb] rounded-xl shrink-0 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                          <img src={item.coverImage || item.image || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 truncate text-lg group-hover:text-[#4a2e2b] transition-colors">{item.kitapAdi || item.title || "İsimsiz Kitap"}</p>
                          <p className="text-sm text-gray-400 font-medium mt-1">{item.yazar || "Bilinmeyen Yazar"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-400 mb-1">{item.quantity || item.adet} Adet</p>
                          <p className="font-black text-[#4a2e2b] text-lg">{(item.price * (item.quantity || item.adet))?.toFixed(2) || item.fiyat} TL</p>
                        </div>
                      </div>
                    ))
                  ) : (
                     <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl">
                        <p className="text-gray-400 italic font-medium">Bu siparişe ait ürün detayı bulunamadı.</p>
                     </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <Footer />
    </div>
  );
}