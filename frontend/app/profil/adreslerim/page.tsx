'use client'; 

import React, { useState, useEffect } from 'react'; 
import Link from 'next/link'; 
import {  
  MapPin,  
  ChevronRight,  
  User,  
  Package,  
  Plus,  
  Home,  
  Briefcase,  
  LogOut,  
  X,  
  Trash2,  
  Save, 
  CheckCircle2  
} from 'lucide-react'; 
import { Header } from '@/components/header'; 
import { Footer } from '@/components/footer'; 
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input'; 
import { useRouter } from 'next/navigation'; 

export default function AdreslerimPage() { 
  const router = useRouter(); 
  const [user, setUser] = useState<any>(null); 
  const [showSuccessToast, setShowSuccessToast] = useState(false); 
  const [toastMessage, setToastMessage] = useState(''); 

  const [adresler, setAdresler] = useState<any[]>([]); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [editingAdres, setEditingAdres] = useState<any>(null); 
  const [formData, setFormData] = useState({ baslik: '', tip: 'ev', detay: '', ilce: '', il: '' }); 

  useEffect(() => { 
    const userString = localStorage.getItem('user'); 
    if (!userString) { 
      router.push('/giris'); 
      return; 
    } 
    const loggedInUser = JSON.parse(userString); 
    setUser(loggedInUser); 

    const addressKey = `bagdas_user_addresses_${loggedInUser.id}`;
    const localAdresler = localStorage.getItem(addressKey);

    if (localAdresler) {
      const kayitliAdresler = JSON.parse(localAdresler);

      const eskiVarsayilanAdresler =
        kayitliAdresler.length > 0 &&
        kayitliAdresler.every(
          (adres: any) =>
            (adres.baslik === 'Ev Adresim' &&
              adres.detay === 'Atatürk Mah. Karanfil Sokak No:15 Daire:4') ||
            (adres.baslik === 'İş Adresi' &&
              adres.detay === 'Plazalar Bölgesi B Blok Kat:8 No:44')
        );

      if (eskiVarsayilanAdresler) {
        localStorage.removeItem(addressKey);
        setAdresler([]);
      } else {
        setAdresler(kayitliAdresler);
      }
    } else {
      setAdresler([]);
    } 
  }, [router]); 

  useEffect(() => { 
    if (user && adresler.length >= 0) { 
      localStorage.setItem(`bagdas_user_addresses_${user.id}`, JSON.stringify(adresler)); 
    } 
  }, [adresler, user]); 

  const triggerToast = (message: string) => { 
    setToastMessage(message); 
    setShowSuccessToast(true); 
    setTimeout(() => setShowSuccessToast(false), 3000); 
  }; 

  const handleCikisYap = () => { 
    localStorage.clear(); 
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
    router.push('/giris'); 
  }; 

  const openYeniEkle = () => { 
    setEditingAdres(null); 
    setFormData({ baslik: '', tip: 'ev', detay: '', ilce: '', il: '' }); 
    setIsModalOpen(true); 
  }; 

  const openDuzenle = (adres: any) => { 
    setEditingAdres(adres); 
    setFormData({ baslik: adres.baslik, tip: adres.tip, detay: adres.detay, ilce: adres.ilce, il: adres.il }); 
    setIsModalOpen(true); 
  }; 

  const handleKaydet = (e: React.FormEvent) => { 
    e.preventDefault(); 

    let yeniListe; 
    if (editingAdres) { 
      yeniListe = adresler.map(a => a.id === editingAdres.id ? { ...formData, id: a.id } : a); 
      triggerToast('Adres başarıyla güncellendi!'); 
    } else { 
      yeniListe = [...adresler, { ...formData, id: Date.now() }]; 
      triggerToast('Yeni adres başarıyla eklendi!'); 
    } 

    setAdresler(yeniListe); 
    setIsModalOpen(false); 
  }; 

  const handleSil = () => { 
    if(!editingAdres) return; 
    const yeniListe = adresler.filter(a => a.id !== editingAdres.id); 
    setAdresler(yeniListe); 
    triggerToast('Adres başarıyla silindi.'); 
    setIsModalOpen(false); 
  }; 

  return ( 
    <div className="min-h-screen flex flex-col bg-[#fdfcfb] relative"> 
      <Header /> 

      {showSuccessToast && ( 
        <div className="fixed top-24 right-4 z-[100] animate-in slide-in-from-right duration-300"> 
          <div className="bg-[#4a2e2b] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"> 
            <CheckCircle2 className="w-5 h-5 text-green-400" /> 
            <p className="font-bold text-sm tracking-tight">{toastMessage}</p> 
          </div> 
        </div> 
      )} 

      <main className="flex-1 container mx-auto py-10 px-4 max-w-6xl"> 
        <div className="flex flex-col md:flex-row gap-8 items-start"> 

          <aside className="w-full md:w-80 shrink-0 md:sticky md:top-24"> 
            <div className="border rounded-2xl bg-white shadow-sm overflow-hidden border-gray-100"> 
              <div className="p-6 bg-[#4a2e2b] text-white"> 
                <p className="text-xs opacity-70 uppercase tracking-widest mb-1 font-bold">Hesabım</p> 
                <h2 className="text-xl font-serif font-bold truncate">{user?.ad || user?.name}</h2> 
              </div> 
              <nav className="flex flex-col"> 
                <Link href="/profil"> 
                  <button className="flex items-center justify-between px-6 py-5 w-full text-left hover:bg-gray-50 transition-colors border-l-4 border-transparent text-gray-600 font-bold"> 
                    <div className="flex items-center"><User className="w-5 h-5 mr-3" /> Hesap Bilgileri</div> 
                    <ChevronRight className="w-4 h-4" /> 
                  </button> 
                </Link> 
                <Link href="/profil/siparisler"> 
                  <button className="flex items-center justify-between px-6 py-5 w-full text-left hover:bg-gray-50 transition-colors border-l-4 border-transparent text-gray-600 font-bold"> 
                    <div className="flex items-center"><Package className="w-5 h-5 mr-3" /> Siparişlerim</div> 
                    <ChevronRight className="w-4 h-4" /> 
                  </button> 
                </Link> 
                <Link href="/profil/adreslerim"> 
                  <button className="flex items-center justify-between px-6 py-5 w-full text-left bg-gray-50 border-l-4 border-[#4a2e2b] text-[#4a2e2b] font-bold"> 
                    <div className="flex items-center"><MapPin className="w-5 h-5 mr-3" /> Adreslerim</div> 
                    <ChevronRight className="w-4 h-4" /> 
                  </button> 
                </Link> 
                <button onClick={handleCikisYap} className="flex items-center justify-between px-6 py-5 w-full text-left hover:bg-red-50 transition-colors border-l-4 border-transparent text-red-600 border-t font-bold"> 
                  <div className="flex items-center"><LogOut className="w-5 h-5 mr-3" /> Güvenli Çıkış</div> 
                </button> 
              </nav> 
            </div> 
          </aside> 

          <section className="flex-1 w-full"> 
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8"> 
              <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-100"> 
                <h1 className="text-2xl font-serif font-bold flex items-center text-gray-800"> 
                  <MapPin className="mr-3 text-[#4a2e2b]" /> Adreslerim 
                </h1> 
                <Button  
                   onClick={openYeniEkle}  
                   title="Yeni Adres Ekle" 
                   aria-label="Yeni Adres Ekle" 
                   className="bg-[#4a2e2b] hover:bg-[#3a2422] rounded-xl text-white shadow-md font-bold" 
                > 
                  <Plus className="w-4 h-4 mr-2" /> Yeni Ekle 
                </Button> 
              </div> 

              {adresler.length === 0 ? ( 
                <div className="text-center py-12"> 
                  <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" /> 
                  <p className="text-muted-foreground italic">Henüz kayıtlı bir adresiniz bulunmamaktadır.</p> 
                </div> 
              ) : ( 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
                  {adresler.map((adres) => ( 
                    <div  
                      key={adres.id}  
                      onClick={() => openDuzenle(adres)} 
                      className="border border-dashed border-gray-300 rounded-2xl p-6 relative group hover:border-[#4a2e2b] hover:shadow-md transition-all cursor-pointer bg-gray-50/30" 
                    > 
                      <div className="flex items-center justify-between mb-3"> 
                        <div className="flex items-center gap-3"> 
                          <div className="p-2 bg-white shadow-sm border border-gray-100 rounded-lg group-hover:bg-[#4a2e2b] group-hover:text-white transition-colors"> 
                            {adres.tip === 'ev' ? <Home className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />} 
                          </div> 
                          <p className="font-bold text-gray-800 text-lg">{adres.baslik}</p> 
                        </div> 
                        <Button  
                           variant="ghost"  
                           size="sm"  
                           title={`${adres.baslik} Adresini Düzenle`} 
                           aria-label={`${adres.baslik} Adresini Düzenle`} 
                           className="text-xs text-[#4a2e2b] opacity-0 group-hover:opacity-100 transition-opacity font-bold" 
                        > 
                          Düzenle 
                        </Button> 
                      </div> 
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 italic"> 
                        {adres.detay} 
                      </p> 
                      <p className="text-sm font-black text-gray-400 mt-2 uppercase tracking-tighter"> 
                        {adres.ilce} / {adres.il} 
                      </p> 
                    </div> 
                  ))} 
                </div> 
              )} 
            </div> 
          </section> 
        </div> 
      </main> 

      {isModalOpen && ( 
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"> 
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} /> 
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"> 
            <div className="flex justify-between items-center p-6 border-b bg-gray-50/50"> 
              <h2 className="text-xl font-serif font-bold text-[#4a2e2b]"> 
                {editingAdres ? 'Adresi Düzenle' : 'Yeni Adres Ekle'} 
              </h2> 
              <button  
                 onClick={() => setIsModalOpen(false)}  
                 aria-label="Kapat" 
                 title="Kapat" 
                 className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors" 
              > 
                <X className="w-5 h-5" /> 
              </button> 
            </div> 

            <form onSubmit={handleKaydet} className="p-6 space-y-6"> 
              <div className="grid grid-cols-2 gap-4"> 
                <div className="space-y-2 col-span-2 sm:col-span-1"> 
                  <label htmlFor="baslik" className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Adres Başlığı</label> 
                  <Input  
                    id="baslik" 
                    aria-label="Adres Başlığı" 
                    placeholder="Örn: Evim, İş Yerim"  
                    required  
                    value={formData.baslik}  
                    className="rounded-xl h-12" 
                    onChange={(e) => setFormData({...formData, baslik: e.target.value})}  
                  /> 
                </div> 
                <div className="space-y-2 col-span-2 sm:col-span-1"> 
                  <label htmlFor="tip" className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Adres Tipi</label> 
                  <select  
                    id="tip" 
                    aria-label="Adres Tipi" 
                    className="w-full h-12 px-3 py-2 rounded-xl border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                    value={formData.tip} 
                    onChange={(e) => setFormData({...formData, tip: e.target.value})}  
                  > 
                    <option value="ev">Ev Adresi</option> 
                    <option value="is">İş Adresi</option> 
                  </select> 
                </div> 
              </div> 

              <div className="grid grid-cols-2 gap-4"> 
                <div className="space-y-2"> 
                  <label htmlFor="il" className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">İl</label> 
                  <Input  
                    id="il" 
                    aria-label="Şehir/İl" 
                    placeholder="Örn: İstanbul"  
                    required  
                    value={formData.il}  
                    className="rounded-xl h-12" 
                    onChange={(e) => setFormData({...formData, il: e.target.value})}  
                  /> 
                </div> 
                <div className="space-y-2"> 
                  <label htmlFor="ilce" className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">İlçe</label> 
                  <Input  
                    id="ilce" 
                    aria-label="İlçe" 
                    placeholder="Örn: Kadıköy"  
                    required  
                    value={formData.ilce}  
                    className="rounded-xl h-12" 
                    onChange={(e) => setFormData({...formData, ilce: e.target.value})}  
                  /> 
                </div> 
              </div> 

              <div className="space-y-2"> 
                <label htmlFor="detay" className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Açık Adres</label> 
                <textarea  
                  id="detay"
                  aria-label="Açık Adres Detayı"
                  required
                  placeholder="Mahalle, sokak, bina ve daire numarası giriniz."
                  className="w-full min-h-[100px] p-4 rounded-xl border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  value={formData.detay}
                  onChange={(e) => setFormData({...formData, detay: e.target.value})}
                />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                {editingAdres ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleSil}
                    title="Adresi Sil"
                    aria-label="Adresi Sil"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 px-4 font-bold rounded-xl h-12"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Sil
                  </Button>
                ) : <div></div>}

                <Button
                   type="submit"
                   title="Adresi Kaydet"
                   aria-label="Adresi Kaydet"
                   className="bg-[#4a2e2b] hover:bg-[#3a2422] text-white px-10 h-12 rounded-xl font-bold shadow-lg shadow-[#4a2e2b]/20 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Kaydet
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}