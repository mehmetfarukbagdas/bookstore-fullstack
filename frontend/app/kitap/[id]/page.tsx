'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StoreProvider, useStore } from '@/lib/store-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Star, ShoppingCart, Heart, Share2, ArrowLeft, Check, AlertTriangle, MessageSquare, CheckCircle2 } from 'lucide-react';

function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart } = useStore();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ayarlar, setAyarlar] = useState({ ucretsizKargoLimiti: 150 });
  const [userComment, setUserComment] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [comments, setComments] = useState<any[]>([]); 
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastIconColor, setToastIconColor] = useState('text-green-400');

  const apiUrl = "https://bagdas-kitap-api.onrender.com/api";

  const triggerToast = (message: string, isSuccess: boolean = true) => {
    setToastMessage(message);
    setToastIconColor(isSuccess ? 'text-green-400' : 'text-red-400');
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/Kitap/${id}`);
        
        if (!res.ok) {
          setError(true);
          return;
        }

        const data = await res.json();
        const bookData = data.data || data; 
        setBook(bookData);

      } catch (err) {
        console.error("Kitap detayı çekilirken hata:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetch(`${apiUrl}/ayarlar`)
      .then(res => res.json())
      .then(data => data && setAyarlar({
        ucretsizKargoLimiti: data.ucretsizKargoLimiti || 150
      }))
      .catch(err => console.error("Ayarlar çekilemedi:", err));

    const fetchBookComments = async () => {
      try {
        const res = await fetch(`${apiUrl}/Yorum/kitap/${id}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (err) {
        console.error("Yorumlar getirilirken API hatası:", err);
      }
    };

    fetchBookDetails();
    if (id) {
      fetchBookComments();
    }
  }, [id]);

  useEffect(() => {
    if (book) {
      
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const isFav = favorites.some((fav: any) => fav.id === book.id || fav.id === id);
      setIsFavorite(isFav);
    }
  }, [book, id]);

  const handleAddComment = async () => {
    if (!userComment.trim()) return;

    try {
      const response = await fetch(`${apiUrl}/Yorum`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: Number(id),
          user: "Anonim Kullanıcı",
          text: userComment,
          rating: userRating
        })
      });

      if (response.ok) {
        const yeniYorum = await response.json();
        
        setComments((prev) => [
          {
            ...yeniYorum,
            date: "Az önce",
            initials: "AK"
          },
          ...prev
        ]);

        setUserComment("");
        setUserRating(5);
        
        triggerToast("Yorumunuz başarıyla gönderildi!");
      } else {
        triggerToast("Yorum kaydedilirken bir hata oluştu.", false);
      }
    } catch (err) {
      console.error("Yorum gönderilirken hata:", err);
      triggerToast("Sunucu bağlantısı kurulamadı.", false);
    }
  };

  const toggleFavorite = () => {
    if (!book) return;

    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const bookId = book.id || id;
    
    if (isFavorite) {
      const updatedFavorites = favorites.filter((fav: any) => fav.id !== bookId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
      triggerToast("Ürün favorilerinizden kaldırıldı.");
    } else {
      const newFavorite = {
        ...book,
        id: bookId,
        title: book.title || book.baslik,
        image: book.image || book.resimUrl || book.coverImage,
        price: book.price || book.fiyat,
        author: book.author || book.yazar
      };
      favorites.push(newFavorite);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      triggerToast("Ürün favorilerinize eklendi!");
    }
    
    
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const handleShare = () => {
    const shareData = {
      title: book?.title || book?.baslik,
      text: `${book?.title || book?.baslik} kitabına Bağdaş Kitap Dünyası'nda göz at!`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      triggerToast("Ürün linki başarıyla panoya kopyalandı!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg animate-pulse">Kitap bilgileri yükleniyor...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Kitap Bulunamadı</h1>
            <p className="text-muted-foreground mb-6">Aradığınız kitap sistemde mevcut değil.</p>
            <Link href="/"><Button>Ana Sayfaya Dön</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const title = book.title || book.baslik || "İsimsiz Kitap";
  const author = book.author || book.yazar || "Bilinmeyen Yazar";
  const categoryName = book.kategori?.name || book.kategori?.ad || "Genel";
  const image = book.image || book.resimUrl || book.coverImage || "/placeholder.jpg";
  const price = Number(book.price || book.fiyat || 0);
  const originalPrice = Number(book.originalPrice || book.orijinalFiyat || 0);
  const rating = book.rating || book.puan || 0;
  const reviewCount = book.reviewCount !== undefined ? book.reviewCount : (book.degerlendirmeSayisi !== undefined ? book.degerlendirmeSayisi : comments.length);
  const stock = book.stock !== undefined ? book.stock : 10; 
  const publisher = book.publisher || book.yayinevi || "Belirtilmemiş";
  const pageCount = book.pageCount || book.sayfaSayisi || "Belirtilmemiş";
  const language = book.language || book.dil || "Türkçe";
  const isbn = book.isbn || "Belirtilmemiş";
  const description = book.description || book.aciklama || "Bu kitap için henüz bir açıklama girilmemiştir.";

  const discount = originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const bookForCart = {
    ...book,
    id: Number(book.id || id),
    title: title,
    author: author,
    price: price,
    image: image,
    coverImage: image
  };

  const handleAddToCart = () => {
    addToCart(bookForCart);
    triggerToast("Ürün başarıyla sepete eklendi!");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Az önce";
    if (dateString === "Az önce" || dateString === "Geçen hafta") return dateString;
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(date);
    } catch (e) {
      return "Kayıtlı Tarih";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfcfb] relative">
      <Header />

      
      {showSuccessToast && (
        <div className="fixed top-24 right-4 z-[100] animate-in slide-in-from-right duration-300">
          <div className="bg-[#4a2e2b] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            <CheckCircle2 className={`w-5 h-5 ${toastIconColor}`} />
            <p className="font-bold text-sm tracking-tight">{toastMessage}</p>
          </div>
        </div>
      )}

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-foreground">{title}</span>
          </nav>

          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Geri Dön
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0 rounded-lg overflow-hidden bg-secondary">
              <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              {discount > 0 && <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-sm font-semibold px-3 py-1.5 rounded shadow-sm">%{discount} indirim</span>}
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-4">
                  <span className="text-sm text-accent font-medium uppercase tracking-wider">{categoryName}</span>
                </div>

                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">{title}</h1>
                <p className="text-lg text-muted-foreground mb-4">{author}</p>

                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
                    ))}
                  </div>
                  <span className="font-medium text-sm text-muted-foreground">({reviewCount} değerlendirme)</span>
                </div>

                <div className="mt-6 pb-6 border-b border-border">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-foreground">{price.toFixed(2)} TL</span>
                    {originalPrice > 0 && <span className="text-xl text-muted-foreground line-through">{originalPrice.toFixed(2)} TL</span>}
                  </div>
                </div>

                <div className="py-4 border-b border-border">
                  {stock > 0 ? (
                    <div className="flex items-center gap-2 font-medium text-green-600 text-sm">
                      <Check className="h-4 w-4" />
                      <span>Stokta var ({stock} adet)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-destructive font-medium text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Stokta yok</span>
                    </div>
                  )}
                </div>

                <p className="text-muted-foreground text-base leading-relaxed mt-4">{description}</p>
              </div>

              <div className="mt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="flex-1 h-12 text-base font-semibold shadow-sm" onClick={handleAddToCart} disabled={stock === 0}><ShoppingCart className="h-5 w-5 mr-2" /> Sepete Ekle</Button>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" size="icon" onClick={toggleFavorite} className={isFavorite ? 'text-red-500 bg-red-50 border-red-200 shadow-sm' : 'shadow-sm'}>
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare} className="shadow-sm">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Card className="mb-12 bg-white border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-[#4a2e2b] font-serif mb-4 text-base">Kitap Bilgileri</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-12 text-sm">
                <div className="flex justify-between border-b pb-1.5 border-border/40"><dt className="text-muted-foreground">Yayınevi</dt><dd className="font-medium text-gray-800">{publisher}</dd></div>
                <div className="flex justify-between border-b pb-1.5 border-border/40"><dt className="text-muted-foreground">Sayfa Sayısı</dt><dd className="font-medium text-gray-800">{pageCount}</dd></div>
                <div className="flex justify-between border-b pb-1.5 border-border/40"><dt className="text-muted-foreground">Dil</dt><dd className="font-medium text-gray-800">{language}</dd></div>
                <div className="flex justify-between border-b pb-1.5 border-border/40"><dt className="text-muted-foreground">ISBN</dt><dd className="font-medium text-gray-800">{isbn}</dd></div>
              </dl>
            </CardContent>
          </Card>

          <section className="mb-16 border-t pt-8">
            <div className="flex items-center gap-3 mb-8 pb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h2 className="font-serif text-2xl font-bold text-foreground">Kullanıcı Yorumları</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card className="p-6 border-none bg-secondary/30 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-[#4a2e2b] font-serif">Yorum Yap</h3>
                  <div className="space-y-4">
                    <div className="flex gap-1 text-amber-400">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} onClick={() => setUserRating(i)} className={`h-6 w-6 cursor-pointer ${i <= userRating ? 'fill-current' : 'opacity-30'}`} />
                      ))}
                    </div>
                    <Textarea placeholder="Kitap hakkındaki görüşlerinizi paylaşın..." className="bg-background min-h-[120px] resize-none" value={userComment} onChange={(e) => setUserComment(e.target.value)} />
                    <Button className="w-full h-11 text-sm font-semibold" disabled={!userComment.trim()} onClick={handleAddComment}>Gönder</Button>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-4 max-h-[550px] overflow-y-auto pr-2">
                {comments.length === 0 ? (
                  <p className="text-muted-foreground italic text-sm p-4 text-center bg-secondary/10 rounded-xl">Bu kitap için henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                ) : (
                  comments.map((comment: any) => (
                    <div key={comment.id} className="p-5 border rounded-xl bg-card shadow-sm space-y-3 border-border/60">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                            {comment.initials || comment.user?.substring(0,1).toUpperCase() || "A"}
                          </div>
                          <span className="font-bold text-sm text-foreground">{comment.user}</span>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < comment.rating ? 'fill-current' : 'text-muted-foreground/30'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed pl-1">"{comment.text}"</p>
                      <span className="text-[10px] text-muted-foreground italic pl-1 block">{formatDate(comment.date)}</span>

                      {comment.cevap && (
                        <div className="mt-3 ml-4 flex items-start gap-2.5 text-xs bg-secondary/40 p-3 rounded-lg border border-border/50 shadow-inner">
                          <div className="shrink-0 w-6 h-6 rounded-full bg-[#4a2e2b] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                            B
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-[#4a2e2b] text-xs">Bağdaş Kitap Dünyası Yanıtı</p>
                            <p className="text-muted-foreground leading-relaxed italic">"{comment.cevap}"</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <StoreProvider>
      <BookDetailPage params={params} />
    </StoreProvider>
  );
}