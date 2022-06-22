#nullable disable

namespace Api.Models
{
    public class ResetPasswordModel
    {
        public string ResetCode { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
