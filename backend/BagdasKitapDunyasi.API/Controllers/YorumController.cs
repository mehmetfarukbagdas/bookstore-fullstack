using BagdasKitapDunyasi.API.Data;
using BagdasKitapDunyasi.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BagdasKitapDunyasi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class YorumController : ControllerBase
{
    private readonly AppDbContext _context;

    public YorumController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("kitap/{kitapId}")]
    public async Task<IActionResult> GetKitapYorumlari(int kitapId)
    {
        var yorumlar = await _context.Yorumlar
            .Where(y => y.KitapId == kitapId)
            .OrderByDescending(y => y.KayitTarihi)
            .Select(y => new
            {
                id = y.Id,
                bookId = y.KitapId,
                user = y.KullaniciAd,
                initials = !string.IsNullOrEmpty(y.KullaniciAd) ? y.KullaniciAd.Substring(0, 1).ToUpper() : "U",
                text = y.Metin,
                rating = y.Puan,
                date = y.KayitTarihi,
                cevap = y.Cevap
            })
            .ToListAsync();

        return Ok(yorumlar);
    }

    [HttpGet("admin/hepsi")]
    public async Task<IActionResult> GetAdminYorumlari()
    {
        var yorumlar = await _context.Yorumlar
            .Include(y => y.Kitap)
            .OrderByDescending(y => y.KayitTarihi)
            .Select(y => new
            {
                id = y.Id,
                bookId = y.KitapId,
                bookTitle = y.Kitap != null ? y.Kitap.Baslik : "Silinmiş Kitap",
                user = y.KullaniciAd,
                initials = !string.IsNullOrEmpty(y.KullaniciAd) ? y.KullaniciAd.Substring(0, 1).ToUpper() : "U",
                text = y.Metin,
                rating = y.Puan,
                date = y.KayitTarihi,
                cevap = y.Cevap
            })
            .ToListAsync();

        return Ok(yorumlar);
    }

    [HttpPost]
    public async Task<IActionResult> YorumEkle([FromBody] YorumEkleDto dto)
    {
        if (dto == null || string.IsNullOrEmpty(dto.Text))
            return BadRequest("Geçersiz yorum verisi.");

        var kitapMevcutmu = await _context.Kitaplar.AnyAsync(k => k.Id == dto.BookId);
        if (!kitapMevcutmu)
            return NotFound("Yorum yapılmak istenen kitap bulunamadı.");

        if (dto.Rating < 1 || dto.Rating > 5)
            return BadRequest("Lütfen 1 ile 5 arasında bir puan seçin.");

        var yeniYorum = new Yorum
        {
            KitapId = dto.BookId,
            KullaniciAd = string.IsNullOrWhiteSpace(dto.User) ? "Anonim Kullanıcı" : dto.User,
            Metin = dto.Text,
            Puan = dto.Rating,
            KayitTarihi = DateTime.UtcNow
        };

        _context.Yorumlar.Add(yeniYorum);
        await _context.SaveChangesAsync();

        var ozet = await _context.Yorumlar
            .Where(y => y.KitapId == dto.BookId)
            .GroupBy(y => y.KitapId)
            .Select(g => new
            {
                puan = g.Average(y => y.Puan),
                yorumSayisi = g.Count()
            })
            .FirstOrDefaultAsync();

        return Ok(new
        {
            id = yeniYorum.Id,
            bookId = yeniYorum.KitapId,
            user = yeniYorum.KullaniciAd,
            initials = !string.IsNullOrEmpty(yeniYorum.KullaniciAd)
                ? yeniYorum.KullaniciAd.Substring(0, 1).ToUpper()
                : "U",
            text = yeniYorum.Metin,
            rating = yeniYorum.Puan,
            date = yeniYorum.KayitTarihi.ToString("yyyy-MM-ddTHH:mm:sszzz"),
            puan = ozet?.puan ?? yeniYorum.Puan,
            yorumSayisi = ozet?.yorumSayisi ?? 1
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> YorumSil(int id)
    {
        var yorum = await _context.Yorumlar.FindAsync(id);
        if (yorum == null) return NotFound();

        _context.Yorumlar.Remove(yorum);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("admin/cevapla")]
    public async Task<IActionResult> YorumCevapla([FromBody] YorumCevapDto dto)
    {
        if (dto == null || string.IsNullOrEmpty(dto.CevapMetni))
            return BadRequest("Geçersiz veya boş cevap metni.");

        var yorum = await _context.Yorumlar.FindAsync(dto.YorumId);
        if (yorum == null)
            return NotFound("Cevaplanacak yorum bulunamadı.");

        yorum.Cevap = dto.CevapMetni;
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Cevap başarıyla kaydedildi." });
    }

    public class YorumEkleDto
    {
        public int BookId { get; set; }
        public string User { get; set; } = "Anonim Kullanıcı";
        public string Text { get; set; } = string.Empty;
        public int Rating { get; set; }
    }

    public class YorumCevapDto
    {
        public int YorumId { get; set; }
        public string CevapMetni { get; set; } = string.Empty;
    }
}
