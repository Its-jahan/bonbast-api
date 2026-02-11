# 🚀 Quick Test Guide

## Start the Application (2 minutes)

### Terminal 1 - Backend
```bash
python app.py
```
Wait for: `Running on http://127.0.0.1:5001`

### Terminal 2 - Frontend
```bash
cd "Front-end new"
npm run dev
```
Wait for: `Local: http://localhost:3000`

## Test the Complete Flow (3 minutes)

### 1. Home Page ✅
- Open http://localhost:3000
- You should see:
  - 4 stat cards at the top (USD, EUR, Coin, Bitcoin)
  - Search bar and category filters
  - Grid of currency cards with prices
  - Auto-refresh every 30 seconds

### 2. Register ✅
- Click "ثبت نام" (Sign up) button in header
- Fill in:
  - Name: "علی احمدی"
  - Email: "ali@test.com"
  - Password: "123456"
- Click "ثبت نام"
- You should be redirected to Dashboard

### 3. Shop ✅
- Click "فروشگاه" (Shop) in header
- You should see 5 different API plans
- "پلن حرفه‌ای" (Pro Plan) has a "محبوب‌ترین" badge
- Click "خرید پلن" on any plan

### 4. Checkout ✅
- Review order details
- See features list
- See price calculation
- Click "پرداخت و خرید (دمو)"
- Wait 1.5 seconds for processing
- See success message
- Auto-redirect to Dashboard

### 5. Dashboard ✅
- See your API key card
- Click copy button next to API key
- Click copy button next to Request URL
- See usage statistics:
  - Request counter (green bar)
  - Used: 0
  - Total: depends on plan
  - Remaining: full quota
- Click "تست فراخوانی API" button
- Watch the counter increment

### 6. Test API Key ✅
Open a new terminal and test your API key:

```bash
# Copy your API key from dashboard, then:
curl -H "x-api-key: YOUR_API_KEY_HERE" http://localhost:5001/v1/prices
```

You should see JSON response with prices!

## Expected Results

### Home Page
```
✅ Prices loading from backend
✅ Search works
✅ Category filters work
✅ Cards show price changes
✅ Auto-refresh working
```

### Authentication
```
✅ Can register new user
✅ Can login with credentials
✅ Session persists on refresh
✅ Can logout
```

### Shop
```
✅ All 5 plans displayed
✅ Popular badge on Pro plan
✅ Features listed correctly
✅ Buy button works
```

### Checkout
```
✅ Order summary correct
✅ Price calculation correct
✅ Payment processing works
✅ Redirects to dashboard
```

### Dashboard
```
✅ API key displayed
✅ Copy buttons work
✅ Usage counter shows correctly
✅ Test button increments usage
✅ Color changes based on usage
```

## Common Issues & Fixes

### Issue: Prices not loading
**Fix:**
```bash
# Check backend is running
curl http://localhost:5001/prices

# Should return JSON with prices
```

### Issue: Can't register
**Fix:**
```javascript
// Open browser console (F12)
// Clear localStorage
localStorage.clear()
// Refresh page
```

### Issue: Dashboard empty after purchase
**Fix:**
```javascript
// Check localStorage
console.log(localStorage.getItem('subscriptions'))
// Should show your subscription
```

### Issue: Port already in use
**Fix:**
```bash
# Backend (port 5001)
lsof -ti:5001 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

## Visual Checklist

When everything is working, you should see:

### Home Page
- [ ] 4 colorful stat cards
- [ ] Search bar with icon
- [ ] 5 category filter buttons
- [ ] Grid of currency cards
- [ ] Prices in Persian numbers
- [ ] Smooth animations

### Shop Page
- [ ] 5 plan cards in a grid
- [ ] "محبوب‌ترین" badge on Pro plan
- [ ] Prices in Persian numbers
- [ ] Feature lists with checkmarks
- [ ] "خرید پلن" buttons

### Dashboard
- [ ] API key card with gradient header
- [ ] Copy buttons with icons
- [ ] Green progress bar (if unused)
- [ ] Persian numbers for usage
- [ ] "تست فراخوانی API" button

## Performance Check

The app should be:
- ⚡ Fast: Pages load instantly
- 🎨 Smooth: Animations are fluid
- 📱 Responsive: Works on mobile
- 🔄 Real-time: Prices update automatically

## Success! 🎉

If you can:
1. ✅ See prices on home page
2. ✅ Register an account
3. ✅ Buy a plan
4. ✅ See API key in dashboard
5. ✅ Test the API key with curl

Then everything is working perfectly!

## Next Steps

1. **Customize**: Edit colors in `src/index.css`
2. **Add Features**: Extend the dashboard
3. **Connect Backend**: Replace TODO sections
4. **Deploy**: Follow DEPLOYMENT.md

## Need Help?

- Check browser console (F12) for errors
- Check backend terminal for logs
- Review MIGRATION_COMPLETE.md
- Read QUICKSTART.md

---

**Time to complete**: ~5 minutes
**Difficulty**: Easy
**Result**: Fully functional app! 🚀
