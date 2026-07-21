# Example: Updating FoodCard Component

## Before (Current Implementation)

```jsx
const FoodCard = ({ food }) => {
  const { currency, navigate, setFoodDetail, addToCart, backendUrl } =
    useContext(AppContext);

  // ... rest of component

  // Price display:
  <p className="text-lg font-bold text-amber-500">
    {currency}
    {item.price?.toFixed(2) || "0.00"}
  </p>;
};
```

## After (With Currency Conversion)

```jsx
const FoodCard = ({ food }) => {
  const {
    currency,
    convertPrice,
    navigate,
    setFoodDetail,
    addToCart,
    backendUrl,
  } = useContext(AppContext);

  // ... rest of component

  // Price display with conversion:
  <p className="text-lg font-bold text-amber-500">
    {currency}
    {convertPrice(item.price)?.toFixed(2) || "0.00"}
  </p>;
};
```

## Step-by-Step Update

1. **Add `convertPrice` to the useContext destructuring:**

   ```jsx
   const { currency, convertPrice, ... } = useContext(AppContext);
   ```

2. **Update price displays:**

   ```jsx
   // Before:
   {
     currency;
   }
   {
     item.price;
   }

   // After:
   {
     currency;
   }
   {
     convertPrice(item.price);
   }
   ```

3. **Test:** The prices should now update when user changes currency in the LanguageSwitcher

## Other Components to Update Similarly

- **Cart.jsx** - Update subtotal, tax, total, delivery_fee
- **CartPage.jsx** - All price displays
- **Checkout.jsx** - Order total
- **OrderDetail.jsx** - Order amounts
- **FoodDetail.jsx** - Food price display
- **Popular.jsx** - Popular items prices
- **Menu.jsx** - Menu items prices

## Quick Find & Replace Patterns

In all components showing prices:

### Pattern 1: Currency symbol + price

```
Search: {currency}\s*{.*?\.price
Replace: {currency} {convertPrice(item.price)}
```

### Pattern 2: Delivery fee

```
Search: {currency}\s*{delivery_fee
Replace: {currency} {delivery_fee}
```

This is already handled by AppContext since delivery_fee is already converted.

### Pattern 3: Tax calculation

```
Search: {currency}\s*{.*?\*\s*tax
Replace: {currency} {convertPrice(totalAmount) * tax / 100}
```

Adjust formula as needed for your specific calculation.

## Important Notes

- `convertPrice()` converts USD prices to the selected currency
- Only pass USD prices to `convertPrice()`
- The `currency` symbol is already dynamic ($ for USD, ብር for ETB)
- `delivery_fee` is already converted in AppContext
- For tax: calculate as percentage AFTER converting total price
