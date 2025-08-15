const Review = require("../models/review.model")
const Task = require("../models/task.model")

exports.sendingclientreview = async (req, res) => {
    try {
        const taskid = req.params
        const { reviewrating, reviewcomment } = req.body
        const task = await Task.findById(taskid).populate("assignedTo client")
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }
        if (String(task.client._id) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not authorize to review" })
        }
        if (task.status === "completed") {
            return res.status(400).json({ message: "Task not completed yet" })
        }

        const existingreview = await Review.find({ task: taskid })
        if (existingreview) {
            return res.status(400).json({ message: "Review already given" })
        }
        const review = await new Review({
            freelancer: task.assignedTo,
            client: req.user._id,
            task: taskid,
            reviewrating,
            reviewcomment
        })
        await review.save()
        res.status(200).json({ success: true, message: "Review submitted", review })
    } catch (error) {
        console.error("Error in submitting review", error)
        res.status(500).json({ success: false, message: "Server error" })
    }
}