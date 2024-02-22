// middle ware user to authenticate the user


const jwt = require('jsonwebtoken');

module.exports = async function(req,resp,next){
    const token = req.header('Authorization');

    if(!token){
        return resp.status(401).json({
            msg:'No token authorization denied'
        });
    }

    try{
        await jwt.verify(token,process.env.jwtUserSecret,(err,decoded)=>{
            if(err){
                resp.status(401).json({
                    msg:'Token not valid'
                });
            }
            else{
                req.user = decoded.user;
                next();
            }
        });
    }catch(err){
        console.log("something went wrong with middleware"+err);
        resp.status(500).json({
            msg:'server error'
        });
    }
};