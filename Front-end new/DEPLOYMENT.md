# Deployment Guide

## Overview
This guide explains how to deploy the frontend with proper backend integration.

## Architecture
- **Frontend**: React + Vite (served on port 5173 in dev, static files in production)
- **Backend API**: Flask (running on port 5001)
- **Supabase**: Authentication and database
- **Nginx**: Reverse proxy to connect frontend and backend

## Backend Endpoints

### Price API (Public)
- `GET /api/prices` - Get all prices (no auth required)

### API Manager (Authenticated with Supabase JWT)
- `GET /api/plans` - List available plans
- `POST /api/me/purchase` - Purchase a plan (requires Bearer token)
- `GET /api/me/keys` - List user's API keys (requires Bearer token)
- `POST /api/me/keys/:id/add-requests` - Add extra requests (requires Bearer token)

### API Usage (Authenticated with API Key)
- `GET /api/v1/prices` - Get prices with API key (requires x-api-key header)
- `GET /api/v1/key/:api_key/prices` - Get prices via URL parameter

## Environment Variables

### Frontend (.env)
```bash
# Supabase (already configured in src/utils/supabase/info.tsx)
VITE_SUPABASE_URL=https://shxhgzryhljbocnnhzwn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Backend (.env)
```bash
# Supabase
SUPABASE_URL=https://shxhgzryhljbocnnhzwn.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_JWT_SECRET=your_jwt_secret_here

# API Manager
API_DB_PATH=./data/api_manager.db
API_KEY_PEPPER=your_random_pepper_string

# Optional
PUBLIC_API_BASE_URL=https://yourdomain.com/api
```

## Nginx Configuration

Create `/etc/nginx/sites-available/bonbast-api`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend (static files)
    location / {
        root /var/www/bonbast-api/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/bonbast-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Deployment Steps

### 1. Backend Setup

```bash
# Navigate to project root
cd /path/to/bonbast-api

# Install Python dependencies
pip install -r requirements.txt

# Initialize the API manager database
python -c "from api_manager import init_db; init_db()"

# Run the backend (use systemd service in production)
python app.py
```

### 2. Frontend Build

```bash
# Navigate to frontend directory
cd "Front-end new"

# Install dependencies
npm install

# Build for production
npm run build

# Copy build files to nginx directory
sudo cp -r dist/* /var/www/bonbast-api/
```

### 3. Systemd Service (Production)

Create `/etc/systemd/system/bonbast-api.service`:

```ini
[Unit]
Description=Bonbast API Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/bonbast-api
Environment="PATH=/usr/bin:/usr/local/bin"
ExecStart=/usr/bin/python3 app.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable bonbast-api
sudo systemctl start bonbast-api
sudo systemctl status bonbast-api
```

## Development Setup

### 1. Start Backend
```bash
python app.py
# Runs on http://localhost:5001
```

### 2. Start Frontend
```bash
cd "Front-end new"
npm run dev
# Runs on http://localhost:5173
```

The frontend dev server is configured to proxy `/api` requests to `http://localhost:5001` automatically.

## Supabase Setup

### 1. Create Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table (synced from SQLite)
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL,
  supabase_user_id UUID UNIQUE REFERENCES auth.users(id),
  current_plan_slug TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Plans table (synced from SQLite)
CREATE TABLE IF NOT EXISTS plans (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  scope TEXT NOT NULL DEFAULT 'all',
  name TEXT NOT NULL,
  monthly_quota INTEGER NOT NULL,
  rpm_limit INTEGER NOT NULL,
  price_irr INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- API Keys table (synced from SQLite)
CREATE TABLE IF NOT EXISTS api_keys (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  plan_id INTEGER NOT NULL REFERENCES plans(id),
  plan_slug TEXT,
  plan_name TEXT,
  plan_scope TEXT DEFAULT 'all',
  monthly_quota INTEGER,
  rpm_limit INTEGER,
  price_irr INTEGER,
  api_key TEXT,
  api_url TEXT,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  key_last4 TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

-- Usage Monthly table (synced from SQLite)
CREATE TABLE IF NOT EXISTS usage_monthly (
  api_key_id INTEGER NOT NULL REFERENCES api_keys(id),
  month TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  extra_quota INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (api_key_id, month)
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_monthly ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own data"
  ON customers FOR SELECT
  USING (auth.uid() = supabase_user_id);

CREATE POLICY "Users can view their own API keys"
  ON api_keys FOR SELECT
  USING (customer_id IN (
    SELECT id FROM customers WHERE supabase_user_id = auth.uid()
  ));

CREATE POLICY "Users can view their own usage"
  ON usage_monthly FOR SELECT
  USING (api_key_id IN (
    SELECT id FROM api_keys WHERE customer_id IN (
      SELECT id FROM customers WHERE supabase_user_id = auth.uid()
    )
  ));
```

### 2. Get JWT Secret

1. Go to Supabase Dashboard → Settings → API
2. Copy the JWT Secret
3. Add it to backend `.env` as `SUPABASE_JWT_SECRET`

## Testing

### Test Backend API
```bash
# Test prices endpoint
curl http://localhost:5001/prices

# Test plans endpoint
curl http://localhost:5001/plans
```

### Test Frontend
1. Open http://localhost:5173
2. Register a new account
3. Go to Shop and purchase a plan
4. Check Dashboard to see your API key
5. Test the API key with the provided URL

## Troubleshooting

### CORS Issues
Make sure the backend allows requests from your frontend domain. Check `app.py` for CORS configuration.

### 401 Unauthorized
- Check that Supabase JWT secret is correctly set in backend
- Verify the user is logged in and token is being sent
- Check browser console for auth errors

### API Key Not Working
- Verify the API key is correctly copied
- Check that the key hasn't exceeded its quota
- Ensure the backend is running and accessible

### Database Sync Issues
- Check that Supabase credentials are correct
- Verify the tables exist in Supabase
- Check backend logs for sync errors

## Production Checklist

- [ ] Set strong `API_KEY_PEPPER` in backend
- [ ] Configure proper `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Set up SSL certificate (Let's Encrypt)
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Configure backup for SQLite database
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test API key generation and usage
- [ ] Set up rate limiting
- [ ] Configure proper CORS origins

## Support

For issues or questions, check:
- Backend logs: `sudo journalctl -u bonbast-api -f`
- Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Frontend console: Browser DevTools → Console
