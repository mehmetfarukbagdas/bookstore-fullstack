'use client';

import { useState, useEffect, use } from 'react';
import Link from "next/link";
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ShoppingCart, Star, ChevronLeft, Loader2, Heart, CheckCircle2, ChevronDown, Filter, X, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Kitap {
  id: number;
  baslik: string;
  yazar: string;
  fiyat: number;
  indirimliFiyat?: number;
  resimUrl: string;
  puan: number;
  yorumSayisi: number;
  yayinevi?: string;
}

export default function KategoriDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [kitaplar, setKitaplar] = useState<Kitap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriler, setFavoriler] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [sortBy, setSortBy] = useState<string>('varsayilan');
  const [sortLabel, setSortLabel] = useState<string>('Önerilen Sıralama');

  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [publisher, setPublisher] = useState<string>('');
  
  const [appliedMin, setAppliedMin] = useState<string | null>(null);
  const [appliedMax, setAppliedMax] = useState<string | null>(null);
  const [appliedPublisher, setAppliedPublisher] = useState<string | null>(null);

  const store: any = useStore();
  const addToCart = store.addToCart;

  const baslikCevirileri: Record<string, string> = {
    'dunya-klasikleri': 'Dünya Klasikleri',
    'cok-satanlar': 'Çok Satanlar',
    'kampanyalar': 'Kampanyalar',
    'kisisel-gelisim': 'Kişisel Gelişim',
    'cocuk-kitaplari': 'Çocuk Kitapları',
    'roman': 'Roman'
  };

  const sayfaBasligi = slug
    ? baslikCevirileri[slug] || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Kategori';

  const sortOptions = [
    { id: 'varsayilan', label: 'Önerilen Sıralama' },
    { id: 'fiyat_artan', label: 'Fiyata Göre Artan' },
    { id: 'fiyat_azalan', label: 'Fiyata Göre Azalan' },
    { id: 'en_yeni', label: 'En Yeniler' },
  ];

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavoriler(favs.map((f: any) => f.id));
  }, []);

  useEffect(() => {
    async function fetchKategoriVerisi() {
      if (!slug) return;
      setIsLoading(true);
      try {
        let url;
        const ozelKategoriler = ['cok-satanlar', 'dunya-klasikleri', 'kampanyalar'];

        if (ozelKategoriler.includes(slug)) {
          url = `https://bagdas-kitap-api.onrender.com/api/kitap/${slug}?sirala=${sortBy}`;
        } else {
          url = `https://bagdas-kitap-api.onrender.com/api/kitap?kategori=${slug}&sirala=${sortBy}&limit=1000`;
        }

        if (appliedMin) url += `&minFiyat=${appliedMin}`;
        if (appliedMax) url += `&maxFiyat=${appliedMax}`;
        if (appliedPublisher) url += `&yayinevi=${encodeURIComponent(appliedPublisher)}`;

        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          const result = await res.json();
          const rawData = result.data || result; 
          const dataArray = Array.isArray(rawData) ? rawData : [];
          
          const mappedData = dataArray.map((b: any) => ({
            ...b,
            id: b.Id || b.id,
            baslik: b.Baslik || b.baslik || b.title || "İsimsiz Kitap",
            yazar: b.Yazar || b.yazar || b.author || "Bilinmiyor",
            fiyat: b.Fiyat || b.fiyat || b.price || 0,
            indirimliFiyat: b.IndirimliFiyat || b.indirimliFiyat || b.OrijinalFiyat || null,
            resimUrl: b.ResimUrl || b.resimUrl || b.image || "",
            puan: b.Puan || b.puan || 0,
            yorumSayisi: b.YorumSayisi || b.yorumSayisi || 0,
            yayinevi: b.Yayinevi || b.yayinevi || ""
          }));

          setKitaplar(mappedData);
        } else {
          setKitaplar([]); 
        }
      } catch (error) {
        console.error("Veri çekme hatası:", error);
        setKitaplar([]); 
      } finally {
        setIsLoading(false);
      }
    }
    fetchKategoriVerisi();
  }, [slug, sortBy, appliedMin, appliedMax, appliedPublisher, sayfaBasligi]); 
  
  const handleSortChange = (id: string, label: string) => {
    setSortBy(id);
    setSortLabel(label);
  };

  const handleFilterApply = () => {
    setAppliedMin(minPrice || null);
    setAppliedMax(maxPrice || null);
    setAppliedPublisher(publisher || null);
  };

  const handleFilterClear = () => {
    setMinPrice('');
    setMaxPrice('');
    setPublisher('');
    setAppliedMin(null);
    setAppliedMax(null);
    setAppliedPublisher(null);
  };

  const handleToggleFavorite = (e: React.MouseEvent<HTMLButtonElement>, kitap: Kitap) => {
    e.preventDefault(); 
    let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isFav = favs.some((f: any) => f.id === kitap.id);
    if (isFav) {
      favs = favs.filter((f: any) => f.id !== kitap.id);
    } else {
      favs.push(kitap);
    }
    localStorage.setItem('favorites', JSON.stringify(favs));
    setFavoriler(favs.map((f: any) => f.id));
    window.dispatchEvent(new Event('favoritesUpdated')); 
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, kitap: Kitap) => {
    e.preventDefault(); 
    if (addToCart) {
      addToCart({
        id: kitap.id.toString(),
        title: kitap.baslik,
        price: kitap.indirimliFiyat || kitap.fiyat,
        image: kitap.resimUrl,
        quantity: 1
      });
      setToastMessage(`"${kitap.baslik}" sepete eklendi!`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfcfb] relative">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8 border-b pb-6 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5 text-[#4a2e2b]" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#4a2e2b]">{sayfaBasligi}</h1>
            <p className="text-gray-500 italic mt-1">{sayfaBasligi} kategorisinde aradığınızı bulun.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          <aside className="w-full md:w-64 shrink-0 sticky top-24">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[#4a2e2b] flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filtreler
                </h3>
                {(appliedMin || appliedMax || appliedPublisher) && (
                  <button type="button" onClick={handleFilterClear} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center">
                    Temizle <X className="w-3 h-3 ml-1" />
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Yayınevi</label>
                  <Input 
                    type="text" 
                    placeholder="Örn: Can Yayınları" 
                    value={publisher} 
                    onChange={(e) => setPublisher(e.target.value)}
                    className="h-10 text-sm focus:border-[#4a2e2b]"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Fiyat Aralığı</label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      placeholder="Min" 
                      value={minPrice} 
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="h-10 text-sm focus:border-[#4a2e2b]"
                    />
                    <span className="text-gray-400">-</span>
                    <Input 
                      type="number" 
                      placeholder="Max" 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="h-10 text-sm focus:border-[#4a2e2b]"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleFilterApply}
                  className="w-full bg-[#4a2e2b] hover:bg-[#3a2422] text-white rounded-xl shadow-sm mt-2"
                >
                  Filtreleri Uygula
                </Button>
              </div>
            </div>
          </aside>

          <div className="flex-1 w-full">
            <div className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-2xl shadow-sm mb-6">
              <span className="text-sm font-medium text-gray-500 ml-2">
                {!isLoading && <>{kitaplar.length} kitap listeleniyor</>}
              </span>
              
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="min-w-[180px] justify-between border-gray-200 rounded-xl hover:bg-gray-50 text-[#4a2e2b] font-medium">
                      {sortLabel}
                      <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-xl">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem 
                        key={option.id}
                        onClick={() => handleSortChange(option.id, option.label)}
                        className={`cursor-pointer rounded-lg py-2.5 ${sortBy === option.id ? 'bg-[#4a2e2b]/5 text-[#4a2e2b] font-bold' : ''}`}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-[#4a2e2b]">
                <Loader2 className="animate-spin w-12 h-12 mb-4" />
                <p className="font-medium tracking-wide">Liste güncelleniyor...</p>
              </div>
            ) : kitaplar.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                <p className="text-gray-400 text-lg italic mb-4">Seçtiğiniz kriterlere uygun kitap bulunamadı.</p>
                <Button onClick={handleFilterClear} variant="outline" className="rounded-xl border-gray-200">
                  Filtreleri Temizle
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {kitaplar.map((kitap) => {
                  const isFavori = favoriler.includes(kitap.id);
                  
                  const normalFiyat = kitap.fiyat || 0;
                  const indirimliFiyat = kitap.indirimliFiyat || null;
                  const price = indirimliFiyat && indirimliFiyat > 0 ? indirimliFiyat : normalFiyat;
                  const originalPrice = indirimliFiyat && indirimliFiyat > 0 ? normalFiyat : 0;
                  const discount = originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

                  return (
                    <div key={kitap.id} className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                      
                     
                      <button 
                      type="button"
                      aria-label={isFavori ? "Favorilerden çıkar" : "Favorilere ekle"}
                      title={isFavori ? "Favorilerden çıkar" : "Favorilere ekle"}
                      onClick={(e) => handleToggleFavorite(e, kitap)} 
                      className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
                    >
                      <Heart className={`w-4 h-4 transition-colors ${isFavori ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
                    </button>
                      
                      <Link href={`/kitap/${kitap.id}`} className="block relative">
                        <div className="aspect-[2/3] relative overflow-hidden bg-gray-50">
                          {kitap.resimUrl ? (
                            <img src={kitap.resimUrl} alt={kitap.baslik} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-4xl">📖</div>
                          )}
                          
                          {discount > 0 && (
                            <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                              <span className="bg-red-600 text-white text-[11px] font-black px-2.5 py-1.5 rounded-lg shadow-lg tracking-wider flex items-center gap-1 animate-in zoom-in">
                                <TrendingDown className="w-3 h-3" />
                                %{discount} İNDİRİM
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="p-5 flex flex-col flex-1 bg-white">
                        <Link href={`/kitap/${kitap.id}`}>
                          <h3 className="font-serif font-bold text-gray-800 line-clamp-1 group-hover:text-[#4a2e2b] transition-colors mb-1.5 text-base">{kitap.baslik}</h3>
                        </Link>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-1 italic">{kitap.yazar}</p>
                        
                        <div className="flex items-center gap-1.5 mb-4 bg-gray-50 w-fit px-2 py-1 rounded-lg">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-black text-gray-700">{kitap.puan?.toFixed(1) || "0.0"}</span>
                          <span className="text-[10px] text-gray-400 font-medium">({kitap.yorumSayisi || 0})</span>
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                          <div className="flex flex-col">
                            {originalPrice > 0 ? (
                              <>
                                <span className="text-[11px] text-gray-400 line-through decoration-red-500/40 decoration-2 font-medium mb-0.5">
                                  {originalPrice.toFixed(2)} TL
                                </span>
                                <span className="text-lg font-black text-red-600 leading-none">
                                  {price.toFixed(2)} TL
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-black text-[#4a2e2b] leading-none">
                                {price.toFixed(2)} TL
                              </span>
                            )}
                          </div>
                          
                          <Button onClick={(e: any) => handleAddToCart(e, kitap)} size="icon" className="bg-[#4a2e2b] hover:bg-[#3a2422] h-10 w-10 rounded-xl shadow-md transition-all active:scale-95 shrink-0 z-10 relative">
                            <ShoppingCart className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#4a2e2b] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
          <span className="font-medium text-sm md:text-base">{toastMessage}</span>
        </div>
      )}
      <Footer />
    </div>
  );
}