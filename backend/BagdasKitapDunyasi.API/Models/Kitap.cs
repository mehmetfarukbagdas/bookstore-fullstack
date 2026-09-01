namespace BagdasKitapDunyasi.API.Models;

public class Kitap
{
    public int Id { get; set; }
    public string Baslik { get; set; } = string.Empty;
    public string Yazar { get; set; } = string.Empty;
    public decimal Fiyat { get; set; }
    public decimal? IndirimliFiyat { get; set; }
    public string ResimUrl { get; set; } = string.Empty;
    public int KategoriId { get; set; }
    public Kategori? Kategori { get; set; } = null!;
    public double Puan { get; set; }
    public int YorumSayisi { get; set; }
    public string Aciklama { get; set; } = string.Empty;
    public string ISBN { get; set; } = string.Empty;
    public string Yayinevi { get; set; } = string.Empty;
    public int SayfaSayisi { get; set; }
    public DateTime YayinTarihi { get; set; }
    public int Stok { get; set; }
    public bool CokSatan { get; set; } = false;
    public bool DunyaKlasigi { get; set; } = false;
    public bool Kampanya { get; set; } = false;
}