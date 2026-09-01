'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, isAuthenticated } = useStore();

  
  const [ayarlar, setAyarlar] = useState({
    kargoUcreti: 50,
    bedavaKargoLimiti: 150
  });

  
  useEffect(() => {
    fetch("https://bagdas-kitap-api.onrender.com/api/ayarlar")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setAyarlar({
            kargoUcreti: data.kargoUcreti || data.standartKargoUcreti || 50,
            bedavaKargoLimiti: data.ucretsizKargoLimiti || 150
          });
        }
      })
      .catch((err) => console.error("Kargo ayarları çekilemedi:", err));
  }, []);

  
  const shippingCost = cartTotal >= ayarlar.bedavaKargoLimiti ? 0 : ayarlar.kargoUcreti;
  const totalWithShipping = cartTotal + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Sepetiniz Boş</h1>
            <p className="text-muted-foreground mb-6">Henüz sepetinize ürün eklemediniz.</p>
            <Link href="/">
              <Button>Alışverişe Başla</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-8 text-center md:text-left">Sepetim</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.book.id} className="overflow-hidden border-none shadow-sm bg-card hover:shadow-md transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex gap-4 md:gap-6">
                      <div className="relative w-20 h-28 md:w-24 md:h-32 flex-shrink-0 bg-secondary rounded-md overflow-hidden">
                        <Image
                          src={item.book.coverImage || item.book.image}
                          alt={item.book.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h3 className="font-bold text-lg text-foreground truncate">{item.book.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">{item.book.author}</p>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.book.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            aria-label="Ürünü sil" // Erişilebilirlik hatasını düzeltir
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <div className="mt-auto flex justify-between items-end">
                          <div className="flex items-center gap-1 border border-input rounded-md p-1 bg-background">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                              aria-label="Azalt"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                              aria-label="Artır"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground line-through">
                              {(item.book.price * 1.2 * item.quantity).toFixed(2)} TL
                            </p>
                            <p className="font-bold text-xl text-primary">
                              {(item.book.price * item.quantity).toFixed(2)} TL
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-none shadow-lg bg-card">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Sipariş Özeti</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Ara Toplam</span>
                      <span>{cartTotal.toFixed(2)} TL</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Kargo</span>
                      <span className={shippingCost === 0 ? "text-green-600 font-bold" : ""}>
                        {shippingCost === 0 ? 'Ücretsiz' : `${shippingCost.toFixed(2)} TL`}
                      </span>
                    </div>
                    {cartTotal < ayarlar.bedavaKargoLimiti && (
                      <p className="text-xs text-muted-foreground italic bg-secondary/50 p-2 rounded">
                        Kargonun bedava olması için <span className="font-bold">{(ayarlar.bedavaKargoLimiti - cartTotal).toFixed(2)} TL</span> daha ekleyin!
                      </p>
                    )}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-bold text-lg text-foreground">Toplam</span>
                      <span className="text-2xl font-black text-primary">
                        {totalWithShipping.toFixed(2)} TL
                      </span>
                    </div>
                  </div>
                  {isAuthenticated ? (
                    <Link href="/odeme" className="block">
                      <Button className="w-full h-12 text-lg" size="lg">
                        Ödemeye Geç
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="space-y-3">
                      <Link href="/giris?redirect=/sepet" className="block">
                        <Button className="w-full h-12" size="lg">Giriş Yap ve Devam Et</Button>
                      </Link>
                      <Link href="/kayit?redirect=/sepet" className="block">
                        <Button variant="outline" className="w-full h-12" size="lg">Üye Ol</Button>
                      </Link>
                    </div>
                  )}
                  <Link href="/" className="block">
                    <Button variant="ghost" className="w-full text-muted-foreground hover:bg-secondary">Alışverişe Devam Et</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}