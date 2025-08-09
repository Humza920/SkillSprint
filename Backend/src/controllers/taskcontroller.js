const Task = require("../models/task.model")

exports.createproject = async (req, res) => {
    try {
        const { title, description, budget, deadline, skillsRequired, category, attachments, proposals, tags } = req.body
        if (req.user.role !== "client") {
            return res.status(403).json({ message: "Only Client" });
        }
        const task = await new Task({
            title,
            description,
            budget,
            deadline,
            skillsRequired,
            category,
            attachments,
            client: req.user.id,
            proposals,
            tags
        })
        await task.save()
        res.status(200).json({
            sucess: true,
            message: "Your project post is now live",
            task
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
exports.getallprojects = async (req, res) => {
    try {
        const allProjects = await Task.find().populate("client", "name email")
        res.status(200).json({
            success: true,
            allProjects
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getuserprojects = async (req, res) => {
    try {
        const allprojects = await Task.find({ client: req.user._id })
        res.status(200).json({
            success: true,
            allprojects
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}