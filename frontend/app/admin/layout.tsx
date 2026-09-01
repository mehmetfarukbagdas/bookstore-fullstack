"use client";

import { useState } from "react";
import { useStore } from "@/lib/store-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  LayoutDashboard,
  Package,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Home,
  MessageSquare,
  AlertTriangle 
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/admin/kitaplar", label: "Kitaplar", icon: BookOpen },
  { href: "/admin/siparisler", label: "Siparişler", icon: Package },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: Users },
  { href: "/admin/yorumlar", label: "Kullanıcı Yorumları", icon: MessageSquare },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useStore();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Erisim Engellendi</h1>
          <p className="text-muted-foreground mb-6">
            Bu sayfaya erisim yetkiniz bulunmamaktadir. Lutfen admin olarak giris yapin.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/giris">Giris Yap</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Ana Sayfa</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b">
        <Link href="/admin" className="flex items-center gap-2 font-serif text-xl font-bold">
          <BookOpen className="w-6 h-6 text-primary" />
          Admin Panel
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      <div className="flex">
        
        <aside className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-card border-r transition-transform lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="flex flex-col h-full">
            
            <div className="hidden lg:flex items-center gap-2 p-6 border-b">
              <BookOpen className="w-6 h-6 text-primary" />
              <span className="font-serif text-xl font-bold">Admin Panel</span>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Siteye Dön</span>
              </Link>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-h-screen lg:min-h-0">
          {children}
        </main>
      </div>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Çıkış Yapıyorsunuz!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Yönetim panelinden güvenli bir şekilde çıkış yapmak istediğinize emin misiniz?
            </p>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1 h-12 rounded-xl" 
                onClick={() => setIsLogoutModalOpen(false)}
              >
                Vazgeç
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700" 
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  logout(); 
                }}
              >
                Evet, Çıkış Yap
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}