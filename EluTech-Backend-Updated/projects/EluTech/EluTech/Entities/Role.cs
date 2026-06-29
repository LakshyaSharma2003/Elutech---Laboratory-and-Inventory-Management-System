
using EluTech.API.Common;

namespace EluTech.API.Entities;

public class Role : BaseEntity
{

    public string? Name { get; set; }

    public ICollection<User> Users { get; set; }

}