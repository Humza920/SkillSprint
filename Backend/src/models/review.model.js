const mongoose = require("mongoose")
const Task = require("./task.model")
const User = require("./user.model")
const { Schema } = mongoose
const reviewSchema = new Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Task,
        index: true,
        unique: true,
        required
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required
    },
    reviewrating: {
        type: Number,
        min: 0,
        max: 10,
        required
    },
    reviewcomment: {
        type: String,
        maxLength: 500,
        trim: true
    }
},
    {
        timestamps: true,
        collection: "reviews"
    })

const Review = mongoose.model("Review", reviewSchema)
module.exports = Review