#!/bin/bash

# HMS Domain Setup Script
# Usage: ./setup-domain.sh yourdomain.com

if [ -z "$1" ]; then
    echo "Usage: $0 <domain-name>"
    echo "Example: $0 yourhms.duckdns.org"
    exit 1
fi

DOMAIN_NAME=$1
echo "Setting up HMS for domain: $DOMAIN_NAME"

# Update frontend environment
cat > frontend/.env.production << EOF
# Production Environment with Custom Domain
VITE_API_URL=https://$DOMAIN_NAME
VITE_WS_URL=wss://$DOMAIN_NAME
EOF

# Update Docker Compose for production
cat > docker-compose.domain.yml << EOF
version: '3.8'

services:
  # MySQL Database
  database:
    image: mysql:8.0
    container_name: hms-database
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: \${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: hms
      MYSQL_USER: \${MYSQL_USER}
      MYSQL_PASSWORD: \${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3307:3306"
    networks:
      - hms-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  # Spring Boot Backend
  backend:
    image: dilshan019/hms-backend:latest
    container_name: hms-backend
    restart: unless-stopped
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:mysql://database:3306/hms
      SPRING_DATASOURCE_USERNAME: \${MYSQL_USER}
      SPRING_DATASOURCE_PASSWORD: \${MYSQL_PASSWORD}
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
      SERVER_PORT: 8080
      SERVER_ADDRESS: 0.0.0.0
      # CORS configuration for domain
      CORS_ALLOWED_ORIGINS: https://$DOMAIN_NAME,http://$DOMAIN_NAME
    ports:
      - "8080:8080"
    depends_on:
      database:
        condition: service_healthy
    networks:
      - hms-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # React Frontend with Domain
  frontend:
    image: dilshan019/hms-frontend:latest
    container_name: hms-frontend
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"  # For SSL
    depends_on:
      - backend
    networks:
      - hms-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  mysql_data:
    driver: local

networks:
  hms-network:
    driver: bridge
EOF

echo "✅ Domain configuration created for: $DOMAIN_NAME"
echo ""
echo "Next steps:"
echo "1. Set up DNS: Point $DOMAIN_NAME to 13.53.135.196"
echo "2. Rebuild frontend: cd frontend && npm run build"
echo "3. Push updated image: docker build -t dilshan019/hms-frontend:latest . && docker push dilshan019/hms-frontend:latest"
echo "4. Deploy with: docker-compose -f docker-compose.domain.yml up -d"
echo "5. Set up SSL certificate (optional): Use Certbot/Let's Encrypt"