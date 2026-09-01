export default function SSSPage() {
  const faqs = [
    {
      question: "Siparişim kaç gün içinde kargoya verilir?",
      answer: "Stoklarımızda bulunan kitaplar için siparişleriniz aynı gün veya en geç ertesi iş günü kargoya teslim edilmektedir."
    },
    {
      question: "Hangi kargo firmaları ile çalışıyorsunuz?",
      answer: "Bağdaş Kitap Dünyası olarak siparişlerinizi Yurtiçi Kargo ve Aras Kargo güvencesiyle sizlere ulaştırıyoruz."
    },
    {
      question: "Aradığım kitabı sitenizde bulamadım, getirtebilir misiniz?",
      answer: "Elbette! İletişim sayfası üzerinden yazar ve kitap adını bize iletirseniz, tedarikçi ağımızdan kontrol edip size dönüş yapabiliriz."
    },
    {
      question: "Kapıda ödeme seçeneğiniz var mı?",
      answer: "Şu an için yalnızca kredi kartı, banka kartı ve havale/EFT ile ödeme kabul etmekteyiz."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-serif font-bold mb-8 text-[#5C3A21]">Sıkça Sorulan Sorular</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-stone-50 p-6 rounded-lg shadow-sm border border-stone-200">
            <h3 className="text-xl font-semibold mb-2 text-stone-800">{faq.question}</h3>
            <p className="text-stone-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}