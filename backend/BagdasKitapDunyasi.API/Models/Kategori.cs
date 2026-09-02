using System.Text.Json.Serialization;

namespace BagdasKitapDunyasi.API.Models;

public class Kategori
{
    public int Id { get; set; }
    public string Ad { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;

    [JsonIgnore]
    public List<Kitap> Kitaplar { get; set; } = new();
}
