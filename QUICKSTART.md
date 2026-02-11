# Quick Start Guide - Bonbast API Platform

This guide will get you up and running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Python 3.8+ installed
- A Supabase account (free tier works)

## Step 1: Backend Setup (2 minutes)

```bash
# 1. Install Python dependencies
pip install flask selenium jwt supabase-py

# 2. Initialize the API manager database
python -c "from api_manager import init_db; init_db()"

# 3. Start the backend
python app.py
```

The backend will start on `http://localhost:5001`

## Step 2: Frontend Setup (2 minutes)

```bash
# 1. Navigate to frontend directory
cd "Front-end new"

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## Step 3: Test the Application (1 minute)

1. Open your browser to `http://localhost:3000`
2. You should see the home page with real-time currency prices
3. Click "Register" to create an account
4. After registration, go to "Shop" to see available API plans
5. Purchase a plan (it's in demo mode, no payment required)
6. Go to "Dashboard" to see your API key and usage statistics

## What You Get

✅ Real-time currency, gold, and crypto prices  
✅ User authentication with Supabase  
✅ API marketplace with multiple plans  
✅ Usage dashboard with visual progress bars  
✅ Bilingual support (English/Persian)  
✅ Responsive design for all devices  

## Testing the API

After purchasing a plan in the dashboard, you'll get an API key. Test it:

```bash
# Copy your API key from the dashboard, then:
curl -H "x-api-key: YOUR_API_KEY" http://localhost:5001/v1/prices
```

## Common Issues

### Backend won't start
- Make sure port 5001 is not in use
- Check that all Python dependencies are installed
- Verify the `data/` directory exists

### Frontend won't start
- Make sure port 3000 is not in use
- Delete `node_modules` and run `npm install` again
- Check that you're in the "Front-end new" directory

### Can't register/login
- Verify Supabase credentials in `src/utils/supabase/info.tsx`
- Check browser console for errors
- Make sure you have internet connection (Supabase is cloud-based)

### Prices not loading
- Check that the backend is running on port 5001
- Look at backend console for scraping errors
- Wait 60 seconds for the first scrape to complete

## Next Steps

1. **Read the full documentation**: Check `Front-end new/README.md`
2. **Deploy to production**: Follow `Front-end new/DEPLOYMENT.md`
3. **Customize the UI**: Edit colors in `Front-end new/src/index.css`
4. **Add more currencies**: Edit `Front-end new/src/data/currencies.ts`
5. **Configure plans**: Modify `api_manager.py` DEFAULT_PLANS

## Architecture Overview

```
┌─────────────┐
│   Browser   │
│ (React App) │
└──────┬──────┘
       │
       │ HTTP Requests
       │
┌──────▼──────────────────────────────┐
│         Nginx (Production)          │
│  or Vite Dev Server (Development)   │
└──────┬──────────────────────────────┘
       │
       ├─────► /api/* ──────┐
       │                    │
       │              ┌─────▼──────┐
       │              │   Flask    │
       │              │  Backend   │
       │              │ (port 5001)│
       │              └─────┬──────┘
       │                    │
       │                    ├──► Selenium (Price Scraping)
       │                    ├──► SQLite (API Keys & Usage)
       │                    └──► Supabase (Sync & Auth)
       │
       └─────► Supabase Auth (JWT Validation)
```

## File Structure

```
bonbast-api/
├── app.py                    # Flask backend (price scraping)
├── api_manager.py            # API key management
├── data/
│   └── api_manager.db        # SQLite database
└── Front-end new/
    ├── src/
    │   ├── pages/            # React pages
    │   ├── components/       # React components
    │   ├── contexts/         # Auth & Language contexts
    │   └── config/           # API configuration
    ├── package.json
    └── vite.config.ts        # Vite config with proxy
```

## Environment Variables

### Backend (.env) - Optional but Recommended

```bash
# Supabase (for production sync)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_key
SUPABASE_JWT_SECRET=your_jwt_secret

# API Manager
API_DB_PATH=./data/api_manager.db
API_KEY_PEPPER=random_string_for_security
```

### Frontend - Already Configured

The Supabase credentials are already in `src/utils/supabase/info.tsx`. For production, you should move these to environment variables.

## Demo Mode

The application works in demo mode without any external configuration:

- ✅ Price scraping works immediately
- ✅ User registration/login via Supabase
- ✅ API key generation and management
- ✅ Usage tracking and quotas
- ✅ All features functional

For production deployment with database sync, you'll need to configure the Supabase environment variables.

## Support

- **Documentation**: See `Front-end new/README.md`
- **Deployment**: See `Front-end new/DEPLOYMENT.md`
- **Backend API**: See `front-end-new/API_DOCUMENTATION.md`

## Success!

If you can see prices on the home page and register an account, you're all set! 🎉

The platform is now running locally and ready for development or testing.
