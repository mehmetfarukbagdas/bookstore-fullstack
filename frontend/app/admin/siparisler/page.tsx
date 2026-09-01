"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, X, Package, Truck, CheckCircle, Clock, Trash2, AlertTriangle, Loader2 } from "lucide-react";


export default function AdminSiparisler() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  
  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem("bagdas_orders") || "[]");
    setOrders(allOrders);
  }, []);

  
  const confirmDelete = async () => {
    if (!deleteModalId) return;
    setIsDeleting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://bagdas-kitap-api.onrender.com/api/Siparis/${deleteModalId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        
        const updatedOrders = orders.filter((o) => o.id !== deleteModalId);
        setOrders(updatedOrders);
        localStorage.setItem("bagdas_orders", JSON.stringify(updatedOrders));
      } else {
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      }
    } catch (error) {
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsDeleting(false);
      setDeleteModalId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    localStorage.setItem("bagdas_orders", JSON.stringify(updated));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: "bg-stone-100 text-stone-700",
      processing: "bg-amber-100 text-amber-700",
      shipped: "bg-blue-100 text-blue-700",
      delivered: "bg-green-100 text-green-700",
    };
    const labels: any = {
      pending: "Beklemede",
      processing: "Hazırlanıyor",
      shipped: "Kargoda",
      delivered: "Teslim Edildi",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-[#fdfcfb] min-h-screen relative">
      
      
      {showErrorToast && (
        <div className="fixed top-24 right-4 z-[100] animate-in slide-in-from-right duration-300">
          <div className="bg-[#4a2e2b] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="font-bold text-sm tracking-tight">Sipariş silinirken bir hata oluştu.</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Sipariş Yönetimi</h1>
          <p className="text-muted-foreground text-sm">Tüm kitap siparişleri ({filteredOrders.length})</p>
        </div>
      </div>

      {/*İstatistikler*/}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Beklemede", status: "pending", icon: Clock, color: "text-stone-500" },
          { label: "Hazırlanıyor", status: "processing", icon: Package, color: "text-amber-500" },
          { label: "Kargoda", status: "shipped", icon: Truck, color: "text-blue-500" },
          { label: "Teslim Edildi", status: "delivered", icon: CheckCircle, color: "text-green-500" },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center gap-4">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <div>
                <p className="text-xl font-bold">{orders.filter(o => o.status === stat.status).length}</p>
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tablo */}
      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="p-5 text-[10px] uppercase font-black text-gray-400 tracking-widest">No</th>
                <th className="p-5 text-[10px] uppercase font-black text-gray-400 tracking-widest">Müşteri</th>
                <th className="p-5 text-[10px] uppercase font-black text-gray-400 tracking-widest">Tutar</th>
                <th className="p-5 text-[10px] uppercase font-black text-gray-400 tracking-widest">Durum</th>
                <th className="p-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-5 font-mono text-sm font-bold text-[#4a2e2b]">#{order.id}</td>
                  <td className="p-5 font-bold text-gray-700 text-sm">{order.customerName}</td>
                  <td className="p-5 font-black text-gray-800">{order.totalAmount.toFixed(2)} TL</td>
                  <td className="p-5">{getStatusBadge(order.status)}</td>
                  
                  
                  <td className="p-5 text-right flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)} className="rounded-full hover:bg-[#4a2e2b]/5">
                      <Eye className="w-4 h-4 text-[#4a2e2b]" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteModalId(order.id)} className="rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Detay Modal */} 
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#4a2e2b]/20 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <Card className="relative z-10 w-full max-w-2xl bg-white rounded-3xl border-none shadow-2xl overflow-y-auto max-h-[90vh]">
            <CardHeader className="border-b flex flex-row items-center justify-between p-6">
              <CardTitle className="font-serif text-[#4a2e2b]">Detay: #{selectedOrder.id}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)} className="rounded-full hover:bg-gray-100"><X className="w-4 h-4" /></Button>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl">
                <div><p className="text-[10px] font-black text-gray-400 uppercase">Müşteri</p><p className="font-bold">{selectedOrder.customerName}</p></div>
                <div><p className="text-[10px] font-black text-gray-400 uppercase">Adres</p><p className="text-xs truncate">{selectedOrder.address}</p></div>
              </div>
              
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase">Durum Güncelle</p>
                <div className="flex flex-wrap gap-2">
                  {["pending", "processing", "shipped", "delivered"].map((s) => (
                    <Button 
                      key={s} 
                      size="sm" 
                      variant={selectedOrder.status === s ? "default" : "outline"}
                      onClick={() => updateOrderStatus(selectedOrder.id, s)}
                      className={`rounded-xl text-[10px] font-bold ${selectedOrder.status === s ? 'bg-[#4a2e2b]' : ''}`}
                    >
                      {s === "pending" ? "BEKLEMEDE" : s === "processing" ? "HAZIRLANIYOR" : s === "shipped" ? "KARGODA" : "TESLİM EDİLDİ"}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                {selectedOrder.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg">
                    <span>{item.title} x{item.quantity}</span>
                    <span className="font-bold">{(item.price * item.quantity).toFixed(2)} TL</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      
      {deleteModalId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Siparişi Siliyorsunuz!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Bu siparişi kalıcı olarak silmek istediğinize emin misiniz? Bu işlem <strong>geri alınamaz</strong>.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setDeleteModalId(null)}>Vazgeç</Button>
              <Button variant="destructive" className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700" onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Evet, Sil"}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}