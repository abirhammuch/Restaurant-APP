

import jwt from 'jsonwebtoken'

const userAuth = async (req , res , next ) => {
  const { usertoken } = req.headers
  if (!usertoken) {
    return res.json({success:false, message:'No Authorized Login Again'})
  }
 try {
   const token_decode = jwt.verify(usertoken, process.env.JWT_SECRET)
  req.body.userId = token_decode.id
  next()
 } catch (error) {
  console.log(error);
  res.json({success:false, message:error.message})
  
 }
}

export default userAuth