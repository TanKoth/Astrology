const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRET_KEY;

const auth =(req,res,next) =>{
  try{
    console.log("Headers", req.headers);
    console.log("Authorization Header", req.headers.authorization);
    if(!req.headers.authorization){
      return res.status(401).json({success: false, message: "No token provided"});
    }
    const token = req.headers.authorization.split(" ")[1];
    if(!token){
      return res.status(401).json({success: false, message: "No token provided"});
    } 
    const verifyToken = jwt.verify(token,JWT_SECRET);
    console.log("Token verified:", verifyToken);
    if(!verifyToken){
      return res.status(401).json({success: false, message: "Invalid token"});
    }
    req.body.userId = verifyToken.UserId; // Attach userId to request body
    req.body = verifyToken
    
    next();
  }catch(error){
    return res.status(500).json({success: false, message: "Token Invalid", error: error.message});
  }
}


module.exports = auth;