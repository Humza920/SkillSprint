const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const generateToken = require("../utils/generatetoken")
const validator = require("validator")

exports.registeruser = async (req, res) => {
    const { username, email, password, role} = req.body
    try {
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: "Fill all the fields (including role)" })
        }
        else if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid Email address" })
        }
        else if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: "Password must be strong (e.g., include uppercase, lowercase, numbers, symbols, 8+ characters)." })
        }
        const checkinguser = await User.findOne({ email })
        if (checkinguser) {
            return res.status(400).json({ message: "User already exists with this email" })
        }

        const hashPass = await bcrypt.hash(password, Number(process.env.SALTED_ROUNDS))
        const user = await new User({
            username,
            email,
            password: hashPass,
            role
        })
        await user.save()
            const { password: hashPassword, ...userwithoutpass } = user._doc

        const token = await generateToken(user._id)
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        res.status(200).json({
                message: "Signup Successful",
                userwithoutpass
            })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.loginuser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email) {
            res.status(400).json({ message: "Enter your Email" })
        }
        if (!password) {
            res.status(400).json({ message: "Enter your Password" })
        }
        const userchecking = await User.findOne({ email }).select("+password")
        if (!userchecking) {
            res.status(400).json({ message: "User with this email does not exist" })
        }
        const hashPass =await bcrypt.compare(password, userchecking.password)
        if (!hashPass) {
            res.status(400).json({ message: "Invalid Credentials" })
        } else {
            const token =await generateToken(userchecking._id)
            res.cookie("token", token, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })

            const { password, ...userwithoutpass } = userchecking._doc
            res.status(200).json({
                message: "Login Successful",
                user: userwithoutpass
            })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.logoutuser = async (req, res) => {
    try {
        res.clearCookie("token")
        res.send("logout successful")
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}