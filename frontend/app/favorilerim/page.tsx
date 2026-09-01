"use client";

import { useState, useEffect } from "react";
import { BookCard } from "@/components/book-card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeartOff } from "lucide-react";

export default function FavorilerimPage() {
  const [favBooks, setFavBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavs = async () => {
    
    const savedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
    
    if (savedFavs.length === 0) {
      setFavBooks([]);
      setLoading(false);
      return;
    }

    try {
    
      const promises = savedFavs.map((fav: any) => {
        const id = typeof fav === 'object' ? (fav.id || fav.Id) : fav;
        return fetch(`https://bagdas-kitap-api.onrender.com/api/Kitap/${id}`).then(res => res.json());
      });
      
      const results = await Promise.all(promises);
      
      const validBooks = results.map(r => r.data || r).filter(b => b && (b.id || b.Id));
      setFavBooks(validBooks); 

    } catch (err) {
      console.error("Favoriler API'den yüklenemedi", err);
      setFavBooks(savedFavs.filter((f: any) => typeof f === 'object'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavs();

    
    window.addEventListener('favoritesUpdated', fetchFavs);
    return () => window.removeEventListener('favoritesUpdated', fetchFavs);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-12 flex-1">
        <h1 className="text-3xl font-serif font-bold mb-8">Favorilerim</h1>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-64 bg-muted rounded-xl" />)}
          </div>
        ) : favBooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            
            {favBooks.map((book, index) => <BookCard key={book.id || book.Id || index} book={book} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
            <HeartOff className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl font-medium text-muted-foreground">Henüz favori kitabınız yok.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}