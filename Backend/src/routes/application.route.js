const express = require("express")
const { applytoproject, getappliedapplications, actionofapplications, myfreelancerapplications } = require("../controllers/applicationcontroller")
const { protect } = require("../middleware/auth.middleware")
const { authorizeRoles } = require("../middleware/role.middleware")
const applicationRouter = express.Router()

applicationRouter.post("/applyon/:taskid", protect, authorizeRoles("freelancer"), applytoproject)
applicationRouter.get("/task/:taskid", protect, authorizeRoles("client"), getappliedapplications)
applicationRouter.patch("/:applicationid/respond", protect, authorizeRoles("client"), actionofapplications)
applicationRouter.get("/myapplications", protect, authorizeRoles("freelancer"), myfreelancerapplications)

module.exports = applicationRouter