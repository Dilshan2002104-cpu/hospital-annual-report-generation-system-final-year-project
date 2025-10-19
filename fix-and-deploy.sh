#!/bin/bash

# Production deployment script that fixes localhost URLs and rebuilds images

echo "🏥 HMS Production Deployment - Fixing localhost URLs"
echo "=================================================="

# Configuration
DOCKER_HUB_USER="dilshan019"
EC2_IP="16.171.66.213"

echo "🔧 Step 1: Fixing localhost URLs in source code..."

# Quick fix for the most critical files
echo "Fixing LoginForm.jsx..."
sed -i 's|http://localhost:8080|${API_BASE_URL}|g' frontend/src/Pages/LoginForm.jsx

echo "Fixing API configuration..."
# Create environment-aware API config
cat > frontend/src/config/api.js << 'EOF'
// Dynamic API configuration for production deployment
const getApiBaseUrl = () => {
  // In production, use the current host with port 8080
  if (typeof window !== 'undefined') {
    const currentHost = window.location.hostname;
    if (currentHost.match(/^\d+\.\d+\.\d+\.\d+/) || currentHost !== 'localhost') {
      return `http://${currentHost}:8080`;
    }
  }
  
  // Development fallback
  return 'http://localhost:8080';
};

export const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);
EOF

echo "🐳 Step 2: Rebuilding frontend Docker image..."

# Update frontend Dockerfile for production
cat > frontend/Dockerfile << 'EOF'
# Multi-stage build for React application
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build with production optimizations
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy nginx config and built app
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

# Install dependencies and setup
RUN apk add --no-cache wget && \
    chown -R nginx:nginx /usr/share/nginx/html

# Create startup script that replaces localhost URLs
RUN echo '#!/bin/sh' > /startup.sh && \
    echo 'echo "Configuring API URLs for production..."' >> /startup.sh && \
    echo 'find /usr/share/nginx/html -name "*.js" -type f -exec sed -i "s|http://localhost:8080|http://'"$EC2_IP"':8080|g" {} +' >> /startup.sh && \
    echo 'echo "Starting nginx..."' >> /startup.sh && \
    echo 'nginx -g "daemon off;"' >> /startup.sh && \
    chmod +x /startup.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

CMD ["/startup.sh"]
EOF

echo "🔨 Step 3: Building new frontend image..."
docker build -t ${DOCKER_HUB_USER}/hms-frontend:latest frontend/

echo "📦 Step 4: Pushing to Docker Hub..."
docker push ${DOCKER_HUB_USER}/hms-frontend:latest

echo "🚀 Step 5: Updating docker-compose for production..."
cat > docker-compose.ec2-fixed.yml << 'EOF'
services:
  database:
    image: mysql:8.0
    container_name: hms-database
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: hms
      MYSQL_USER: hmsuser
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-SecurePassword123!}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-RootPassword123!}
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - hms-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

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
      SERVER_PORT: 8080
      SERVER_ADDRESS: 0.0.0.0
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
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:80"]
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

echo "✅ Production build completed!"
echo ""
echo "Next steps for EC2 deployment:"
echo "1. Download the fixed configuration:"
echo "   wget https://raw.githubusercontent.com/Dilshan2002104-cpu/hospital-annual-report-generation-system-final-year-project/main/docker-compose.ec2-fixed.yml"
echo ""
echo "2. Deploy with fixed frontend:"
echo "   docker-compose -f docker-compose.ec2-fixed.yml down"
echo "   docker-compose -f docker-compose.ec2-fixed.yml pull"
echo "   docker-compose -f docker-compose.ec2-fixed.yml up -d"
echo ""
echo "3. Access your application:"
echo "   Frontend: http://${EC2_IP}"
echo "   Backend: http://${EC2_IP}:8080"