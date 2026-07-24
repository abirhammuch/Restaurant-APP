# Chapa Payment Integration - Technical Details

## 🔄 Complete Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PAYMENT INITIATION                       │
└─────────────────────────────────────────────────────────────────┘

  User Interface (Frontend)
  ┌────────────────────────────────┐
  │ 1. Browse Menu & Add Items     │
  │ 2. Go to Checkout              │
  │ 3. Select "Chapa" Payment      │
  │ 4. Fill Details (Name, Email...) │
  │ 5. Click "Place Order"         │
  └────────────────────────────────┘
           │
           ↓ (Send order data)

  Backend Processing
  ┌────────────────────────────────────────────────┐
  │ Order Controller                               │
  │ ├─ Validate items                              │
  │ ├─ Calculate totals (subtotal, tax, delivery) │
  │ ├─ Apply coupon discount                       │
  │ └─ Create order with paymentStatus="pending"   │
  └────────────────────────────────────────────────┘
           │
           ↓ (Return orderId + success)

  Frontend Response Handling
  ┌─────────────────────────────────────────┐
  │ Check payment method                     │
  │ IF method === "chapa" THEN:              │
  │   ├─ Call /api/chapa/initiate            │
  │   └─ Pass orderId                        │
  └─────────────────────────────────────────┘
           │
           ↓

┌─────────────────────────────────────────────────────────────────┐
│                     PAYMENT PROCESSING                          │
└─────────────────────────────────────────────────────────────────┘

  Chapa Controller (/api/chapa/initiate)
  ┌──────────────────────────────────────────┐
  │ 1. Find order by orderId                 │
  │ 2. Verify order belongs to user          │
  │ 3. Prepare Chapa payload:                │
  │    ├─ amount: order.total                │
  │    ├─ email: user email                  │
  │    ├─ phone: user phone                  │
  │    ├─ tx_ref: unique reference           │
  │    └─ callback_url: webhook endpoint     │
  │ 4. Send request to Chapa API             │
  │ 5. Receive checkout_url                  │
  │ 6. Store transactionId in order          │
  └──────────────────────────────────────────┘
           │
           ↓ (Return checkout_url)

  Frontend Redirect
  ┌─────────────────────────────────────────┐
  │ window.location.href = checkout_url     │
  │                                          │
  │ User redirected to Chapa checkout page  │
  └─────────────────────────────────────────┘
           │
           ↓

┌─────────────────────────────────────────────────────────────────┐
│                    PAYMENT COMPLETION                           │
└─────────────────────────────────────────────────────────────────┘

  Chapa Checkout Page
  ┌───────────────────────────────┐
  │ 1. User enters card details   │
  │ 2. Chapa processes payment    │
  │ 3. Payment succeeds/fails     │
  └───────────────────────────────┘
           │
           ├─ WEBHOOK ──────→ POST /api/chapa/webhook
           │                  └─ Update order status
           │
           ├─ REDIRECT ─────→ /payment-status?tx_ref=XXX
           │
           ↓

  Payment Status Page (Frontend)
  ┌──────────────────────────────────┐
  │ 1. Extract tx_ref from URL       │
  │ 2. Call /api/chapa/verify        │
  │ 3. Wait for response             │
  │ 4. Show success/failed message   │
  └──────────────────────────────────┘
           │
           ↓ (Success)

  Order Updated
  ┌──────────────────────────────────────┐
  │ paymentStatus: "paid"                 │
  │ paymentGateway: "chapa"               │
  │ transactionId: "order_xxx_xxxxx"      │
  │ transactionDetails: { ... }           │
  └──────────────────────────────────────┘
           │
           ↓

  User Redirected to Orders Page
  ┌──────────────────────────────────┐
  │ ✓ Payment successful!             │
  │ View order details                │
  │ Track delivery                    │
  └──────────────────────────────────┘
```

---

## 📡 API Request/Response Examples

### 1. Create Order

**Request:**

```bash
POST /api/order/create
Content-Type: application/json
Authorization: Bearer usertoken

{
  "items": [
    {"foodId": "abc123", "quantity": 2},
    {"foodId": "def456", "quantity": 1}
  ],
  "deliveryAddress": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+251912345678",
    "table": "5"
  },
  "paymentMethod": "chapa",
  "note": "No onions please",
  "couponCode": "SAVE10"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "_id": "65f8a1c2d1e2f3g4h5i6j7k8",
    "userId": "user123",
    "items": [...],
    "total": 450.50,
    "paymentMethod": "chapa",
    "paymentStatus": "pending",
    "orderStatus": "pending",
    "createdAt": "2024-03-20T10:30:00Z"
  }
}
```

---

### 2. Initiate Chapa Payment

**Request:**

```bash
POST /api/chapa/initiate
Content-Type: application/json
Authorization: Bearer usertoken

{
  "orderId": "65f8a1c2d1e2f3g4h5i6j7k8"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment initialization successful",
  "data": {
    "checkout_url": "https://checkout.chapa.co/payment/XXXXXXXXXXXXX",
    "tx_ref": "order_65f8a1c2d1e2f3g4h5i6j7k8_1234567890123"
  }
}
```

---

### 3. Verify Payment

**Request:**

```bash
GET /api/chapa/verify?tx_ref=order_65f8a1c2d1e2f3g4h5i6j7k8_1234567890123
```

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "success",
    "amount": 450.5,
    "currency": "ETB",
    "reference": "CHAPA_REF_123456789"
  }
}
```

---

## 🗄️ Database Schema Updates

### Order Model - New Fields

```javascript
// Payment Gateway Information
paymentGateway: {
  type: String,
  enum: ["none", "chapa", "telebirr", "stripe"],
  default: "none"
}

// Chapa Transaction ID
transactionId: {
  type: String,
  default: ""
}

// Full Transaction Details
transactionDetails: {
  amount: Number,           // e.g., 450.50
  currency: String,         // "ETB"
  status: String,           // "success", "failed", "pending"
  reference: String,        // Chapa's reference number
  verifiedAt: Date          // When payment was verified
}
```

---

## 🔐 Security Features

### Request Security

```javascript
// All payment endpoints use userAuth middleware
chapaRouter.post("/initiate", userAuth, initiateChapaPayment);
chapaRouter.get("/status/:orderId", userAuth, getPaymentStatus);

// Webhook doesn't require auth (Chapa calls it)
chapaRouter.post("/webhook", chapaWebhook);
```

### Data Validation

```javascript
// Server-side validation
1. Verify order exists
2. Verify order belongs to authenticated user
3. Validate order total matches
4. Verify transaction reference format
5. Check transaction status with Chapa
```

### Sensitive Data Protection

- API keys stored in `.env` (not in code)
- Card data never touches your server
- HTTPS required for production
- Webhook signature verification recommended

---

## 📊 Order Status Lifecycle

```
┌─────────────────────────────────────────┐
│ Order Created                            │
│ paymentStatus: "pending"                 │
│ orderStatus: "pending"                   │
└─────────────────────────────────────────┘
           │
           ├─ PAYMENT SUCCESSFUL
           │       ↓
           │  paymentStatus: "paid"
           │  transactionId: set
           │  transactionDetails: set
           │       ↓
           │  Order can be confirmed
           │       ↓
           │  orderStatus: "confirmed"
           │
           ├─ PAYMENT FAILED
           │       ↓
           │  paymentStatus: "failed"
           │  User can retry
           │
           └─ USER REFUND
                   ↓
              paymentStatus: "refunded"
              Order status: "cancelled"
```

---

## 🧪 Webhook Testing

### Test Webhook Locally

Use a service like [Ngrok](https://ngrok.com/) to expose local server:

```bash
# In another terminal
ngrok http 3000

# This creates: https://xxxx-xx-xxx-xxx-xx.ngrok.io
# Update Chapa webhook to: https://xxxx-xx-xxx-xxx-xx.ngrok.io/api/chapa/webhook
```

### Webhook Payload Example

```json
{
  "tx_ref": "order_65f8a1c2d1e2f3g4h5i6j7k8_1234567890123",
  "status": "success",
  "amount": 450.5,
  "currency": "ETB",
  "reference": "CHAPA_REF_123456789",
  "timestamp": "2024-03-20T10:35:00Z"
}
```

---

## 📈 Order Tracking

### Customer Perspective

```
1. Payment Page
   └─ "Processing payment with Chapa"

2. Verification Page
   └─ "Verifying your payment"

3. Order Confirmation
   └─ "✓ Payment successful!"
   └─ Order details shown

4. My Orders Page
   └─ Order with "Paid" status
   └─ Chapa transaction ID visible to admin
```

### Admin Perspective

```
Order Details:
├─ Payment Method: Chapa
├─ Payment Status: Paid
├─ Transaction ID: order_65f8a1c2d1e2f3g4h5i6j7k8_1234567890123
├─ Amount: 450.50 ETB
└─ Verified At: 2024-03-20 10:35:00
```

---

## 🚨 Error Handling

### Frontend Error Handling

```javascript
// Payment initiation error
catch (error) {
  console.error("Chapa payment error:", error);
  toast.error(
    error.response?.data?.message ||
    "Failed to initiate Chapa payment"
  );
}

// Payment verification error
catch (error) {
  console.error("Verification error:", error);
  toast.error("Failed to verify payment");
  // User can retry
}
```

### Backend Error Handling

```javascript
try {
  // Process payment
} catch (error) {
  console.error("Chapa error:", error);
  res.status(500).json({
    success: false,
    message: error.message,
  });
}
```

### Common Errors

| Error                 | Cause                       | Solution                  |
| --------------------- | --------------------------- | ------------------------- |
| "Invalid API Key"     | Wrong CHAPA_SECRET_KEY      | Check .env file           |
| "Order not found"     | orderId doesn't exist       | Ensure order was created  |
| "Unauthorized"        | User doesn't own order      | Check authentication      |
| "Verification failed" | Transaction reference wrong | Retry payment             |
| "Network error"       | Chapa API unreachable       | Check internet connection |

---

## 💾 Database Migration

If adding Chapa to existing orders:

```javascript
// Optional: Add migration to set default values
// No migration needed - new fields have defaults

// Existing orders will have:
// - paymentGateway: "none"
// - transactionId: ""
// - transactionDetails: undefined
```

---

## 📱 Multi-Platform Support

### Mobile Considerations

- Chapa checkout is mobile-responsive
- Payment verification works on mobile
- Redirect URLs must match exactly
- Test on various browsers and devices

### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Minimum: ES6 JavaScript support

---

## 🔍 Monitoring & Logging

### What to Monitor

```
1. Payment success rate
2. Failed payment attempts
3. Webhook delivery status
4. Transaction verification time
5. Customer support tickets related to payment
```

### Logs Location

```
Backend: console.log() output
- /api/chapa/initiate calls
- /api/chapa/verify responses
- Webhook receipts
- Error traces

Chapa Dashboard:
- Transaction logs
- Webhook delivery status
- Payment failures
```

---

## 📞 Troubleshooting Guide

### Payment Won't Redirect

```
Check:
1. FRONTEND_URL in .env matches actual URL
2. Order created successfully
3. Chapa returned valid checkout_url
4. No JavaScript errors in console
```

### Verification Fails

```
Check:
1. tx_ref parameter present in URL
2. CHAPA_SECRET_KEY is correct
3. Webhook was called by Chapa
4. Order exists in database
```

### Webhook Not Received

```
Check:
1. Webhook URL is public (not localhost)
2. Firewall allows Chapa IP addresses
3. Endpoint returns 200 OK
4. Logs show webhook received
```

---

**This integration provides enterprise-grade payment processing for your Digital Menu application.** 🚀

For additional support, visit [Chapa Developer Docs](https://developer.chapa.co/docs)
