var jwt = require('jsonwebtoken')
const secret = "kudshfldsslaffbknnlsdf"

const fetchuser =  (req,res,next) => {
    // get user from the jwt token

    const token =  req.header('auth-token')
    console.log(token)
    if(!token){
        res.status(401).send({error:"Please authenticate using a valid token"})
    }
    try {
        console.log('you are here')
        const data = jwt.verify(token,secret)
        console.log(data.user)
        req.user = data.user;
        next();
        
    } catch (error) {
        res.status(401).send({error:"Please authenticate using a valid token"})
    }


}

module.exports = fetchuser;