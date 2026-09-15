const roles = require("../data/roles")
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "clinic",
        default: null
    },
    userName: String,
    email: String,
    password: String,
    phoneNumber: {
        type: String,
        unique: true,
        required: true,
    },
    role: {
        type: String,
        enum: [roles.ADMIN, roles.MANAGER]
    },
})

const User = mongoose.model("user", userSchema)
module.exports = User