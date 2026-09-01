namespace BagdasKitapDunyasi.API.Models;

public class Kullanici
{
    public int Id { get; set; }
    public string Ad { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SifreHash { get; set; } = string.Empty;
    public string Rol { get; set; } = "kullanici";
    public DateTime KayitTarihi { get; set; } = DateTime.UtcNow;
}