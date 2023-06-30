const jwt = require('jsonwebtoken')
const User = require('../Models/User')

const  isAuth = async(req, res, next)=>{
    try {
        const token = req.headers['x-auth-token']
        if (!token) {
            return res.status(401).json({message:'no token'})
        }
        const decoded =  jwt.verify(token , process.env.JWT_KEY)
        const id = decoded.userId
        const user = await User.findById(id)
        res.user = user
        next()
    } catch (error) {
        res.status(500).json({message:error.message})  
    }
}
module.exports = isAuth
