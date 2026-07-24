# 🚨 Fix: 500 Error on `/api/chapa/initiate`

## Problem

Getting 500 error when trying to pay with Chapa on production (Vercel).

## Most Likely Causes

### 1. **CHAPA_SECRET_KEY Not Set** ❌

**Symptom:** Error log shows: `❌ CHAPA_SECRET_KEY not configured`

**Fix:**

1. Go to Vercel Dashboard
2. Your Backend Project → Settings → Environment Variables
3. Add: `CHAPA_SECRET_KEY` with your key from Chapa dashboard
4. Redeploy

### 2. **Invalid API Key** ❌

**Symptom:** Error log shows: `Invalid API key` or `Unauthorized`

**Fix:**

1. Get fresh API key from https://dashboard.chapa.co
2. Copy EXACTLY (no extra spaces)
3. Update on Vercel
4. Redeploy

### 3. **BACKEND_URL Not Set Correctly** ❌

**Symptom:** Webhook won't work or validation fails

**Fix:**

1. Set on Vercel: `BACKEND_URL=https://your-backend.vercel.app`
2. Redeploy

### 4. **FRONTEND_URL Not Set** ❌

**Symptom:** Payment completes but redirect URL is wrong

**Fix:**

1. Set on Vercel: `FRONTEND_URL=https://your-frontend.vercel.app`
2. Redeploy

---

## Quick Diagnostic Steps

### Step 1: Check Vercel Logs

```
1. Vercel Dashboard → Your Backend Project
2. Deployments (latest)
3. Function Logs → Search for "❌" or "Chapa"
```

### Step 2: Common Error Messages

| Error Message                     | Fix                                     |
| --------------------------------- | --------------------------------------- |
| `CHAPA_SECRET_KEY not configured` | Add CHAPA_SECRET_KEY to Vercel env vars |
| `Invalid API key`                 | Get fresh key, check for spaces         |
| `Order not found`                 | Order wasn't created successfully       |
| `Unauthorized`                    | Check your Chapa API key is valid       |

### Step 3: Verify Chapa Credentials

```bash
# These must be set on Vercel:
✓ CHAPA_SECRET_KEY
✓ CHAPA_PUBLIC_KEY
✓ BACKEND_URL (for webhook)
✓ FRONTEND_URL (for redirects)
```

---

## How to Check Environment Variables on Vercel

1. Vercel Dashboard
2. Your Backend Project
3. Settings → Environment Variables
4. You should see all these keys listed:
   - CHAPA_SECRET_KEY
   - CHAPA_PUBLIC_KEY
   - BACKEND_URL
   - FRONTEND_URL
   - MONGODB_URI
   - JWT_SECRET
   - CLOUDINARY\_\*

If any are missing, add them!

---

## After Fixing Environment Variables

**Always redeploy after changing environment variables:**

1. Vercel Dashboard
2. Your Backend Project
3. Deployments tab
4. Click the "..." on latest deployment
5. Select "Redeploy"
6. Wait for deployment to complete

---

## Test Immediately After Deployment

1. Go to your app
2. Add items to cart
3. Checkout → Select "Chapa"
4. Click "Place Order"
5. Should redirect to Chapa checkout
6. If 500 error still appears, check logs again

---

## Getting Your Chapa API Keys

### For Sandbox Testing

1. Go to https://dashboard.chapa.co
2. Sign up/Login
3. Settings → API Keys
4. Copy the keys
5. Add to `.env` locally first to test
6. Then add to Vercel for production

### Keys You Need

- **CHAPA_SECRET_KEY** - For backend (keep secret!)
- **CHAPA_PUBLIC_KEY** - For frontend initialization (optional)

---

## Redeploy Checklist

- [ ] Got Chapa API keys
- [ ] Added CHAPA_SECRET_KEY to Vercel
- [ ] Added CHAPA_PUBLIC_KEY to Vercel
- [ ] Set BACKEND_URL correctly
- [ ] Set FRONTEND_URL correctly
- [ ] Redeployed backend
- [ ] Redeployed frontend
- [ ] Tested payment flow

---

## If Still Getting 500 Error

### Check These in Order:

1. **Look at Vercel Logs**
   - Go to deployment logs
   - Search for "❌" or "error"
   - Note the exact error message

2. **Verify API Key Format**
   - Copy from Chapa dashboard again
   - Paste to Vercel (NO quotes, NO extra spaces)
   - Redeploy

3. **Test Locally First**
   - Add keys to local `.env`
   - Run `npm run server` and `npm run dev`
   - Test locally
   - If it works locally, then deploy to Vercel

4. **Check Network Tab**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try payment again
   - Look for the request to `/api/chapa/initiate`
   - Check response body for error details

5. **Contact Chapa Support**
   - If you've verified everything above
   - The issue might be with your Chapa account
   - Contact: support@chapa.co

---

## Example: Correct Vercel Setup

```
Backend Environment Variables:
✓ CHAPA_SECRET_KEY = sk_test_xxxxxxxxxxxxx (no quotes)
✓ CHAPA_PUBLIC_KEY = pk_test_xxxxxxxxxxxxx (no quotes)
✓ BACKEND_URL = https://your-backend.vercel.app (HTTPS!)
✓ FRONTEND_URL = https://your-frontend.vercel.app (HTTPS!)
✓ MONGODB_URI = your_mongodb_connection_string
✓ JWT_SECRET = your_jwt_secret
✓ CLOUDINARY_NAME = your_cloudinary_name
✓ CLOUDINARY_API_KEY = your_cloudinary_api_key
✓ CLOUDINARY_API_SECRET = your_cloudinary_api_secret
```

---

## Quick Fix Checklist

```
☐ Get Chapa API keys from dashboard
☐ Add to Vercel backend environment variables
☐ Add BACKEND_URL to Vercel
☐ Add FRONTEND_URL to Vercel
☐ Redeploy backend
☐ Wait for deployment to complete
☐ Test payment flow
```

---

**Fixed? Great! If not, check the error message in Vercel logs and reference the table above.**

See full troubleshooting guide: [CHAPA_VERCEL_TROUBLESHOOTING.md](./CHAPA_VERCEL_TROUBLESHOOTING.md)
