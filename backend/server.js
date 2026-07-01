

import express from 'express' //first
import cors from 'cors' //first
import dotenv from "dotenv/config"; //first
import connectDB from './config/mongodb.js' 
import userRouter from './routes/userRoute.js';
import foodRouter from './routes/foodRoute.js';
import connectCloudinary from './config/cloudinary.js';
import categoryRouter from './routes/categoryRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';






const app = express() //first
const port = process.env.PORT || 4000 //first
connectDB()
connectCloudinary()



//middleware
app.use(express.json()) //first
app.use(cors())   //first


//end point
app.use('/api/user', userRouter)
app.use('/api/food', foodRouter)
app.use('/api/category', categoryRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order',orderRouter)
app.use('/', (req, res) => res.send('API is working') )   //first








app.listen(port, () => console.log(`Server started on http://localhost:${port}`))   //first