
import jwt from 'jsonwebtoken'

const adminAuth = async (req , res , next) => {
 const { admintoken} = req.headers
 console.log(req.headers)
 if (!admintoken) {
  return res.json({success:false, message:'Not Authorized Login Again..pp.'})
  console.log(admintoken)
 }
 try {
  const token_decode = jwt.verify(admintoken, process.env.JWT_SECRET)
  if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
    return res.json({success:false, message: 'Not Authorized Login Again'})
  }
  next()
 } catch (error) {
  console.log(error);
  res.json({success:false, message:error.message})
  
 }
}

export default adminAuth