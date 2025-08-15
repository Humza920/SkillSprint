const express = require("express")
const { sendingclientreview } = require("../controllers/reviewcontroller")
const reviewRouter = express.Router()
reviewRouter.post("/:taskid", protect, authorizeRoles("client"), sendingclientreview)
module.exports = reviewRouter