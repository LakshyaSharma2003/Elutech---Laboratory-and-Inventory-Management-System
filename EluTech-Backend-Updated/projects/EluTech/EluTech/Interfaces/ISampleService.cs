using EluTech.API.DTOs.Sample;

namespace EluTech.API.Interfaces;

public interface ISampleService
{
    Task AddSample(AddSampleDto dto);

    Task<List<SampleDto>> GetSamples();
    Task<List<SampleDto>> GetSamplesByType(string sampleType);

    Task RequestPhase(RequestPhaseDto dto);
    Task ApproveRequest(int requestId);
    Task RejectRequest(int requestId);

    Task<List<SampleDto>> GetSamplesByEmployee(int employeeId);

    Task UpdateSampleDetails(int sampleId, UpdateSampleDetailsDto dto);

    Task AcceptSample(int sampleId, AcceptSampleDto dto);
    Task RejectSample(int sampleId, RejectSampleDto dto);

    Task AddProgress(AddProgressDto dto);
    Task<List<ProgressLogDto>> GetProgressLogs(int sampleId);
}
