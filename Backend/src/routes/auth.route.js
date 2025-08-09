const express = require("express")
const {registeruser , loginuser , logoutuser} = require("../controllers/authcontroller")
const authRouter = express.Router()
authRouter.post("/register" , registeruser)
authRouter.post("/login" , loginuser)
authRouter.post("/logout" , logoutuser)
module.exports = authRouter