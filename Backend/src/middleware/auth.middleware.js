const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

exports.protect = async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        return res.status(400).json({ message: "Unauthorized, no token" })
    }
    
    try {
        const decode = await jwt.verify(token, process.env.SECRET_KEY_JWT)
        const {id} = decode
        const user = await User.findById(id)
        req.user = user
        next()
    } catch (error) {
        res.status(400).json({ message: "Unvalid token" })
    }
}