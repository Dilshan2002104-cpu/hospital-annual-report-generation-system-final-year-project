#!/bin/bash

# Hospital Management System - AWS Deployment Script
# This script automates the deployment process on Ubuntu EC2 instance

set -e  # Exit on error

echo "=========================================="
echo "HMS Deployment Script for AWS EC2"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as ubuntu user
if [ "$USER" != "ubuntu" ]; then
    echo -e "${RED}Please run this script as ubuntu user${NC}"
    exit 1
fi

# Get configuration
echo -e "${YELLOW}Please provide the following information:${NC}"
read -p "MySQL Username [hmsuser]: " DB_USER
DB_USER=${DB_USER:-hmsuser}

read -sp "MySQL Password: " DB_PASS
echo ""

read -p "Database Name [hms]: " DB_NAME
DB_NAME=${DB_NAME:-hms}

read -p "Your Domain or Elastic IP: " SERVER_NAME

echo ""
echo -e "${GREEN}Starting deployment...${NC}"
echo ""

# Update system
echo -e "${YELLOW}[1/10] Updating system...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Java
echo -e "${YELLOW}[2/10] Installing Java 21...${NC}"
sudo apt install -y openjdk-21-jdk
java -version

# Install Maven
echo -e "${YELLOW}[3/10] Installing Maven...${NC}"
sudo apt install -y maven
mvn -version

# Install Node.js
echo -e "${YELLOW}[4/10] Installing Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v

# Install Nginx
echo -e "${YELLOW}[5/10] Installing Nginx...${NC}"
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install MySQL
echo -e "${YELLOW}[6/10] Installing MySQL...${NC}"
sudo apt install -y mysql-server

# Configure MySQL
echo -e "${YELLOW}[7/10] Configuring MySQL...${NC}"
sudo mysql <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF

echo -e "${GREEN}MySQL configured successfully${NC}"

# Create application directory
echo -e "${YELLOW}[8/10] Setting up application directory...${NC}"
sudo mkdir -p /opt/hms
sudo chown ubuntu:ubuntu /opt/hms
cd /opt/hms

# Clone repository
echo -e "${YELLOW}[9/10] Cloning repository...${NC}"
if [ -d "hospital-annual-report-generation-system-final-year-project" ]; then
    echo "Repository already exists, pulling latest changes..."
    cd hospital-annual-report-generation-system-final-year-project
    git pull
else
    git clone https://github.com/Dilshan2002104-cpu/hospital-annual-report-generation-system-final-year-project.git
    cd hospital-annual-report-generation-system-final-year-project
fi

# Update application.properties
echo -e "${YELLOW}[10/10] Configuring application...${NC}"
cat > HMS/src/main/resources/application.properties <<EOF
spring.application.name=HMS
spring.datasource.url=jdbc:mysql://localhost:3306/$DB_NAME
spring.datasource.username=$DB_USER
spring.datasource.password=$DB_PASS
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
server.port=8080
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
server.address=0.0.0.0
logging.level.root=INFO
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
EOF

# Build Backend
echo -e "${YELLOW}Building Backend...${NC}"
cd HMS
mvn clean package -DskipTests
cd ..

# Build Frontend
echo -e "${YELLOW}Building Frontend...${NC}"
cd frontend
npm install
npm run build
cd ..

# Configure Nginx
echo -e "${YELLOW}Configuring Nginx...${NC}"
sudo tee /etc/nginx/sites-available/hms > /dev/null <<EOF
server {
    listen 80;
    server_name $SERVER_NAME;

    root /opt/hms/hospital-annual-report-generation-system-final-year-project/frontend/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /ws {
        proxy_pass http://localhost:8080/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/hms /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Create systemd service
echo -e "${YELLOW}Creating Backend Service...${NC}"
sudo tee /etc/systemd/system/hms-backend.service > /dev/null <<EOF
[Unit]
Description=Hospital Management System Backend
After=network.target mysql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/hms/hospital-annual-report-generation-system-final-year-project/HMS
ExecStart=/usr/bin/java -Xmx512m -Xms256m -jar target/HMS-0.0.1-SNAPSHOT.jar
Restart=always
RestartSec=10
StandardOutput=append:/var/log/hms-backend.log
StandardError=append:/var/log/hms-backend-error.log

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl start hms-backend
sudo systemctl enable hms-backend

# Configure firewall
echo -e "${YELLOW}Configuring Firewall...${NC}"
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
echo "y" | sudo ufw enable

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend to start...${NC}"
sleep 10

# Check status
echo ""
echo "=========================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "=========================================="
echo ""
echo "Services Status:"
sudo systemctl status hms-backend --no-pager -l
echo ""
echo "Access your application at: http://$SERVER_NAME"
echo ""
echo "Useful Commands:"
echo "  - View backend logs: sudo journalctl -u hms-backend -f"
echo "  - Restart backend: sudo systemctl restart hms-backend"
echo "  - Restart nginx: sudo systemctl restart nginx"
echo "  - Check backend health: curl http://localhost:8080/actuator/health"
echo ""
echo -e "${GREEN}Deployment successful!${NC}"
