using Microsoft.EntityFrameworkCore.Migrations; 
 
#nullable disable 
 
namespace BagdasKitapDünyası.API.Migrations 
{ 
    /// <inheritdoc /> 
    public partial class YorumlaraCevapAlaniEklendi : Migration 
    { 
        /// <inheritdoc /> 
        protected override void Up(MigrationBuilder migrationBuilder) 
        { 
            migrationBuilder.AddColumn<string>(
                name: "Cevap",
                table: "Yorumlar",
                type: "text",
                nullable: true);
        } 
 
        /// <inheritdoc /> 
        protected override void Down(MigrationBuilder migrationBuilder) 
        { 
            migrationBuilder.DropColumn(
                name: "Cevap",
                table: "Yorumlar");
        } 
    } 
}