using BagdasKitapDunyasi.API.Data;
using BagdasKitapDunyasi.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BagdasKitapDunyasi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AyarlarController : ControllerBase
{
    private readonly AppDbContext _context;

    public AyarlarController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAyarlar()
    {
        var ayarlar = await _context.SiteAyarlari.FirstOrDefaultAsync();


        if (ayarlar == null)
        {
            ayarlar = new SiteAyar();
            _context.SiteAyarlari.Add(ayarlar);
            await _context.SaveChangesAsync();
        }

        return Ok(ayarlar);
    }


    [HttpPut]
    public async Task<IActionResult> AyarlariGuncelle([FromBody] SiteAyar yeniAyarlar)
    {
        var ayarlar = await _context.SiteAyarlari.FirstOrDefaultAsync();

        if (ayarlar == null) return NotFound("Ayarlar bulunamadı.");


        ayarlar.MagazaAdi = yeniAyarlar.MagazaAdi;
        ayarlar.Aciklama = yeniAyarlar.Aciklama;
        ayarlar.LogoUrl = yeniAyarlar.LogoUrl;
        ayarlar.Email = yeniAyarlar.Email;
        ayarlar.Telefon = yeniAyarlar.Telefon;
        ayarlar.Adres = yeniAyarlar.Adres;
        ayarlar.KargoUcreti = yeniAyarlar.KargoUcreti;
        ayarlar.UcretsizKargoLimiti = yeniAyarlar.UcretsizKargoLimiti;

        await _context.SaveChangesAsync();
        return Ok(new { mesaj = "Ayarlar başarıyla güncellendi!" });
    }
}