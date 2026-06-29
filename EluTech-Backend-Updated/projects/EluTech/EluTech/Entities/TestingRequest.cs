using EluTech.API.Common;

namespace EluTech.API.Entities;


public class TestingRequest : BaseEntity
{


    public int SampleId { get; set; }


    public Sample Sample { get; set; }




    public int EmployeeId { get; set; }


    public Employee Employee { get; set; }




    public string? CurrentPhase { get; set; }


    public string? RequestedPhase { get; set; }



    public string? Status { get; set; }



}