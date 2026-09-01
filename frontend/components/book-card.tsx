"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { ShoppingCart, Star, Heart, TrendingDown } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { Button } from '@/components/ui/button';

export function BookCard({ book }: { book: any }) {
  const { addToCart } = useStore();
  const [isFavorite, setIsFavorite] = useState(false);

  const b = book || {};
  const id = b.id || b.Id;
  const title = b.baslik || b.Baslik || b.title || "İsimsiz Kitap";
  const author = b.yazar || b.Yazar || b.author || "Bilinmeyen Yazar";
  const image = b.resimUrl || b.ResimUrl || b.image || "/gorseller/placeholder.jpg";

  const normalFiyat = b.fiyat || b.Fiyat || b.price || 0;
  const indirimliFiyat = b.indirimliFiyat || b.IndirimliFiyat || null;
  const price = indirimliFiyat && indirimliFiyat > 0 ? indirimliFiyat : normalFiyat;
  const originalPrice = indirimliFiyat && indirimliFiyat > 0 ? normalFiyat : 0;

  const discount = originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  // API'den gelen alan adları farklı olsa bile puan ve yorum sayısını doğru göster.
  const reviewList = Array.isArray(b.yorumlar)
    ? b.yorumlar
    : Array.isArray(b.Yorumlar)
      ? b.Yorumlar
      : Array.isArray(b.reviews)
        ? b.reviews
        : Array.isArray(b.Reviews)
          ? b.Reviews
          : [];

  const ratingValue =
    b.puan ??
    b.Puan ??
    b.rating ??
    b.Rating ??
    b.averageRating ??
    b.AverageRating ??
    b.ortalamaPuan ??
    b.OrtalamaPuan ??
    b.ratingAverage ??
    b.RatingAverage;

  const reviewCountValue =
    b.yorumSayisi ??
    b.YorumSayisi ??
    b.reviewCount ??
    b.ReviewCount ??
    b.degerlendirmeSayisi ??
    b.DegerlendirmeSayisi;

  const reviewCount =
    reviewCountValue != null
      ? Number(reviewCountValue)
      : reviewList.length;

  const calculatedRating =
    ratingValue != null
      ? Number(ratingValue)
      : reviewList.length > 0
        ? reviewList.reduce((sum: number, review: any) => {
          const value =
            review.puan ??
            review.Puan ??
            review.rating ??
            review.Rating ??
            0;
          return sum + Number(value || 0);
        }, 0) / reviewList.length
        : 0;

  const rating = Number.isFinite(calculatedRating)
    ? Math.round(calculatedRating * 10) / 10
    : 0;


  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favs.some((fav: any) => String(fav.id || fav) === String(id)));
  }, [id]);


  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const exists = favs.some((fav: any) => String(fav.id || fav) === String(id));

    if (exists) {
      favs = favs.filter((fav: any) => String(fav.id || fav) !== String(id));
      setIsFavorite(false);
    } else {
      favs.push({ id, baslik: title, resimUrl: image, fiyat: normalFiyat, indirimliFiyat: indirimliFiyat });
      setIsFavorite(true);
    }

    localStorage.setItem("favorites", JSON.stringify(favs));
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Favori Butonu */}
      <button
        onClick={toggleFavorite}
        title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
        aria-label={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
        className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}`}
        />
      </button>

      <Link href={`/kitap/${id}`} className="block relative">
        <div className="aspect-[2/3] relative overflow-hidden bg-gray-50">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />

          {/* İndirim Rozeti */}
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
        <Link href={`/kitap/${id}`}>
          <h3 className="font-serif font-bold text-gray-800 line-clamp-1 group-hover:text-[#4a2e2b] transition-colors mb-1.5 text-base">
            {title}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 mb-3 line-clamp-1 italic">
          {author}
        </p>

        <div className="flex items-center gap-1.5 mb-4 bg-gray-50 w-fit px-2 py-1 rounded-lg">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-black text-gray-700">{rating}</span>
          <span className="text-[10px] text-gray-400 font-medium">({reviewCount})</span>
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


          <Button
            onClick={(e) => {
              e.preventDefault();

              addToCart({
                ...b,
                id: id,
                title: title,
                price: price,
                image: image,
                author: author
              });
            }}
            size="icon"
            title="Sepete Ekle"
            aria-label="Sepete Ekle"
            className="bg-[#4a2e2b] hover:bg-[#3a2422] h-10 w-10 rounded-xl shadow-md transition-all active:scale-95 shrink-0 z-10 relative"
          >
            <ShoppingCart className="h-4 w-4 text-white" />
          </Button>

        </div>
      </div>
    </div>
  );
}