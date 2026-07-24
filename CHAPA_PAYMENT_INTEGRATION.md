# Chapa Payment Integration Guide

## Overview

This guide walks you through integrating Chapa payment gateway into your Digital Menu application.

---

## 1. Backend Setup

### 1.1 Install Dependencies

No additional dependencies needed - we're using the built-in `axios` for API calls.

### 1.2 Environment Variables

Add these to your `.env` file in the backend folder:

```env
# Chapa Configuration
CHAPA_SECRET_KEY=your_chapa_secret_key_here
CHAPA_PUBLIC_KEY=your_chapa_public_key_here

# URLs
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

### 1.3 Files Created/Modified

#### New Files:

- `controllers/chapaController.js` - Handles all Chapa payment logic
- `routes/chapaRoute.js` - Chapa API endpoints

#### Modified Files:

- `server.js` - Added Chapa route integration
- `models/orderModel.js` - Added Chapa payment fields

### 1.4 Database Fields Added to Order Model

```javascript
paymentGateway: String (enum: "none", "chapa", "telebirr", "stripe")
transactionId: String
transactionDetails: {
  amount: Number,
  currency: String,
  status: String,
  reference: String,
  verifiedAt: Date
}
```

---

## 2. Frontend Setup

### 2.1 Payment Status Component

A new `PaymentStatus.jsx` component has been created to handle payment verification after Chapa redirects.

**Location:** `frontend/src/pages/PaymentStatus.jsx`

### 2.2 Checkout Component Updates

The `Checkout.jsx` has been updated to:

- Add "Chapa" as a payment method option
- Handle Chapa payment flow with `handleChapaPayment()` function
- Show loading state during payment processing

### 2.3 Add Route to App.jsx

Add this route to your `App.jsx`:

```jsx
import PaymentStatus from "./pages/PaymentStatus";

// In your routes:
<Route path="/payment-status" element={<PaymentStatus />} />;
```

---

## 3. Getting Chapa Credentials

### 3.1 Create Chapa Account

1. Go to [Chapa.co](https://chapa.co)
2. Sign up for a developer account
3. Navigate to Dashboard

### 3.2 Get API Keys

1. Log in to Chapa Dashboard
2. Go to Settings → API Keys
3. Copy:
   - **Secret Key** (for backend)
   - **Public Key** (for frontend, if needed)

### 3.3 Set Webhook URL

In Chapa Dashboard:

1. Go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/chapa/webhook`
3. Select events: "Payment Success", "Payment Failed"

---

## 4. API Endpoints

### 4.1 Initiate Payment

**POST** `/api/chapa/initiate`

- **Auth:** Required (userToken)
- **Body:**
  ```json
  {
    "orderId": "order_id_here"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "checkout_url": "https://checkout.chapa.co/...",
      "tx_ref": "order_xyz_12345"
    }
  }
  ```

### 4.2 Verify Payment

**GET** `/api/chapa/verify?tx_ref=transaction_ref`

- **Auth:** Not required
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "status": "success",
      "amount": 250.0,
      "currency": "ETB",
      "reference": "chapa_ref_123"
    }
  }
  ```

### 4.3 Get Payment Status

**GET** `/api/chapa/status/:orderId`

- **Auth:** Required (userToken)
- **Response:**
  ```json
  {
    "success": true,
    "paymentStatus": "paid",
    "paymentGateway": "chapa",
    "transactionId": "order_xyz_12345"
  }
  ```

### 4.4 Webhook

**POST** `/api/chapa/webhook`

- **Auth:** Not required (Chapa calls this)
- **Purpose:** Receives payment status updates from Chapa

---

## 5. Payment Flow Diagram

```
1. User selects "Chapa" payment method
   ↓
2. User fills order details and submits
   ↓
3. Backend creates order with "pending" status
   ↓
4. Frontend calls `/api/chapa/initiate` with orderId
   ↓
5. Backend calls Chapa API to initialize payment
   ↓
6. Chapa returns checkout URL
   ↓
7. Frontend redirects user to Chapa checkout
   ↓
8. User enters card details and completes payment
   ↓
9. Chapa redirects to `/payment-status` with tx_ref
   ↓
10. PaymentStatus component verifies payment
    ↓
11. Order payment status updated to "paid"
    ↓
12. User sees confirmation and is redirected to orders page
```

---

## 6. Testing

### 6.1 Test Cards (Chapa Sandbox)

Use these test cards in sandbox environment:

- **Card Number:** 4111 1111 1111 1111
- **CVV:** Any 3 digits
- **Expiry:** Any future date

### 6.2 Test Flow

1. Start your backend: `npm run server`
2. Start your frontend: `npm run dev`
3. Go to checkout
4. Select "Chapa" payment method
5. Fill in test data
6. Place order
7. Use test card details at Chapa checkout

---

## 7. Deployment Notes

### 7.1 Environment Variables on Vercel (Backend)

1. Go to Vercel Dashboard
2. Select your backend project
3. Settings → Environment Variables
4. Add:
   - `CHAPA_SECRET_KEY`
   - `CHAPA_PUBLIC_KEY`
   - `BACKEND_URL` (your production backend URL)
   - `FRONTEND_URL` (your production frontend URL)

### 7.2 Webhook URL for Production

Update Chapa webhook URL to your production backend:

```
https://your-production-backend.com/api/chapa/webhook
```

### 7.3 API Calls in Frontend

Update `backendUrl` in frontend `.env`:

```env
VITE_BACKEND_URL=https://your-production-backend.com
```

---

## 8. Troubleshooting

### Issue: "Invalid API Key"

- **Solution:** Check `CHAPA_SECRET_KEY` in `.env` - ensure it's correct and has no spaces

### Issue: Payment Verification Fails

- **Solution:** Check Chapa webhook logs in dashboard to see if payment was received

### Issue: Redirect URL Not Working

- **Solution:** Ensure `FRONTEND_URL` in backend `.env` matches your frontend domain

### Issue: "Order Not Found"

- **Solution:** Verify order was created successfully before initiating payment

---

## 9. Additional Resources

- [Chapa API Documentation](https://developer.chapa.co/docs)
- [Chapa Dashboard](https://dashboard.chapa.co)
- [Test Cards & Amounts](https://developer.chapa.co/docs/accept-payments/test-cards)

---

## 10. Security Best Practices

✅ **Do:**

- Keep `CHAPA_SECRET_KEY` private (backend only)
- Validate transaction amounts on backend
- Verify payment signatures from Chapa
- Use HTTPS for all payment URLs
- Never log sensitive payment data

❌ **Don't:**

- Expose `CHAPA_SECRET_KEY` in frontend code
- Trust frontend-only payment verification
- Skip server-side transaction verification
- Hardcode payment credentials

---

## 11. Next Steps

1. ✅ Get Chapa credentials from dashboard
2. ✅ Add environment variables to `.env`
3. ✅ Test payment flow in sandbox
4. ✅ Deploy to production
5. ✅ Enable production mode in Chapa dashboard
6. ✅ Update webhook URL to production

---

For questions or issues, contact:

- Chapa Support: support@chapa.co
- Your development team

**Last Updated:** 2024
