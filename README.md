# Legal Expert - SaaS Legal Practice Management

A comprehensive full-stack SaaS application for legal practice management, built with modern technologies and clean architecture principles.

> 📋 **For detailed technical specifications and product requirements, please see the [documents](./documents) folder.**

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication system
- **Customer Management**: Complete CRUD operations for managing clients
- **Matter Management**: Track and manage legal matters for each customer
- **Role-based Access**: Secure access control for different user types
- **RESTful API**: Well-structured API with proper error handling
- **Modern UI**: Responsive React frontend with Tailwind CSS

## 🏗️ Architecture

### Backend (.NET 9 API)
- **Clean Architecture**: Organized with interfaces in dedicated folders
- **Repository Pattern**: Abstracted data access layer
- **Service Layer**: Business logic separation
- **Entity Framework Core**: In-memory database for development
- **JWT Authentication**: Secure token-based authentication
- **Unit Tests**: Comprehensive service layer testing

### Frontend (React + TypeScript)
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety throughout the application
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management

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
- Entity Framework Core (In-Memory)
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

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5207
- **API Documentation**: http://localhost:5207/swagger

## 🧪 Testing

Run the service layer unit tests:
```bash
cd LegalSaasApi.Tests
dotnet test
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - User login

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Matters
- `GET /api/customers/{customerId}/matters` - Get matters for customer
- `GET /api/customers/{customerId}/matters/{id}` - Get specific matter
- `POST /api/customers/{customerId}/matters` - Create new matter
- `PUT /api/customers/{customerId}/matters/{id}` - Update matter
- `DELETE /api/customers/{customerId}/matters/{id}` - Delete matter
