namespace BagdasKitapDunyasi.API.Models;

public class SiteAyar
{
    public int Id { get; set; }


    public string MagazaAdi { get; set; } = "Bağdaş Kitap Dünyası";
    public string Aciklama { get; set; } = string.Empty;
    public string LogoUrl { get; set; } = string.Empty;


    public string Email { get; set; } = string.Empty;
    public string Telefon { get; set; } = string.Empty;
    public string Adres { get; set; } = string.Empty;


    public decimal KargoUcreti { get; set; } = 14.99m;
    public decimal UcretsizKargoLimiti { get; set; } = 150m;
}