// routes/cartRouter.js
import express from 'express';
import userAuth from '../middleware/userAuth.js';
import {
  getUserCart,   // ✅ Now this exists (alias)
  addToCart,
  updateCart,     // ✅ Now this exists (alias)
  clearCart,
  getCartCount,
  removeFromCart
} from '../controllers/cartController.js';

const cartRouter = express.Router();

cartRouter.post('/add', userAuth, addToCart);
cartRouter.get('/get', userAuth, getUserCart);
cartRouter.put('/update', userAuth, updateCart);
cartRouter.get('/count', userAuth, getCartCount);
cartRouter.delete('/clear', userAuth, clearCart);
cartRouter.delete('/remove', userAuth, removeFromCart);

export default cartRouter;