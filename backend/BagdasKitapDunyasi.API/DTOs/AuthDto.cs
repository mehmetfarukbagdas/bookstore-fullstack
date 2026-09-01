namespace BagdasKitapDunyasi.API.DTOs;

public class RegisterDto
{
    public string Ad { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Sifre { get; set; } = string.Empty;
}

public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Sifre { get; set; } = string.Empty;
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Ad { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public int Id { get; set; }
}