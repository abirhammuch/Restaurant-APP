# 🔧 Fix 500 Error - Exact Steps

Your `/api/chapa/initiate` endpoint is returning 500 because **environment variables are not configured on Vercel**.

## 📋 EXACT STEPS TO FIX (Copy-Paste Ready)

### Step 1: Get Your Chapa API Keys

1. Go to https://dashboard.chapa.co
2. Click **Settings** (bottom left)
3. Click **API Keys**
4. You'll see:
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)
   - **Public Key** (starts with `pk_test_` or `pk_live_`)
5. Copy both keys

### Step 2: Add to Vercel Backend

1. Go to https://vercel.com/dashboard
2. Click your **backend project** (the one deployed to `restaurant-app-gold-sigma.vercel.app`)
3. Click **Settings** tab (top navigation)
4. Click **Environment Variables** (left sidebar)
5. Click **Add New** and create these variables one by one:

```
Key:   CHAPA_SECRET_KEY
Value: sk_test_xxxxxxxxxxxxxxxx  (or sk_live_ if production)
[Save]

Key:   CHAPA_PUBLIC_KEY
Value: pk_test_xxxxxxxxxxxxxxxx  (or pk_live_ if production)
[Save]

Key:   BACKEND_URL
Value: https://restaurant-app-gold-sigma.vercel.app
[Save]

Key:   FRONTEND_URL
Value: https://restaurant-app-gold-sigma.vercel.app  (or your frontend URL if different)
[Save]
```

### Step 3: Redeploy

1. Go to **Deployments** tab (top navigation)
2. Find the latest deployment
3. Click the **...** (three dots)
4. Click **Redeploy**
5. Wait for deployment to complete (should say "Ready")

### Step 4: Test

1. Go to your app
2. Add items to cart
3. Checkout
4. Select "Chapa"
5. Click "Place Order"
6. Should now redirect to Chapa checkout ✅

---

## 🔍 If Still Getting 500 Error

### Quick Diagnostic (Do This First!)

1. After you redeploy, visit this URL:
   ```
   https://restaurant-app-gold-sigma.vercel.app/api/chapa/status
   ```
2. You should see:
   ```json
   {
     "success": true,
     "chapa": {
       "secretKeyConfigured": true,   ← Should be TRUE
       "backendUrlConfigured": true,   ← Should be TRUE
       "frontendUrlConfigured": true   ← Should be TRUE
     },
     "message": "✅ Chapa is fully configured"
   }
   ```
3. If any are `false`, you missed that variable - go back to Step 2

### Check Vercel Logs

1. Vercel Dashboard → Your Backend Project
2. **Deployments** tab
3. Click on the latest deployment
4. Scroll down to **Function Logs**
5. Search for `❌` in the logs
6. Tell me exactly what the error says

### Common Error Messages & Fixes

| Error Message                     | Fix                                          |
| --------------------------------- | -------------------------------------------- |
| `CHAPA_SECRET_KEY not configured` | You missed Step 2 - add the variable         |
| `Invalid API key`                 | Check you copied the key exactly (no spaces) |
| `Order not found`                 | Order wasn't created - try checkout again    |
| `Unauthorized`                    | Check the API key format                     |

---

## ✅ Verification Checklist

After adding environment variables, verify on Vercel:

```
✓ CHAPA_SECRET_KEY is showing in Environment Variables
✓ CHAPA_PUBLIC_KEY is showing in Environment Variables
✓ BACKEND_URL is showing and correct
✓ FRONTEND_URL is showing and correct
✓ Latest deployment says "Ready" or "✓"
```

If any variable is missing or wrong, add/fix it and redeploy again.

---

## 🚨 What NOT To Do

❌ Don't add these to your local `.env` - they won't work on Vercel
❌ Don't include quotes around the values
❌ Don't add extra spaces
❌ Don't forget to redeploy after adding variables

---

## 📱 Test Payment Flow

After deployment completes:

1. Go to https://restaurant-app-gold-sigma.vercel.app
2. Login/Register
3. Add items to cart
4. Checkout
5. Fill in details
6. **Select "Chapa" as payment method** ← Important!
7. Click "Place Order"
8. Should see Chapa checkout page
9. Use test card: `4111 1111 1111 1111`

---

## 💬 Still Broken?

If you've done all the steps above and still getting 500:

1. Share the exact error from Vercel Function Logs
2. I'll help debug further

**Make sure you've redeployed after adding variables** - that's the most common mistake!

---

**This should fix your issue. Let me know if it works!** ✅
