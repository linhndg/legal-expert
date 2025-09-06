# Changelog

All notable changes to the LegalFlow project will be documented in this file.

## [2.0.0] - 2025-09-06

### 🚀 Major Features Added

#### Customer Portal System
- **Dual Authentication System**: Separate login flows for law firm admins and customers
- **Customer Portal Dashboard**: Dedicated interface for customers to view their matters and profile
- **Portal Access Control**: Law firms can enable/disable portal access per customer with password management
- **Customer Authentication**: Secure JWT-based authentication specifically for customer portal

#### Dashboard Improvements
- **Analytics Dashboard**: Overview of total customers, matters, and active matters
- **Recent Items**: Display recent customers with clickable navigation to detail pages
- **Simplified Interface**: Removed redundant sections for cleaner user experience
- **Navigation Enhancements**: Added "Back to Dashboard" buttons across pages

#### Docker Deployment
- **Production-Ready Dockerfile**: Multi-stage build for optimized production deployment
- **Render.com Integration**: Pre-configured deployment files for Render.com
- **Environment Configuration**: Proper production environment setup
- **Static File Serving**: Integrated frontend and backend in single Docker container

### 🔧 Technical Improvements

#### API & Backend
- **Customer Portal Controller**: New API endpoints for customer authentication and data access
- **Enhanced Customer Model**: Added portal-specific fields (PasswordHash, IsPortalEnabled, LastLogin)
- **Improved Error Handling**: Better error responses and validation messages
- **CORS Configuration**: Proper CORS setup for production deployment

#### Frontend & UI
- **Axios Configuration**: Centralized HTTP client with environment-specific base URLs
- **Error Handling**: User-friendly error messages with retry functionality instead of alert popups
- **Authentication Flow**: Automatic token management and route protection
- **Matter Form Enhancements**: Default start date to current date for new matters

#### Developer Experience
- **Consistent Code Structure**: Replaced all axios imports with axiosInstance for consistency
- **Environment Variables**: Proper environment configuration for different deployment stages
- **Documentation**: Comprehensive deployment and setup documentation

### 🐛 Bug Fixes

#### Authentication Issues
- **Fixed Duplicate API Paths**: Resolved `/api/api/...` URL duplication in customer portal endpoints
- **Token Management**: Fixed axios interceptor configuration for proper token handling
- **Route Protection**: Improved protected route logic for both admin and customer portals

#### UI/UX Fixes
- **Form Validation**: Enhanced validation messages and error handling
- **Navigation**: Fixed routing issues and improved navigation flow
- **Responsive Design**: Better mobile and desktop experience

### 📝 API Changes

#### New Endpoints
- `POST /api/customer/login` - Customer portal authentication
- `GET /api/customer/profile` - Customer profile access
- `GET /api/customer/matters` - Customer matters listing

#### Enhanced Endpoints
- `POST /api/customers` - Now supports portal access configuration
- `PUT /api/customers/{id}` - Enhanced with portal management

### 🗂️ File Structure Changes

#### New Files
- `Dockerfile` - Production Docker configuration
- `render.yaml` - Render.com deployment configuration
- `.dockerignore` - Docker build optimization
- `DEPLOYMENT.md` - Comprehensive deployment guide
- `CHANGELOG.md` - This changelog file

#### Modified Files
- `README.md` - Updated with new features and deployment information
- `src/utils/axios.ts` - Enhanced configuration for different environments
- `api/Program.cs` - Added production configurations and CORS setup
- Multiple component files - Consistent axios usage and error handling

### 🚀 Deployment

#### Production Ready
- **Docker Deployment**: Fully containerized application ready for cloud deployment
- **Render.com Support**: Pre-configured for easy Render.com deployment
- **Environment Variables**: Proper configuration management for different environments
- **Performance Optimized**: Multi-stage Docker build for smaller production images

### 📋 Migration Notes

#### For Existing Installations
1. Run database migrations if any schema changes are present
2. Update environment variables with new Jwt configuration
3. Clear browser storage if authentication issues occur
4. Test both admin and customer portal access

#### For New Deployments
1. Use the new Docker deployment method
2. Configure environment variables as specified in DEPLOYMENT.md
3. Test the complete authentication flow for both user types

---

## [1.0.0] - Initial Release

### Features
- Basic customer management CRUD operations
- Matter management system
- JWT authentication for admin users
- React frontend with TypeScript
- .NET 9 API backend
- In-memory database for development

### API Endpoints
- Authentication endpoints
- Customer management endpoints
- Matter management endpoints

### Frontend
- Customer listing and forms
- Matter listing and forms
- Basic authentication flow
- Responsive design with Tailwind CSS
