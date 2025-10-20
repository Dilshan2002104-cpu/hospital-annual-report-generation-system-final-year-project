# HMS Domain Setup Script for Windows
# Usage: .\setup-domain.ps1 "yourdomain.com"

param(
    [Parameter(Mandatory=$true)]
    [string]$DomainName
)

Write-Host "Setting up HMS for domain: $DomainName" -ForegroundColor Green

# Update frontend environment
$envContent = @"
# Production Environment with Custom Domain
VITE_API_URL=https://$DomainName
VITE_WS_URL=wss://$DomainName
"@

$envContent | Out-File -FilePath "frontend\.env.production" -Encoding UTF8

# Update API configuration
$apiConfigPath = "frontend\src\config\api.js"

Write-Host "✅ Domain configuration created for: $DomainName" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Set up DNS: Point $DomainName to 13.53.135.196"
Write-Host "2. Update frontend API config if needed"
Write-Host "3. Rebuild frontend: docker build -t dilshan019/hms-frontend:latest ."
Write-Host "4. Push updated image: docker push dilshan019/hms-frontend:latest"
Write-Host "5. Deploy to server"
Write-Host "6. Set up SSL certificate (optional): Use Certbot/Let's Encrypt"

Write-Host ""
Write-Host "🦆 Quick option: Use DuckDNS for free subdomain:" -ForegroundColor Cyan
Write-Host "   1. Go to https://www.duckdns.org"
Write-Host "   2. Create subdomain: yourhms.duckdns.org"
Write-Host "   3. Point to IP: 13.53.135.196"
Write-Host "   4. Run: .\setup-domain.ps1 'yourhms.duckdns.org'"