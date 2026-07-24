# Chapa Payment Integration Checklist

Complete this checklist to fully integrate Chapa payment into your Digital Menu application.

## Phase 1: Backend Setup ✅ [COMPLETED]

### Files Created

- [x] `backend/controllers/chapaController.js` - Payment logic controller
- [x] `backend/routes/chapaRoute.js` - Chapa API routes

### Files Modified

- [x] `backend/server.js` - Added Chapa router registration
- [x] `backend/models/orderModel.js` - Added payment gateway fields
- [x] `backend/.env.example` - Added Chapa configuration template

## Phase 2: Frontend Setup ✅ [COMPLETED]

### Files Created

- [x] `frontend/src/pages/PaymentStatus.jsx` - Payment verification page

### Files Modified

- [x] `frontend/src/pages/Checkout.jsx` - Added Chapa payment option and flow

## Phase 3: Configuration 🔄 [MANUAL STEPS REQUIRED]

### Backend Configuration

**Location:** `backend/.env`

Add these lines:

```env
CHAPA_SECRET_KEY=your_secret_key
CHAPA_PUBLIC_KEY=your_public_key
BACKEND_URL=your_backend_url
FRONTEND_URL=your_frontend_url
```

**Get Keys From:** https://dashboard.chapa.co → Settings → API Keys

### Frontend Configuration

**Location:** `frontend/src/App.jsx`

Add the route for payment status:

```jsx
import PaymentStatus from "./pages/PaymentStatus";

// Inside your Routes component, add:
<Route path="/payment-status" element={<PaymentStatus />} />;
```

## Phase 4: Testing 📝 [READY TO TEST]

### Sandbox Testing

1. **Start Backend**

   ```bash
   cd backend
   npm install axios  # if not already installed
   npm run server
   ```

2. **Start Frontend**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Payment Flow**
   - Go to home page → add items to cart → checkout
   - Select "Chapa" as payment method
   - Fill customer information
   - Submit order
   - Use test card: `4111 1111 1111 1111`
   - Verify payment on `/payment-status` page

### Test Cards

- **Successful Payment:** 4111 1111 1111 1111
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **Amount:** Any amount

## Phase 5: Order Management

### Order Status Tracking

Orders now track:

- `paymentGateway` - Which payment service ("chapa", "telebirr", etc.)
- `transactionId` - Chapa transaction reference
- `paymentStatus` - "pending", "paid", "failed", "refunded"
- `transactionDetails` - Full transaction info from Chapa

### Admin Dashboard Updates Needed

If you have an admin dashboard, consider adding:

- Filter orders by payment method
- View Chapa transaction details
- Manual payment status override (for refunds)
- Payment reconciliation reports

## Phase 6: Webhook Setup

### Configure Webhook URL

1. Go to https://dashboard.chapa.co
2. Settings → Webhooks
3. Add webhook: `{YOUR_BACKEND_URL}/api/chapa/webhook`
4. Select events: All payment events
5. Save

### Test Webhook

Chapa will send test webhooks to verify your endpoint is working.

## Phase 7: Production Deployment 🚀

### Before Going Live

- [ ] Change `NODE_ENV` to `production`
- [ ] Get production Chapa API keys
- [ ] Update all URLs to production domains
- [ ] Test full payment flow in production
- [ ] Configure Chapa production mode
- [ ] Enable HTTPS for all payment endpoints
- [ ] Set up error monitoring/logging
- [ ] Create backup for Chapa transaction logs

### Vercel Backend Deployment

Add environment variables:

```
CHAPA_SECRET_KEY=prod_secret_key
CHAPA_PUBLIC_KEY=prod_public_key
BACKEND_URL=https://your-backend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
```

### Vercel Frontend Deployment

Update any hardcoded URLs to use environment variables:

```env
VITE_BACKEND_URL=https://your-backend-domain.com
```

## Phase 8: Post-Deployment

- [ ] Monitor webhook logs
- [ ] Track payment success rate
- [ ] Set up alerts for failed payments
- [ ] Create support process for payment issues
- [ ] Document refund process
- [ ] Train staff on payment troubleshooting

## API Endpoints Summary

### Payment Endpoints

| Method | Endpoint                     | Purpose                    |
| ------ | ---------------------------- | -------------------------- |
| POST   | `/api/chapa/initiate`        | Start payment process      |
| GET    | `/api/chapa/verify`          | Verify payment status      |
| GET    | `/api/chapa/status/:orderId` | Check order payment status |
| POST   | `/api/chapa/webhook`         | Chapa callback handler     |

## Troubleshooting Checklist

- [ ] Check `.env` variables are set correctly
- [ ] Verify API keys are valid and not expired
- [ ] Check backend logs for errors: `npm run server`
- [ ] Verify webhook URL is accessible
- [ ] Test with Chapa sandbox first
- [ ] Check browser console for frontend errors
- [ ] Verify order is created before payment
- [ ] Check payment success in Chapa dashboard

## Support & Resources

- **Chapa API Docs:** https://developer.chapa.co
- **Chapa Dashboard:** https://dashboard.chapa.co
- **Order Model:** `backend/models/orderModel.js`
- **Chapa Controller:** `backend/controllers/chapaController.js`
- **Checkout Component:** `frontend/src/pages/Checkout.jsx`

## Notes

- All timestamps are UTC
- Currency is hardcoded to ETB (Ethiopian Birr)
- Transaction references use format: `order_ORDERID_TIMESTAMP`
- Order totals are calculated with tax and delivery fees
- Promo codes are automatically applied during order creation

---

**Status:** ✅ Backend & Frontend integration complete. Ready for configuration and testing.

**Next Action:** Add Chapa API keys to `.env` file and test the payment flow.
