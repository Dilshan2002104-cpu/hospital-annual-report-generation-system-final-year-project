# 🐳 HMS Docker Deployment Guide

This guide will help you containerize the Hospital Management System, push images to DockerHub, and deploy on your AWS EC2 Ubuntu server.

## 📋 Prerequisites

### Local Development Machine:
- **Docker Desktop** installed and running
- **Git** installed
- **DockerHub account** (create at [hub.docker.com](https://hub.docker.com))

### AWS EC2 Ubuntu Server:
- **Ubuntu 24.04 LTS** (your AMI: ubuntu-noble-24.04-amd64-server-20250821)
- **Security Group** configured to allow:
  - SSH (port 22)
  - HTTP (port 80)
  - HTTPS (port 443)
  - Custom TCP (port 8080) for API access
- **At least 2GB RAM** and 2 vCPUs (t2.small or larger)
- **10GB+ storage** for Docker images and data

## 🚀 Quick Start

### Step 1: Prepare Your Environment

1. **Clone/Navigate to your project:**
   ```bash
   cd /path/to/hospital-annual-report-generation-system-final-year-project
   ```

2. **Set up environment file:**
   ```bash
   cp .env.example .env
   # Edit .env with your DockerHub username and secure passwords
   ```

### Step 2: Build and Push Images

**On Windows:**
```cmd
scripts\build-and-push.bat YOUR_DOCKERHUB_USERNAME
```

**On Linux/Mac:**
```bash
chmod +x scripts/build-and-push.sh
./scripts/build-and-push.sh YOUR_DOCKERHUB_USERNAME
```

### Step 3: Deploy to EC2

1. **Connect to your EC2 instance:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-public-ip
   ```

2. **Clone the repository on EC2:**
   ```bash
   git clone https://github.com/Dilshan2002104-cpu/hospital-annual-report-generation-system-final-year-project.git
   cd hospital-annual-report-generation-system-final-year-project
   ```

3. **Run deployment script:**
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh YOUR_DOCKERHUB_USERNAME
   ```

## 📁 Docker Architecture

```
HMS Docker Setup
├── HMS/
│   └── Dockerfile              # Spring Boot backend
├── frontend/
│   ├── Dockerfile              # React frontend
│   └── nginx.conf              # Nginx configuration
├── docker-compose.yml          # Development environment
├── docker-compose.prod.yml     # Production environment
└── scripts/
    ├── build-and-push.sh       # Build and push script (Linux/Mac)
    ├── build-and-push.bat      # Build and push script (Windows)
    └── deploy.sh               # EC2 deployment script
```

## 🔧 Detailed Configuration

### Backend Dockerfile Features:
- **Multi-stage build** for optimized image size
- **Non-root user** for security
- **Health checks** for container monitoring
- **Environment-based configuration**

### Frontend Dockerfile Features:
- **Nginx** web server for production
- **Multi-stage build** with Node.js
- **Security headers** configured
- **API proxy** to backend
- **WebSocket support** for real-time features

### Docker Compose Features:
- **Health checks** for all services
- **Dependency management** between services
- **Volume persistence** for MySQL data
- **Network isolation** for security
- **Environment variable** support

## 🌐 Network Configuration

### Container Communication:
- **Frontend (Port 80)** → Public access
- **Backend (Port 8080)** → API and WebSocket endpoints
- **Database (Port 3306)** → Internal network only

### Nginx Proxy Configuration:
```nginx
# API requests proxy
location /api/ {
    proxy_pass http://backend:8080;
}

# WebSocket proxy for real-time features
location /ws/ {
    proxy_pass http://backend:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

## 🔒 Security Features

### Container Security:
- Non-root users in all containers
- Security headers in Nginx
- Firewall configuration on EC2
- Environment variable isolation

### Database Security:
- Secure passwords
- Internal network communication only
- Regular backup capabilities

## 📊 Monitoring & Management

### Health Checks:
All containers include health checks for monitoring:
```bash
# Check container health
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Monitor resources
docker stats
```

### Management Commands:
```bash
# Start system
docker-compose -f docker-compose.prod.yml up -d

# Stop system
docker-compose -f docker-compose.prod.yml down

# Restart system
docker-compose -f docker-compose.prod.yml restart

# Update system
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Backup database
./backup.sh
```

## 🔄 Update Process

### To update your application:

1. **Build and push new images:**
   ```bash
   ./scripts/build-and-push.sh YOUR_DOCKERHUB_USERNAME v2.0
   ```

2. **Deploy updates on EC2:**
   ```bash
   # Update environment file
   sed -i 's/IMAGE_TAG=.*/IMAGE_TAG=v2.0/' .env
   
   # Pull and deploy
   docker-compose -f docker-compose.prod.yml pull
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 💾 Backup & Recovery

### Automated Backup:
The deployment script creates a backup script that:
- Backs up MySQL database daily
- Compresses backups
- Retains 7 days of backups
- Can be scheduled with cron

### Manual Backup:
```bash
# Create immediate backup
./backup.sh

# Restore from backup
docker exec -i hms-database mysql -u root -p$MYSQL_ROOT_PASSWORD hms < backup_file.sql
```

## 🐛 Troubleshooting

### Common Issues:

1. **Port 80 already in use:**
   ```bash
   sudo lsof -i :80
   sudo systemctl stop apache2  # If Apache is running
   ```

2. **Docker permission denied:**
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker  # Or logout and login again
   ```

3. **Container won't start:**
   ```bash
   # Check logs
   docker-compose -f docker-compose.prod.yml logs SERVICE_NAME
   
   # Check container status
   docker-compose -f docker-compose.prod.yml ps
   ```

4. **Database connection issues:**
   ```bash
   # Check database container
   docker exec -it hms-database mysql -u root -p
   
   # Verify network connectivity
   docker-compose -f docker-compose.prod.yml exec backend ping database
   ```

## 📈 Performance Optimization

### For Production:
- Use **t3.medium** or larger EC2 instance for better performance
- Enable **CloudWatch** monitoring
- Set up **Application Load Balancer** for high availability
- Use **RDS** for managed database instead of containerized MySQL
- Implement **Redis** for session management and caching

## 🌍 Access Your Application

After successful deployment:
- **Frontend:** `http://YOUR_EC2_PUBLIC_IP`
- **Backend API:** `http://YOUR_EC2_PUBLIC_IP:8080`
- **Health Check:** `http://YOUR_EC2_PUBLIC_IP:8080/actuator/health`

## 📞 Support

If you encounter issues:
1. Check the logs: `docker-compose -f docker-compose.prod.yml logs`
2. Verify container status: `docker-compose -f docker-compose.prod.yml ps`
3. Check system resources: `docker stats`
4. Review the troubleshooting section above

---

**🎉 Congratulations!** Your Hospital Management System is now containerized and deployed on AWS EC2!