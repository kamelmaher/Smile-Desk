const mongoose = require('mongoose');
const plans = require("../data/plans")
const { DEFAULT_CLINIC_WORKING_HOURS } = require("../data/clinic")

const clinicSchema = new mongoose.Schema({
    clinicName: {
        type: String, required: true, unique: true, trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phoneNumber: String,
    logo: String,
    description: String,
    email: String,
    address: String,
    subscription: {
        plan: {
            type: String,
            enum: Object.values(plans),
            default: plans.TRIAL
        },

        status: {
            type: String,
            enum: ['active', 'expired', 'canceled'],
            default: 'active'
        },

        startedAt: {
            type: Date,
            default: Date.now
        },
        trialEndsAt: {
            type: Date
        },
        currentPeriodEnd: {
            type: Date
        },
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
}, { timestamps: true });

clinicSchema.methods.isSubscriptionActive = function () {
    const sub = this.subscription;
    const now = new Date();

    if (sub.status !== 'active') return false;
    if (sub.plan === plans.LIFETIME) return true;
    if (sub.plan === plans.TRIAL) return !!sub.trialEndsAt && sub.trialEndsAt > now;
    return !!sub.currentPeriodEnd && sub.currentPeriodEnd > now;
};

const Clinic = mongoose.model("clinic", clinicSchema)
module.exports = Clinic