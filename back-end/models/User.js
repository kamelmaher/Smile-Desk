const roles = require("../data/roles")
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    clinicId: String,
    userId: String,
    userName: String,
    email: String,
    password: String,
    phoneNumber: String,
    role: {
        type: String,
        enum: [roles.ADMIN, roles.MANAGER]
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

const User = mongoose.model("User", userSchema)
module.exports = User