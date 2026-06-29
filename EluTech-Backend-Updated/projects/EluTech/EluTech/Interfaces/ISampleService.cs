using EluTech.API.DTOs.Sample;

namespace EluTech.API.Interfaces;


public interface ISampleService
{


    Task AddSample(

    AddSampleDto dto);



    Task<List<SampleDto>>

    GetSamples();



    Task RequestPhase(

    RequestPhaseDto dto);



    Task ApproveRequest(

    int requestId);



    Task RejectRequest(

    int requestId);





    Task<List<SampleDto>>

    GetSamplesByEmployee(

    int employeeId);

}