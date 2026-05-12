const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
    sendTo: String,

    hashedOtp: String,

    expiresAt: {
        type: Date,
        expires: 0,
    },

    attempts: {
        type: Number,
        default: 0,
    },
});

const OTP = mongoose.model("otp", otpSchema)
module.exports = OTP