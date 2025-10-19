#!/bin/bash

# Hospital Management System - AWS EC2 Deployment Script (Using Pre-built Images)
# This script deploys HMS on Ubuntu EC2 using Docker Hub images

set -e

echo "🏥 Hospital Management System - EC2 Deployment (Docker Hub)"
echo "=========================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running as ubuntu user
if [ "$USER" != "ubuntu" ]; then
    print_error "Please run this script as ubuntu user on EC2 instance"
    exit 1
fi

print_header "Step 1: System Update"
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

print_header "Step 2: Docker Installation"
# Install Docker
print_status "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker ubuntu
    rm get-docker.sh
    print_status "Docker installed successfully"
else
    print_status "Docker already installed"
fi

# Install Docker Compose
print_status "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_status "Docker Compose installed successfully"
else
    print_status "Docker Compose already installed"
fi

# Check if we need to logout for docker group
if ! groups $USER | grep -q '\bdocker\b'; then
    print_warning "You need to logout and login again for Docker group to take effect"
    print_warning "After logging back in, run this script again with: ./deploy-ec2-dockerhub.sh --continue"
    exit 0
fi

# Continue flag check
if [[ "$1" == "--continue" ]] || groups $USER | grep -q '\bdocker\b'; then
    print_status "Continuing with deployment..."
else
    print_warning "Please logout and login again, then run: ./deploy-ec2-dockerhub.sh --continue"
    exit 0
fi

print_header "Step 3: Application Setup"

# Create application directory
APP_DIR="/home/ubuntu/hms-app"
mkdir -p $APP_DIR
cd $APP_DIR

# Download docker-compose file for EC2
print_status "Downloading EC2 docker-compose configuration..."
cat > docker-compose.yml << 'EOF'
services:
  # MySQL Database
  database:
    image: mysql:8.0
    container_name: hms-database
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: hms
      MYSQL_USER: hmsuser
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-SecurePassword123!}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-RootPassword123!}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - hms-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  # Backend Service (pre-built image from Docker Hub)
  backend:
    image: dilshan019/hms-backend:latest
    container_name: hms-backend
    restart: unless-stopped
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://database:3306/hms
      SPRING_DATASOURCE_USERNAME: hmsuser
      SPRING_DATASOURCE_PASSWORD: ${MYSQL_PASSWORD:-SecurePassword123!}
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
      SPRING_JPA_SHOW_SQL: false
      SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT: org.hibernate.dialect.MySQL8Dialect
      SERVER_PORT: 8080
      SERVER_ADDRESS: 0.0.0.0
      LOGGING_LEVEL_ROOT: WARN
      SPRING_PROFILES_ACTIVE: production
    ports:
      - "8080:8080"
    depends_on:
      database:
        condition: service_healthy
    networks:
      - hms-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s

  # Frontend Service (pre-built image from Docker Hub)
  frontend:
    image: dilshan019/hms-frontend:latest
    container_name: hms-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - hms-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:80/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

volumes:
  mysql_data:
    driver: local

networks:
  hms-network:
    driver: bridge
EOF

print_header "Step 4: Security Configuration"

# Generate secure passwords
print_status "Generating secure passwords..."
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)
MYSQL_PASSWORD=$(openssl rand -base64 32)

# Create environment file
cat > .env << EOF
# Generated on $(date)
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
MYSQL_PASSWORD=${MYSQL_PASSWORD}
EOF

# Save passwords to file
cat > passwords.txt << EOF
=== HMS Database Passwords ===
Generated: $(date)

MySQL Root Password: ${MYSQL_ROOT_PASSWORD}
HMS User Password: ${MYSQL_PASSWORD}

=== Application Login Credentials ===
Admin: admin / admin123
Doctor: doctor / doctor123
Nurse: nurse / nurse123

=== Docker Hub Images Used ===
Backend: dilshan019/hms-backend:latest
Frontend: dilshan019/hms-frontend:latest

IMPORTANT: Keep these passwords secure and change default application passwords after first login.
EOF

chmod 600 passwords.txt .env

print_status "Passwords saved to passwords.txt (readable only by you)"

print_header "Step 5: Docker Deployment"

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    print_error "Docker daemon is not running. Starting Docker..."
    sudo systemctl start docker
    sudo systemctl enable docker
    sleep 5
fi

# Pull images first (faster deployment)
print_status "Pulling Docker images from Docker Hub..."
docker pull dilshan019/hms-backend:latest
docker pull dilshan019/hms-frontend:latest
docker pull mysql:8.0

# Deploy the application
print_status "Deploying Hospital Management System..."
docker-compose up -d

# Wait for services to start
print_status "Waiting for services to start..."
sleep 45

print_header "Step 6: Health Check"

# Check service health
print_status "Checking service health..."
if docker-compose ps | grep -q "Up"; then
    print_status "✅ Services are running!"
    
    # Get EC2 public IP
    PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "your-ec2-ip")
    
    echo ""
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo "=================================="
    echo -e "${BLUE}Frontend URL:${NC} http://${PUBLIC_IP}"
    echo -e "${BLUE}Backend API:${NC} http://${PUBLIC_IP}:8080"
    echo ""
    echo -e "${YELLOW}Login Credentials:${NC}"
    echo "- Admin: admin / admin123"
    echo "- Doctor: doctor / doctor123"
    echo "- Nurse: nurse / nurse123"
    echo ""
    echo -e "${YELLOW}Docker Images Used:${NC}"
    echo "- Backend: dilshan019/hms-backend:latest"
    echo "- Frontend: dilshan019/hms-frontend:latest"
    echo ""
    echo -e "${BLUE}Database passwords:${NC} saved in passwords.txt"
    echo ""
    echo -e "${YELLOW}Useful commands:${NC}"
    echo "- View logs: docker-compose logs -f"
    echo "- Stop services: docker-compose down"
    echo "- Restart services: docker-compose restart"
    echo "- Check status: docker-compose ps"
    
else
    print_error "Some services failed to start. Check logs:"
    docker-compose logs
    exit 1
fi

print_header "Step 7: System Configuration"

# Set up log rotation
print_status "Configuring log rotation..."
sudo tee /etc/docker/daemon.json > /dev/null << EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

sudo systemctl restart docker
sleep 10
docker-compose up -d

# Create backup script
print_status "Creating database backup script..."
cat > backup-database.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="hms_backup_$DATE.sql"

mkdir -p $BACKUP_DIR

# Load environment variables
source .env

# Create database backup
docker-compose exec -T database mysqldump -u root -p$MYSQL_ROOT_PASSWORD hms > "$BACKUP_DIR/$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_DIR/$BACKUP_FILE"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "hms_backup_*.sql.gz" -mtime +7 -delete

echo "$(date): Backup completed: $BACKUP_FILE.gz"
EOF

chmod +x backup-database.sh

print_status "✅ HMS deployment completed successfully!"
echo ""
echo -e "${GREEN}🏥 Your Hospital Management System is now running on EC2!${NC}"
echo -e "${BLUE}Access URL:${NC} http://${PUBLIC_IP}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Configure your Security Group to allow HTTP (port 80) traffic"
echo "2. Change default application passwords after first login"
echo "3. Set up regular backups using: ./backup-database.sh"
echo "4. Consider setting up HTTPS with Let's Encrypt for production"
echo ""
echo -e "${BLUE}Support:${NC} Check the logs if you encounter any issues:"
echo "docker-compose logs -f"