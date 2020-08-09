const jwt = require('jsonwebtoken');

const authToken = async (req, res, next)=> {
    const token = req.header('auth-token');


    if(!token){
        return res.status(401).json({message: 'Access denied'});
    }
    try {
        const validId =jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = validId;
        next();
    } catch (err) {
        res.status(400).json({
            message: 'Token invalid access denied'
        })
    }
}

module.exports = authToken;