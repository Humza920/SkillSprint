const { request } = require("express")
const mongoose = require("mongoose")
const { Schema } = mongoose
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
        minlength: 6
    },
    role: {
        type: String,
        enum: ["admin", "client", "freelancer"],
        default: "freelancer"
    },
    profile: {
        Bio: String,
        skills: [String],
        avatarimg: String
    }
},
    { timestamps: true }
)
const User = mongoose.model("User", userSchema)
module.exports = User