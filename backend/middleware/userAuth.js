// middleware/userAuth.js
import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {

  const { usertoken } = req.headers;



  if (!usertoken) {
    return res.status(401).json({
      success: false,
      message: 'No Authorized Login Again...'
    });
  }

  try {
    const token_decode = jwt.verify(usertoken, process.env.JWT_SECRET);
   
    
    
    req.userId = token_decode.id;
    next();
  } catch (error) {
    console.log('Auth error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid token'
    });
  }
};

export default userAuth;