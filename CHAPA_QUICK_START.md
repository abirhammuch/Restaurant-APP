# Quick Start: Chapa Payment Integration

## 5-Minute Setup Guide

### Step 1: Get Chapa Credentials (2 min)

1. Go to https://dashboard.chapa.co
2. Sign up if you don't have an account
3. Navigate to **Settings → API Keys**
4. Copy your **Secret Key** and **Public Key**

### Step 2: Update Environment Variables (1 min)

**File:** `backend/.env`

Add these lines:

```env
CHAPA_SECRET_KEY=paste_your_secret_key_here
CHAPA_PUBLIC_KEY=paste_your_public_key_here
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

For production, use your actual domain URLs.

### Step 3: Add Frontend Route (1 min)

**File:** `frontend/src/App.jsx`

Find your Routes component and add:

```jsx
import PaymentStatus from "./pages/PaymentStatus";

// Inside your Routes:
<Route path="/payment-status" element={<PaymentStatus />} />;
```

### Step 4: Start Testing (1 min)

```bash
# Terminal 1 - Backend
cd backend
npm run server

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Then:

1. Go to http://localhost:5173
2. Add items to cart
3. Checkout and select **"Chapa"** payment method
4. Use test card: **4111 1111 1111 1111**
5. Complete payment

---

## What Was Integrated

### Backend Changes

✅ New Chapa payment controller with 4 main functions
✅ New Chapa payment routes
✅ Order model updated with payment gateway fields
✅ Axios installed for API calls

### Frontend Changes

✅ Checkout page now supports Chapa payment
✅ Payment status page for verification
✅ Payment method selector updated with Chapa option

---

## File Reference

| File                                     | Purpose                  |
| ---------------------------------------- | ------------------------ |
| `backend/controllers/chapaController.js` | Payment processing logic |
| `backend/routes/chapaRoute.js`           | API endpoints            |
| `backend/models/orderModel.js`           | Added payment fields     |
| `frontend/src/pages/Checkout.jsx`        | Payment selection UI     |
| `frontend/src/pages/PaymentStatus.jsx`   | Payment verification     |
| `backend/server.js`                      | Route registration       |

---

## API Endpoints

Your app now has these new endpoints:

```
POST   /api/chapa/initiate      - Start payment
GET    /api/chapa/verify        - Verify transaction
GET    /api/chapa/status/:id    - Check order payment
POST   /api/chapa/webhook       - Chapa callback
```

---

## Payment Flow

1. User selects "Chapa" → Places order
2. Backend creates order with "pending" status
3. Frontend gets checkout URL from Chapa
4. User redirects to Chapa checkout
5. User pays with card
6. Chapa redirects to `/payment-status`
7. Payment status verified
8. Order status updated to "paid"

---

## Testing

**Test Card:** 4111 1111 1111 1111
**CVV:** Any 3 digits (e.g., 123)
**Expiry:** Any future date (e.g., 12/25)
**Amount:** Any amount

---

## Troubleshooting

### ❌ "Invalid API Key"

**Solution:** Check your `CHAPA_SECRET_KEY` in `.env` - ensure no spaces

### ❌ Redirect not working

**Solution:** Verify `FRONTEND_URL` in `.env` matches your frontend URL

### ❌ Order not found

**Solution:** Ensure order was created before initiating payment

### ❌ Payment verification fails

**Solution:** Check Chapa dashboard logs - webhook may not be configured yet

---

## Next Steps

1. ✅ Add API keys to `.env`
2. ✅ Add route to `App.jsx`
3. ✅ Test in sandbox
4. ✅ Deploy to production
5. ✅ Update Chapa to production mode

---

## Production Checklist

Before deploying to production:

- [ ] Get production Chapa API keys
- [ ] Update `.env` with production keys
- [ ] Update `BACKEND_URL` and `FRONTEND_URL` to production URLs
- [ ] Set up Chapa webhook for production URL
- [ ] Test full payment flow
- [ ] Enable HTTPS
- [ ] Deploy backend & frontend
- [ ] Monitor payment logs

---

## Support

- **Chapa Docs:** https://developer.chapa.co
- **Chapa Support:** support@chapa.co
- **Integration Guide:** `CHAPA_PAYMENT_INTEGRATION.md`
- **Full Checklist:** `CHAPA_INTEGRATION_CHECKLIST.md`

---

**Ready to go! Your Chapa payment integration is complete.** 🎉
