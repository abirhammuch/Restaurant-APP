# Chapa Integration - Vercel Deployment Troubleshooting

## 🚨 Error: 500 on `/api/chapa/initiate`

If you're getting a 500 error when trying to initiate Chapa payment on Vercel, follow this troubleshooting guide.

---

## ✅ Vercel Environment Variables Checklist

### Backend Environment Variables (REQUIRED)

Go to: **Vercel Dashboard → Your Backend Project → Settings → Environment Variables**

Make sure these variables are set:

```
✓ CHAPA_SECRET_KEY        (from Chapa Dashboard)
✓ CHAPA_PUBLIC_KEY        (from Chapa Dashboard)
✓ BACKEND_URL             (your production backend URL)
✓ FRONTEND_URL            (your production frontend URL)
✓ MONGODB_URI             (your MongoDB connection string)
✓ JWT_SECRET              (your JWT secret)
```

### Frontend Environment Variables

Go to: **Vercel Dashboard → Your Frontend Project → Settings → Environment Variables**

```
✓ VITE_BACKEND_URL        (your production backend URL, e.g., https://backend-xyz.vercel.app)
```

---

## 🔍 Common Issues & Solutions

### Issue 1: "CHAPA_SECRET_KEY not configured"

**Error in logs:** `❌ CHAPA_SECRET_KEY not configured`

**Solution:**

1. Go to https://dashboard.chapa.co
2. Get your Secret Key
3. Add to Vercel backend environment variables:
   - Key: `CHAPA_SECRET_KEY`
   - Value: (paste your secret key)
4. Redeploy backend

**Verify:** Check Vercel logs - should NOT see "CHAPA_SECRET_KEY not configured"

---

### Issue 2: "Unauthorized" - 401/403 from Chapa

**Error in logs:** `Chapa returned non-success status: { status: "error", message: "Invalid API key" }`

**Solution:**

1. Double-check your CHAPA_SECRET_KEY is exactly correct (copy-paste from dashboard)
2. Ensure there are no extra spaces or quotes
3. Get a fresh key from Chapa dashboard if needed
4. Redeploy after updating

**Test:** Add a log to verify the key format doesn't have extra characters

---

### Issue 3: "Order not found" - 404

**Solution:**

1. Verify order was created successfully before attempting payment
2. Check order ID is valid
3. Ensure order belongs to the logged-in user

**Debug:** Check order creation logs in Vercel dashboard

---

### Issue 4: Network/Timeout Errors

**Error:** `Request timeout` or `ECONNREFUSED`

**Solution:**

1. Verify Chapa API endpoint is accessible (it is: https://api.chapa.co/v1)
2. Check backend has internet connectivity on Vercel
3. Ensure callback_url and return_url are valid

**Test:** Manually test Chapa API from local machine first

---

## 🔧 Debugging Steps

### Step 1: Check Environment Variables

```bash
# On Vercel backend, check logs for this output:
# Should show: ✅ or error message
```

### Step 2: Verify Chapa API Key

1. Log in to https://dashboard.chapa.co
2. Settings → API Keys
3. Verify key hasn't expired/been revoked
4. Copy exact key including prefix (if any)

### Step 3: Test with cURL

From your local machine (with proper API key):

```bash
curl -X POST https://api.chapa.co/v1/transaction/initialize \
  -H "Authorization: Bearer YOUR_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "currency": "ETB",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "phone_number": "+251912345678",
    "tx_ref": "test_'$(date +%s)'",
    "callback_url": "https://yourbackend.com/api/chapa/webhook",
    "return_url": "https://yourfrontend.com/payment-status"
  }'
```

If this works, the issue is with your backend setup.

### Step 4: Check Vercel Backend Logs

1. Vercel Dashboard → Backend Project → Deployments
2. Click latest deployment
3. Look for error messages
4. Check for: `❌ Chapa initialization error:` with details

---

## ✅ Production Deployment Checklist

- [ ] CHAPA_SECRET_KEY set on Vercel backend
- [ ] CHAPA_PUBLIC_KEY set on Vercel backend
- [ ] BACKEND_URL set correctly (e.g., https://your-backend.vercel.app)
- [ ] FRONTEND_URL set correctly (e.g., https://your-frontend.vercel.app)
- [ ] MongoDB URI configured on Vercel
- [ ] JWT_SECRET configured on Vercel
- [ ] Backend redeployed after setting variables
- [ ] Frontend redeployed after setting VITE_BACKEND_URL
- [ ] Chapa webhook URL updated to production
- [ ] Tested payment flow end-to-end

---

## 📋 Required URLs for Chapa

### callback_url

```
https://your-backend-domain.vercel.app/api/chapa/webhook
```

Chapa calls this after payment completes.

### return_url

```
https://your-frontend-domain.vercel.app/payment-status?tx_ref=order_xyz...
```

User is redirected here after payment.

---

## 🧪 Testing in Production

### Test with Chapa Sandbox

```
Endpoint: https://api.chapa.co/v1 (this is sandbox AND production)
Test Card: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

### Full Test Flow

1. Frontend: Add items to cart
2. Frontend: Go to checkout
3. Frontend: Select "Chapa" payment
4. Frontend: Fill details and click "Place Order"
5. Backend: Should create order with "pending" status
6. Backend: Should call `/api/chapa/initiate`
7. Frontend: Should redirect to Chapa checkout
8. User: Enter test card details
9. User: Click pay
10. Chapa: Redirect back to `/payment-status`
11. Backend: Verify payment
12. Frontend: Show success message

---

## 📞 Getting Help

### Check Vercel Logs

1. Vercel Dashboard
2. Your backend project
3. Deployments tab
4. Click on the deployment
5. Scroll to "Function Logs"
6. Look for error details

### Check Chapa Logs

1. Chapa Dashboard: https://dashboard.chapa.co
2. Transactions tab
3. Look for your transaction
4. See error details if any

### Check Frontend Console (Browser)

1. Open browser dev tools (F12)
2. Console tab
3. Look for axios errors
4. Check network tab for failed requests

---

## 🚀 Quick Fix Steps (If Currently Broken)

1. **Verify Chapa API Key**
   - Get fresh key from Chapa dashboard
   - Update on Vercel

2. **Check BACKEND_URL**
   - Should be: `https://your-backend.vercel.app`
   - NOT: `http://localhost:3000`

3. **Redeploy Everything**
   - Backend on Vercel
   - Frontend on Vercel
   - Wait for deployment to complete

4. **Test Again**
   - Same payment flow
   - Check logs if still failing

---

## ✨ If Everything Works

Great! You should see:

- ✅ Order created in database
- ✅ Chapa payment initiated
- ✅ User redirected to Chapa checkout
- ✅ Payment verified
- ✅ Order status updated to "paid"

---

## 📚 Related Documents

- See [CHAPA_QUICK_START.md](./CHAPA_QUICK_START.md) for basic setup
- See [CHAPA_PAYMENT_INTEGRATION.md](./CHAPA_PAYMENT_INTEGRATION.md) for details
- See [CHAPA_INTEGRATION_CHECKLIST.md](./CHAPA_INTEGRATION_CHECKLIST.md) for deployment

---

**Still having issues?** Check the logs in Vercel to see the exact error message, then reference this guide.
