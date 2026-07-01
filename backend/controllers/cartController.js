// controllers/cartController.js
import userModel from '../models/userModel.js';
import foodModel from '../models/foodModel.js';

// Add to Cart - FIXED WITH markModified()
const addToCart = async (req, res) => {
  try {
  
    
    const userId = req.userId;
    const { foodId, quantity = 1 } = req.body;
    
    
    
    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: 'Food ID is required'
      });
    }
    
    // Check if food exists
    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }
    
    console.log('Food found:', food.name);
    
    // Get user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log('User found:', user.name);
    
    // Initialize cartData if empty
    if (!user.cartData) {
      user.cartData = {};
    }
    
    // Add or update item
    if (user.cartData[foodId]) {
      user.cartData[foodId].quantity += quantity;
      user.cartData[foodId].totalPrice = user.cartData[foodId].price * user.cartData[foodId].quantity;
      console.log('Updated existing item. New quantity:', user.cartData[foodId].quantity);
    } else {
      user.cartData[foodId] = {
        foodId: food._id,
        name: food.name,
        price: food.price,
        quantity: quantity,
        image: food.images?.[0] || '',
        totalPrice: food.price * quantity
      };
      console.log('Added new item:', food.name);
    }
    
    console.log('CartData before save:', JSON.stringify(user.cartData, null, 2));
    
    // ✅ CRITICAL FIX: Tell Mongoose that cartData has changed
    user.markModified('cartData');
    
    // ✅ Save user
    const savedUser = await user.save();
    console.log('User saved successfully');
    
    // ✅ Verify save by fetching fresh data
    const verifiedUser = await userModel.findById(userId);
    console.log('Verified cartData from DB:', JSON.stringify(verifiedUser.cartData, null, 2));
    
    // Calculate response
    const items = Object.values(verifiedUser.cartData || {});
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        items: items,
        subtotal: subtotal,
        total: subtotal,
        count: count
      }
    });
    
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
};

// Update Cart Item - FIXED WITH markModified()
const updateCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { foodId, quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }
    
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!user.cartData || !user.cartData[foodId]) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    user.cartData[foodId].quantity = quantity;
    user.cartData[foodId].totalPrice = user.cartData[foodId].price * quantity;
    
    // ✅ CRITICAL FIX: Tell Mongoose that cartData has changed
    user.markModified('cartData');
    
    await user.save();
    
    const items = Object.values(user.cartData);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({
      success: true,
      message: 'Cart updated',
      cart: {
        items: items,
        subtotal: subtotal,
        total: subtotal,
        count: count
      }
    });
    
  } catch (error) {
    console.log('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Remove from Cart - FIXED WITH markModified()
const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { foodId } = req.body;
    
    console.log('=== REMOVE FROM CART ===');
    console.log('User ID:', userId);
    console.log('Food ID:', foodId);
    
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!user.cartData || !user.cartData[foodId]) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    delete user.cartData[foodId];
    
    // ✅ CRITICAL FIX: Tell Mongoose that cartData has changed
    user.markModified('cartData');
    
    await user.save();
    
    const items = Object.values(user.cartData);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: {
        items: items,
        subtotal: subtotal,
        total: subtotal,
        count: count
      }
    });
    
  } catch (error) {
    console.log('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Clear Cart
const clearCart = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.cartData = {};
    
    // ✅ CRITICAL FIX: Tell Mongoose that cartData has changed
    user.markModified('cartData');
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Cart cleared',
      cart: {
        items: [],
        subtotal: 0,
        total: 0,
        count: 0
      }
    });
    
  } catch (error) {
    console.log('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Cart
const getCart = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const cartData = user.cartData || {};
    const items = Object.values(cartData);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({
      success: true,
      cart: {
        items: items,
        subtotal: subtotal,
        total: subtotal,
        count: count
      }
    });
    
  } catch (error) {
    console.log('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Cart Count
const getCartCount = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const cartData = user.cartData || {};
    const count = Object.values(cartData).reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({
      success: true,
      count
    });
    
  } catch (error) {
    console.log('Get cart count error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Export
export {
  getCart as getUserCart,
  addToCart,
  updateCartItem as updateCart,
  removeFromCart,
  clearCart,
  getCartCount
};