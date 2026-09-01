"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  Layers, 
  ShoppingCart, 
  Loader2, 
  PlusCircle,
  ArrowRight,
  MessageSquare 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentBooks, setRecentBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        };

        const statsRes = await fetch("https://bagdas-kitap-api.onrender.com/api/Admin/istatistikler", { headers });
        if (statsRes.ok) {
          setStats(await statsRes.json());
        }

        const booksRes = await fetch("https://bagdas-kitap-api.onrender.com/api/Admin/kitaplar", { headers });
        if (booksRes.ok) {
          const booksData = await booksRes.json();
          
          const booksArray = booksData.data || booksData;
          
          const sorted = booksArray.sort((a: any, b: any) => (b.id || b.Id) - (a.id || a.Id)).slice(0, 4);
          setRecentBooks(sorted);
        }
      } catch (error) {
        console.error("Dashboard verileri yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Veriler veritabanından çekiliyor...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Yönetim Paneli</h1>
        <p className="text-muted-foreground">Bağdaş Kitap Dünyası mağaza özeti</p>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Toplam Kitap" 
          value={stats?.kitapSayisi || 0} 
          icon={<BookOpen className="w-6 h-6 text-blue-600" />} 
          color="bg-blue-50"
        />
        <StatCard 
          title="Kategoriler" 
          value={stats?.kategoriSayisi || 0} 
          icon={<Layers className="w-6 h-6 text-purple-600" />} 
          color="bg-purple-50"
        />
        <StatCard 
          title="Kullanıcılar" 
          value={stats?.kullaniciSayisi || 0} 
          icon={<Users className="w-6 h-6 text-green-600" />} 
          color="bg-green-50"
        />
        <StatCard 
          title="Siparişler" 
          value={stats?.siparisSayisi || 0} 
          icon={<ShoppingCart className="w-6 h-6 text-orange-600" />} 
          color="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Taraf */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-lg font-serif">Son Eklenen Kitaplar</CardTitle>
              <CardDescription>Mağazaya eklenen en yeni ürünler</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/kitaplar" className="flex items-center gap-1 text-primary">
                Tümünü Gör <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              {recentBooks.map((book) => {
                const id = book.id || book.Id;
                const ad = book.Baslik || book.baslik || book.Title || book.title || "İsimsiz Kitap";
                const yazar = book.Yazar || book.yazar || book.Author || book.author || "Bilinmeyen Yazar";
                const fiyat = book.fiyat || book.Fiyat || 0;
                const stok = book.stok || book.Stok || 0;
                const resimUrl = book.resimUrl || book.ResimUrl || "https://via.placeholder.com/150";

                return (
                  <div key={id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-14 bg-muted rounded overflow-hidden flex-shrink-0">
                        <img src={resimUrl} alt={ad} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{ad}</p>
                        <p className="text-xs text-muted-foreground">{yazar}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-primary">{fiyat} TL</p>
                      <p className="text-xs text-muted-foreground">Stok: {stok}</p>
                    </div>
                  </div>
                );
              })}
              {recentBooks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Henüz kitap eklenmemiş.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sağ Taraf */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Hızlı İşlemler</CardTitle>
            <CardDescription>Sık kullanılan yönetim araçları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-muted/50 hover:bg-muted text-foreground" variant="outline" asChild>
              <Link href="/admin/kitaplar">
                <PlusCircle className="w-4 h-4 mr-2 text-blue-600" /> Yeni Kitap Ekle
              </Link>
            </Button>
            <Button className="w-full justify-start bg-muted/50 hover:bg-muted text-foreground" variant="outline" asChild>
              <Link href="/admin/kullanicilar">
                <Users className="w-4 h-4 mr-2 text-green-600" /> Kullanıcıları Yönet
              </Link>
            </Button>
            <Button className="w-full justify-start bg-muted/50 hover:bg-muted text-foreground" variant="outline" asChild>
              <Link href="/admin/yorumlar">
                <MessageSquare className="w-4 h-4 mr-2 text-purple-600" /> Kullanıcı Yorumlarını Yönet
              </Link>
            </Button>
            <Button className="w-full justify-start bg-muted/50 hover:bg-muted text-foreground" variant="outline" asChild>
              <Link href="/admin/siparisler">
                <ShoppingCart className="w-4 h-4 mr-2 text-orange-600" /> Siparişleri İncele
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: any, color: string }) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className={`p-3 rounded-xl ${color}`}>
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          <p className="text-sm text-muted-foreground font-medium mt-1">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}