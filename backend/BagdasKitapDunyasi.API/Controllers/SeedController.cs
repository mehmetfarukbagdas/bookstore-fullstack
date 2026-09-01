using BagdasKitapDunyasi.API.Data;
using BagdasKitapDunyasi.API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace BagdasKitapDunyasi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;

    public SeedController(AppDbContext context, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
    }

    [HttpPost("google-books-cek/{kategoriAd}")]
    public async Task<IActionResult> FetchFromGoogleBooks(string kategoriAd, int kategoriId)
    {
        var requestUrl = $"https://www.googleapis.com/books/v1/volumes?q={kategoriAd}&maxResults=20";
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("User-Agent", "BagdasKitapDunyasi-App");

        var response = await client.GetAsync(requestUrl);

        if (!response.IsSuccessStatusCode)
        {
            var hataDetayi = await response.Content.ReadAsStringAsync();
            return BadRequest($"Google Books API Error ({response.StatusCode}): {hataDetayi}");
        }

        var content = await response.Content.ReadAsStringAsync();
        using var jsonDoc = JsonDocument.Parse(content);

        if (!jsonDoc.RootElement.TryGetProperty("items", out var items))
        {
            return NotFound($"No books found for category: '{kategoriAd}'");
        }

        var eklenecekKitaplar = new List<Kitap>();
        var random = new Random();

        foreach (var item in items.EnumerateArray())
        {
            var volumeInfo = item.GetProperty("volumeInfo");

            string baslik = volumeInfo.TryGetProperty("title", out var t) ? t.GetString() : "Bilinmeyen Başlık";
            string yazar = volumeInfo.TryGetProperty("authors", out var a) && a.GetArrayLength() > 0 ? a[0].GetString() : "Kolektif";
            string resimUrl = volumeInfo.TryGetProperty("imageLinks", out var img) && img.TryGetProperty("thumbnail", out var thumb) ? thumb.GetString() : "/placeholder-book.png";
            string aciklama = volumeInfo.TryGetProperty("description", out var desc) ? desc.GetString() : "Açıklama bulunmuyor.";
            int sayfaSayisi = volumeInfo.TryGetProperty("pageCount", out var pc) ? pc.GetInt32() : 200;
            string yayinevi = volumeInfo.TryGetProperty("publisher", out var pub) ? pub.GetString() : "Bağdaş Yayınları";

            var rastgeleFiyat = random.Next(100, 400);
            bool isCokSatan = random.Next(0, 3) == 1;
            bool isKampanya = random.Next(0, 3) == 1;
            bool isDunyaKlasigi = kategoriAd.ToLower().Contains("klasik") || random.Next(0, 5) == 1;

            var yeniKitap = new Kitap
            {
                Baslik = baslik,
                Yazar = yazar,
                Aciklama = aciklama,
                ResimUrl = resimUrl,
                SayfaSayisi = sayfaSayisi,
                Yayinevi = yayinevi,
                Fiyat = rastgeleFiyat,
                IndirimliFiyat = rastgeleFiyat - (rastgeleFiyat * 0.2m),
                Stok = random.Next(5, 50),
                KategoriId = kategoriId,
                CokSatan = isCokSatan,
                DunyaKlasigi = isDunyaKlasigi,
                Kampanya = isKampanya
            };

            eklenecekKitaplar.Add(yeniKitap);
        }

        await _context.Kitaplar.AddRangeAsync(eklenecekKitaplar);
        await _context.SaveChangesAsync();

        return Ok(new { mesaj = $"{eklenecekKitaplar.Count} adet kitap başarıyla senkronize edildi." });
    }
}