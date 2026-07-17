using Microsoft.EntityFrameworkCore;
using EluTech.API.Entities;

namespace EluTech.API.Data;

public class ApplicationDbContext : DbContext
{

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {

    }




    public DbSet<User> Users { get; set; }


    public DbSet<Role> Roles { get; set; }


    public DbSet<Attendance> Attendances { get; set; }


    public DbSet<Sample> Samples { get; set; }

    public DbSet<EmployeeCheckLog> EmployeeCheckLogs { get; set; }

    public DbSet<SampleProgressLog> SampleProgressLogs { get; set; }


    public DbSet<RefreshToken> RefreshTokens { get; set; }

    public DbSet<OTP> OTPs { get; set; }

    public DbSet<Employee> Employees { get; set; }

    public DbSet<Payment> Payments { get; set; }

    public DbSet<Expense> Expenses { get; set; }

    public DbSet<Salary> Salaries { get; set; }

    public DbSet<Tax> Taxes { get; set; }

    public DbSet<Invoice> Invoices { get; set; }

    public DbSet<Chemical> Chemicals { get; set; }

    public DbSet<Machinery> Machineries { get; set; }

    public DbSet<Consumable> Consumables { get; set; }

    public DbSet<Purchase> Purchases { get; set; }

    public DbSet<Report> Reports { get; set; }

    public DbSet<Notification> Notifications { get; set; }

    public DbSet<AuditLog>
AuditLogs
    {
        get;
        set;
    }

    public DbSet<Customer>
Customers
    { get; set; }


    public DbSet<TestingRequest>

    TestingRequests
    { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User -> Employee (1:1)
        modelBuilder.Entity<Employee>()
            .HasOne(e => e.User)
            .WithOne()
            .HasForeignKey<Employee>(e => e.UserId)
            .OnDelete(DeleteBehavior.NoAction);


        // Sample -> Employee
        modelBuilder.Entity<Sample>()
            .HasOne(s => s.AssignedEmployee)
            .WithMany()
            .HasForeignKey(s => s.AssignedEmployeeId)
            .OnDelete(DeleteBehavior.NoAction);


        // Sample -> Customer (optional — Government samples have no Customer)
        modelBuilder.Entity<Sample>()
            .HasOne(s => s.Customer)
            .WithMany(c => c.Samples)
            .HasForeignKey(s => s.CustomerId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.NoAction);


        // TestingRequest -> Employee
        modelBuilder.Entity<TestingRequest>()
            .HasOne(t => t.Employee)
            .WithMany()
            .HasForeignKey(t => t.EmployeeId)
            .OnDelete(DeleteBehavior.NoAction);

        // EmployeeCheckLog -> Employee
        modelBuilder.Entity<EmployeeCheckLog>()
            .HasOne(x => x.Employee)
            .WithMany()
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.NoAction);

        // SampleProgressLog -> Sample
        modelBuilder.Entity<SampleProgressLog>()
            .HasOne(x => x.Sample)
            .WithMany(s => s.ProgressLogs)
            .HasForeignKey(x => x.SampleId)
            .OnDelete(DeleteBehavior.NoAction);

        // SampleProgressLog -> Employee
        modelBuilder.Entity<SampleProgressLog>()
            .HasOne(x => x.Employee)
            .WithMany()
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.NoAction);


        // TestingRequest -> Sample
        modelBuilder.Entity<TestingRequest>()
            .HasOne(t => t.Sample)
            .WithMany(s => s.Requests)
            .HasForeignKey(t => t.SampleId)
            .OnDelete(DeleteBehavior.Cascade);


        // Salary precision
        modelBuilder.Entity<Employee>()
            .Property(e => e.Salary)
            .HasPrecision(18, 2);


        modelBuilder.Entity<Payment>()
.Property(x => x.Amount)
.HasPrecision(18, 2);


        modelBuilder.Entity<Salary>()
        .Property(x => x.Amount)
        .HasPrecision(18, 2);


        modelBuilder.Entity<Expense>()
        .Property(x => x.Amount)
        .HasPrecision(18, 2);


        modelBuilder.Entity<Tax>()
        .Property(x => x.Amount)
        .HasPrecision(18, 2);


        modelBuilder.Entity<Invoice>()
        .Property(x => x.TotalAmount)
        .HasPrecision(18, 2);

        modelBuilder.Entity<Purchase>()

.Property(x => x.Amount)

.HasPrecision(18, 2);

        modelBuilder.Entity<Invoice>()
.Property(x => x.SubTotal)
.HasPrecision(18, 2);


        modelBuilder.Entity<Invoice>()
        .Property(x => x.GST)
        .HasPrecision(18, 2);


        modelBuilder.Entity<Invoice>()
        .Property(x => x.TotalAmount)
        .HasPrecision(18, 2);

        modelBuilder.Entity<Report>()

.HasOne(x => x.Sample)

.WithMany()

.HasForeignKey(x => x.SampleId)

.OnDelete(DeleteBehavior.NoAction);



        modelBuilder.Entity<Report>()

        .HasOne(x => x.Employee)

        .WithMany()

        .HasForeignKey(x => x.EmployeeId)

        .OnDelete(DeleteBehavior.NoAction);


        modelBuilder.Entity<Employee>()

.HasQueryFilter(

x => !x.IsDeleted);



        modelBuilder.Entity<Customer>()

        .HasQueryFilter(

        x => !x.IsDeleted);



        modelBuilder.Entity<Sample>()

        .HasQueryFilter(

        x => !x.IsDeleted);



        modelBuilder.Entity<Report>()

        .HasQueryFilter(

        x => !x.IsDeleted);
    }

}