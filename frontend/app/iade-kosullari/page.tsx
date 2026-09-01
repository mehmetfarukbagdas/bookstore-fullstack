export default function IadeKosullariPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-serif font-bold mb-8 text-[#5C3A21]">İade Koşulları</h1>
      
      <div className="prose prose-stone max-w-none text-stone-700 space-y-6">
        <p className="text-lg">
          Bağdaş Kitap Dünyası'ndan yapmış olduğunuz alışverişlerde, siparişinizi teslim aldığınız tarihten itibaren <strong>14 gün</strong> içerisinde hiçbir gerekçe göstermeksizin iade hakkınızı kullanabilirsiniz.
        </p>

        <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-4">İade Şartları</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>İade edilecek kitabın okunmamış, sayfalarının katlanmamış ve kapağının hasar görmemiş olması gerekmektedir.</li>
          <li>Jelatini açılmış ithal kitaplar ve set halinde satılan eserler ancak tam set olarak iade edilebilir.</li>
          <li>Faturası gönderilmeyen veya faturası kurumsal kesilip iade faturası oluşturulmayan ürünlerin iadesi kabul edilememektedir.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-4">İade Süreci</h2>
        <p>
          İade işlemini başlatmak için <strong>İletişim</strong> sayfamızdan sipariş numaranızla birlikte bize ulaşabilirsiniz. Size verilecek iade kodu ile anlaşmalı kargo firmalarımız üzerinden kitaplarınızı ücretsiz olarak geri gönderebilirsiniz.
        </p>
      </div>
    </div>
  );
}