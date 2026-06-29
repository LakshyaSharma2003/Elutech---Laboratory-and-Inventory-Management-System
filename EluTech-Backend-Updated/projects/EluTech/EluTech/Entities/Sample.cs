using EluTech.API.Common;

namespace EluTech.API.Entities;

public class Sample : BaseEntity
{


    public string? SampleCode { get; set; }


    public string? SampleName { get; set; }



    public int CustomerId { get; set; }


    public Customer Customer { get; set; }




    public int AssignedEmployeeId { get; set; }


    public Employee AssignedEmployee { get; set; }




    public string? CurrentPhase { get; set; }




    public string? Status { get; set; }




    public DateTime ReceivedDate { get; set; }



    public ICollection<TestingRequest>

        Requests

    { get; set; }

    =

    new List<TestingRequest>();



}