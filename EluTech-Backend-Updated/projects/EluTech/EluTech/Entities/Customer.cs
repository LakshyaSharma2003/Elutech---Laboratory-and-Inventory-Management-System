using EluTech.API.Common;

namespace EluTech.API.Entities;

public class Customer : BaseEntity
{

    public string? Name { get; set; }

    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Address { get; set; }

    public string? GSTNumber { get; set; }


    public ICollection<Sample>
        Samples
    { get; set; }
    =
    new List<Sample>();

}