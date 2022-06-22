using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Api.Database.Models;

public class Subscriber
{
    [Key]
    public Guid Guid { get; set; } = Guid.NewGuid();
    public string Email {get; set; }
}