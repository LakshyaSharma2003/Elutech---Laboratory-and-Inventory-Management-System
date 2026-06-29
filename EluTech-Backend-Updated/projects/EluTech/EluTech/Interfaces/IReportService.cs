using EluTech.API.DTOs.Report;

namespace EluTech.API.Interfaces;



public interface IReportService
{


    Task UploadReport(

    IFormFile file,

    UploadReportDto dto);



    Task<List<ReportDto>>

    GetReports();



    Task<byte[]>

    DownloadReport(

    int id);



    Task ApproveReport(

    int id);



    Task RejectReport(

    int id);



}