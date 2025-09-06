# LegalFlow Deployment Guide for Render.com

This guide will help you deploy your LegalFlow application to Render.com using Docker.

## 🚀 Quick Deployment Steps

### Method 1: Using Render Dashboard (Recommended)

1. **Fork or Push to GitHub**
   - Ensure your code is in a GitHub repository
   - Make sure all the Docker files are committed

2. **Create New Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   - **Name**: `legalflow`
   - **Environment**: `Docker`
   - **Plan**: `Free` (or higher for production)
   - **Dockerfile Path**: `./Dockerfile`

4. **Set Environment Variables**
   ```
   ASPNETCORE_ENVIRONMENT=Production
   ASPNETCORE_URLS=http://+:8080
   Jwt__Key=your-super-secret-jwt-key-that-is-at-least-32-characters-long
   Jwt__Issuer=LegalFlow
   Jwt__Audience=LegalFlowClient
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

### Method 2: Using render.yaml (Infrastructure as Code)

1. **Use the provided render.yaml**
   - The `render.yaml` file is already configured in your project
   - Simply push to GitHub and connect to Render

2. **Auto-deployment**
   - Render will read the configuration from render.yaml
   - Environment variables will be set automatically

## 🔧 Configuration Details

### Docker Build Process
The Dockerfile uses a multi-stage build:
1. **Frontend Build**: Builds React app with Vite
2. **Backend Build**: Compiles .NET 9 API
3. **Runtime**: Serves both frontend and API from single container

### Environment Variables
- `ASPNETCORE_ENVIRONMENT`: Set to Production
- `ASPNETCORE_URLS`: Configured for port 8080 (Render's default)
- `Jwt__Key`: Secure JWT signing key (auto-generated on Render)
- `Jwt__Issuer`: JWT issuer identifier
- `Jwt__Audience`: JWT audience identifier

### API Endpoints
After deployment, your API will be available at:
- Frontend: `https://your-app-name.onrender.com`
- API: `https://your-app-name.onrender.com/api`
- Swagger (if enabled): `https://your-app-name.onrender.com/swagger`

## 🎯 Post-Deployment

### Test Your Application
1. Visit your Render URL
2. Test login functionality
3. Verify API endpoints work
4. Check customer portal access

### Production Considerations
1. **Database**: Currently uses in-memory database (data is lost on restart)
   - Consider upgrading to PostgreSQL for persistence
   - Render offers managed PostgreSQL databases

2. **Environment Variables**: Review and secure JWT keys

3. **Domain**: Configure custom domain if needed

4. **Monitoring**: Set up health checks and monitoring

## 🐛 Troubleshooting

### Build Issues
- Check Docker build logs in Render dashboard
- Ensure all dependencies are properly defined
- Verify Node.js and .NET versions compatibility

### Runtime Issues
- Check application logs in Render dashboard
- Verify environment variables are set correctly
- Ensure port 8080 is properly configured

### API Connection Issues
- Check CORS configuration
- Verify API base URL in axios configuration
- Test API endpoints directly

## 📞 Support

If you encounter issues:
1. Check Render's build and runtime logs
2. Verify all environment variables
3. Test Docker build locally first
4. Review the troubleshooting section above

## 🔄 Updates and Redeployment

Render automatically redeploys when you push to your connected Git branch:
1. Make changes to your code
2. Commit and push to GitHub
3. Render automatically builds and deploys the new version

## 🎉 Success!

Once deployed, your LegalFlow application will be live at:
`https://your-service-name.onrender.com`

The application includes:
- ✅ React frontend served statically
- ✅ .NET API with all endpoints
- ✅ JWT authentication system
- ✅ In-memory database with test data
- ✅ Responsive design with Tailwind CSS
