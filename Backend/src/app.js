const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Top par add karo sabse pehle
const authRouter = require("./routes/auth.route")
const projectRouter = require("./routes/task.route");
const applicationRouter = require("./routes/application.route");
app.use(express.json())
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}))
app.use("/auth" , authRouter)
app.use("/project" , projectRouter)
app.use("application",applicationRouter)
module.exports = app