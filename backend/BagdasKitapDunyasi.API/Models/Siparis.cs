using System.ComponentModel.DataAnnotations;

namespace BagdasKitapDunyasi.API.Models
{
    public class Siparis
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public int KullaniciId { get; set; }
        public DateTime KayitTarihi { get; set; } = DateTime.Now;
        public decimal ToplamTutar { get; set; }
        public string Durum { get; set; } = "pending";


    }
}