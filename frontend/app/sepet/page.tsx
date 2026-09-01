'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BookCard } from '@/components/book-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Truck, Shield, CreditCard, Headphones } from 'lucide-react';

function HomePage() {
  const { searchQuery } = useStore();
  const [dbBooks, setDbBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const categories = [
    { id: 1, name: 'Roman', slug: 'roman' },
    { id: 2, name: 'Bilim Kurgu', slug: 'bilim-kurgu' },
    { id: 3, name: 'Tarih', slug: 'tarih' },
    { id: 4, name: 'Felsefe', slug: 'felsefe' },
    { id: 5, name: 'Kişisel Gelişim', slug: 'kisisel-gelisim' },
    { id: 8, name: 'Biyografi', slug: 'biyografi' },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(false);

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://bagdas-kitap-api.onrender.com/api';
        const url = searchQuery
          ? `${baseUrl}/Kitap?arama=${encodeURIComponent(searchQuery)}`
          : `${baseUrl}/Kitap`;

        const res = await fetch(url, { cache: 'no-store' });

        if (!res.ok) {
          throw new Error(`API Hatası: ${res.status}`);
        }

        const data = await res.json();

        setDbBooks(data.data || []);
      } catch (error) {
        console.error("Kitaplar çekilemedi:", error);
        setError(true);
        setDbBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchQuery]);

  const filteredBooks = useMemo(() => {
    if (!searchQuery) return dbBooks;

    const query = String(searchQuery).toLowerCase();

    return dbBooks.filter((book) => {
      const title = book.baslik ? String(book.baslik).toLowerCase() : '';
      const author = book.yazar ? String(book.yazar).toLowerCase() : '';

      return title.includes(query) || author.includes(query);
    });
  }, [searchQuery, dbBooks]);

  const featuredBooks = filteredBooks.slice(0, 8);

  const discountedBooks = dbBooks
    .filter((book) => !featuredBooks.some((fb) => (fb.id || fb.Id) === (book.id || book.Id)))
    .slice(0, 4);

  const handleScrollToKesfet = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('kesfet');
    if (element) {
      const headerOffset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">

        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-balance">
                  Binlerce Kitap, Tek Adreste
                </h1>
                <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-lg">
                  Uygun fiyatlar ve geniş koleksiyonla aradığın kitabı hemen bul.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="#kesfet" onClick={handleScrollToKesfet}>
                    <Button size="lg" variant="secondary" className="font-medium group">
                      Kitapları Keşfet
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative max-w-[280px] md:max-w-sm w-full mx-auto md:ml-8 mt-2 md:mt-0">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "/gorseller/kitap1.jpg",
                    "/gorseller/kitap2.jpg",
                    "/gorseller/kitap3.jpg",
                    "/gorseller/kitap4.jpg"
                  ].map((localImageSrc, i) => (
                    <div
                      key={i}
                      className={`relative aspect-[3/4] rounded-lg overflow-hidden shadow-2xl ${
                        i % 2 === 1 ? 'mt-4' : ''
                      }`}
                    >
                      <Image
                        src={localImageSrc}
                        alt={`Öne Çıkan Kitap ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 140px, 200px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 border-b border-border bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-secondary">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Ücretsiz Kargo</p>
                  <p className="text-xs text-muted-foreground">200 TL üstü</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-secondary">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Güvenli Alışveriş</p>
                  <p className="text-xs text-muted-foreground">256-bit SSL</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-secondary">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Esnek Ödeme</p>
                  <p className="text-xs text-muted-foreground">Taksit imkani</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-secondary">
                  <Headphones className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">7/24 Destek</p>
                  <p className="text-xs text-muted-foreground">Her zaman yanımızda</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="kategoriler" className="py-12 md:py-16 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                Kategoriler
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((category) => (
                <Link key={category.id} href={`/kategori/${category.slug}`}>
                  <Card className="group hover:shadow-md transition-shadow border-0 bg-secondary/50 hover:bg-secondary cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">
                        {category.name}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="kesfet" className="py-12 md:py-16 bg-card scroll-mt-28">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                {searchQuery ? `"${searchQuery}" icin sonuclar` : 'Öne Çıkan Kitaplar'}
              </h2>
            </div>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Kitaplar yükleniyor...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Kitaplar yüklenirken bir hata oluştu.
                </p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {searchQuery
                    ? "Aramanızla eşleşen kitap bulunamadı."
                    : "Henüz kitap bulunmuyor."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {featuredBooks.map((book) => (
                  <BookCard key={book.id || book.Id} book={book} />
                ))}
              </div>
            )}
          </div>
        </section>

        {discountedBooks.length > 0 && !searchQuery && (
          <section className="py-12 md:py-16 border-t border-gray-100">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                    Kampanyalı Kitaplar
                  </h2>
                  <p className="text-muted-foreground mt-1">Kaçırmamanız gereken fırsatlar</p>
                </div>
                <Link href="/kategori/kampanyalar">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Tüm Kampanyalar
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {discountedBooks.map((book) => (
                  <BookCard key={book.id || book.Id} book={book} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-12 md:py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                Fırsatlardan Haberdar Olun
              </h2>
              <p className="text-muted-foreground mb-6">
                Yeni kitaplar ve özel indirimlerden ilk siz haberdar olun.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  aria-label="Bültene abone ol"
                  className="flex-1 px-4 py-2.5 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button type="submit">Abone Ol</Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function Page() {
  return <HomePage />;
}
