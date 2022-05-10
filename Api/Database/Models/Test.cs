using System.ComponentModel.DataAnnotations;

namespace Api.Database.Models
{
    public class Test
    {
        [Key]
        public Guid Guid { get; set; } = Guid.NewGuid();
    }
}
