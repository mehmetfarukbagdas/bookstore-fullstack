'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Loader2 } from 'lucide-react';

interface UserType {
  ad?: string;
  name?: string;
  email?: string;
  rol?: string;
  role?: string;
}

const HeartIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const NAV_CATEGORIES = [
  { label: 'Çok Satanlar', slug: 'cok-satanlar' },
  { label: 'Dünya Klasikleri', slug: 'dunya-klasikleri' },
  { label: 'Kampanyalar', slug: 'kampanyalar' },
];

const DROPDOWN_CATEGORIES = [
  { label: 'Roman', slug: 'roman' },
  { label: 'Bilim Kurgu', slug: 'bilim-kurgu' },
  { label: 'Tarih', slug: 'tarih' },
  { label: 'Felsefe', slug: 'felsefe' },
  { label: 'Kişisel Gelişim', slug: 'kisisel-gelisim' },
];

export function Header() {
  const { cartItemCount, user: rawUser, isAuthenticated, searchQuery, setSearchQuery } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const user = rawUser as UserType;

  const updateFavCount = () => {
    if (typeof window !== 'undefined') {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavCount(favs.length);
    }
  };

  useEffect(() => {
    updateFavCount();
    window.addEventListener('favoritesUpdated', updateFavCount);

    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('favoritesUpdated', updateFavCount);
    };
  }, []);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://bagdas-kitap-api.onrender.com/api/Kitap?arama=${searchQuery}`
        );

        if (res.ok) {
          const data = await res.json();
          const rawBooks = data.data || [];

          const mapped = rawBooks.map((b: any) => ({
            id: b.Id || b.id,
            title: b.Baslik || b.baslik || b.title,
            author: b.Yazar || b.yazar || b.author,
            image:
              b.ResimUrl ||
              b.resimUrl ||
              b.image ||
              '/gorseller/placeholder.jpg',
          }));

          setSuggestions(mapped.slice(0, 5));
        }
      } catch (error) {
        console.error('Arama önerileri alınamadı:', error);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        {/* ÜST KISIM */}
        <div className="flex h-16 md:h-20 items-center justify-between gap-2 sm:gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 shrink-0"
          >
            <Image
              src="/logo.png"
              width={32}
              height={32}
              alt="Bağdaş Kitap Dünyası"
              className="object-contain"
            />
            {/* Mobilde de site adı görünür; masaüstü tasarımı korunur. */}
            <span className="font-serif text-sm sm:text-xl font-bold text-[#4a2e2b] whitespace-nowrap">
              Bağdaş Kitap Dünyası
            </span>
          </Link>

          {/* Arama Alanı */}
          <div className="hidden md:flex flex-1 max-w-xl" ref={searchRef}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Kitap veya yazar ara..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#4a2e2b] transition-colors rounded-xl"
              />

              {showSuggestions && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {isSearching ? (
                    <div className="flex items-center justify-center p-6 text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="flex flex-col">
                      {suggestions.map((book) => (
                        <Link
                          key={book.id}
                          href={`/kitap/${book.id}`}
                          className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                          onClick={() => {
                            setShowSuggestions(false);
                            setSearchQuery('');
                          }}
                        >
                          <div className="w-10 h-14 bg-gray-100 rounded overflow-hidden shrink-0">
                            <img
                              src={book.image}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <p className="text-sm font-bold text-gray-800 truncate">
                              {book.title}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {book.author}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-sm text-gray-500">
                      Sonuç bulunamadı
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sağ İkonlar */}
          <div className="flex items-center gap-0 sm:gap-2 shrink-0">
            <Link href="/favorilerim" aria-label="Favorilerim">
              <Button
                variant="ghost"
                size="icon"
                className="relative group hover:bg-[#4a2e2b]/10 rounded-full h-9 w-9 sm:h-10 sm:w-10"
              >
                <HeartIcon className="group-hover:text-red-500 transition-colors text-gray-600" />
                {favCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold animate-in zoom-in">
                    {favCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Sepet: doğrudan Link kullanılıyor; mobil/masaüstünde /sepet rotasına gider. */}
            <Link
              href="/sepet"
              aria-label="Sepete git"
              className="relative group flex items-center justify-center hover:bg-[#4a2e2b]/10 rounded-full text-gray-600 transition-all h-9 w-9 sm:h-10 sm:w-10"
            >
              <ShoppingCart className="h-5 w-5 group-hover:text-[#4a2e2b] transition-colors" />

              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#4a2e2b] text-white text-xs flex items-center justify-center font-medium animate-in zoom-in">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative group hover:bg-[#4a2e2b]/10 rounded-full text-gray-600 transition-all h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <User className="h-5 w-5 group-hover:text-[#4a2e2b] transition-colors" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50/50">
                    <div className="h-10 w-10 rounded-full bg-[#4a2e2b] flex items-center justify-center text-white font-bold text-lg">
                      {user?.ad?.charAt(0) || user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <p className="text-sm font-bold text-[#4a2e2b] truncate">
                        {user?.ad || user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profil">Profilim</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profil/siparisler">Siparişlerim</Link>
                  </DropdownMenuItem>

                  {(user?.rol === 'admin' || user?.role === 'admin') && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          href="/admin"
                          className="font-bold text-[#4a2e2b]"
                        >
                          Admin Paneli
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <a
                      href="/"
                      onClick={() => {
                        localStorage.removeItem('book-user');
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        document.cookie =
                          'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                      }}
                      className="text-red-600 cursor-pointer font-medium w-full block"
                    >
                      Çıkış Yap
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/giris">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-semibold text-gray-600"
                  >
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/kayit">
                  <Button
                    size="sm"
                    className="bg-[#4a2e2b] hover:bg-[#3a2422] text-white"
                  >
                    Üye Ol
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menüyü aç"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ALT KISIM: KATEGORİLER ŞERİDİ */}
      <div className="hidden md:block border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-8 py-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-between gap-3 font-bold text-white bg-[#4a2e2b] hover:bg-[#3a2422] px-5 py-2.5 rounded-lg transition-colors shadow-sm outline-none w-48">
                  <div className="flex items-center gap-2">
                    <Menu className="w-5 h-5" />
                    <span>Tüm Kategoriler</span>
                  </div>
                  <ChevronDown className="w-4 h-4 opacity-70" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="w-48 mt-2 p-2 shadow-xl border-gray-100 rounded-xl"
              >
                {DROPDOWN_CATEGORIES.map((cat) => (
                  <DropdownMenuItem
                    key={cat.slug}
                    asChild
                    className="cursor-pointer font-medium py-2 hover:bg-gray-50 focus:bg-gray-50 focus:text-[#4a2e2b] rounded-lg"
                  >
                    <Link href={`/kategori/${cat.slug}`}>{cat.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 w-px bg-gray-200" />

            <ul className="flex items-center gap-8 text-sm font-bold text-gray-600">
              {NAV_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategori/${cat.slug}`}
                    className="hover:text-[#4a2e2b] transition-colors whitespace-nowrap"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href="/hakkimizda"
                  className="hover:text-[#4a2e2b] transition-colors whitespace-nowrap"
                >
                  Hakkımızda
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* MOBİL MENÜ */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Kitap veya yazar ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {[
              ...DROPDOWN_CATEGORIES,
              ...NAV_CATEGORIES.filter(
                (n) =>
                  !DROPDOWN_CATEGORIES.find((d) => d.slug === n.slug)
              ),
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#4a2e2b]/5 hover:text-[#4a2e2b] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.label}
              </Link>
            ))}

            <Link
              href="/hakkimizda"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#4a2e2b]/5 hover:text-[#4a2e2b] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hakkımızda
            </Link>
          </nav>

          {!isAuthenticated && (
            <div className="p-4 border-t border-gray-100 flex gap-3">
              <Link href="/giris" className="flex-1">
                <Button variant="outline" className="w-full">
                  Giriş Yap
                </Button>
              </Link>

              <Link href="/kayit" className="flex-1">
                <Button className="w-full bg-[#4a2e2b] hover:bg-[#3a2422] text-white">
                  Üye Ol
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
