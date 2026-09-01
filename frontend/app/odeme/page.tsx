"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, CreditCard, Truck, CheckCircle, ChevronRight, Lock, AlertCircle } from "lucide-react";

export default function OdemePage() {
  const { cart, user, clearCart } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  
  
  const [error, setError] = useState<string | null>(null);

  const [ayarlar, setAyarlar] = useState({
    kargoUcreti: 50,
    ucretsizKargoLimiti: 150
  });

  useEffect(() => {
    fetch("https://bagdas-kitap-api.onrender.com/api/ayarlar")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setAyarlar({
            kargoUcreti: data.kargoUcreti || data.standartKargoUcreti || 50,
            ucretsizKargoLimiti: data.ucretsizKargoLimiti || 150
          });
        }
      })
      .catch((err) => console.error("Kargo ayarları çekilemedi:", err));
  }, []);

  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.name?.split(" ")[1] || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handleExpiryChange = (value: string) => {
    // Sadece rakamları al ve MM/YY formatına dönüştür.
    const digits = value.replace(/\\D/g, "").slice(0, 4);

    if (digits.length <= 2) {
      setExpiry(digits);
    } else {
      setExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const shipping = subtotal >= ayarlar.ucretsizKargoLimiti ? 0 : ayarlar.kargoUcreti;
  const total = subtotal + shipping;

 
  const validateStep = () => {
    setError(null);

    if (step === 1) {
      if (!firstName.trim() || !lastName.trim() || !phone.trim() || !address.trim() || !city.trim() || !district.trim()) {
        setError("Lütfen teslimat bilgilerindeki tüm zorunlu alanları doldurun.");
        return false;
      }
    } else if (step === 2) {
      const expiryMatch = /^(0[1-9]|1[0-2])\\/\\d{2}$/.test(expiry);

      if (!cardName.trim() || cardNumber.length < 16 || !expiryMatch || cvv.length < 3) {
        setError("Lütfen geçerli ödeme bilgilerini girin.");
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
      window.scrollTo(0, 0); 
    }
  };

  const handleCompleteOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newOrderNo = `KD${Date.now().toString().slice(-6)}`;
      const newOrder = {
        id: newOrderNo,
        userId: user?.id || "guest",
        customerName: `${firstName} ${lastName}`.trim() || user?.name || "Misafir",
        email: user?.email || "",
        phone,
        items: cart.map((item) => ({
          bookId: item.book.id,
          title: item.book.title,
          author: item.book.author,
          coverImage: item.book.coverImage || item.book.image,
          price: item.book.price,
          quantity: item.quantity,
        })),
        totalAmount: total,
        address: `${address}, ${district} / ${city} ${zipCode}`,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      const allOrders = JSON.parse(localStorage.getItem("bagdas_orders") || "[]");
      localStorage.setItem("bagdas_orders", JSON.stringify([newOrder, ...allOrders]));
      setOrderNumber(newOrderNo);
      clearCart();
      setOrderComplete(true);
      setIsProcessing(false);
    }, 2000);
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16 text-center">
          <Card className="w-full max-w-md mx-4 p-8">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">Sepetiniz Boş</h2>
            <p className="text-muted-foreground mb-6">Ödeme yapmak için sepetinize ürün ekleyin.</p>
            <Button asChild className="w-full"><Link href="/">Alışverişe Başla</Link></Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <Card className="w-full max-w-md mx-4 text-center p-8 shadow-xl border-green-50">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Siparişiniz Alındı!</h2>
            <p className="text-muted-foreground mb-6">Sipariş numaranız: <span className="font-mono font-bold text-primary">#{orderNumber}</span></p>
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full"><Link href="/">Alışverişe Devam Et</Link></Button>
              <Button variant="outline" asChild className="w-full"><Link href="/profil/siparisler">Siparişlerim</Link></Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          
          {/* Uyarı Mesajı */}
          {error && (
            <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-center mb-10">
            {step === 1 && <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full font-bold shadow-lg"><Truck className="w-4 h-4" /> 1. Adres</div>}
            {step === 2 && <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full font-bold shadow-lg"><CreditCard className="w-4 h-4" /> 2. Ödeme</div>}
            {step === 3 && <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full font-bold shadow-lg"><CheckCircle className="w-4 h-4" /> 3. Onay</div>}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 1 && (
                <Card className="border-0 shadow-sm">
                  <CardHeader><CardTitle className="font-serif text-2xl">Teslimat Adresi</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ad</Label>
                        <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Mehmet" />
                      </div>
                      <div className="space-y-2">
                        <Label>Soyad</Label>
                        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Faruk" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Telefon</Label>
                      <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05XX XXX XX XX" />
                    </div>
                    <div className="space-y-2">
                      <Label>Açık Adres</Label>
                      <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Mahalle, sokak, bina no, daire no" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="İl" />
                      <Input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="İlçe" />
                      <Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="Posta Kodu" />
                    </div>
                    <Button onClick={handleNextStep} className="w-full h-12 text-lg mt-4">Devam Et <ChevronRight className="w-5 h-5 ml-2" /></Button>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card className="border-0 shadow-sm">
                  <CardHeader><CardTitle className="font-serif text-2xl">Ödeme Bilgileri</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Kart Üzerindeki İsim</Label>
                      <Input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="AD SOYAD" />
                    </div>
                    <div className="space-y-2">
                      <Label>Kart Numarası</Label>
                      <Input maxLength={16} value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Son Kullanma Tarihi</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          maxLength={5}
                          value={expiry}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          placeholder="AA/YY"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input type="password" maxLength={3} value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="***" />
                      </div>
                    </div>
                    <div className="pt-6 flex gap-4">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12">Geri</Button>
                      <Button onClick={handleNextStep} className="flex-1 h-12 text-lg">Devam Et</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card className="border-0 shadow-sm">
                  <CardHeader><CardTitle className="font-serif text-2xl">Siparişi Onayla</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl space-y-3">
                      <div className="flex justify-between border-b pb-2"><span>Alıcı:</span><b>{firstName} {lastName}</b></div>
                      <div className="flex justify-between border-b pb-2"><span>Adres:</span><b className="text-right">{address}, {district}/{city}</b></div>
                      <div className="flex justify-between"><span>Ödeme:</span><b>Kredi Kartı</b></div>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12">Geri</Button>
                      <Button onClick={handleCompleteOrder} disabled={isProcessing} className="flex-[2] h-12 text-lg">
                        {isProcessing ? "İşleniyor..." : "Siparişi Tamamla"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-0 shadow-sm">
                <CardHeader><CardTitle className="text-lg font-serif">Sipariş Özeti</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {cart.map((item) => (
                      <div key={item.book.id} className="flex justify-between text-sm">
                        <span className="truncate flex-1 mr-2">{item.book.title} x{item.quantity}</span>
                        <span className="font-medium">{(item.book.price * item.quantity).toFixed(2)} TL</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground"><span>Ara Toplam</span><span>{subtotal.toFixed(2)} TL</span></div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Kargo</span>
                      <span className={shipping === 0 ? "text-green-600 font-bold" : ""}>
                        {shipping === 0 ? "Ücretsiz" : `${shipping.toFixed(2)} TL`}
                      </span>
                    </div>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold text-xl text-[#4a2e2b]">
                    <span>Toplam</span>
                    <span>{total.toFixed(2)} TL</span>
                  </div>
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