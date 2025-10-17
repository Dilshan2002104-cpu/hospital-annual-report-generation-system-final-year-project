# 🚀 Quick AWS Deployment Reference

## ✅ Yes, You Can Deploy on AWS Free Tier!

Your HMS can run on AWS Free Tier with these services:
- **EC2 t2.micro** (750 hours/month) - Application Server
- **RDS db.t2.micro** (750 hours/month) - MySQL Database
- **30 GB Storage** - Free
- **15 GB Data Transfer** - Free per month

---

## 📊 Resource Requirements

### Your Application Needs:
- **CPU:** 1 vCPU (t2.micro provides this)
- **RAM:** 1 GB (t2.micro provides this)
- **Storage:** ~20 GB for OS + Application
- **Database:** MySQL 8.0

### What Fits in Free Tier:
✅ Single EC2 t2.micro instance  
✅ RDS MySQL db.t2.micro  
✅ 30 GB storage  
✅ Elastic IP (free when attached)  
⚠️ Load Balancer (NOT free - skip it)  

---

## 🎯 Recommended Setup

### **Option 1: All-in-One (Simplest)**
```
Single EC2 t2.micro Instance
├── Frontend (React via Nginx)
├── Backend (Spring Boot)
└── MySQL (Local)
```
**Cost:** FREE for 12 months
**Good for:** Development, Testing, Small deployments

### **Option 2: Separated Database (Better)**
```
EC2 t2.micro (App) + RDS db.t2.micro (MySQL)
```
**Cost:** FREE for 12 months
**Good for:** Production, Better backups

---

## ⚡ Quick Deployment Steps

### 1. **Launch EC2**
```
Instance Type: t2.micro (Ubuntu 22.04)
Storage: 30 GB
Security: Allow ports 22, 80, 443, 8080
```

### 2. **Connect & Deploy**
```bash
ssh -i your-key.pem ubuntu@YOUR_IP
wget https://raw.githubusercontent.com/Dilshan2002104-cpu/hospital-annual-report-generation-system-final-year-project/main/deploy-aws.sh
chmod +x deploy-aws.sh
./deploy-aws.sh
```

### 3. **Access Application**
```
http://YOUR_ELASTIC_IP
```

---

## 💰 Cost After Free Tier (12 months)

| Service | Monthly Cost |
|---------|--------------|
| EC2 t2.micro | $8-10 |
| RDS db.t2.micro | $15-20 |
| Storage (30GB) | $3 |
| Data Transfer | $0-5 |
| **Total** | **$26-38/month** |

---

## 🔧 Performance Optimization for t2.micro

### **Backend (Spring Boot):**
```properties
# Reduce memory usage
server.tomcat.max-threads=50
spring.jpa.show-sql=false
logging.level.root=WARN
```

```bash
# Java JVM settings
-Xmx512m -Xms256m
```

### **Frontend (React):**
```bash
# Production build (smaller size)
npm run build
# Gzip compression in Nginx
gzip on;
```

### **Database:**
```sql
-- Optimize queries
-- Add indexes
CREATE INDEX idx_patient_id ON admissions(patient_id);
CREATE INDEX idx_ward_id ON admissions(ward_id);
```

---

## 🛡️ Security Checklist

- [ ] Change default passwords
- [ ] Setup SSL with Let's Encrypt
- [ ] Enable UFW firewall
- [ ] Restrict SSH to your IP
- [ ] Use strong database passwords
- [ ] Enable MySQL secure installation
- [ ] Setup regular backups
- [ ] Enable CloudWatch monitoring
- [ ] Keep system updated

---

## 🔄 Deployment Workflow

```mermaid
Local Development → Git Push → EC2 Pull → Build → Deploy → Test
```

### Update Application:
```bash
cd /opt/hms/hospital-annual-report-generation-system-final-year-project
git pull
cd HMS && mvn clean package -DskipTests
cd ../frontend && npm run build
sudo systemctl restart hms-backend nginx
```

---

## 📱 Access Points

After deployment:
- **Frontend:** `http://YOUR_IP`
- **Backend API:** `http://YOUR_IP/api`
- **Health Check:** `http://YOUR_IP/api/actuator/health`
- **Database:** Internal only (not exposed)

---

## 🐛 Common Issues

### **Issue 1: Out of Memory**
```bash
# Solution: Reduce Java heap
Environment="JAVA_OPTS=-Xmx400m -Xms200m"
```

### **Issue 2: Slow Performance**
```bash
# Solution: Add swap memory
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### **Issue 3: Database Connection Failed**
```bash
# Check MySQL status
sudo systemctl status mysql
# Reset MySQL password
sudo mysql_secure_installation
```

---

## 📊 Monitoring Commands

```bash
# Check backend logs
sudo journalctl -u hms-backend -f

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log

# Check system resources
htop
df -h
free -m

# Check service status
sudo systemctl status hms-backend nginx mysql
```

---

## 🎓 Alternative: AWS Lightsail

If EC2 seems complex, try **AWS Lightsail**:
- Simpler interface
- Fixed pricing: $3.50/month (512 MB RAM)
- Includes everything (compute, storage, transfer)
- One-click setup

**Note:** Not in Free Tier, but very affordable!

---

## 📚 Files Created

1. **AWS_DEPLOYMENT_GUIDE.md** - Complete step-by-step guide
2. **deploy-aws.sh** - Automated deployment script
3. **QUICK_REFERENCE.md** - This file

---

## ✅ Summary

**Can you deploy on AWS Free Tier?** 
### YES! ✅

**Best approach for Free Tier:**
- EC2 t2.micro (Ubuntu) + Local MySQL = FREE
- Or EC2 t2.micro + RDS db.t2.micro = FREE

**Performance:**
- Suitable for development/testing
- Can handle 10-50 concurrent users
- May be slow with heavy traffic
- Good for final year project demo

**After 12 months:**
- Costs ~$26-38/month
- Or upgrade to t3.small (~$15/month) for better performance

---

## 🎉 Ready to Deploy?

Follow the **AWS_DEPLOYMENT_GUIDE.md** for detailed instructions!

**Questions?** Check the troubleshooting section in the main guide.
