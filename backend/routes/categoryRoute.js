
import express from 'express'
import { editCategory,addCategory,removeCategory,singleCategory,listCategories } from '../controllers/categoryController.js'
import adminAuth from '../middleware/adminAuth.js'
import upload from '../middleware/multer.js'

const categoryRouter = express.Router()

categoryRouter.post('/add' ,upload.fields([{name:'image1', maxCount: 1}, {name:'image2', maxCount: 1}, {name:'image3', maxCount: 1}, {name:'image4', maxCount: 1}]) ,addCategory)
categoryRouter.get('/list', listCategories)
categoryRouter.put('/edit' , upload.fields([{name:'image1', maxCount: 1}, {name:'image2', maxCount: 1}, {name:'image3', maxCount: 1}, {name:'image4', maxCount: 1}]) ,adminAuth, editCategory)
categoryRouter.post('/remove' ,adminAuth, removeCategory)

export default categoryRouter
