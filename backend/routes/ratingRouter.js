// routes/ratingRouter.js
import express from 'express';
import {
  addRating,
  getFoodRatings,
  getUserRatings,
  getPurchasedItems,
  checkCanRate,
  updateRating,
  deleteRating,
  getAllRatings,
  toggleHideRating,
  addAdminResponse,
  deleteRatingAsAdmin  // ✅ Added
} from '../controllers/ratingController.js';
import userAuth from '../middleware/userAuth.js';
import adminAuth from '../middleware/adminAuth.js';

const ratingRouter = express.Router();

// ✅ Public routes (anyone can view)
ratingRouter.get('/food/:foodId', getFoodRatings);

// ✅ User routes (authenticated)
ratingRouter.get('/user/purchased', userAuth, getPurchasedItems);
ratingRouter.get('/user/ratings', userAuth, getUserRatings);
ratingRouter.get('/check', userAuth, checkCanRate);
ratingRouter.post('/add', userAuth, addRating);
ratingRouter.put('/:ratingId', userAuth, updateRating);
ratingRouter.delete('/:ratingId', userAuth, deleteRating);

// ✅ Admin routes
ratingRouter.get('/admin/all', adminAuth, getAllRatings);
ratingRouter.put('/admin/hide/:ratingId', adminAuth, toggleHideRating);
ratingRouter.put('/admin/response/:ratingId', adminAuth, addAdminResponse);
ratingRouter.delete('/admin/delete/:ratingId', adminAuth, deleteRatingAsAdmin);  // ✅ Added

export default ratingRouter;