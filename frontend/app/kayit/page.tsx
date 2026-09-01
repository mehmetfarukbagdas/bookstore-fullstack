'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
import { BookOpen, Eye, EyeOff, Check } from 'lucide-react';

function KayitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get('redirect') || '/giris';

  const passwordRequirements = [
    { text: 'En az 8 karakter', met: password.length >= 8 },
    { text: 'En az bir büyük harf', met: /[A-Z]/.test(password) },
    { text: 'En az bir rakam', met: /[0-9]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    if (!acceptTerms) {
      setError('Kullanım koşullarını kabul etmelisiniz');
      return;
    }
    if (passwordRequirements.some((r) => !r.met)) {
      setError('Şifre gereksinimlerini karşılayın');
      return;
    }

    setLoading(true);
    try {
      await authApi.kayit(name, email, password);
      
      router.push(`/giris?redirect=${redirectTo}&registered=1`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400) {
          setError(err.message || 'Bu e-posta zaten kayıtlı.');
        } else {
          setError('Kayıt sırasında bir hata oluştu.');
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
            <CardTitle className="font-serif text-2xl">Üye Ol</CardTitle>
            <CardDescription>
              Hesap oluşturun ve avantajlı alışverişlere başlayın
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
                <Label htmlFor="name">Ad Soyad</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Adınız Soyadınız"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>

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
                <Label htmlFor="password">Şifre</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Şifreniz"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password && (
                  <ul className="mt-2 space-y-1">
                    {passwordRequirements.map((req, i) => (
                      <li
                        key={i}
                        className={`text-xs flex items-center gap-1.5 ${
                          req.met ? 'text-green-600' : 'text-muted-foreground'
                        }`}
                      >
                        <Check className={`h-3 w-3 ${req.met ? 'opacity-100' : 'opacity-30'}`} />
                        {req.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Şifrenizi tekrar girin"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  aria-label="Kullanım Koşulları ve Gizlilik Politikasını kabul ediyorum"
                  title="Kullanım Koşulları ve Gizlilik Politikasını kabul ediyorum"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 rounded border-input"
                />
                <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                  <Link href="/kullanim-kosullari" className="text-primary hover:underline">
                    Kullanım Koşulları
                  </Link>
                  {' ve '}
                  <Link href="/gizlilik-politikasi" className="text-primary hover:underline">
                    Gizlilik Politikası
                  </Link>
                  &apos;nı okudum ve kabul ediyorum.
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Kayıt Yapılıyor...' : 'Üye Ol'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Zaten hesabınız var mı? </span>
              <Link href="/giris" className="text-primary hover:underline font-medium">
                Giriş Yap
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
      <KayitPage />
    </Suspense>
  );
}