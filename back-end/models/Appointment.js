const { ACCEPTED, DECLINED, PENDING } = require("../data/appointmentStatus")
const mongoose = require("mongoose")
const appointmentSchema = new mongoose.Schema({
    appointmentId: String,
    clinicId: String,
    status: {
        type: String,
        enum: [ACCEPTED, DECLINED, PENDING],
        default: PENDING
    },
    date: {
        type: Date,
        required: true,
    },

    // Patient Data
    patientName: {
        type: String,
        required: true
    },
    patientPhoneNumber: {
        type: String,
        required: true
    },
    patientAddress: {
        type: String,
        reqiured: true
    },
    notes: String
})

const Appointment = mongoose.model("Appointment", appointmentSchema)
module.exports = Appointment