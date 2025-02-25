using System.ComponentModel.DataAnnotations;

public class RegisterUser
{
    [Required(ErrorMessage = "El nombre es obligatorio")]
    public string Name { get; set; }

    [Required(ErrorMessage = "El correo es obligatorio")]
    [EmailAddress(ErrorMessage = "Debe ser un correo válido")]
    public string Email { get; set; }

    [Required(ErrorMessage = "La contraseña es obligatoria")]
    [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
    public string Password { get; set; }
}
