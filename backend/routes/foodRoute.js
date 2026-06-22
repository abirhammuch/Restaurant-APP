
import express from 'express'

import { addFood, listFood, removeFood, singleFood } from '../controllers/foodController.js'
import adminAuth from '../middleware/adminAuth.js'
import upload from '../middleware/multer.js'

const foodRouter = express.Router()

foodRouter.post('/add',upload.fields([{name:'image1', maxCount: 1}, {name:'image2', maxCount: 1}, {name:'image3', maxCount: 1}, {name:'image4', maxCount: 1}]) , addFood)
foodRouter.get('/list', listFood)
foodRouter.post('/remove', singleFood)
foodRouter.post('/single', adminAuth,removeFood)

export default foodRouter