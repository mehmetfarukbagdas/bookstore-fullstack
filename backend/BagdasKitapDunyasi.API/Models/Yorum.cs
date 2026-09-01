using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BagdasKitapDunyasi.API.Models;

public class Yorum
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int KitapId { get; set; }

    [ForeignKey("KitapId")]
    public Kitap? Kitap { get; set; }

    [Required]
    [MaxLength(100)]
    public string KullaniciAd { get; set; } = "Anonim Kullanıcı";

    [Required]
    [MaxLength(1000)]
    public string Metin { get; set; } = string.Empty;

    [Required]
    [Range(1, 5)]
    public int Puan { get; set; } = 5;

    public DateTime KayitTarihi { get; set; } = DateTime.UtcNow;
    public string? Cevap { get; set; }
}