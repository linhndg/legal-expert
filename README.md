# LegalFlow - SaaS Legal Practice Management

A comprehensive full-stack SaaS application for legal practice management, built with modern technologies and clean architecture principles. Features both admin dashboard for law firms and customer portal for clients.

> 📋 **For detailed technical specifications and product requirements, please see the [documents](./documents) folder.**

## 🚀 Features

### 🏢 **Law Firm Dashboard**
- **User Authentication**: Secure JWT-based authentication system
- **Customer Management**: Complete CRUD operations for managing clients with portal access control
- **Matter Management**: Track and manage legal matters for each customer
- **Dashboard Analytics**: Overview of total customers, matters, and recent activities
- **Role-based Access**: Secure access control for different user types

### 👥 **Customer Portal**
- **Customer Authentication**: Separate secure login system for clients
- **Matter Tracking**: Customers can view their legal matters and case progress
- **Profile Management**: Customers can access their account information
- **Portal Access Control**: Law firms can enable/disable portal access per customer

### 🔧 **Technical Features**
- **RESTful API**: Well-structured API with proper error handling
- **Modern UI**: Responsive React frontend with Tailwind CSS
- **Docker Deployment**: Ready-to-deploy Docker configuration
- **Cloud Deployment**: Pre-configured for Render.com deployment
- **Error Handling**: User-friendly error messages and retry functionality

## 🏗️ Architecture

### Backend (.NET 9 API)
- **Clean Architecture**: Organized with interfaces in dedicated folders
- **Repository Pattern**: Abstracted data access layer
- **Service Layer**: Business logic separation
- **Entity Framework Core**: In-memory database for development (PostgreSQL-compatible schema)
- **JWT Authentication**: Secure token-based authentication
- **Unit Tests**: Comprehensive service layer testing

### Frontend (React + TypeScript)
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety throughout the application
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **Axios Interceptors**: Automatic token management and error handling
- **Customer Portal**: Separate authentication and dashboard for clients

## 📁 Project Structure

```
legal-expert/
├── api/                           # Backend API (.NET 9)
│   ├── Controllers/              # API controllers
│   ├── Services/
│   │   ├── Interfaces/           # Service interfaces
│   │   └── *.cs                  # Service implementations
│   ├── Repositories/
│   │   ├── Interfaces/           # Repository interfaces
│   │   └── *.cs                  # Repository implementations
│   ├── Models/                   # Entity models
│   ├── DTOs/                     # Data transfer objects
│   └── Data/                     # Database context
├── LegalSaasApi.Tests/           # Unit tests (Service layer only)
└── src/                          # Frontend React app
    ├── components/               # Reusable UI components
    ├── pages/                    # Page components
    ├── stores/                   # State management
    └── utils/                    # Utility functions
```

## 🛠️ Technologies

**Backend:**
- .NET 9
- ASP.NET Core Web API
- Entity Framework Core (In-Memory for convenience, PostgreSQL-ready schema)
- JWT Authentication
- BCrypt for password hashing
- XUnit for testing

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios for API calls
- Zustand for state management

## 🚦 Getting Started

### Prerequisites
- .NET 9 SDK
- Node.js 18+
- Git

### Database Setup
The application currently uses **Entity Framework Core In-Memory database** for convenience and easy setup. The schema is designed to be **PostgreSQL-compatible**, allowing for easy migration to PostgreSQL in production environments without code changes.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/linhndg/legal-expert.git
   cd legal-expert
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   ```

   Or run them separately:

   **Backend API:**
   ```bash
   cd api
   dotnet run
   ```

   **Frontend:**
   ```bash
   npm run client:dev
   ```

### 🌐 Access Points

- **Frontend (Law Firm Dashboard)**: http://localhost:5174
- **Frontend (Customer Portal)**: http://localhost:5174/customer-portal
- **Backend API**: http://localhost:5207
- **API Documentation**: http://localhost:5207/swagger

### 🌍 Live Demo

**Experience LegalFlow in action:** [https://legal-expert-1.onrender.com/](https://legal-expert-1.onrender.com/)

The live demo includes:
- **Law Firm Dashboard**: Full admin interface for managing customers and matters
- **Customer Portal**: Client-facing portal for viewing matters and profile information
- **Sample Data**: Pre-populated with example customers and legal matters
- **Both Authentication Systems**: Test both admin and customer login flows

*Note: The demo uses a shared database, so data may be modified by other users.*

## 🧪 Testing

Run the service layer unit tests:
```bash
cd LegalSaasApi.Tests
dotnet test
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new law firm user
- `POST /api/auth/login` - Law firm user login

### Customer Portal Authentication
- `POST /api/customer/login` - Customer portal login
- `GET /api/customer/profile` - Get customer profile (customer auth required)
- `GET /api/customer/matters` - Get customer matters (customer auth required)

### Customers (Law Firm Admin)
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer (with optional portal access)
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Matters (Law Firm Admin)
- `GET /api/customers/{customerId}/matters` - Get matters for customer
- `GET /api/customers/{customerId}/matters/{id}` - Get specific matter
- `POST /api/customers/{customerId}/matters` - Create new matter
- `PUT /api/customers/{customerId}/matters/{id}` - Update matter
- `DELETE /api/customers/{customerId}/matters/{id}` - Delete matter

## 🚀 Deployment

### Docker Deployment
The project includes Docker configuration for easy deployment to platforms like Render.com, Railway, or any Docker-compatible hosting service.

**Quick Deploy to Render.com:**
1. Push your code to GitHub
2. Connect your repository to Render
3. Use the included `Dockerfile` and `render.yaml` for automatic configuration

**Build and run locally with Docker:**
```bash
# Build the Docker image
docker build -t legalflow .

# Run the container
docker run -p 8080:8080 legalflow
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).
