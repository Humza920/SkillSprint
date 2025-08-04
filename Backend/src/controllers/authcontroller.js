const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const generateToken = require("../utils/generatetoken")
const validator = require("validator")
exports.registeruser = async (req, res) => {
    const { username, email, password } = req.body
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Fill all the fields" })
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

        const hashPass = await bcrypt.hash(password, process.env.SALTED_ROUNDS)
        const user = await new User({
            username,
            email,
            hashPass
        })
        await user.save()
        const token = generateToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        res.status(200).json(user)
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
        const userchecking = await User.findOne({ email }.select("+password"))
        if (!userchecking) {
            res.status(400).json({ message: "User with this email does not exist" })
        }
        const hashPass = bcrypt.compare(password, userchecking.password)
        if (!hashPass) {
            res.status(400).json({ message: "Invalid Credentials" })
        } else {
            const token = generateToken(userchecking._id)
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })

            const { password, ...userwithoutpass } = userchecking._doc
            res.status(200).json({ message: "Login Sucessfull" })
            res.send(userwithoutpass)
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.logout = async (req, res) => {
    res.clearCookie("token")
    res.send("logout successful")
}