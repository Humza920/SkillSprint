const mongoose = require("mongoose")
const Task = require("./task.model")
const User = require("./user.model")
const { Schema } = mongoose
const applicationschema = new Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Task,
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    proposal: {
        type: String,
        trim: true
    },
    expectedbudget: {
        type: Number,
    },
    status: {
        type: String,
        enum: ["accepted", "pending", "rejected"],
        default: "pending"
    }
},
    {
        timestamps: true,
        collection: applications
    }
) 

applicationschema.index({task:-1 , freelancer:1}, {unique:true})

const Application = mongoose.model("Application",applicationschema)

module.exports = Application