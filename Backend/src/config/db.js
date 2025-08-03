const mongoose = require("mongoose")

const connectionWithDb = async () => {
    try {
        await mongoose.connect(process.env.DATA_BASE_URI)
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error(`❌ Error: ${error.message}`)
        process.exit(1)
    }
}
module.exports = connectionWithDb 