const mongoose = require("mongoose")
const User = require("./user.model")
const { Schema } = mongoose
const taskschema = new Schema({
    title: {
        type: String,
        required: [true, "Task title is required"],
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: [true, "Task description is required"],
        maxlength: 2000
    },
    budget: {
        type: Number,
        required: [true, "Task budget is required"],
        min: 5
    },
    deadline: {
        type: Date,
        required: [true, "Deadline is required"]
    },
    status: {
        type: String,
        enum: ["open", "in-progress", "completed", "cancelled"],
        default: "open"
    },
    category: {
        type: String,
        required: [true, "category is required"],
        trim: true
    },
    skillsRequired: [{
        type: String,
        trim: true,
        required : true
    }],
    attachments: [{
        type: String
    }],
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        default: null
    },
    proposals: [{
        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User
        },
        bidamount: {
            type: Number,
            required: true
        },
        coverletter: {
            type: String,
            maxlength: 1000
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    tags: [{
        type: String,
        trim: true
    }]
},
    {
        timestamps: true,
        collection: "tasks"
    }
)

const Task = mongoose.model("Task",taskschema)

module.exports = Task