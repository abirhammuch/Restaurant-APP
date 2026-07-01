
import express from 'express'

import { addFood, listFood, removeFood, singleFood ,editFood} from '../controllers/foodController.js'
import adminAuth from '../middleware/adminAuth.js'
import upload from '../middleware/multer.js'

const foodRouter = express.Router()

foodRouter.post('/add',upload.fields([{name:'image1', maxCount: 1}, {name:'image2', maxCount: 1}, {name:'image3', maxCount: 1}, {name:'image4', maxCount: 1}]) , addFood)
foodRouter.get('/list', listFood)
foodRouter.post('/single', singleFood)
foodRouter.post('/remove', adminAuth,removeFood)
foodRouter.put('/edit',upload.fields([{name:'image1', maxCount: 1}, {name:'image2', maxCount: 1}, {name:'image3', maxCount: 1}, {name:'image4', maxCount: 1}]), adminAuth,editFood)

export default foodRouter