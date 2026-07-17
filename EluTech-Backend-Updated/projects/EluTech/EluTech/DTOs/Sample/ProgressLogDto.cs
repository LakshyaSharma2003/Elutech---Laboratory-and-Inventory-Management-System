namespace EluTech.API.DTOs.Sample;

public class ProgressLogDto
{
    public int Id { get; set; }
    public int ProgressPercent { get; set; }
    public string? Remarks { get; set; }
    public string? Employee { get; set; }
    public DateTime LoggedAt { get; set; }
}
