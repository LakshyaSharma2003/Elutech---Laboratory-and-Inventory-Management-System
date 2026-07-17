# EluTech - Laboratory and Inventory Management System

![EluTech Banner](https://via.placeholder.com/1200x300.png?text=EluTech+LIMS+-+Enterprise+Laboratory+%26+Inventory+Management)

**EluTech** is a comprehensive, scalable, and highly performant Laboratory and Inventory Management System (LIMS). It is designed to streamline laboratory workflows, manage chemical/equipment inventories, and provide real-time analytics and reporting. 

Built with a robust **.NET 8** backend and a dynamic **Angular 20** frontend, EluTech ensures enterprise-grade security, real-time collaboration, and an exceptional user experience.

---

## 🚀 Key Features

* **Advanced Authentication & Authorization:** Secure JWT-based authentication with Role-Based Access Control (RBAC). Passwords are cryptographically hashed using BCrypt.
* **Real-time Updates & Notifications:** Integrated with **SignalR** to push instant updates to connected clients (e.g., inventory alerts, status changes).
* **Comprehensive Inventory Management:** Track laboratory equipment, chemicals, and consumables with precision.
* **Sample Lifecycle Management:** Track the entire lifecycle of lab samples, including detailed progress logs and status updates.
* **Attendance Tracking:** Keep track of employee check-ins and check-outs with detailed logs and self-service capabilities.
* **Automated Background Jobs:** Leverages **Hangfire** for scheduling and executing asynchronous tasks (e.g., automated email notifications, database cleanup).
* **High-Performance Caching:** Utilizes **Redis** for distributed caching to significantly reduce database load and improve API response times.
* **Dynamic Reporting & Exporting:**
  * PDF report generation using **QuestPDF**.
  * Excel data exports using **ClosedXML**.
* **API Rate Limiting:** Built-in protection against brute-force and DDoS attacks using `AspNetCoreRateLimit`.
* **Rich Dashboard & Analytics:** Interactive data visualization in the frontend using **ApexCharts**.
* **Modern UI/UX:** A highly responsive and aesthetic interface built with **Tailwind CSS** and **Angular Material**.

---

## 🛠️ Technology Stack

### Backend (.NET 8 Web API)
* **Framework:** ASP.NET Core 8.0
* **ORM:** Entity Framework Core (SQL Server)
* **Real-time Communication:** SignalR
* **Background Processing:** Hangfire
* **Caching:** Redis (StackExchange.Redis)
* **Validation:** FluentValidation
* **Email Service:** MailKit
* **Document Generation:** QuestPDF (PDFs), ClosedXML (Excel)
* **Logging:** Serilog (with File Sink)
* **API Versioning:** Asp.Versioning.Mvc

### Frontend (Angular 20)
* **Framework:** Angular 20
* **Styling:** Tailwind CSS, Angular Material
* **Icons:** Lucide Angular
* **Charts/Visualizations:** ApexCharts (`ng-apexcharts`), D3.js
* **Real-time Client:** `@microsoft/signalr`
* **State & Data Handling:** RxJS, Day.js

---

## 📁 Project Structure

```
Elutech Final/
├── EluTech-Backend-Updated/      # Backend Solution (.NET 8)
│   └── projects/
│       └── EluTech/
│           ├── Controllers/      # API Endpoints
│           ├── DTOs/             # Data Transfer Objects
│           ├── Entities/         # Domain Models
│           ├── Hubs/             # SignalR Hubs for Real-time Comm.
│           ├── Interfaces/       # Abstractions & Contracts
│           ├── Services/         # Business Logic Layer
│           ├── Repositories/     # Data Access Layer
│           ├── Migrations/       # EF Core Migrations
│           └── Program.cs        # Application Entry & Services Config
│
├── EluTech-Frontend-Complete/    # Frontend Workspace (Angular 20)
│   └── EluTech-Frontend/
│       ├── src/
│       │   ├── app/              # Components, Services, Modules
│       │   ├── assets/           # Static files
│       │   └── environments/     # Env configurations
│       ├── tailwind.config.js    # Tailwind configurations
│       └── package.json          # Node dependencies
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
* [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)
* [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
* [Redis](https://redis.io/download) (Running on default port 6379)

### 1. Running the Backend

1. Navigate to the backend project directory:
   ```bash
   cd "EluTech-Backend-Updated/projects/EluTech/EluTech"
   ```
2. Update the `appsettings.json` file with your **SQL Server Connection String** and **Redis Configuration**.
3. Apply Entity Framework migrations to set up the database:
   ```bash
   dotnet ef database update
   ```
4. Run the API:
   ```bash
   dotnet run
   ```
   *The API will start (usually on `https://localhost:7001` or `http://localhost:5000`). Swagger UI will be available at `/swagger`.*

### 2. Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd "EluTech-Frontend-Complete/EluTech-Frontend"
   ```
2. Install the necessary NPM packages:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   ng serve
   ```
4. Open your browser and navigate to `http://localhost:4200/`.

---

## 🔒 Security & Architecture

EluTech uses a standard **N-Tier Architecture** ensuring separation of concerns:
* **Controllers** handle HTTP requests and route them to Services.
* **Services** contain all core business logic and validation rules.
* **Repositories** abstract the database layer via EF Core.

**Security mechanisms include:**
* JWT Bearer token authentication with configurable expiration.
* API Rate Limiting to prevent abusive request patterns.
* Password encryption using adaptive bcrypt hashing.

---

> **Note:** This project is intended as a full-stack showcase of modern enterprise web development capabilities combining the Microsoft .NET ecosystem with Angular.
