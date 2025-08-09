const Application = require("../models/application.model")
const Task = require("../models/task.model")

exports.applytoproject = async (req, res) => {
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
    res.status(200).json({ seccess: true, message: "Applied Successfully", application })
}

exports.getappliedapplications = async (req , res) => {
    const {taskid} = req.params
    const task = await Task.findById(taskid)
    if (!task) {
        return res.status(404).json({success:false , message:"Task not found"})
    }
    if (!String(task.client) === String(req.user.id) ) {
        return res.status(400).json({success:false , message:"Not authorize to view applications of this task"})     
    }
    const appliedApplications = await Application.find({task:taskid})
    res.status(200).json({success:true , appliedApplications})
}