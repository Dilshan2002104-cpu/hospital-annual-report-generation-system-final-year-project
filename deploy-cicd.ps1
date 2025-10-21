# HMS CI/CD Pipeline Setup Script (PowerShell)
# This script will deploy the CI/CD configuration to GitHub

Write-Host "HMS CI/CD Pipeline Setup" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (!(Test-Path "pom.xml") -and !(Test-Path "frontend\package.json")) {
    Write-Host "Error: Please run this script from the HMS project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "Current directory: $PWD" -ForegroundColor Yellow
Write-Host ""

# Check Git status
Write-Host "Checking repository status..." -ForegroundColor Yellow
git status --porcelain

Write-Host ""
Write-Host "CI/CD files to be deployed:" -ForegroundColor Green
Write-Host "- .github/workflows/ci-cd.yml (Main pipeline)" -ForegroundColor White
Write-Host "- .github/workflows/pr-checks.yml (PR validation)" -ForegroundColor White
Write-Host "- .github/workflows/security-scan.yml (Security scanning)" -ForegroundColor White
Write-Host "- .github/workflows/backup-maintenance.yml (Database backups)" -ForegroundColor White
Write-Host "- CI-CD-SETUP.md (Complete documentation)" -ForegroundColor White
Write-Host ""

# Confirm deployment
$confirm = Read-Host "Deploy CI/CD pipeline to GitHub? (y/N)"
if ($confirm -notmatch "^[Yy]$") {
    Write-Host "Deployment cancelled" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "Deploying CI/CD pipeline..." -ForegroundColor Yellow

# Add all CI/CD files
Write-Host "Adding workflow files..." -ForegroundColor Yellow
git add .github/workflows/
git add CI-CD-SETUP.md

# Commit the changes
Write-Host "Committing CI/CD configuration..." -ForegroundColor Yellow
git commit -m "feat: Add comprehensive CI/CD pipeline for HMS

- Main CI/CD pipeline with build, test, and deploy automation
- Pull request validation with automated quality gates
- Security scanning with Trivy, CodeQL, and dependency audits
- Daily database backups with 7-day retention
- Complete setup documentation and monitoring

Features:
- Multi-architecture Docker builds (amd64, arm64)
- Automated deployment to EC2 (13.53.135.196)
- Quality assurance for frontend and backend
- Security-first approach with continuous monitoring
- Production-ready with health checks and rollback capabilities

Ready for enterprise deployment! 🚀"

# Push to repository
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "CI/CD Pipeline Deployed Successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Configure GitHub Secrets:" -ForegroundColor White
Write-Host "   Go to: https://github.com/Dilshan2002104-cpu/hospital-annual-report-generation-system-final-year-project/settings/secrets/actions" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Add Required Secrets:" -ForegroundColor White
Write-Host "   - DOCKERHUB_PASSWORD: Your Docker Hub access token" -ForegroundColor Gray
Write-Host "   - EC2_SSH_KEY: Your EC2 private key (Praveen.pem content)" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test the Pipeline:" -ForegroundColor White
Write-Host "   - Create a test pull request" -ForegroundColor Gray
Write-Host "   - Merge to main to trigger deployment" -ForegroundColor Gray
Write-Host "   - Monitor at: https://github.com/Dilshan2002104-cpu/hospital-annual-report-generation-system-final-year-project/actions" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Live Application:" -ForegroundColor White
Write-Host "   - Production: http://nindt.duckdns.org" -ForegroundColor Gray
Write-Host "   - Docker Hub: https://hub.docker.com/u/dilshan019" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Complete setup guide: CI-CD-SETUP.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎉 Your HMS system now has enterprise-grade CI/CD capabilities!" -ForegroundColor Green