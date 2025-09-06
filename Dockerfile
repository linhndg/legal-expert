# Multi-stage Docker build for LegalFlow
# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy frontend source code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Build .NET API
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build

WORKDIR /app

# Copy .NET project files
COPY api/*.csproj ./
RUN dotnet restore

# Copy .NET source code
COPY api/ ./

# Build the API
RUN dotnet publish -c Release -o out

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

WORKDIR /app

# Copy the built API
COPY --from=backend-build /app/out .

# Copy the built React app to wwwroot for static serving
COPY --from=frontend-build /app/dist ./wwwroot

# Expose port
EXPOSE 10000

# Set environment variables for production
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:10000

# Start the application
ENTRYPOINT ["dotnet", "LegalSaasApi.dll"]
