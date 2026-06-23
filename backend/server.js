

import express from 'express' //first
import cors from 'cors' //first
import dotenv from "dotenv/config"; //first
import connectDB from './config/mongodb.js' 
import userRouter from './routes/userRoute.js';
import foodRouter from './routes/foodRoute.js';
import connectCloudinary from './config/cloudinary.js';






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
app.use('/', (req, res) => res.send('API is working') )   //first




import { v2 as cloudinary } from "cloudinary";

app.get("/cloudinary-test", async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json(result);
  } catch (error) {
    console.log("Cloudinary Test Error:", error);
    res.json(error);
  }
});


app.listen(port, () => console.log(`Server started on http://localhost:${port}`))   //first