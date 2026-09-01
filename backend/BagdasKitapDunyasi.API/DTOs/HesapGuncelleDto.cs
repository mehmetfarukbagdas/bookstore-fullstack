namespace BagdasKitapDunyasi.API.DTOs;

public class HesapGuncelleDto
{
    public string Ad { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefon { get; set; }
    public string? DogumTarihi { get; set; }
    public string? MevcutSifre { get; set; }
    public string? YeniSifre { get; set; }
}