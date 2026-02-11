# 🚀 Server Deployment Guide

## Current Server Setup

- **Server IP**: 31.59.105.156
- **Backend Port**: 5050 (mapped to container 5001)
- **Frontend Port**: 80
- **Docker Compose**: ✅ Configured

## Quick Deploy (Recommended)

### Option 1: Using Deploy Script

```bash
# On your server
cd ~/bonbast-api

# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

This will:
1. Stop containers
2. Remove old frontend image
3. Build new frontend with updated UI
4. Start all containers
5. Show status and logs

### Option 2: Manual Deploy

```bash
# On your server
cd ~/bonbast-api

# Stop containers
sudo docker-compose down

# Remove old frontend image (force rebuild)
sudo docker rmi bonbast-api-frontend

# Build and start
sudo docker-compose build --no-cache frontend
sudo docker-compose up -d

# Check status
sudo docker-compose ps
sudo docker-compose logs -f frontend
```

## What Gets Deployed

The new UI includes:

### Pages
- ✅ **Home** - Real-time prices with search/filter
- ✅ **Shop** - API marketplace with 5 plans
- ✅ **Checkout** - Purchase flow
- ✅ **Dashboard** - API key management
- ✅ **Login/Signup** - Authentication

### Features
- ✅ Real-time price updates (every 30 seconds)
- ✅ Beautiful Notion-style design
- ✅ Demo authentication (localStorage)
- ✅ API key generation
- ✅ Usage tracking
- ✅ Copy-to-clipboard
- ✅ Responsive design

## Verify Deployment

### 1. Check Containers
```bash
sudo docker-compose ps
```

Expected output:
```
NAME                    STATUS
bonbast-api-api-1       Up
bonbast-api-frontend-1  Up
```

### 2. Check Frontend Logs
```bash
sudo docker-compose logs frontend --tail=50
```

Should see:
```
frontend-1  | /docker-entrypoint.sh: Configuration complete; ready for start up
```

### 3. Check API Logs
```bash
sudo docker-compose logs api --tail=50
```

Should see:
```
api-1  | * Running on http://0.0.0.0:5001
```

### 4. Test in Browser

Open: http://31.59.105.156

You should see:
- ✅ New home page with gradient design
- ✅ Real-time prices loading
- ✅ Search bar and category filters
- ✅ "ثبت نام" and "ورود" buttons in header

## Test Complete Flow

### 1. Register
- Click "ثبت نام" (Sign up)
- Fill in details
- Should redirect to Dashboard

### 2. Shop
- Click "فروشگاه" (Shop)
- See 5 API plans
- Click "خرید پلن" on any plan

### 3. Checkout
- Review order
- Click "پرداخت و خرید (دمو)"
- Should redirect to Dashboard

### 4. Dashboard
- See your API key
- Copy API key
- Click "تست فراخوانی API"
- Watch usage counter increment

### 5. Test API
```bash
# Replace YOUR_KEY with actual key from dashboard
curl -H "x-api-key: YOUR_KEY" http://31.59.105.156/api/v1/prices
```

## Troubleshooting

### Issue: Frontend not loading

**Check nginx logs:**
```bash
sudo docker-compose logs frontend --tail=100
```

**Restart frontend:**
```bash
sudo docker-compose restart frontend
```

### Issue: API not responding

**Check API logs:**
```bash
sudo docker-compose logs api --tail=100
```

**Restart API:**
```bash
sudo docker-compose restart api
```

### Issue: Old UI still showing

**Clear browser cache:**
- Press Ctrl+Shift+R (hard refresh)
- Or clear browser cache completely

**Verify build:**
```bash
# Check if new files are in container
sudo docker-compose exec frontend ls -la /usr/share/nginx/html
```

### Issue: Prices not loading

**Test API directly:**
```bash
curl http://31.59.105.156/api/prices
```

**Check API is running:**
```bash
sudo docker-compose ps api
```

## Configuration Files

### docker-compose.yml
- Defines services (api, frontend)
- Maps ports (80, 5050)
- Sets environment variables

### Front-end new/Dockerfile
- Multi-stage build
- Stage 1: Build React app
- Stage 2: Serve with nginx

### Front-end new/nginx.conf
- Serves static files
- Proxies /api/ to backend
- SPA fallback routing

## Environment Variables

### Backend (API)
```yaml
SUPABASE_JWT_SECRET: JWT secret from Supabase
SUPABASE_URL: Supabase project URL
SUPABASE_SERVICE_ROLE_KEY: Service role key
API_DB_PATH: SQLite database path
API_KEY_PEPPER_PATH: Pepper file path
PUBLIC_API_BASE_URL: Public API URL
ADMIN_TOKEN: Admin authentication token
```

### Frontend
No environment variables needed - uses proxy to backend

## Monitoring

### View Live Logs
```bash
# All services
sudo docker-compose logs -f

# Frontend only
sudo docker-compose logs -f frontend

# API only
sudo docker-compose logs -f api
```

### Check Resource Usage
```bash
sudo docker stats
```

### Check Disk Space
```bash
df -h
```

## Maintenance

### Update Code
```bash
cd ~/bonbast-api
git pull  # If using git
./deploy.sh
```

### Restart Services
```bash
sudo docker-compose restart
```

### Stop Services
```bash
sudo docker-compose down
```

### Start Services
```bash
sudo docker-compose up -d
```

### Clean Up Old Images
```bash
sudo docker system prune -a
```

## Backup

### Backup Database
```bash
sudo cp ~/bonbast-api/data/api_manager.db ~/bonbast-api/data/api_manager.db.backup
```

### Backup Environment
```bash
sudo cp ~/bonbast-api/docker-compose.yml ~/bonbast-api/docker-compose.yml.backup
```

## Performance

### Expected Response Times
- Home page: < 1s
- API calls: < 200ms
- Price updates: Every 30s

### Optimization
- Static assets cached for 30 days
- Gzip compression enabled
- SPA routing for instant navigation

## Security

### Current Setup
- ✅ API key authentication
- ✅ JWT validation
- ✅ CORS configured
- ✅ Rate limiting (backend)
- ✅ Secure headers (nginx)

### Recommendations
- [ ] Add SSL certificate (Let's Encrypt)
- [ ] Enable firewall (ufw)
- [ ] Set up monitoring (Prometheus/Grafana)
- [ ] Configure log rotation
- [ ] Set up automated backups

## SSL Setup (Optional)

### Using Certbot
```bash
# Install certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Support

### Check Status
```bash
# Container status
sudo docker-compose ps

# Service health
curl http://31.59.105.156/api/prices
curl http://31.59.105.156

# Logs
sudo docker-compose logs --tail=100
```

### Common Commands
```bash
# Restart everything
sudo docker-compose restart

# Rebuild frontend
sudo docker-compose build --no-cache frontend
sudo docker-compose up -d frontend

# View logs
sudo docker-compose logs -f

# Stop everything
sudo docker-compose down

# Start everything
sudo docker-compose up -d
```

## Success Checklist

After deployment, verify:

- [ ] Frontend loads at http://31.59.105.156
- [ ] Home page shows prices
- [ ] Can register new account
- [ ] Can browse shop
- [ ] Can purchase plan
- [ ] Dashboard shows API key
- [ ] API key works with curl
- [ ] Usage counter updates
- [ ] No errors in logs

## Next Steps

1. ✅ Deploy using `./deploy.sh`
2. ✅ Test in browser
3. ✅ Verify all features work
4. 📝 Set up SSL (optional)
5. 📊 Set up monitoring (optional)
6. 🔒 Configure firewall (optional)

---

**Deployment Time**: ~5 minutes
**Downtime**: ~30 seconds
**Difficulty**: Easy

Your new UI is ready to deploy! 🚀
