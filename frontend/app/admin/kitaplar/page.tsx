"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Trash2, Edit, Loader2, X, Star, AlertTriangle } from "lucide-react";

export default function AdminKitaplar() {
  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);

  
  const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  
  const [formData, setFormData] = useState({
    baslik: "", 
    yazar: "",
    fiyat: "",
    orijinalFiyat: "",
    stok: "",
    kategoriId: "1",
    resimUrl: "",
    cokSatanMi: false 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksRes, categoriesRes] = await Promise.all([
        fetch("https://bagdas-kitap-api.onrender.com/api/Kitap?limit=1000"), 
        fetch("https://bagdas-kitap-api.onrender.com/api/Kategori")
      ]);

      if (booksRes.ok) {
        const bData = await booksRes.json();
        setBooks(Array.isArray(bData) ? bData : (bData.data || bData.items || []));
      }

      if (categoriesRes.ok) {
        const cData = await categoriesRes.json();
        setCategories(Array.isArray(cData) ? cData : (cData.data || []));
      }
    } catch (error) {
      console.error("Veriler yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  
  const confirmDelete = async () => {
    if (!deleteModalId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`https://bagdas-kitap-api.onrender.com/api/Kitap/${deleteModalId}`, { method: "DELETE" });
      if (response.ok) {
        setBooks(books.filter(b => (b.id || b.Id) !== deleteModalId));
      } else {
        setErrorMessage("Kitap silinirken bir hata oluştu.");
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      }
    } catch (error) {
      console.error("Silme hatası:", error);
      setErrorMessage("Sunucu bağlantısı kurulamadı.");
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsDeleting(false);
      setDeleteModalId(null);
    }
  };

  const handleAddNewClick = () => {
    setEditingBookId(null);
    setFormData({ baslik: "", yazar: "", fiyat: "", orijinalFiyat: "", stok: "", kategoriId: "1", resimUrl: "", cokSatanMi: false });
    setIsModalOpen(true);
  };

  const handleEditClick = (book: any) => {
    const bookId = book.id || book.Id;
    setEditingBookId(bookId);
    
    setFormData({
      baslik: book.baslik || book.Baslik || book.title || "",
      yazar: book.yazar || book.Yazar || "",
      fiyat: (book.fiyat || book.Fiyat || 0).toString(),
      orijinalFiyat: (book.indirimliFiyat || book.IndirimliFiyat || 0).toString(),
      stok: (book.stok || book.Stok || 0).toString(),
      kategoriId: (book.kategoriId || book.KategoriId || 1).toString(),
      resimUrl: book.resimUrl || book.ResimUrl || "",
      cokSatanMi: book.cokSatan || book.CokSatan || false 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        Baslik: formData.baslik,
        Yazar: formData.yazar,
        Fiyat: parseFloat(formData.fiyat.toString().replace(',', '.')) || 0,
        IndirimliFiyat: formData.orijinalFiyat ? parseFloat(formData.orijinalFiyat.toString().replace(',', '.')) : null, 
        Stok: parseInt(formData.stok.toString()) || 0,
        KategoriId: parseInt(formData.kategoriId.toString()) || 1,
        ResimUrl: formData.resimUrl || "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=400&fit=crop",
        CokSatan: formData.cokSatanMi, 
        ISBN: "",
        Aciklama: "",
        Yayinevi: "",
        SayfaSayisi: 0,
        YayinTarihi: new Date().toISOString()
      };

      const url = editingBookId 
        ? `https://bagdas-kitap-api.onrender.com/api/Kitap/${editingBookId}` 
        : "https://bagdas-kitap-api.onrender.com/api/Kitap";
        
      const response = await fetch(url, {
        method: editingBookId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsModalOpen(false); 
        await fetchData(); 
      } else {
        const errorData = await response.json().catch(() => null);
        console.error("Backend Hata Detayı:", errorData);
        // Alert silindi, Toast eklendi
        setErrorMessage("İşlem başarısız! Hata detayı için F12 (Console) ekranına bakınız.");
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      }
    } catch (error) {
      console.error("Bağlantı Hatası:", error);
      setErrorMessage("Sunucu bağlantısı kurulamadı.");
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      const baslik = b.baslik || b.Baslik || b.title || "";
      const yazar = b.yazar || b.Yazar || "";
      return baslik.toLowerCase().includes(searchQuery.toLowerCase()) || 
             yazar.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [books, searchQuery]);

  return (
    <div className="p-6 space-y-6 relative bg-white min-h-screen">
      
      
      {showErrorToast && (
        <div className="fixed top-24 right-4 z-[100] animate-in slide-in-from-right duration-300">
          <div className="bg-[#4a2e2b] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="font-bold text-sm tracking-tight">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Kitap Yönetimi</h1>
          <p className="text-muted-foreground text-sm">Toplam {books.length} adet kitap yayında</p>
        </div>
        <Button onClick={handleAddNewClick} className="bg-[#5c3d2e] hover:bg-[#4a3125]">
          <Plus className="w-4 h-4 mr-2" /> Yeni Kitap Ekle
        </Button>
      </div>

      <Card className="p-4 bg-white border-none shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Kitap adı veya yazar ara..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      <Card className="overflow-hidden border-none shadow-sm bg-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex flex-col items-center"><Loader2 className="animate-spin text-[#5c3d2e]" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#f8f5f2] border-b text-[#5c3d2e]">
                  <tr>
                    <th className="p-4 text-left">Kitap</th>
                    <th className="p-4 text-left">Kategori</th>
                    <th className="p-4 text-left">Fiyat</th>
                    <th className="p-4 text-left">Stok</th>
                    <th className="p-4 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBooks.map((book) => {
                    const id = book.id || book.Id;
                    const baslik = book.baslik || book.Baslik || book.title || "İsimsiz Kitap";
                    const yazar = book.yazar || book.Yazar || "Bilinmiyor";
                    const fiyat = book.fiyat || book.Fiyat || 0;
                    const stok = book.stok || book.Stok || 0;
                    const resimUrl = book.resimUrl || book.ResimUrl || "https://via.placeholder.com/150";
                    const isCokSatan = book.cokSatan || book.CokSatan || false;

                    return (
                      <tr key={id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-14 bg-muted rounded overflow-hidden flex-shrink-0 border">
                                <img src={resimUrl} alt={baslik} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex flex-col">
                               <span className="text-[#2d1e1e] font-bold flex items-center gap-2">
                                 {baslik}
                                 {isCokSatan && (
                                    <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded border border-amber-200">
                                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Çok Satan
                                    </span>
                                  )}
                               </span>
                               <span className="text-xs text-gray-500">{yazar}</span>
                             </div>
                           </div>
                        </td>
                        <td className="p-4">{book.kategori?.ad || book.Kategori?.Ad || "Kategori Seçilmedi"}</td>
                        <td className="p-4 font-bold text-[#5c3d2e]">{fiyat} TL</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${stok < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {stok} Adet
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <Button variant="ghost" size="icon" className="text-blue-600" onClick={() => handleEditClick(book)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => setDeleteModalId(id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-lg shadow-xl border-none">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold font-serif">{editingBookId ? "Kitabı Düzenle" : "Yeni Kitap Ekle"}</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}><X className="w-4 h-4" /></Button>
            </div>
            <div className="p-6 space-y-4">
               <div className="space-y-1">
                 <label className="text-xs font-semibold text-gray-500 uppercase">Kitap Başlığı</label>
                 <Input value={formData.baslik} onChange={e => setFormData({...formData, baslik: e.target.value})} />
               </div>
               <div className="space-y-1">
                 <label className="text-xs font-semibold text-gray-500 uppercase">Yazar</label>
                 <Input value={formData.yazar} onChange={e => setFormData({...formData, yazar: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-xs font-semibold text-gray-500 uppercase">Satış Fiyatı (TL)</label>
                     <Input type="number" step="0.01" value={formData.fiyat} onChange={e => setFormData({...formData, fiyat: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-semibold text-gray-500 uppercase">Orijinal Fiyat (TL)</label>
                     <Input type="number" step="0.01" value={formData.orijinalFiyat} onChange={e => setFormData({...formData, orijinalFiyat: e.target.value})} />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Stok Adedi</label>
                    <Input type="number" value={formData.stok} onChange={e => setFormData({...formData, stok: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Kategori</label>
                    <select 
                        aria-label="Kategori Seçimi"
                        className="w-full h-10 p-2 border rounded-md bg-white text-sm"
                        value={formData.kategoriId}
                        onChange={e => setFormData({...formData, kategoriId: e.target.value})}
                    >
                        {categories.map(cat => <option key={cat.id || cat.Id} value={cat.id || cat.Id}>{cat.name || cat.ad || cat.Ad}</option>)}
                    </select>
                 </div>
               </div>
               <div className="space-y-1">
                 <label className="text-xs font-semibold text-gray-500 uppercase">Kapak Resmi URL</label>
                 <Input value={formData.resimUrl} onChange={e => setFormData({...formData, resimUrl: e.target.value})} />
               </div>
               <div className="flex items-center gap-2 py-2 bg-amber-50 p-3 rounded-md border border-amber-100">
                  <input type="checkbox" id="coksatan" checked={formData.cokSatanMi} onChange={e => setFormData({...formData, cokSatanMi: e.target.checked})} className="w-4 h-4 cursor-pointer" />
                  <label htmlFor="coksatan" className="text-sm font-medium flex items-center gap-1 cursor-pointer text-amber-900">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> Çok Satanlar vitrininde göster
                  </label>
               </div>
               <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>İptal</Button>
                  <Button disabled={isSubmitting} className="bg-[#5c3d2e] hover:bg-[#4a3125]" onClick={handleSubmit}>
                    {isSubmitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                  </Button>
               </div>
            </div>
          </Card>
        </div>
      )}

      
      {deleteModalId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Kitabı Siliyorsunuz!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Bu kitabı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem <strong>geri alınamaz</strong>.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setDeleteModalId(null)}>Vazgeç</Button>
              <Button variant="destructive" className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700" onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Evet, Sil"}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}