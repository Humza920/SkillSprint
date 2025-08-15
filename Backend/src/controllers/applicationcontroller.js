const { default: mongoose } = require("mongoose")
const Application = require("../models/application.model")
const Task = require("../models/task.model")

exports.applytoproject = async (req, res) => {
    try {
        const { projectid } = req.params
        const { proposal, expectedbudget } = req.body
        const isTask = await Task.findById(taskid)
        if (!isTask) {
            return res.status(404).json({ success: false, message: "This Project is not present" })
        }
        if (isTask.status !== "open") {
            return res.status(400).json({ success: false, message: "This Project is already in progress" })
        }
        const application = await new Application({
            task: projectid,
            freelancer: req.user.id,
            proposal,
            expectedbudget
        })
        await application.save()
        res.status(200).json({ success: true, message: "Applied Successfully", application })
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ success: false, message: "You have already applied on this project", })
        }
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.getappliedapplications = async (req, res) => {
    try {
        const { taskid } = req.params
        const task = await Task.findById(taskid)
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" })
        }
        if (!String(task.client) === String(req.user.id)) {
            return res.status(400).json({ success: false, message: "Not authorize to view applications of this task" })
        }
        const appliedApplications = await Application.find({ task: taskid }).populate("freelancer", "name email")
        res.status(200).json({ success: true, appliedApplications })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.actionofapplications = async (req, res) => {
    const session = mongoose.startSession()
    try {
        const { applicationid } = req.params
        const { action } = req.body
        if (action !== "accept" && action !== "reject") {
            res.status(400).json({ message: "Unvalid action" })
        }
        const currentapplication = Application.findById(applicationid).populate("task")
        if (!currentapplication) {
            res.status(400).json({ message: "Application not found" })
        }
        const currenttask = Task.findById(currentapplication.task._id)
        if (!currenttask) {
            res.status(400).json({ message: "Task not found" })
        }
        if (String(currenttask.client) !== String(req.user._id)) {
            return res.status(400).json({ success: false, message: "Not authorize to respond to this application" })
        }
        if (action === "reject") {
            currentapplication.status = "rejected"
            await currentapplication.save()
            res.status(200).json({ success: true, message: "Application rejected successfully", currentapplication })
        }
        await session.withTransaction(async () => {
            const taskinTx = Task.findById(currenttask._id).session(session)
            if (taskinTx.assignedTo) {
                return res.status(400).json({
                    success: false,
                    message: "Task already has an assigned freelancer"
                });
            }
            currentapplication.status = "accepted"
            await currentapplication.save({ session })
            taskinTx.assignedTo = currentapplication.freelancer
            taskinTx.status = "in-progress"
            await taskinTx.save({ session })
            await Application.updateMany(
                { task: taskinTx._id, _id: { $ne: applicationid }, status: "pending" },
                { $set: { status: "rejected" } },
                { session }
            )
            const updatedApp = Application.findById(applicationid).populate("freelancer", "name email")
            res.status(200).json({ success: true, message: "Application accepted", application: updatedApp });
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    } finally {
        session.endSession()
    }
}

exports.myfreelancerapplications = async (req, res) => {
    try {
        const { id } = req.user.id
        const myapplications = Application.find({ freelancer: id }).populate("task", "title , description , client , budget , deadline").sort({createdat:-1})
        res.status(200).json({success:true , message:"Your Applications" , myapplications})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
