# 🚀 AWS EC2 Deployment Guide for Hospital Management System

This guide shows you how to deploy the Hospital Management System on AWS EC2 using Docker containers.

## 📋 Prerequisites

- AWS Account with EC2 access
- Basic knowledge of SSH and Linux commands
- Domain name (optional, for HTTPS setup)

## 🎯 Deployment Options

### Option 1: Use Pre-built Docker Hub Images (Fastest) ⚡
### Option 2: Deploy with Docker Compose (Build on EC2)
### Option 3: Manual Build on EC2

---

## ⚡ Option 1: Deploy Using Docker Hub Images (Fastest)

**Pre-built images available on Docker Hub:**
- Backend: `dilshan019/hms-backend:latest`
- Frontend: `dilshan019/hms-frontend:latest`

### Quick Deployment on EC2

```bash
# Connect to your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# Download and run the deployment script
wget https://raw.githubusercontent.com/Dilshan2002104-cpu/hospital-annual-report-generation-system-final-year-project/main/deploy-ec2-dockerhub.sh
chmod +x deploy-ec2-dockerhub.sh
./deploy-ec2-dockerhub.sh

# After logout/login for docker group:
./deploy-ec2-dockerhub.sh --continue
```

**Benefits:**
- ⚡ Fastest deployment (no build time)
- 📦 Pre-optimized images
- 🔄 Consistent deployment across environments
- 💾 Smaller EC2 storage requirements

---

## 🔧 Option 2: Complete Docker Deployment on EC2

### Step 1: Launch EC2 Instance

**Instance Specifications:**
- **Instance Type:** t3.medium (minimum) or t3.large (recommended)
- **AMI:** Ubuntu Server 22.04 LTS
- **Storage:** 20 GB GP3 (minimum)
- **Security Group:** Configure ports as shown below

**Security Group Configuration:**
```
Type            Protocol    Port Range    Source
SSH             TCP         22           Your IP
HTTP            TCP         80           0.0.0.0/0
HTTPS           TCP         443          0.0.0.0/0
MySQL/Aurora    TCP         3306         10.0.0.0/8 (internal only)
Custom TCP      TCP         8080         10.0.0.0/8 (internal only)
```

### Step 2: Connect to EC2 Instance

```bash
# Connect via SSH
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# Update system
sudo apt update && sudo apt upgrade -y
```

### Step 3: Install Docker and Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for docker group to take effect
logout
```

### Step 4: Deploy the Application

```bash
# SSH back in
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# Clone the repository
git clone https://github.com/Dilshan2002104-cpu/hospital-annual-report-generation-system-final-year-project.git
cd hospital-annual-report-generation-system-final-year-project

# Create production environment file
cat > .env << EOF
# Database Configuration
MYSQL_ROOT_PASSWORD=YourSecureRootPassword123!
MYSQL_PASSWORD=YourSecurePassword123!
MYSQL_USER=hmsuser
MYSQL_DATABASE=hms

# Backend Configuration
SPRING_DATASOURCE_URL=jdbc:mysql://database:3306/hms
SPRING_DATASOURCE_USERNAME=hmsuser
SPRING_DATASOURCE_PASSWORD=YourSecurePassword123!
SPRING_PROFILES_ACTIVE=production

# Server Configuration
SERVER_PORT=8080
LOGGING_LEVEL_ROOT=WARN
EOF

# Start the application
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs
```

### Step 5: Configure Domain and HTTPS (Optional)

```bash
# Install Certbot for Let's Encrypt SSL
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
sudo certbot certonly --standalone -d your-domain.com

# Update nginx configuration for HTTPS
# (See HTTPS configuration section below)
```

---

## 🏗️ Option 2: Using Pre-built Docker Images

If you have Docker images built elsewhere and pushed to a registry:

### Push Images to Docker Hub (from your local machine)

```powershell
# Build and tag images locally (after starting Docker Desktop)
docker-compose build

# Tag images for Docker Hub
docker tag hospital-annual-report-generation-system-final-year-project_backend yourusername/hms-backend:latest
docker tag hospital-annual-report-generation-system-final-year-project_frontend yourusername/hms-frontend:latest

# Push to Docker Hub
docker login
docker push yourusername/hms-backend:latest
docker push yourusername/hms-frontend:latest
```

### Deploy on EC2 using pre-built images

```bash
# On EC2 instance
# Create docker-compose-prod.yml
cat > docker-compose-prod.yml << EOF
version: '3.8'

services:
  database:
    image: mysql:8.0
    container_name: hms-database
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: hms
      MYSQL_USER: hmsuser
      MYSQL_PASSWORD: \${MYSQL_PASSWORD}
      MYSQL_ROOT_PASSWORD: \${MYSQL_ROOT_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - hms-network

  backend:
    image: yourusername/hms-backend:latest
    container_name: hms-backend
    restart: unless-stopped
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://database:3306/hms
      SPRING_DATASOURCE_USERNAME: hmsuser
      SPRING_DATASOURCE_PASSWORD: \${MYSQL_PASSWORD}
      SPRING_PROFILES_ACTIVE: production
    ports:
      - "8080:8080"
    depends_on:
      - database
    networks:
      - hms-network

  frontend:
    image: yourusername/hms-frontend:latest
    container_name: hms-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - hms-network

volumes:
  mysql_data:

networks:
  hms-network:
    driver: bridge
EOF

# Deploy
docker-compose -f docker-compose-prod.yml up -d
```

---

## 🔒 Production Security Configuration

### 1. Update Security Group (More Restrictive)

```
Type         Protocol    Port    Source                Description
SSH          TCP         22      Your IP only          SSH access
HTTP         TCP         80      0.0.0.0/0            Web traffic
HTTPS        TCP         443     0.0.0.0/0            Secure web traffic
```

### 2. Configure Firewall (UFW)

```bash
# Enable firewall
sudo ufw enable

# Allow necessary ports
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# Check status
sudo ufw status
```

### 3. HTTPS Configuration

Create an HTTPS-enabled nginx configuration:

```bash
# Create HTTPS nginx config
cat > frontend/nginx-https.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        # SSL certificates
        ssl_certificate /etc/ssl/certs/fullchain.pem;
        ssl_certificate_key /etc/ssl/private/privkey.pem;

        # SSL configuration
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Strict-Transport-Security "max-age=31536000" always;

        # Application routes
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API proxy
        location /api/ {
            proxy_pass http://backend:8080;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket proxy
        location /ws/ {
            proxy_pass http://backend:8080;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
EOF

# Update frontend Dockerfile to use HTTPS config
# (Copy SSL certificates into container or mount them)
```

---

## 📊 Monitoring and Maintenance

### Set up Log Rotation

```bash
# Configure Docker log rotation
sudo tee /etc/docker/daemon.json << EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

sudo systemctl restart docker
```

### Database Backup Script

```bash
# Create backup script
cat > backup-database.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="hms_backup_$DATE.sql"

mkdir -p $BACKUP_DIR

# Create database backup
docker-compose exec -T database mysqldump -u root -p$MYSQL_ROOT_PASSWORD hms > "$BACKUP_DIR/$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_DIR/$BACKUP_FILE"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "hms_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE.gz"
EOF

chmod +x backup-database.sh

# Set up daily backup cron job
crontab -e
# Add this line:
# 0 2 * * * /home/ubuntu/hospital-annual-report-generation-system-final-year-project/backup-database.sh
```

---

## 🚀 Deployment Commands Summary

### Quick EC2 Deployment (Copy-Paste Ready)

```bash
# 1. Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 2. Clone and deploy (after logout/login for docker group)
git clone https://github.com/Dilshan2002104-cpu/hospital-annual-report-generation-system-final-year-project.git
cd hospital-annual-report-generation-system-final-year-project

# 3. Set secure passwords
export MYSQL_ROOT_PASSWORD="$(openssl rand -base64 32)"
export MYSQL_PASSWORD="$(openssl rand -base64 32)"
echo "Root Password: $MYSQL_ROOT_PASSWORD" > passwords.txt
echo "HMS Password: $MYSQL_PASSWORD" >> passwords.txt

# 4. Deploy
docker-compose up -d

# 5. Check status
docker-compose ps && docker-compose logs --tail=50
```

---

## 🌐 Access Your Application

After deployment:
- **Application URL:** `http://your-ec2-public-ip` or `https://your-domain.com`
- **API Endpoint:** `http://your-ec2-public-ip:8080` (internal)
- **Login Credentials:**
  - Admin: admin / admin123
  - Doctor: doctor / doctor123
  - Nurse: nurse / nurse123

---

## 🔧 Troubleshooting

### Common Issues

1. **Docker not starting:**
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

2. **Port already in use:**
   ```bash
   sudo netstat -tulpn | grep :80
   sudo kill -9 <pid>
   ```

3. **Database connection issues:**
   ```bash
   docker-compose logs database
   docker-compose restart database
   ```

4. **Check application health:**
   ```bash
   curl -f http://localhost:8080/actuator/health
   curl -f http://localhost/health
   ```

### Performance Optimization

For production workloads:
- Use **t3.large** or **t3.xlarge** instances
- Enable **GP3** SSD with higher IOPS
- Set up **Application Load Balancer** for high availability
- Use **RDS MySQL** instead of containerized database
- Implement **CloudWatch** monitoring

---

## 💰 Cost Estimation

**Monthly costs (us-east-1):**
- **t3.medium:** ~$30/month
- **t3.large:** ~$60/month  
- **20 GB GP3 Storage:** ~$2/month
- **Data Transfer:** ~$5-15/month

**Total estimated cost:** $37-77/month depending on instance size and usage.

---

This deployment setup provides a production-ready Hospital Management System on AWS EC2 with Docker containers, SSL support, automated backups, and monitoring capabilities.