const plans = require("../data/plans")
const mongoose = require("mongoose")
const { DEFAULT_CLINIC_WORKING_HOURS } = require("../data/clinic")
const clinicSchema = new mongoose.Schema({
    clinicId: String,
    userId: String,
    clinicName: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    phoneNumber: String,
    logo: String,
    description: String,
    email: String,
    address: String,
    plan: {
        type: String,
        enum: [plans.FREE, plans.MONTHLY, plans.UNLIMITED],
        default: plans.FREE
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    validTo: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    workingHours: {
        type: [
            {
                day: {
                    type: Number,
                    required: true
                },
                isOpen: {
                    type: Boolean,
                    default: true
                },
                start: String,
                end: String
            }
        ],
        default: DEFAULT_CLINIC_WORKING_HOURS
    }
})

const Clinic = mongoose.model("Clinic", clinicSchema)
module.exports = Clinic