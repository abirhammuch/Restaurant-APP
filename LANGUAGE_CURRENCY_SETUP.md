# Language & Currency Implementation Guide

## Features Implemented ✅

1. **Language Support**: English (en) and Amharic (am)
2. **Currency Support**: USD ($) and Ethiopian Birr (ETB - ብር)
3. **Language Switcher**: Located in the Navbar for easy access
4. **Persistent Settings**: Language and currency choices are saved to localStorage
5. **Price Conversion**: Automatic conversion between USD and ETB (1 USD = 130 ETB)

## How to Use in Components

### 1. Get the Translation Function

```jsx
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const YourComponent = () => {
  const { t } = useContext(AppContext);

  return (
    <div>
      <h1>{t("home")}</h1>
      <p>{t("orderNow")}</p>
    </div>
  );
};
```

### 2. Get Current Language/Currency

```jsx
const { language, currencyType, currency } = useContext(AppContext);
```

### 3. Display Prices with Currency

```jsx
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const FoodCard = ({ food }) => {
  const { convertPrice, currency } = useContext(AppContext);

  return (
    <div>
      <h3>{food.name}</h3>
      <p>
        {currency} {convertPrice(food.price)}
      </p>
    </div>
  );
};
```

## Available Translation Keys

### Navigation

- home, menu, category, about, contact, cart, login, logout, search, searchFood

### Food & Cart

- price, addToCart, removeFromCart, quantity, description, rating, reviews
- cartEmpty, subtotal, deliveryFee, tax, total, checkout, continueShopping, clearCart

### Checkout & Order

- firstName, lastName, email, phone, address, city, zipCode, placeOrder, orderPlaced
- myOrders, orderDate, orderStatus, orderTotal, orderDetails, viewDetails, trackOrder

### Status

- pending, confirmed, preparing, outForDelivery, delivered, cancelled

### Common UI

- yes, no, ok, cancel, save, delete, edit, add, back, next, previous
- error, success, loading, loginRequired, logoutSuccess, loginSuccess

### Settings

- language, currency, settings, english, amharic, usd, etb

## Implementation in Existing Components

Replace hardcoded text with translations:

**Before:**

```jsx
<h1>Home</h1>
<button>Add to Cart</button>
```

**After:**

```jsx
const { t } = useContext(AppContext);
<h1>{t('home')}</h1>
<button>{t('addToCart')}</button>
```

## Price Conversion Example

```jsx
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const CartPage = () => {
  const { cart, convertPrice, currency, tax, delivery_fee } =
    useContext(AppContext);

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const taxAmount = (subtotal * tax) / 100;
  const total = convertPrice(subtotal) + taxAmount + delivery_fee;

  return (
    <div>
      <p>
        Subtotal: {currency} {convertPrice(subtotal)}
      </p>
      <p>
        Tax: {currency} {taxAmount}
      </p>
      <p>
        Delivery: {currency} {delivery_fee}
      </p>
      <p>
        Total: {currency} {total}
      </p>
    </div>
  );
};
```

## Exchange Rate

- Current rate: 1 USD = 130 ETB
- To change: Edit `ETH_TO_USD_RATE` in `frontend/src/context/AppContext.jsx`

## Files Modified/Created

1. **Created**: `frontend/src/assets/translations.js` - Translation strings
2. **Created**: `frontend/src/components/LanguageSwitcher.jsx` - Language/Currency switcher UI
3. **Modified**: `frontend/src/context/AppContext.jsx` - Added language/currency state and conversion logic
4. **Modified**: `frontend/src/components/Navbar.jsx` - Added LanguageSwitcher component

## Next Steps

To complete the implementation across the app:

1. Update all component files to use `t()` function for text
2. Update price displays to use `convertPrice()` function
3. Consider RTL (Right-to-Left) styling for Amharic if needed
4. Test language switching across all pages
5. Test currency conversion for all prices
