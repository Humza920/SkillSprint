const jwt = require("jsonwebtoken")
async function generateToken(userId) {
    const token = await jwt.sign({ id: userId }, process.env.SECRET_KEY_JWT, {
        expiresIn: "2d"
    })
    return token
}
module.exports = generateToken