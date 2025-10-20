# Domain Setup Guide for HMS System

## Option 1: Free Subdomain with Cloudflare

### Step 1: Get a Free Domain
1. Go to https://www.freenom.com or use Cloudflare's free tier
2. Register a free domain like: `yourhms.tk`, `yourhms.ml`, `yourhms.ga`
3. Or use a service like DuckDNS for `yourhms.duckdns.org`

### Step 2: Configure DNS Records
Point your domain to your EC2 IP: `13.53.135.196`

**A Record:**
```
Type: A
Name: @ (or your subdomain)
Value: 13.53.135.196
TTL: Auto or 300
```

**CNAME Record (optional for www):**
```
Type: CNAME
Name: www
Value: yourdomain.com
TTL: Auto or 300
```

### Step 3: Update Frontend Configuration
Update API configuration to use domain instead of IP

### Step 4: SSL Certificate (Let's Encrypt)
Set up HTTPS using Let's Encrypt on your server

## Option 2: Custom Domain Purchase

### Recommended Providers:
- Namecheap ($8-15/year)
- Cloudflare ($8-10/year)
- Google Domains ($12/year)
- GoDaddy ($10-20/year)

### Domain Suggestions for HMS:
- myhospitalms.com
- yourhospitalhms.com
- medicalhms.net
- hospitalcare-system.com
- healthmanagement-pro.com

## Quick Setup with DuckDNS (Easiest)

1. Visit: https://www.duckdns.org
2. Sign in with Google/GitHub
3. Create subdomain: `yourhms.duckdns.org`
4. Point to IP: `13.53.135.196`
5. Update your system configuration