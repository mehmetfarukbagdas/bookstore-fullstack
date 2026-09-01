'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { authApi, ApiError } from '@/lib/api';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Eye, EyeOff } from 'lucide-react';

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.giris(email, password);

      
      const resData = response as any;

      const user = {
        id: resData.id || resData.Id, 
        ad: resData.ad,               
        name: resData.ad,             
        email: resData.email,
        role: resData.rol as 'kullanici' | 'admin',
      };

      
      document.cookie = `auth_token=${response.token}; path=/; max-age=${7 * 24 * 3600}; SameSite=None; Secure`;
      
      
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", response.token);

      login(user, response.token);

      
      if (resData.rol === 'Admin' || resData.rol === 'admin') {
        router.push('/admin');
      } else {
        router.push('/profil'); 
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError('E-posta veya şifre hatalı.');
        } else {
          setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
      } else {
        setError('Sunucuya bağlanılamadı. Backend çalışıyor mu?');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="font-serif text-2xl">Giriş Yap</CardTitle>
            <CardDescription>
              Hesabınıza giriş yapın ve alışverişe devam edin
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Şifre</Label>
                  <Link
                    href="/sifremi-unuttum"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Şifremi Unuttum
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Şifreniz"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                    </span>
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Hesabınız yok mu? </span>
              <Link
                href={`/kayit${redirectTo !== '/' ? `?redirect=${redirectTo}` : ''}`}
                className="text-primary hover:underline font-medium"
              >
                Üye Ol
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}