using BagdasKitapDunyasi.API.Data;
using BagdasKitapDunyasi.API.DTOs;
using BagdasKitapDunyasi.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BagdasKitapDunyasi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("kayit")]
    public async Task<IActionResult> Kayit(RegisterDto dto)
    {
        if (await _context.Kullanicilar.AnyAsync(k => k.Email == dto.Email))
            return BadRequest("Bu e-posta adresi zaten kayıtlı.");

        var kullanici = new Kullanici
        {
            Ad = dto.Ad,
            Email = dto.Email,
            SifreHash = BCrypt.Net.BCrypt.HashPassword(dto.Sifre)
        };

        _context.Kullanicilar.Add(kullanici);
        await _context.SaveChangesAsync();

        return Ok(new { mesaj = "Kayıt başarıyla tamamlandı." });
    }

    [HttpPost("giris")]
    public async Task<IActionResult> Giris(LoginDto dto)
    {
        var kullanici = await _context.Kullanicilar
            .FirstOrDefaultAsync(k => k.Email == dto.Email);

        if (kullanici == null || !BCrypt.Net.BCrypt.Verify(dto.Sifre, kullanici.SifreHash))
            return Unauthorized("E-posta adresi veya şifre hatalı.");

        var token = TokenOlustur(kullanici);

        return Ok(new AuthResponseDto
        {
            Token = token,
            Id = kullanici.Id,
            Ad = kullanici.Ad,
            Email = kullanici.Email,
            Rol = kullanici.Rol
        });
    }

    [HttpPut("hesap-guncelle/{id}")]
    public async Task<IActionResult> HesapGuncelle(int id, [FromBody] HesapGuncelleDto dto)
    {
        var kullanici = await _context.Kullanicilar.FindAsync(id);
        if (kullanici == null)
            return NotFound(new { mesaj = "Kullanıcı bulunamadı." });

        if (kullanici.Email != dto.Email && await _context.Kullanicilar.AnyAsync(k => k.Email == dto.Email))
            return BadRequest(new { mesaj = "Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor." });

        kullanici.Ad = dto.Ad;
        kullanici.Email = dto.Email;

        if (!string.IsNullOrEmpty(dto.YeniSifre))
        {
            if (string.IsNullOrEmpty(dto.MevcutSifre) || !BCrypt.Net.BCrypt.Verify(dto.MevcutSifre, kullanici.SifreHash))
            {
                return BadRequest(new { mesaj = "Mevcut şifre hatalı girdiniz." });
            }

            kullanici.SifreHash = BCrypt.Net.BCrypt.HashPassword(dto.YeniSifre);
        }

        await _context.SaveChangesAsync();
        return Ok(new { mesaj = "Hesap başarıyla güncellendi." });
    }

    [HttpDelete("hesap-sil/{id}")]
    public async Task<IActionResult> HesapSil(int id)
    {
        var kullanici = await _context.Kullanicilar.FindAsync(id);
        if (kullanici == null)
            return NotFound(new { mesaj = "Kullanıcı bulunamadı." });

        _context.Kullanicilar.Remove(kullanici);
        await _context.SaveChangesAsync();

        return Ok(new { mesaj = "Hesap başarıyla silindi." });
    }

    private string TokenOlustur(Kullanici kullanici)
    {
        var jwtSettings = _config.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, kullanici.Id.ToString()),
            new Claim(ClaimTypes.Email, kullanici.Email),
            new Claim(ClaimTypes.Name, kullanici.Ad),
            new Claim(ClaimTypes.Role, kullanici.Rol)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}