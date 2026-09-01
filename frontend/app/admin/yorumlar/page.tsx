"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  MessageSquare,
  Star,
  Trash2,
  BookOpen,
  Calendar,
  ExternalLink,
  Loader2,
  CornerDownRight,
  Reply,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function AdminYorumlarPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  
  const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  
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

  const fetchComments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Yorum/admin/hepsi`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setComments(Array.isArray(data) ? data : (data.data || []));
      }
    } catch (error) {
      console.error("Yorumlar veritabanından çekilemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const confirmDelete = async () => {
    if (!deleteModalId) return;
    setIsDeleting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Yorum/${deleteModalId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setComments(comments.filter((c) => c.id !== deleteModalId));
        
      } else {
        triggerToast("Yorum silinirken bir sunucu hatası oluştu.", false);
      }
    } catch (error) {
      triggerToast("Bağlantı hatası meydana geldi.", false);
    } finally {
      setIsDeleting(false);
      setDeleteModalId(null);
    }
  };

  const handleSendReply = async (yorumId: number) => {
    if (!replyText.trim()) return;

    try {
      setSubmittingReply(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Yorum/admin/cevapla`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          yorumId: yorumId,
          cevapMetni: replyText
        })
      });

      if (response.ok) {
        setComments(comments.map(c => c.id === yorumId ? { ...c, cevap: replyText } : c));
        setActiveReplyId(null);
        setReplyText("");
        triggerToast("Yanıtınız başarıyla kaydedildi ve yayınlandı!");
      } else {
        triggerToast("Yanıt kaydedilirken sunucu hatası oluştu.", false);
      }
    } catch (error) {
      triggerToast("Sunucu bağlantısı kurulamadı.", false);
    } finally {
      setSubmittingReply(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const filteredComments = comments.filter((comment) => {
    const textMatch = comment.text?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const userMatch = comment.user?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const bookMatch = comment.bookTitle?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    
    return (textMatch || userMatch || bookMatch) && (ratingFilter === "all" || comment.rating?.toString() === ratingFilter);
  });

  const totalComments = comments.length;
  const fiveStarComments = comments.filter(c => c.rating === 5).length;
  const averageRating = totalComments > 0 
    ? (comments.reduce((acc, curr) => acc + (curr.rating || 5), 0) / totalComments).toFixed(1)
    : "0";

  return (
    <div className="p-6 space-y-6 relative min-h-screen">
      
      
      {showSuccessToast && (
        <div className="fixed top-24 right-4 z-[100] animate-in slide-in-from-right duration-300">
          <div className="bg-[#4a2e2b] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            <CheckCircle2 className={`w-5 h-5 ${toastIconColor}`} />
            <p className="font-bold text-sm tracking-tight">{toastMessage}</p>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Kullanıcı Yorumları Yönetimi</h1>
        <p className="text-muted-foreground">Sistemdeki tüm yorumları inceleyebilir, silebilir veya resmi yanıtlar dönebilirsiniz.</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{totalComments}</p>
              <p className="text-xs text-muted-foreground">Toplam Yorum</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-500 fill-current" />
            <div>
              <p className="text-2xl font-bold">{fiveStarComments}</p>
              <p className="text-xs text-muted-foreground">5 Yıldızlılar</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{averageRating} / 5</p>
              <p className="text-xs text-muted-foreground">Ortalama Puan</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtre Çubuğu */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Yorum, kullanıcı veya kitap ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              aria-label="Puan Filtresi" 
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">Tüm Puanlar</option>
              <option value="5">5 Yıldız</option>
              <option value="4">4 Yıldız</option>
              <option value="3">3 Yıldız</option>
              <option value="2">2 Yıldız</option>
              <option value="1">1 Yıldız</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tablo */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <p className="text-sm">Yorumlar senkronize ediliyor...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Kullanıcı</th>
                    <th className="text-left p-4 font-medium">İlgili Kitap</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Yorum İçeriği</th>
                    <th className="text-left p-4 font-medium">Değerlendirme</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">Tarih</th>
                    <th className="text-left p-4 font-medium">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredComments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">Yorum bulunamadı.</td>
                    </tr>
                  ) : (
                    filteredComments.map((comment) => (
                      <React.Fragment key={comment.id}>
                        <tr className="hover:bg-muted/10 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="text-primary font-semibold text-lg">
                                  {comment.initials || comment.user?.charAt(0).toUpperCase() || "U"}
                                </span>
                              </div>
                              <span className="font-medium text-sm">{comment.user}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Link href={`/kitap/${comment.bookId}`} target="_blank" className="font-medium text-sm hover:underline hover:text-primary flex items-center gap-1">
                              {comment.bookTitle} <ExternalLink className="w-3 h-3" />
                            </Link>
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            <p className="text-sm text-muted-foreground max-w-xs whitespace-pre-wrap">
                              "{comment.text}"
                            </p>
                          </td>
                          <td className="p-4">
                            <div className="flex text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < (comment.rating || 5) ? 'fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </td>
                          <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3" />
                              {formatDate(comment.date)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
                                  setReplyText(comment.cevap || "");
                                }}
                                className="h-8 text-xs border-primary/30 text-primary hover:bg-primary/5"
                              >
                                <Reply className="w-3.5 h-3.5 mr-1" />
                                {comment.cevap ? "Düzenle" : "Cevapla"}
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => setDeleteModalId(comment.id)}
                                className="h-8 text-xs"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>

                        {/* Cevap Listeleme */}
                        {comment.cevap && activeReplyId !== comment.id && (
                          <tr className="bg-muted/20">
                            <td colSpan={6} className="p-3 pl-12">
                              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CornerDownRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <div className="bg-background p-2.5 rounded-lg border border-border max-w-2xl w-full">
                                  <p className="text-xs font-semibold text-primary mb-1">Cevabınız:</p>
                                  <p className="text-foreground italic">"{comment.cevap}"</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* Cevap Yazma Paneli */}
                        {activeReplyId === comment.id && (
                          <tr className="bg-primary/5">
                            <td colSpan={6} className="p-4 pl-12">
                              <div className="space-y-3 max-w-2xl">
                                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                                  <Reply className="w-4 h-4" />
                                  <span>{comment.user} kullanıcısının yorumunu yanıtlayın</span>
                                </div>
                                <Textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Mağaza yetkilisi olarak resmi yanıtınızı girin..."
                                  className="bg-background resize-none"
                                  rows={3}
                                />
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => setActiveReplyId(null)}>Vazgeç</Button>
                                  <Button 
                                    size="sm" 
                                    disabled={!replyText.trim() || submittingReply}
                                    onClick={() => handleSendReply(comment.id)}
                                  >
                                    {submittingReply && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />}
                                    Yanıtı Kaydet
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SİLME ONAY MODALI */}
      {deleteModalId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Yorumu Siliyorsunuz!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Bu kullanıcı yorumunu kalıcı olarak silmek istediğinize emin misiniz? Bu işlem <strong>geri alınamaz</strong>.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setDeleteModalId(null)}>Vazgeç</Button>
              <Button 
                variant="destructive" 
                className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700" 
                onClick={confirmDelete} 
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Evet, Sil"}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}