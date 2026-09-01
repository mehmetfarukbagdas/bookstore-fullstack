"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Truck,
  CreditCard,
  Save,
  Check,
} from "lucide-react";

export default function AdminAyarlar() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    magazaAdi: "",
    aciklama: "",
    logoUrl: "",
    email: "",
    telefon: "",
    adres: "",
    kargoUcreti: 0,
    ucretsizKargoLimiti: 0
  });

  useEffect(() => {
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://bagdas-kitap-api.onrender.com/api";

    fetch(`${apiUrl}/ayarlar`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setFormData({
            magazaAdi: data.magazaAdi || "",
            aciklama: data.aciklama || "",
            logoUrl: data.logoUrl || "",
            email: data.email || "",
            telefon: data.telefon || "",
            adres: data.adres || "",
            kargoUcreti: data.kargoUcreti || 0,
            ucretsizKargoLimiti: data.ucretsizKargoLimiti || 0
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Veriler çekilemedi:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://bagdas-kitap-api.onrender.com/api";
      
      const res = await fetch(`${apiUrl}/ayarlar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          kargoUcreti: Number(formData.kargoUcreti), 
          ucretsizKargoLimiti: Number(formData.ucretsizKargoLimiti)
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert("Kaydetme işlemi başarısız oldu.");
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Sunucuya bağlanılamadı.");
    }
  };

  if (loading) return <div className="p-6">Ayarlar yükleniyor...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Ayarlar</h1>
          <p className="text-muted-foreground">Mağaza ayarlarınızı yönetin</p>
        </div>
        <Button onClick={handleSave}>
          {saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Kaydedildi
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Kaydet
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Mağaza Bilgileri
            </CardTitle>
            <CardDescription>Temel mağaza bilgilerini düzenleyin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="magazaAdi">Mağaza Adı</Label>
              
              <Input id="magazaAdi" aria-label="Mağaza Adı" value={formData.magazaAdi} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aciklama">Açıklama</Label>
              <textarea
                id="aciklama"
                aria-label="Mağaza Açıklaması"
                className="w-full px-3 py-2 border rounded-lg bg-background min-h-[80px] resize-none"
                value={formData.aciklama}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input id="logoUrl" aria-label="Logo URL" placeholder="https://..." value={formData.logoUrl} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              İletişim Bilgileri
            </CardTitle>
            <CardDescription>Müşteri iletişim bilgilerini düzenleyin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" aria-label="E-posta Adresi" type="email" className="pl-10" value={formData.email} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefon">Telefon</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="telefon" aria-label="Telefon Numarası" type="tel" className="pl-10" value={formData.telefon} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adres">Adres</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <textarea
                  id="adres"
                  aria-label="Mağaza Adresi"
                  className="w-full px-3 py-2 pl-10 border rounded-lg bg-background min-h-[80px] resize-none"
                  value={formData.adres}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Kargo Ayarları
            </CardTitle>
            <CardDescription>Kargo ücretlerini ve koşullarını düzenleyin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kargoUcreti">Standart Kargo Ücreti (TL)</Label>
              <Input id="kargoUcreti" aria-label="Kargo Ücreti" type="number" step="0.01" value={formData.kargoUcreti} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ucretsizKargoLimiti">Ücretsiz Kargo Limiti (TL)</Label>
              <Input id="ucretsizKargoLimiti" aria-label="Ücretsiz Kargo Limiti" type="number" value={formData.ucretsizKargoLimiti} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Ödeme Ayarları
            </CardTitle>
            <CardDescription>Ödeme yöntemlerini yapılandırın</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Aktif Ödeme Yöntemleri</Label>
              <div className="space-y-2">
                <label htmlFor="kartOdeme" className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <input id="kartOdeme" aria-label="Kredi veya Banka Kartı ile Ödeme" type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Kredi/Banka Kartı</span>
                </label>
                <label htmlFor="havaleOdeme" className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <input id="havaleOdeme" aria-label="Havale veya EFT ile Ödeme" type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Havale/EFT</span>
                </label>
                <label htmlFor="kapidaOdeme" className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <input id="kapidaOdeme" aria-label="Kapıda Ödeme" type="checkbox" className="w-4 h-4" />
                  <span>Kapıda Ödeme</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}