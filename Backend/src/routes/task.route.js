const express = require("express")
const {createproject , getallprojects , getuserprojects} = require("../controllers/taskcontroller")
const {protect} = require("../middleware/auth.middleware")
const {authorizeRoles} = require("../middleware/role.middleware")
const projectRouter = express.Router()

projectRouter.post("/createproject" , protect , authorizeRoles("client") , createproject)
projectRouter.get("/getallprojects" , getallprojects)
projectRouter.get("/getuserprojects" , protect , authorizeRoles("client") , getuserprojects)

module.exports = projectRouter