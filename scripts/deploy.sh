#!/bin/bash

# HMS EC2 Deployment Script
# This script deploys the HMS system on AWS EC2 Ubuntu server

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCKERHUB_USERNAME="${1:-your-dockerhub-username}"
IMAGE_TAG="${2:-latest}"
ENV_FILE=".env"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

check_requirements() {
    log_step "Checking system requirements..."
    
    # Check if running on Ubuntu
    if ! grep -q "Ubuntu" /etc/os-release; then
        log_warning "This script is designed for Ubuntu. Proceed with caution."
    fi
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_info "Docker not found. Installing Docker..."
        install_docker
    else
        log_info "Docker is already installed"
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        log_info "Docker Compose not found. Installing Docker Compose..."
        install_docker_compose
    else
        log_info "Docker Compose is already installed"
    fi
}

install_docker() {
    log_info "Installing Docker..."
    
    # Update package index
    sudo apt-get update
    
    # Install packages to allow apt to use a repository over HTTPS
    sudo apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Set up the stable repository
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker Engine
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
    
    # Add current user to docker group
    sudo usermod -aG docker $USER
    
    # Start and enable Docker
    sudo systemctl start docker
    sudo systemctl enable docker
    
    log_info "Docker installed successfully"
}

install_docker_compose() {
    log_info "Installing Docker Compose..."
    
    # Download Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    
    # Make it executable
    sudo chmod +x /usr/local/bin/docker-compose
    
    log_info "Docker Compose installed successfully"
}

setup_environment() {
    log_step "Setting up environment variables..."
    
    if [ ! -f "$ENV_FILE" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example $ENV_FILE
            log_info "Created .env file from .env.example"
        else
            create_env_file
        fi
        
        log_warning "Please edit $ENV_FILE with your actual values before continuing"
        echo "Press Enter after editing the file..."
        read
    fi
    
    # Update .env file with provided parameters
    if [ "$DOCKERHUB_USERNAME" != "your-dockerhub-username" ]; then
        sed -i "s/DOCKERHUB_USERNAME=.*/DOCKERHUB_USERNAME=$DOCKERHUB_USERNAME/" $ENV_FILE
        sed -i "s/IMAGE_TAG=.*/IMAGE_TAG=$IMAGE_TAG/" $ENV_FILE
    fi
}

create_env_file() {
    log_info "Creating environment file..."
    cat > $ENV_FILE << EOF
# DockerHub Configuration
DOCKERHUB_USERNAME=$DOCKERHUB_USERNAME
IMAGE_TAG=$IMAGE_TAG

# Database Configuration
MYSQL_ROOT_PASSWORD=SecureRootPassword123!
MYSQL_USER=hmsuser
MYSQL_PASSWORD=SecurePassword123!

# Application Configuration
SPRING_PROFILES_ACTIVE=docker
SERVER_PORT=8080
EOF
}

setup_firewall() {
    log_step "Configuring firewall..."
    
    # Check if ufw is installed and active
    if command -v ufw &> /dev/null; then
        # Allow SSH (important!)
        sudo ufw allow ssh
        
        # Allow HTTP and HTTPS
        sudo ufw allow 80/tcp
        sudo ufw allow 443/tcp
        
        # Allow application ports
        sudo ufw allow 8080/tcp
        
        # Enable firewall if not already enabled
        if ! sudo ufw status | grep -q "Status: active"; then
            echo "y" | sudo ufw enable
        fi
        
        log_info "Firewall configured successfully"
    else
        log_warning "UFW firewall not found. Please configure firewall manually."
    fi
}

pull_and_deploy() {
    log_step "Pulling Docker images and deploying..."
    
    # Pull the latest images
    docker-compose -f docker-compose.prod.yml pull
    
    # Stop any existing containers
    docker-compose -f docker-compose.prod.yml down --remove-orphans
    
    # Start the services
    docker-compose -f docker-compose.prod.yml up -d
    
    log_info "Deployment started successfully"
}

check_deployment() {
    log_step "Checking deployment status..."
    
    # Wait a moment for services to start
    sleep 10
    
    # Check if containers are running
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        log_info "Containers are running"
        
        # Get the public IP
        PUBLIC_IP=$(curl -s http://checkip.amazonaws.com || echo "Unable to get public IP")
        
        echo ""
        echo "🎉 Deployment completed successfully!"
        echo ""
        echo "Access your HMS system at:"
        echo "  http://$PUBLIC_IP (Frontend)"
        echo "  http://$PUBLIC_IP:8080 (Backend API)"
        echo ""
        echo "Container status:"
        docker-compose -f docker-compose.prod.yml ps
        
    else
        log_error "Some containers failed to start"
        echo "Container status:"
        docker-compose -f docker-compose.prod.yml ps
        echo ""
        echo "Logs:"
        docker-compose -f docker-compose.prod.yml logs --tail=50
        exit 1
    fi
}

create_backup_script() {
    log_step "Creating backup script..."
    
    cat > backup.sh << 'EOF'
#!/bin/bash
# HMS Database Backup Script

BACKUP_DIR="/opt/hms-backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="hms_backup_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create database backup
docker exec hms-database mysqldump -u root -p$MYSQL_ROOT_PASSWORD hms > $BACKUP_DIR/$BACKUP_FILE

# Compress the backup
gzip $BACKUP_DIR/$BACKUP_FILE

# Remove backups older than 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/$BACKUP_FILE.gz"
EOF

    chmod +x backup.sh
    log_info "Backup script created at ./backup.sh"
}

show_management_commands() {
    echo ""
    echo "📋 HMS Management Commands:"
    echo ""
    echo "  View logs:           docker-compose -f docker-compose.prod.yml logs -f"
    echo "  Stop system:         docker-compose -f docker-compose.prod.yml down"
    echo "  Start system:        docker-compose -f docker-compose.prod.yml up -d"
    echo "  Restart system:      docker-compose -f docker-compose.prod.yml restart"
    echo "  Update system:       docker-compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d"
    echo "  Backup database:     ./backup.sh"
    echo ""
    echo "  Container status:    docker-compose -f docker-compose.prod.yml ps"
    echo "  System resources:    docker stats"
    echo ""
}

# Main execution
main() {
    if [ "$DOCKERHUB_USERNAME" = "your-dockerhub-username" ]; then
        log_error "Please provide your DockerHub username as the first argument"
        echo "Usage: $0 <dockerhub-username> [image-tag]"
        exit 1
    fi
    
    log_info "Starting HMS deployment on EC2..."
    log_info "DockerHub Username: $DOCKERHUB_USERNAME"
    log_info "Image Tag: $IMAGE_TAG"
    
    check_requirements
    setup_environment
    setup_firewall
    pull_and_deploy
    check_deployment
    create_backup_script
    show_management_commands
}

main "$@"