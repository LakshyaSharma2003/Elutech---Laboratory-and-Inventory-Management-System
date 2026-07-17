using System.Text.Json;
using System.Text.Json.Serialization;

namespace EluTech.API.Common;

// EF Core returns DateTime values with Kind = Unspecified (SQL Server has no
// timezone concept). Without this converter, System.Text.Json serializes
// them WITHOUT a trailing "Z", so the browser's `new Date(...)` interprets
// them as LOCAL time instead of UTC — causing check-in/attendance times to
// display several hours off. This converter always treats DateTime as UTC
// and always emits the "Z" suffix, so the frontend can safely convert to
// the user's local timezone.
public class UtcDateTimeConverter : JsonConverter<DateTime>
{
    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetDateTime();
        return DateTime.SpecifyKind(value, DateTimeKind.Utc);
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
        var utc = value.Kind == DateTimeKind.Utc ? value : DateTime.SpecifyKind(value, DateTimeKind.Utc);
        writer.WriteStringValue(utc.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"));
    }
}

public class UtcNullableDateTimeConverter : JsonConverter<DateTime?>
{
    public override DateTime? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Null) return null;
        var value = reader.GetDateTime();
        return DateTime.SpecifyKind(value, DateTimeKind.Utc);
    }

    public override void Write(Utf8JsonWriter writer, DateTime? value, JsonSerializerOptions options)
    {
        if (value == null) { writer.WriteNullValue(); return; }
        var utc = value.Value.Kind == DateTimeKind.Utc ? value.Value : DateTime.SpecifyKind(value.Value, DateTimeKind.Utc);
        writer.WriteStringValue(utc.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"));
    }
}
