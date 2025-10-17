# 🚀 AWS Deployment Guide - Hospital Management System

## Prerequisites
- AWS Account with Free Tier
- Domain name (optional but recommended)
- Basic Linux/Terminal knowledge

---

## 📦 Deployment Architecture

### **Option 1: Single EC2 Instance (Free Tier Recommended)**
```
EC2 (t2.micro) - Ubuntu 22.04
├── Nginx (Reverse Proxy + Frontend)
├── Java 24 + Spring Boot Backend (:8080)
└── MySQL (Local) or RDS MySQL
```

**Pros:** Simple, uses 1 EC2 instance, easy to manage  
**Cons:** Single point of failure, limited scalability

### **Option 2: EC2 + RDS (Better for Production)**
```
EC2 (t2.micro) - Application Server
└── RDS MySQL (db.t2.micro) - Database
```

**Pros:** Separate database, better backups, more secure  
**Cons:** Uses both EC2 and RDS free tier hours

---

## 🛠️ Deployment Steps

### **STEP 1: Launch EC2 Instance**

1. **Login to AWS Console**
   - Go to [AWS Console](https://console.aws.amazon.com)
   - Navigate to EC2 Dashboard

2. **Launch Instance**
   - Click "Launch Instance"
   - **Name:** `HMS-Production-Server`
   - **AMI:** Ubuntu Server 22.04 LTS (Free tier eligible)
   - **Instance Type:** `t2.micro` (1 vCPU, 1GB RAM)
   - **Key Pair:** Create new or use existing (SAVE THE .pem FILE!)
   - **Network Settings:**
     - Allow SSH (Port 22) from your IP
     - Allow HTTP (Port 80) from anywhere (0.0.0.0/0)
     - Allow HTTPS (Port 443) from anywhere (0.0.0.0/0)
     - Allow Custom TCP (Port 8080) from anywhere (for backend testing)
   - **Storage:** 30 GB (Free tier allows up to 30GB)
   - Click "Launch Instance"

3. **Allocate Elastic IP**
   - Go to "Elastic IPs" in EC2 Dashboard
   - Click "Allocate Elastic IP address"
   - Associate it with your EC2 instance
   - **Note:** Keep this IP, you'll need it for DNS

---

### **STEP 2: Connect to EC2 Instance**

**Windows (PowerShell):**
```powershell
# Set permissions on your key file
icacls "C:\path\to\your-key.pem" /inheritance:r
icacls "C:\path\to\your-key.pem" /grant:r "%username%:R"

# Connect via SSH
ssh -i "C:\path\to\your-key.pem" ubuntu@YOUR_ELASTIC_IP
```

**Linux/Mac:**
```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@YOUR_ELASTIC_IP
```

---

### **STEP 3: Install Required Software**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 24 (OpenJDK)
sudo apt install -y openjdk-21-jdk  # Java 24 might not be available, use 21
java -version

# Install Maven
sudo apt install -y maven
mvn -version

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v

# Install Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install MySQL (if not using RDS)
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Install Git
sudo apt install -y git
```

---

### **STEP 4: Setup MySQL Database**

#### **Option A: Local MySQL on EC2**

```bash
# Login to MySQL
sudo mysql

# Create database and user
CREATE DATABASE hms;
CREATE USER 'hmsuser'@'localhost' IDENTIFIED BY 'SecurePassword123!';
GRANT ALL PRIVILEGES ON hms.* TO 'hmsuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Test connection
mysql -u hmsuser -p hms
```

#### **Option B: AWS RDS MySQL (Recommended)**

1. **Create RDS Instance:**
   - Go to RDS Dashboard
   - Click "Create database"
   - **Engine:** MySQL 8.0
   - **Template:** Free tier
   - **DB Instance:** db.t2.micro or db.t3.micro
   - **Storage:** 20 GB (Free tier limit)
   - **DB Instance Identifier:** `hms-database`
   - **Master username:** `admin`
   - **Master password:** `SecurePassword123!`
   - **VPC:** Same as EC2
   - **Public access:** No
   - **Security Group:** Allow MySQL (3306) from EC2 security group
   - Click "Create database"

2. **Note the Endpoint:**
   - Example: `hms-database.xxxxxxxxxxxx.us-east-1.rds.amazonaws.com`

---

### **STEP 5: Clone and Build Backend**

```bash
# Create application directory
sudo mkdir -p /opt/hms
sudo chown ubuntu:ubuntu /opt/hms
cd /opt/hms

# Clone repository
git clone https://github.com/Dilshan2002104-cpu/hospital-annual-report-generation-system-final-year-project.git
cd hospital-annual-report-generation-system-final-year-project

# Update application.properties
cd HMS/src/main/resources
nano application.properties
```

**Update application.properties:**
```properties
spring.application.name=HMS

# For RDS MySQL
spring.datasource.url=jdbc:mysql://YOUR_RDS_ENDPOINT:3306/hms
spring.datasource.username=admin
spring.datasource.password=SecurePassword123!

# For Local MySQL
# spring.datasource.url=jdbc:mysql://localhost:3306/hms
# spring.datasource.username=hmsuser
# spring.datasource.password=SecurePassword123!

spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
server.port=8080

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Production settings
server.address=0.0.0.0
logging.level.root=INFO
```

**Build Backend:**
```bash
cd /opt/hms/hospital-annual-report-generation-system-final-year-project/HMS
mvn clean package -DskipTests

# The JAR file will be in target/HMS-0.0.1-SNAPSHOT.jar
```

---

### **STEP 6: Build Frontend**

```bash
cd /opt/hms/hospital-annual-report-generation-system-final-year-project/frontend

# Update API endpoint
nano src/main.jsx  # or wherever API base URL is configured
```

**Update API URL:**
```javascript
// Change from localhost to your domain or Elastic IP
const API_BASE_URL = 'http://YOUR_ELASTIC_IP:8080';
// Or if using domain: http://yourdomain.com/api
```

**Build Frontend:**
```bash
npm install
npm run build

# Build output will be in dist/ folder
```

---

### **STEP 7: Configure Nginx**

```bash
sudo nano /etc/nginx/sites-available/hms
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name YOUR_ELASTIC_IP;  # or your domain name

    # Frontend (React build)
    root /opt/hms/hospital-annual-report-generation-system-final-year-project/frontend/dist;
    index index.html;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:8080/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

**Enable Site:**
```bash
sudo ln -s /etc/nginx/sites-available/hms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### **STEP 8: Create Systemd Service for Backend**

```bash
sudo nano /etc/systemd/system/hms-backend.service
```

**Service Configuration:**
```ini
[Unit]
Description=Hospital Management System Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/hms/hospital-annual-report-generation-system-final-year-project/HMS
ExecStart=/usr/bin/java -jar target/HMS-0.0.1-SNAPSHOT.jar
Restart=always
RestartSec=10
StandardOutput=append:/var/log/hms-backend.log
StandardError=append:/var/log/hms-backend-error.log

Environment="JAVA_OPTS=-Xmx512m -Xms256m"

[Install]
WantedBy=multi-user.target
```

**Start Backend Service:**
```bash
sudo systemctl daemon-reload
sudo systemctl start hms-backend
sudo systemctl enable hms-backend
sudo systemctl status hms-backend

# View logs
sudo journalctl -u hms-backend -f
```

---

### **STEP 9: Configure Firewall**

```bash
# Allow required ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Check status
sudo ufw status
```

---

### **STEP 10: Test Deployment**

1. **Backend Health Check:**
```bash
curl http://localhost:8080/actuator/health
```

2. **Frontend Access:**
```
Open browser: http://YOUR_ELASTIC_IP
```

3. **Test Login:**
   - Try logging in with default credentials
   - Check all modules (Ward, Lab, Pharmacy)

---

## 🔒 Security Enhancements

### 1. **Setup HTTPS with SSL Certificate (Let's Encrypt)**

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (requires domain name)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl status certbot.timer
```

### 2. **Update Nginx for HTTPS:**
```bash
sudo nano /etc/nginx/sites-available/hms
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Rest of your configuration...
}
```

### 3. **Change Default Passwords**
- Update all default login credentials
- Use strong passwords
- Store credentials securely

### 4. **Enable MySQL Security**
```bash
sudo mysql_secure_installation
```

### 5. **Setup Backups**

**Database Backup Script:**
```bash
#!/bin/bash
# Save as /opt/hms/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/hms/backups"
mkdir -p $BACKUP_DIR

# Backup MySQL
mysqldump -u hmsuser -p'SecurePassword123!' hms > $BACKUP_DIR/hms_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "hms_*.sql" -mtime +7 -delete
```

**Setup Cron:**
```bash
crontab -e

# Add daily backup at 2 AM
0 2 * * * /opt/hms/backup.sh
```

---

## 📊 Monitoring

### **1. Check Backend Logs:**
```bash
sudo journalctl -u hms-backend -f
tail -f /var/log/hms-backend.log
```

### **2. Check Nginx Logs:**
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### **3. Monitor System Resources:**
```bash
# CPU and Memory
htop

# Disk usage
df -h

# Service status
sudo systemctl status hms-backend nginx mysql
```

### **4. Setup CloudWatch (Optional)**
- Install CloudWatch agent
- Monitor EC2 metrics
- Set up alarms for high CPU/Memory

---

## 🔄 Updating Application

### **Backend Update:**
```bash
cd /opt/hms/hospital-annual-report-generation-system-final-year-project
git pull origin main

cd HMS
mvn clean package -DskipTests

sudo systemctl restart hms-backend
```

### **Frontend Update:**
```bash
cd /opt/hms/hospital-annual-report-generation-system-final-year-project/frontend
git pull origin main

npm install
npm run build

sudo systemctl restart nginx
```

---

## 💰 Cost Estimation

### **Free Tier (First 12 Months):**
- EC2 t2.micro: **FREE** (750 hours/month)
- RDS db.t2.micro: **FREE** (750 hours/month)
- 30GB EBS: **FREE**
- Elastic IP: **FREE** (when attached)
- Data Transfer: 15GB out **FREE**

### **After Free Tier:**
- EC2 t2.micro: ~$8-10/month
- RDS db.t2.micro: ~$15-20/month
- Storage: ~$3/month (30GB)
- **Total: ~$26-33/month**

### **Cost Optimization Tips:**
1. Stop instances when not in use (development)
2. Use reserved instances for 1-3 year commitment (up to 75% savings)
3. Enable automatic backups only when needed
4. Monitor usage with AWS Cost Explorer

---

## 🐛 Troubleshooting

### **Backend Won't Start:**
```bash
# Check logs
sudo journalctl -u hms-backend -n 50

# Check if port 8080 is available
sudo netstat -tulpn | grep 8080

# Check Java version
java -version

# Restart service
sudo systemctl restart hms-backend
```

### **Database Connection Error:**
```bash
# Test MySQL connection
mysql -u hmsuser -p hms

# Check if MySQL is running
sudo systemctl status mysql

# For RDS, check security group rules
```

### **Nginx 502 Bad Gateway:**
```bash
# Check backend is running
curl http://localhost:8080/actuator/health

# Check Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### **Out of Memory:**
```bash
# Check memory usage
free -h

# Reduce Java heap size in systemd service
Environment="JAVA_OPTS=-Xmx400m -Xms200m"

sudo systemctl daemon-reload
sudo systemctl restart hms-backend
```

---

## 📚 Additional Resources

- [AWS Free Tier](https://aws.amazon.com/free/)
- [Spring Boot Production Guide](https://docs.spring.io/spring-boot/docs/current/reference/html/deployment.html)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

## ✅ Deployment Checklist

- [ ] EC2 instance launched and running
- [ ] Elastic IP allocated and associated
- [ ] Security groups configured
- [ ] Software installed (Java, Node, Nginx, MySQL)
- [ ] Database created and configured
- [ ] Repository cloned
- [ ] Backend built and running
- [ ] Frontend built and deployed
- [ ] Nginx configured and running
- [ ] Systemd service created
- [ ] Firewall configured
- [ ] SSL certificate installed (optional)
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Application tested and working

---

## 🎉 Success!

Your Hospital Management System is now deployed on AWS!

**Access:** `http://YOUR_ELASTIC_IP` or `https://yourdomain.com`

---

**Need Help?**
- Check logs: `sudo journalctl -u hms-backend -f`
- AWS Support: [AWS Support Center](https://console.aws.amazon.com/support/)
- Stack Overflow: [Tag your questions with `aws`, `spring-boot`, `react`]
