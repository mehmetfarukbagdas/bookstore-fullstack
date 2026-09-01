using BagdasKitapDunyasi.API.Data;
using BagdasKitapDunyasi.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BagdasKitapDunyasi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }


    [HttpGet("kitaplar")]
    public async Task<IActionResult> GetKitaplar()
    {
        var kitaplar = await _context.Kitaplar
            .Include(k => k.Kategori)
            .ToListAsync();
        return Ok(kitaplar);
    }


    [HttpPost("kitap")]
    public async Task<IActionResult> KitapEkle([FromBody] Kitap yeniKitap)
    {
        if (yeniKitap == null)
            return BadRequest(new { mesaj = "Ge�ersiz kitap verisi." });

        _context.Kitaplar.Add(yeniKitap);
        await _context.SaveChangesAsync();
        return Ok(new { mesaj = "Kitap ba�ar�yla eklendi.", id = yeniKitap.Id });
    }


    [HttpDelete("kitap/{id}")]
    public async Task<IActionResult> KitapSil(int id)
    {
        var kitap = await _context.Kitaplar.FindAsync(id);
        if (kitap == null) return NotFound();

        _context.Kitaplar.Remove(kitap);
        await _context.SaveChangesAsync();
        return Ok(new { mesaj = "Kitap silindi." });
    }


    [HttpGet("kullanicilar")]
    public async Task<IActionResult> GetKullanicilar()
    {
        var kullanicilar = await _context.Kullanicilar
            .Select(k => new
            {
                k.Id,
                k.Ad,
                k.Email,
                k.Rol,
                k.KayitTarihi
            })
            .ToListAsync();
        return Ok(kullanicilar);
    }


    [HttpPut("kullanici/{id}/rol")]
    public async Task<IActionResult> RolDegistir(int id, [FromBody] string rol)
    {
        var kullanici = await _context.Kullanicilar.FindAsync(id);
        if (kullanici == null) return NotFound();

        kullanici.Rol = rol;
        await _context.SaveChangesAsync();
        return Ok(new { mesaj = "Rol g�ncellendi." });
    }


    [HttpGet("istatistikler")]
    public async Task<IActionResult> GetStats()
    {
        var kitapSayisi = await _context.Kitaplar.CountAsync();
        var kategoriSayisi = await _context.Kategoriler.CountAsync();
        var kullaniciSayisi = await _context.Kullanicilar.CountAsync();
        var siparisSayisi = await _context.Siparisler.CountAsync();

        return Ok(new
        {
            kitapSayisi,
            kategoriSayisi,
            kullaniciSayisi,
            siparisSayisi
        });
    }


    [HttpPut("siparis/{id}/durum")]
    public async Task<IActionResult> UpdateOrderStatus(string id, [FromBody] string yeniDurum)
    {
        var siparis = await _context.Siparisler.FirstOrDefaultAsync(s => s.Id == id);

        if (siparis == null)
            return NotFound(new { mesaj = "Sipari� bulunamad�." });

        siparis.Durum = yeniDurum;
        await _context.SaveChangesAsync();

        return Ok(new { mesaj = "Durum g�ncellendi.", yeniDurum });
    }
}