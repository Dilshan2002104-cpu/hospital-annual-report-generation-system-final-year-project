#!/bin/bash

# Hospital Management System - AWS EC2 Deployment Script
# This script automates the deployment of HMS on Ubuntu EC2 instance

set -e

echo "🏥 Hospital Management System - EC2 Deployment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if running as ubuntu user
if [ "$USER" != "ubuntu" ]; then
    print_error "Please run this script as ubuntu user on EC2 instance"
    exit 1
fi

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

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
    print_warning "After logging back in, run this script again with: ./deploy-ec2.sh --continue"
    exit 0
fi

# Continue flag check
if [[ "$1" == "--continue" ]] || groups $USER | grep -q '\bdocker\b'; then
    print_status "Continuing with deployment..."
else
    print_warning "Please logout and login again, then run: ./deploy-ec2.sh --continue"
    exit 0
fi

# Clone repository if not exists
if [ ! -d "hospital-annual-report-generation-system-final-year-project" ]; then
    print_status "Cloning repository..."
    git clone https://github.com/Dilshan2002104-cpu/hospital-annual-report-generation-system-final-year-project.git
fi

cd hospital-annual-report-generation-system-final-year-project

# Generate secure passwords
print_status "Generating secure passwords..."
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)
MYSQL_PASSWORD=$(openssl rand -base64 32)

# Create environment file
print_status "Creating environment configuration..."
cat > .env << EOF
# Generated on $(date)
# Database Configuration
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
MYSQL_PASSWORD=${MYSQL_PASSWORD}
MYSQL_USER=hmsuser
MYSQL_DATABASE=hms

# Backend Configuration  
SPRING_DATASOURCE_URL=jdbc:mysql://database:3306/hms
SPRING_DATASOURCE_USERNAME=hmsuser
SPRING_DATASOURCE_PASSWORD=${MYSQL_PASSWORD}
SPRING_PROFILES_ACTIVE=production

# Server Configuration
SERVER_PORT=8080
LOGGING_LEVEL_ROOT=WARN
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

IMPORTANT: Keep these passwords secure and change default application passwords after first login.
EOF

chmod 600 passwords.txt

print_status "Passwords saved to passwords.txt (readable only by you)"

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    print_error "Docker daemon is not running. Starting Docker..."
    sudo systemctl start docker
    sudo systemctl enable docker
    sleep 5
fi

# Deploy the application
print_status "Deploying Hospital Management System..."
docker-compose up -d

# Wait for services to start
print_status "Waiting for services to start..."
sleep 30

# Check service health
print_status "Checking service health..."
if docker-compose ps | grep -q "Up"; then
    print_status "✅ Services are running!"
    
    # Get EC2 public IP
    PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "your-ec2-ip")
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "=================================="
    echo "Frontend URL: http://${PUBLIC_IP}"
    echo "Backend API: http://${PUBLIC_IP}:8080"
    echo ""
    echo "Login Credentials:"
    echo "- Admin: admin / admin123"
    echo "- Doctor: doctor / doctor123"
    echo "- Nurse: nurse / nurse123"
    echo ""
    echo "Database passwords are saved in: passwords.txt"
    echo ""
    echo "Useful commands:"
    echo "- View logs: docker-compose logs -f"
    echo "- Stop services: docker-compose down"
    echo "- Restart services: docker-compose restart"
    echo "- Check status: docker-compose ps"
    
else
    print_error "Some services failed to start. Check logs:"
    docker-compose logs
    exit 1
fi

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
print_warning "Remember to:"
print_warning "1. Change default application passwords after first login"
print_warning "2. Configure your security group to allow HTTP (port 80) traffic"
print_warning "3. Set up regular backups using the backup-database.sh script"
print_warning "4. Consider setting up HTTPS with Let's Encrypt for production use"