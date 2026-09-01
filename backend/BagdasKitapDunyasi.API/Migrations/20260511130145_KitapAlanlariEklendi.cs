using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BagdasKitapDunyası.API.Migrations
{
    /// <inheritdoc />
    public partial class KitapAlanlariEklendi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "CokSatan",
                table: "Kitaplar",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "DunyaKlasigi",
                table: "Kitaplar",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Kampanya",
                table: "Kitaplar",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CokSatan",
                table: "Kitaplar");

            migrationBuilder.DropColumn(
                name: "DunyaKlasigi",
                table: "Kitaplar");

            migrationBuilder.DropColumn(
                name: "Kampanya",
                table: "Kitaplar");
        }
    }
}
