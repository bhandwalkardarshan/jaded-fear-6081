const jwt = require("jsonwebtoken")
const authentication = (req,res,next)=>{
    const token = req.headers.auth
    if(token){
        jwt.verify(token,"masai",(err,decoded)=>{
            if(decoded){
                req.body.userId=decoded.userId
                next()
            }
            else {
                res.send({"msg":"Please login here"})
            }
        })
    }
    else {
        res.send({"msg":"Please login"})
    }
}

module.exports={
    authentication
}