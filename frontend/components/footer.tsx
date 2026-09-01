"use client";

import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Footer() {
  
  const [ayarlar, setAyarlar] = useState({
    magazaAdi: "Bağdaş Kitap Dünyası",
    aciklama: "Türkiye'nin en büyük online kitap satıcısı. Binlerce kitap, uygun fiyatlar ve hızlı teslimat.",
    telefon: "0850 123 45 67",
    email: "bagdas@kitapdunyasi.com",
    logoUrl: "" 
  });

  useEffect(() => {
    fetch("https://bagdas-kitap-api.onrender.com/api/ayarlar")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setAyarlar({
            magazaAdi: data.magazaAdi || "Bağdaş Kitap Dünyası",
            aciklama: data.aciklama || "Türkiye'nin en büyük online kitap satıcısı. Binlerce kitap, uygun fiyatlar ve hızlı teslimat.",
            telefon: data.telefon || "0850 123 45 67",
            email: data.email || "bagdas@kitapdunyasi.com",
            logoUrl: data.logoUrl || "" 
          });
        }
      })
      .catch((err) => console.error("Ayarlar çekilemedi:", err));
  }, []);

  
  const handleKategorilerClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById('kategoriler');
      if (element) {
        
        const headerOffset = 140; 
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              {ayarlar.logoUrl ? (
                <img 
                  src={ayarlar.logoUrl} 
                  alt={ayarlar.magazaAdi} 
                  className="h-10 w-auto object-contain" 
                />
              ) : (
                <BookOpen className="h-6 w-6" />
              )}
              <span className="font-serif text-lg font-bold">{ayarlar.magazaAdi}</span>
            </Link>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              {ayarlar.aciklama}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Hızlı Erişim</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link 
                  href="/#kategoriler" 
                  onClick={handleKategorilerClick}
                  className="hover:text-primary-foreground transition-colors"
                >
                  Kategoriler
                </Link>
              </li>
              <li><Link href="/kategori/cok-satanlar" className="hover:text-primary-foreground transition-colors">Çok Satanlar</Link></li>
              <li><Link href="/kategori/kampanyalar" className="hover:text-primary-foreground transition-colors">Kampanyalar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Müşteri Hizmetleri</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/sikca-sorulan-sorular" className="hover:text-primary-foreground transition-colors">Sıkça Sorulan Sorular</Link></li>
              <li><Link href="/iade-kosullari" className="hover:text-primary-foreground transition-colors">İade Koşulları</Link></li>
              <li><Link href="/iletisim" className="hover:text-primary-foreground transition-colors">İletişim</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">İletişim</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Müşteri Hizmetleri: {ayarlar.telefon}</li>
              <li>E-posta: {ayarlar.email}</li>
              <li>Çalışma Saatleri: 09:00 - 18:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            2026 {ayarlar.magazaAdi}. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-4 text-sm text-primary-foreground/60">
            <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-white/80 cursor-default">
              Gizlilik Politikası
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-white/80 cursor-default">
              Kullanım Koşulları
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}