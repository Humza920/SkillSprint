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
        // Common fields (freelancer & client)
        avatarImg: {
            type: String,
            default: "",
        },
        location: {
            city: { type: String, trim: true },
            country: { type: String, trim: true },
        },

        // Freelancer fields
        bio: {
            type: String,
            maxlength: 500,
            trim: true,
        },
        skills: [
            {
                type: String,
                trim: true,
            },
        ],
        website: {
            type: String,
            trim: true,
        },
        socialLinks: {
            linkedin: { type: String, trim: true },
            github: { type: String, trim: true },
            twitter: { type: String, trim: true },
            instagram: { type: String, trim: true },
        },

        // Client fields (optional for freelancer)
        companyName: {
            type: String,
            trim: true,
        },
        companyWebsite: {
            type: String,
            trim: true,
        },
        industry: {
            type: String,
            trim: true,
        },
        teamSize: {
            type: Number,
            min: 1,
        },
    }
},
    { timestamps: true }
)
const User = mongoose.model("User", userSchema)
module.exports = User