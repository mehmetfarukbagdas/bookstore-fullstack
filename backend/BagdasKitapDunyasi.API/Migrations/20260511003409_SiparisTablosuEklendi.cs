using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BagdasKitapDunyası.API.Migrations
{
    /// <inheritdoc />
    public partial class SiparisTablosuEklendi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Siparisler",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    KullaniciId = table.Column<int>(type: "integer", nullable: false),
                    KayitTarihi = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ToplamTutar = table.Column<decimal>(type: "numeric", nullable: false),
                    Durum = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Siparisler", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Siparisler");
        }
    }
}
