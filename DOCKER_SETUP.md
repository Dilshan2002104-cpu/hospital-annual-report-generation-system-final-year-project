# 🐳 Docker Deployment Guide

This guide explains how to run the Hospital Management System using Docker containers.

## 📋 Prerequisites

- Docker Desktop or Docker Engine (20.10+)
- Docker Compose (2.0+)
- At least 4GB RAM available for containers
- Ports 80, 8080, and 3306 available on your system

## 🚀 Quick Start (Full Stack)

### 1. Complete Stack with Database
Run the entire application stack including MySQL database:

```bash
# Clone and navigate to project
git clone https://github.com/Dilshan2002104-cpu/hospital-annual-report-generation-system-final-year-project.git
cd hospital-annual-report-generation-system-final-year-project

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Access the application:**
- Frontend: http://localhost
- Backend API: http://localhost:8080
- Database: localhost:3306

### 2. Development Mode (External Database)
If you prefer to use an external MySQL database:

```bash
# Start only frontend and backend
docker-compose -f docker-compose.dev.yml up -d
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## 🔧 Configuration

### Environment Variables

The application uses the following environment variables:

#### Backend (HMS)
```bash
# Database
SPRING_DATASOURCE_URL=jdbc:mysql://database:3306/hms
SPRING_DATASOURCE_USERNAME=hmsuser
SPRING_DATASOURCE_PASSWORD=SecurePassword123!

# Server
SERVER_PORT=8080
SERVER_ADDRESS=0.0.0.0

# JPA
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false

# Profile
SPRING_PROFILES_ACTIVE=docker
```

#### Frontend
```bash
VITE_API_BASE_URL=http://localhost/api
VITE_WS_URL=ws://localhost/ws
```

### Database Setup

The MySQL container will automatically:
- Create the `hms` database
- Set up the user `hmsuser` with password `SecurePassword123!`
- Initialize with any SQL scripts in `./database/init/` (optional)

## 🏗️ Building Images

### Build Individual Images

```bash
# Backend
cd HMS
docker build -t hms-backend .

# Frontend  
cd frontend
docker build -t hms-frontend .
```

### Build All Images
```bash
# Build all services
docker-compose build

# Build with no cache
docker-compose build --no-cache
```

## 📊 Monitoring and Health Checks

### Health Check Endpoints
- Backend: http://localhost:8080/actuator/health
- Frontend: http://localhost/health
- Database: Built-in MySQL health check

### View Container Status
```bash
# Check running containers
docker-compose ps

# View resource usage
docker stats

# Check health status
docker-compose exec backend curl -f http://localhost:8080/actuator/health
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check what's using port 80/8080/3306
   netstat -tulpn | grep :80
   netstat -tulpn | grep :8080
   netstat -tulpn | grep :3306
   ```

2. **Database Connection Issues**
   ```bash
   # Check database logs
   docker-compose logs database
   
   # Test database connection
   docker-compose exec database mysql -u hmsuser -p hms
   ```

3. **Frontend Build Issues**
   ```bash
   # Rebuild frontend with verbose output
   docker-compose build --no-cache frontend
   ```

4. **Backend Startup Issues**
   ```bash
   # Check backend logs
   docker-compose logs backend
   
   # Connect to backend container
   docker-compose exec backend bash
   ```

### Reset Everything
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v
docker system prune -f

# Rebuild and restart
docker-compose up -d --build
```

## 🔒 Security Notes

### Production Recommendations

1. **Change Default Passwords**
   ```bash
   # Create .env file with secure passwords
   echo "MYSQL_PASSWORD=your-secure-password" > .env
   echo "MYSQL_ROOT_PASSWORD=your-root-password" >> .env
   ```

2. **Use Secrets for Sensitive Data**
   ```yaml
   # In docker-compose.yml
   services:
     database:
       environment:
         MYSQL_PASSWORD_FILE: /run/secrets/mysql_password
       secrets:
         - mysql_password
   
   secrets:
     mysql_password:
       file: ./secrets/mysql_password.txt
   ```

3. **Enable HTTPS**
   - Add SSL certificates to nginx configuration
   - Update frontend environment to use HTTPS URLs

## 📈 Performance Optimization

### Resource Limits
```yaml
# Add to docker-compose.yml services
deploy:
  resources:
    limits:
      memory: 512M
      cpus: '0.5'
    reservations:
      memory: 256M
      cpus: '0.25'
```

### Database Optimization
```yaml
# Add to database service in docker-compose.yml
command: --default-authentication-plugin=mysql_native_password --innodb-buffer-pool-size=256M
```

## 🚢 Production Deployment

### Using Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml hms

# Scale services
docker service scale hms_backend=3
```

### Using Kubernetes
```bash
# Generate Kubernetes manifests (requires kompose)
kompose convert

# Apply to cluster
kubectl apply -f .
```

## 📝 Default Login Credentials

After the system starts up, use these credentials:

- **Admin**: admin / admin123
- **Doctor**: doctor / doctor123  
- **Nurse**: nurse / nurse123

## 🔄 Updates and Maintenance

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Clean up old images
docker image prune -f
```

### Backup Database
```bash
# Create backup
docker-compose exec database mysqldump -u root -p hms > backup.sql

# Restore backup
docker-compose exec -T database mysql -u root -p hms < backup.sql
```

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify all containers are running: `docker-compose ps`
3. Test connectivity: `docker-compose exec backend ping database`
4. Review the troubleshooting section above

For additional help, refer to the main README.md or create an issue in the repository.