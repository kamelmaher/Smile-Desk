const { ACCEPTED, DECLINED, PENDING } = require("../data/appointmentStatus")
const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema({
    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "clinic",
        required: true
    },
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
        required: true
    },
    patientEmail: String,
    notes: String
})

appointmentSchema.index(
    { clinicId: 1, date: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: { $in: [ACCEPTED, PENDING] }
        }
    }
)

const Appointment = mongoose.model("appointment", appointmentSchema)
module.exports = Appointment