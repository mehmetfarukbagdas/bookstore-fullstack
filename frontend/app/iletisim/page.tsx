"use client";

import { FormEvent, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function IletisimPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);

    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);
      form.reset(); 

      
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl relative">
      
      {/* BAŞARILI GÖNDERİM BİLDİRİMİ (TOAST) */}
      {showToast && (
        <div className="fixed top-24 right-4 z-[100] animate-in slide-in-from-right duration-300">
          <div className="bg-[#5C3A21] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <p className="font-bold text-sm tracking-tight">Mesajınız başarıyla gönderildi!</p>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-serif font-bold mb-10 text-center text-[#5C3A21]">İletişim</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* İletişim Bilgileri */}
        <div className="bg-stone-50 p-8 rounded-xl border border-stone-200">
          <h2 className="text-2xl font-semibold mb-6 text-stone-800">Bize Ulaşın</h2>
          <p className="text-stone-600 mb-8">
            Kitaplar hakkında sormak istedikleriniz, siparişleriniz veya önerileriniz için bizimle iletişime geçebilirsiniz.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <span className="text-[#5C3A21] font-bold">📍 Adres:</span>
              <span className="text-stone-600">Kitap Sevenler Sokak, Edebiyat Apt. No:1<br/>İstanbul, Türkiye</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[#5C3A21] font-bold">📧 E-posta:</span>
              <span className="text-stone-600">iletisim@bagdaskitapdunyasi.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[#5C3A21] font-bold">📞 Telefon:</span>
              <span className="text-stone-600">0850 123 45 67</span>
            </div>
          </div>
        </div>

        {/* İletişim Formu */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ad" className="block text-sm font-medium text-stone-700 mb-1">Adınız</label>
                <input 
                  id="ad" 
                  aria-label="Adınız"
                  placeholder="Örn: Ahmet"
                  type="text" 
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] outline-none" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="soyad" className="block text-sm font-medium text-stone-700 mb-1">Soyadınız</label>
                <input 
                  id="soyad" 
                  aria-label="Soyadınız"
                  placeholder="Örn: Yılmaz"
                  type="text" 
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] outline-none" 
                  required 
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">E-posta Adresiniz</label>
              <input 
                id="email" 
                aria-label="E-posta Adresiniz"
                placeholder="ornek@mail.com"
                type="email" 
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] outline-none" 
                required 
              />
            </div>

            <div>
              <label htmlFor="mesaj" className="block text-sm font-medium text-stone-700 mb-1">Mesajınız</label>
              <textarea 
                id="mesaj" 
                aria-label="Mesajınız"
                placeholder="Size nasıl yardımcı olabiliriz?"
                rows={4} 
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] outline-none resize-none" 
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#5C3A21] text-white py-3 rounded-lg font-semibold hover:bg-[#4a2e1a] transition-colors flex items-center justify-center disabled:opacity-80"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Mesajı Gönder"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}