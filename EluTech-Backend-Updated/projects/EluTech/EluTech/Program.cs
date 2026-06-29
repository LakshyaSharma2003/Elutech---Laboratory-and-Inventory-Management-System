using Asp.Versioning;
using AspNetCoreRateLimit;
using EluTech.API.Data;
using EluTech.API.Hubs;
using EluTech.API.Interfaces;
using EluTech.API.Middlewares;
using EluTech.API.Seeders;
using EluTech.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using QuestPDF.Infrastructure;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


// Services
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();


// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"));
});


// Dependency Injection
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();



// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.Events = new JwtBearerEvents
    {


        OnChallenge = context =>
        {


            context.HandleResponse();



            context.Response.StatusCode = 401;



            return Task.CompletedTask;


        },




        OnForbidden = context =>
        {


            context.Response.StatusCode = 403;



            return Task.CompletedTask;


        }



    };
    options.TokenValidationParameters = new TokenValidationParameters
    {

        ValidateIssuer = true,

        ValidateAudience = true,

        ValidateLifetime = true,

        ValidateIssuerSigningKey = true,


        ValidIssuer =
            builder.Configuration["Jwt:Issuer"],

        ValidAudience =
            builder.Configuration["Jwt:Audience"],


        IssuerSigningKey =
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    builder.Configuration["Jwt:Key"]!
                ))
    };

});



// Authorization
builder.Services.AddAuthorization(options =>
{

    options.AddPolicy(

        "ManagerOnly",

        policy =>
        {

            policy.RequireRole(

                "Manager"

            );

        });



    options.AddPolicy(

        "FinanceOnly",

        policy =>
        {

            policy.RequireRole(

                "Manager",

                "FinanceOfficer"

            );

        });




    options.AddPolicy(

        "EmployeeOnly",

        policy =>
        {

            policy.RequireRole(

                "Manager",

                "Employee"

            );

        });


});


// Swagger
builder.Services.AddSwaggerGen(options =>
{

    options.AddSecurityDefinition("Bearer",
        new OpenApiSecurityScheme
        {

            Name = "Authorization",

            Type = SecuritySchemeType.Http,

            Scheme = "bearer",

            BearerFormat = "JWT",

            In = ParameterLocation.Header,

            Description =
            "Enter JWT Token"

        });



    options.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {

            {
                new OpenApiSecurityScheme
                {
                    Reference =
                    new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },

                Array.Empty<string>()
            }

        });

});

builder.Services.AddScoped<

IEmployeeService,

EmployeeService>();

builder.Services.AddScoped<

IAttendanceService,

AttendanceService>();

builder.Services.AddScoped<
ISampleService,
SampleService>();

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ISmsService, SmsService>();


builder.Services.AddScoped<
IFinanceService,
FinanceService>();

builder.Services.AddScoped<
IInventoryService,
InventoryService>();

QuestPDF.Settings.License =
LicenseType.Community;

builder.Services.AddScoped<

IReportService,

ReportService>();

builder.Services.AddScoped<

IDashboardService,

DashboardService>();

builder.Services.AddScoped<

INotificationService,

NotificationService>();

builder.Services.AddScoped<

IAuditService,

AuditService>();

builder.Services.AddMemoryCache();

builder.Services.Configure<IpRateLimitOptions>(

builder.Configuration.GetSection(

"IpRateLimiting"

));

builder.Services.AddApiVersioning(options =>
{

    options.DefaultApiVersion =

    new ApiVersion(1, 0);


    options.AssumeDefaultVersionWhenUnspecified = true;


    options.ReportApiVersions = true;


});

builder.Host.UseSerilog((ctx, lc) =>


lc.WriteTo.File(

"Logs/log.txt",

rollingInterval:

RollingInterval.Day)

);

builder.Services.AddHealthChecks();

//builder.Services.AddStackExchangeRedisCache(options =>
//{

//    options.Configuration =

//    "localhost:6379";



//});

builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{


    options.AddPolicy(

    "MyPolicy",

    policy =>
    {


        policy.AllowAnyOrigin()

    .AllowAnyMethod()

    .AllowAnyHeader();


    });


});

builder.Services.AddSwaggerGen();

var app = builder.Build();



// Seed Roles
using (var scope = app.Services.CreateScope())
{

    var context = scope.ServiceProvider
        .GetRequiredService<ApplicationDbContext>();


    await RoleSeeder.SeedRoles(context);

}



// Middleware

if (app.Environment.IsDevelopment())
{

    app.UseSwagger();

    app.UseSwaggerUI();

}

app.UseCustomExceptionMiddleware();

app.UseHttpsRedirection();


app.UseAuthentication();

app.UseAuthorization();

app.UseMiddleware<AuditMiddleware>();

app.MapControllers();

app.MapHealthChecks(

"/health");

app.MapHub<NotificationHub>(

"/notifications");

app.UseCors(

"MyPolicy");

using (var scope = app.Services.CreateScope())
{

    var context =

    scope.ServiceProvider

    .GetRequiredService<ApplicationDbContext>();



    await RoleSeeder.SeedRoles(context);

    await UserSeeder.Seed(context);

    await EmployeeSeeder.Seed(context);

    //await CustomerSeeder.Seed(context);

    //await SampleSeeder.Seed(context);

    //await FinanceSeeder.Seed(context);

    //await InventorySeeder.Seed(context);

    //await ReportSeeder.Seed(context);

}

app.Run();
