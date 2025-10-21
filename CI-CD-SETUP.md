# 🚀 HMS CI/CD Pipeline Setup Guide

## Overview
This comprehensive CI/CD pipeline provides automated building, testing, security scanning, and deployment for your Hospital Management System (HMS).

## 🏗️ Pipeline Architecture

### 📋 **Workflows Included:**

#### 1. **Main CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
**Triggers:** Push to `main`/`develop`, Pull Requests to `main`

**Features:**
- **Quality Gate**: Frontend (ESLint, TypeScript, Jest) + Backend (Maven compile/test)
- **Docker Builds**: Multi-architecture builds for both services
- **Automated Deployment**: Direct deployment to your EC2 server (13.53.135.196)
- **Health Verification**: Post-deployment checks at nindt.duckdns.org

#### 2. **Pull Request Checks** (`.github/workflows/pr-checks.yml`)
**Triggers:** Pull request creation/updates

**Features:**
- Quality gate validation before merge
- Automated PR comments with results
- Security dependency scanning
- Docker build verification

#### 3. **Security Scanning** (`.github/workflows/security-scan.yml`)
**Triggers:** Weekly schedule, Manual dispatch, Security file changes

**Features:**
- **Dependency Scanning**: npm audit + Maven dependency checks
- **Container Security**: Trivy vulnerability scanning
- **Static Analysis**: CodeQL for Java and JavaScript
- **Security Reporting**: Results in GitHub Security tab

#### 4. **Database Backup & Maintenance** (`.github/workflows/backup-maintenance.yml`)
**Triggers:** Daily at 2 AM UTC, Manual dispatch

**Features:**
- **Automated Backups**: Daily MySQL dumps with compression
- **Retention Policy**: 7-day backup retention
- **System Maintenance**: Docker cleanup, health checks
- **Status Monitoring**: Container and service verification

---

## ⚙️ **Setup Instructions**

### **Step 1: Repository Secrets**
Add these secrets in GitHub: `Settings > Secrets and variables > Actions`

#### **Required Secrets:**

1. **`DOCKERHUB_PASSWORD`**
   - Go to [Docker Hub](https://hub.docker.com/) → Account Settings → Security
   - Create new access token named "HMS-CI-CD"
   - Copy token and add as GitHub secret

2. **`EC2_SSH_KEY`**
   - Use your existing `Praveen.pem` private key content
   - Copy entire content (including BEGIN/END lines)
   - Add as GitHub secret

### **Step 2: Docker Hub Configuration**
Your pipeline is configured for:
- **Username**: `dilshan019` 
- **Images**: `hms-backend:latest` and `hms-frontend:latest`

### **Step 3: Server Configuration**
Pipeline deploys to your existing setup:
- **EC2 Server**: 13.53.135.196
- **Domain**: nindt.duckdns.org
- **Network**: hms-network (existing)
- **Database**: hms-database container

---

## 🔄 **Deployment Flow**

### **Automated Deployment (Main Branch)**
```
Code Push → Quality Tests → Docker Build → Push to Hub → Deploy to EC2 → Verify Health
```

### **Pull Request Flow**
```
PR Created → Quality Gate → Security Scan → Review → Manual Merge → Auto Deploy
```

---

## 📊 **Pipeline Features**

### ✅ **Quality Assurance**
- **Frontend**: ESLint linting, TypeScript checking, Jest tests, Vite builds
- **Backend**: Maven compilation, unit tests, Surefire reports
- **Docker**: Multi-stage optimized builds with caching

### 🔒 **Security & Compliance**
- **Weekly Security Scans**: Automated vulnerability assessment
- **Dependency Monitoring**: npm audit + Maven dependency analysis  
- **Container Security**: Trivy scanning for Docker images
- **Code Analysis**: GitHub CodeQL for static analysis

### 🗄️ **Data Protection**
- **Daily Backups**: Automated MySQL dumps at 2 AM UTC
- **Backup Retention**: 7-day retention policy with compression
- **Health Monitoring**: Continuous service availability checks

### 🚀 **Deployment Automation**
- **Zero-Downtime**: Rolling deployment with health verification
- **Multi-Architecture**: Support for amd64 and arm64 platforms
- **Auto-Rollback**: Health check failures prevent deployment completion

---

## 🎯 **Quick Start**

### **1. Push CI/CD Configuration**
```bash
git add .github/
git commit -m "feat: Add comprehensive CI/CD pipeline"
git push origin main
```

### **2. Configure Secrets**
- Add `DOCKERHUB_PASSWORD` and `EC2_SSH_KEY` in GitHub settings

### **3. Test Pipeline**
- Create a test pull request to verify PR checks
- Merge to main to trigger full deployment pipeline

### **4. Monitor Results**
- **GitHub Actions**: Check workflow status and logs
- **Live Application**: Verify deployment at nindt.duckdns.org
- **Security Tab**: Review security scan results

---

## 📈 **Monitoring Your CI/CD**

### **GitHub Actions Dashboard**
- **Main Pipeline**: Build status and deployment logs
- **PR Checks**: Quality gate results and feedback
- **Security Scans**: Vulnerability reports and CodeQL analysis
- **Backups**: Daily backup status and system health

### **Production Monitoring**
- **Application**: http://nindt.duckdns.org
- **API Health**: Backend health endpoint monitoring
- **Container Status**: Docker container health checks
- **Database**: Connection and backup verification

### **Security Monitoring** 
- **GitHub Security Tab**: Automated vulnerability tracking
- **Dependabot**: Automated dependency update PRs
- **Code Scanning**: Static analysis alerts

---

## 🛠️ **Manual Operations**

### **Trigger Manual Workflows**
```bash
# Manual deployment
gh workflow run "HMS CI/CD Pipeline"

# Manual backup  
gh workflow run "Database Backup & Maintenance"

# Manual security scan
gh workflow run "Security Scanning"
```

### **Emergency Procedures**

#### **Rollback Deployment**
```bash
# SSH to server
ssh -i Praveen.pem ubuntu@13.53.135.196

# Rollback to previous images
docker stop hms-frontend hms-backend
docker run -d --name hms-backend [previous-image-tag]
docker run -d --name hms-frontend [previous-image-tag]
```

#### **Manual Database Restore**
```bash
# Find backup
ls -la /home/ubuntu/hms-backups/

# Restore from backup
gunzip -c /home/ubuntu/hms-backups/hms_backup_YYYYMMDD_HHMMSS.sql.gz | \
docker exec -i hms-database mysql -u hmsuser -p'SecurePassword123!' hms
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Docker Hub Authentication**
   - Verify `DOCKERHUB_PASSWORD` secret is correct
   - Check Docker Hub token hasn't expired

2. **SSH Connection Failures**
   - Verify `EC2_SSH_KEY` contains complete private key
   - Check EC2 security group allows SSH from GitHub Actions IPs

3. **Deployment Failures**
   - Check EC2 disk space: `df -h`
   - Verify Docker network exists: `docker network ls`
   - Check container logs: `docker logs hms-backend`

4. **Health Check Failures**
   - Verify services are accessible on expected ports
   - Check nginx configuration for domain routing
   - Test database connectivity

### **Workflow Debugging**
- Check GitHub Actions logs for detailed error information
- Use workflow dispatch to manually trigger problematic workflows
- Review artifact uploads for test reports and security scans

---

## 🎉 **Success Indicators**

✅ **Green Checkmarks**: All workflows passing in GitHub Actions  
✅ **Live Application**: nindt.duckdns.org accessible and functional  
✅ **Docker Images**: Updated images on Docker Hub  
✅ **Security Clear**: No high-severity vulnerabilities  
✅ **Backups Current**: Daily backups completing successfully  

---

## 🚀 **Your HMS CI/CD is Ready!**

Your Hospital Management System now has enterprise-grade DevOps capabilities:

- **Automated Quality Assurance**: Every code change is tested
- **Security-First**: Continuous vulnerability monitoring  
- **Zero-Downtime Deployments**: Reliable production updates
- **Data Protection**: Automated backups and retention
- **Full Observability**: Comprehensive monitoring and alerting

**Ready to push your code and watch the magic happen!** ✨