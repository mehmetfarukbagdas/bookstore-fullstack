'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BookOpen, Users, Award, ShieldCheck } from 'lucide-react';


export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfcfb]">
      <Header />

      <main className="flex-1">
        {/* Banner Alanı */}
        <div className="bg-[#4a2e2b] text-white py-20 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Bağdaş Kitap Dünyası</h1>
            <p className="text-lg opacity-90 leading-relaxed font-light italic">
              "Bir kitap, içimizdeki donmuş denizi kırmak için kullanılan bir balta olmalıdır."
            </p>
          </div>
        </div>

        {/* Hikayemiz Bölümü */}
        <div className="container mx-auto px-4 py-20 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2070&auto=format&fit=crop" 
                alt="Kitapçımız" 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold text-[#4a2e2b]">Hikayemiz</h2>
              <p className="text-gray-600 leading-relaxed">
                Bağdaş Kitap Dünyası olarak yolculuğumuza, kitapların sadece kağıt yığınları değil, yeni dünyalara açılan kapılar olduğu inancıyla başladık. Kurulduğumuz günden bu yana, okurlarımızı en seçkin eserlerle buluşturmayı kendimize görev edindik.
              </p>
            </div>
          </div>
        </div>

        {/* Değerlerimiz (İkonlu Alan) */}
        <div className="bg-white py-20 border-y border-gray-100">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-[#4a2e2b]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#4a2e2b] group-hover:text-white transition-all">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-[#4a2e2b] mb-2">Geniş Koleksiyon</h3>
                <p className="text-sm text-gray-500">Dünya klasiklerinden yeni çıkanlara binlerce eser.</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-[#4a2e2b]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#4a2e2b] group-hover:text-white transition-all">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-[#4a2e2b] mb-2">Okur Odaklılık</h3>
                <p className="text-sm text-gray-500">Sizin memnuniyetiniz bizim en büyük motivasyonumuz.</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-[#4a2e2b]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#4a2e2b] group-hover:text-white transition-all">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-[#4a2e2b] mb-2">Kaliteli Hizmet</h3>
                <p className="text-sm text-gray-500">Hızlı kargo ve güvenli paketleme standartlarımız.</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-[#4a2e2b]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#4a2e2b] group-hover:text-white transition-all">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-[#4a2e2b] mb-2">Güvenli Alışveriş</h3>
                <p className="text-sm text-gray-500">Modern ödeme sistemleri ile tam güvenlik.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vizyon/Misyon */}
        <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
          <div className="bg-[#faf9f8] p-12 rounded-[40px] border border-gray-100">
            <h2 className="text-3xl font-serif font-bold text-[#4a2e2b] mb-6">Vizyonumuz</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Türkiye'nin her köşesine, her bütçeye uygun, kaliteli ve ulaşılabilir bir kitap dünyası inşa etmek. Okuma alışkanlığını dijital dünyanın kolaylıklarıyla birleştirerek gelecek nesillere taşımak en büyük hayalimizdir.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}