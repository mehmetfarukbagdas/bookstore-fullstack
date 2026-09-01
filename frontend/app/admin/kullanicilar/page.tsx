"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Search,
  Eye,
  X,
  Users,
  Shield,
  ShieldCheck,
  Mail,
  Calendar,
  Loader2
} from "lucide-react";


interface RealUser {
  id: number;
  ad: string;
  email: string;
  rol: string;
  kayitTarihi: string;
}

export default function AdminKullanicilar() {
  const [users, setUsers] = useState<RealUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<RealUser | null>(null);

  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://bagdas-kitap-api.onrender.com/api";
      
      const response = await fetch(`${apiUrl}/Admin/Kullanicilar`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        
        const formattedUsers: RealUser[] = data.map((user: any) => ({
          id: user.id || user.Id,
          ad: user.ad || user.Ad || user.name || "Bilinmiyor",
          email: user.email || user.Email || "",
          rol: user.rol || user.Rol || user.role || "user",
          kayitTarihi: user.kayitTarihi || user.KayitTarihi || new Date().toISOString()
        }));

        setUsers(formattedUsers);
      } else {
        console.error("Kullanıcıları getirirken API hatası döndü.");
      }
    } catch (error) {
      console.error("Fetch işlemi sırasında bir hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId: number, currentRole: string) => {
    
    const newRole = currentRole === "admin" ? "user" : "admin";
    const token = localStorage.getItem("token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://bagdas-kitap-api.onrender.com/api";
    
    try {
      const response = await fetch(`${apiUrl}/Admin/kullanici/${userId}/rol`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRole),
      });

      if (response.ok) {
        
        setUsers(users.map(u => u.id === userId ? { ...u, rol: newRole } : u));
      }
    } catch (error) {
      console.error("Kullanıcı yetkisi değiştirilirken hata oluştu:", error);
    }
  };

  
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.ad.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.rol.toLowerCase() === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Kullanıcı Yönetimi</h1>
          <p className="text-muted-foreground">Sistemdeki {users.length} gerçek üyeyi listeliyorsunuz.</p>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-xs text-muted-foreground">Toplam Kullanıcı</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Shield className="w-8 h-8 text-gray-500" />
            <div>
              <p className="text-2xl font-bold">{users.filter((u) => u.rol !== "admin").length}</p>
              <p className="text-xs text-muted-foreground">Standart Kullanıcı</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{users.filter((u) => u.rol === "admin").length}</p>
              <p className="text-xs text-muted-foreground">Yönetici (Admin)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Arama ve Filtreleme */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Ad veya e-posta ile kullanıcı ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
           
                <select
            aria-label="Rol Filtresi" 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary/50"
            >
            <option value="all">Tüm Roller</option>
            <option value="user">Kullanıcı</option>
            <option value="admin">Admin</option>
          </select>
          </div>
        </CardContent>
      </Card>

      {/* Kullanıcılar Tablosu */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex flex-col items-center">
              <Loader2 className="animate-spin mb-4 w-10 h-10 text-primary" /> 
              <p className="text-muted-foreground font-medium">Veritabanından kullanıcılar çekiliyor...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Kullanıcı</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">E-posta</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">Kayıt Tarihi</th>
                    <th className="text-left p-4 font-medium">Yetki</th>
                    <th className="text-left p-4 font-medium">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">Arama kriterlerine uygun kullanıcı bulunamadı.</td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-primary font-semibold text-lg">
                                {user.ad ? user.ad.charAt(0).toUpperCase() : "U"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm sm:text-base">{user.ad}</p>
                              <p className="text-xs text-muted-foreground md:hidden">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell text-sm">{user.email}</td>
                        <td className="p-4 hidden lg:table-cell text-sm">
                          {new Date(user.kayitTarihi).toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric' })}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase ${
                            user.rol === "admin"
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}>
                            {user.rol === "admin" ? "Admin" : "Üye"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedUser(user)} title="Detayları Gör">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </Button>
                            <Button 
                              variant={user.rol === "admin" ? "destructive" : "outline"} 
                              size="sm" 
                              onClick={() => toggleRole(user.id, user.rol)}
                              className="text-xs h-8"
                            >
                              {user.rol === "admin" ? "Yetkiyi Al" : "Admin Yap"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kullanıcı Detay Modalı (Açılır Pencere) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <Card className="relative z-10 w-full max-w-md mx-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
              <CardTitle className="text-lg font-serif">Kullanıcı Profili</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setSelectedUser(null)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shadow-inner">
                  <span className="text-primary text-4xl font-semibold">
                    {selectedUser.ad ? selectedUser.ad.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedUser.ad}</h3>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedUser.rol === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {selectedUser.rol === "admin" ? "Sistem Yöneticisi" : "Kayıtlı Üye"}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl space-y-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">E-Posta Adresi</span>
                    <span className="text-sm font-medium text-gray-700">{selectedUser.email}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Üyelik Tarihi</span>
                    <span className="text-sm font-medium text-gray-700">
                      {new Date(selectedUser.kayitTarihi).toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}