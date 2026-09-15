const Clinic = require("../models/Clinic")
const statusText = require("../data/statusText");
const { MAIN_LIMIT } = require("../data/constants");
const plans = require("../data/plans");
const getSlug = require("../utils/geSlug")
const dayjs = require("dayjs")

const getSubscribedClinics = async (req, res) => {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1)
    const skip = (page - 1) * MAIN_LIMIT
    const now = new Date()
    const activeFilter = {
        $or: [
            { "subscription.plan": plans.TRIAL, "subscription.status": "active", "subscription.trialEndsAt": { $gt: now } },
            { "subscription.plan": { $in: [plans.MONTHLY, plans.ANNUAL] }, "subscription.status": "active", "subscription.currentPeriodEnd": { $gt: now } },
            { "subscription.plan": plans.LIFETIME, "subscription.status": "active" },
        ],
    }

    try {
        const [clinics, total] = await Promise.all([
            Clinic.find(activeFilter).sort({ createdAt: -1 }).limit(MAIN_LIMIT).skip(skip),
            Clinic.countDocuments(activeFilter),
        ])
        return res.json({ status: statusText.SUCCESS, clinics, pages: Math.ceil(total / MAIN_LIMIT) })
    } catch {
        return res.status(500).json({ status: statusText.ERROR, data: "Unable to load clinics" })
    }
}

const getClinicBySlug = async (req, res) => {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ status: statusText.ERROR, data: "Clinic slug is required" })
    try {
        const clinic = await Clinic.findOne({ slug: slug.trim().toLowerCase() })
        if (!clinic) return res.status(404).json({ status: statusText.ERROR, data: "Clinic Not Found" })
        return res.json({ status: statusText.SUCCESS, clinic })
    } catch {
        return res.status(500).json({ status: statusText.ERROR, data: "Unable to load clinic" })
    }
}

const updateClinic = async (req, res) => {
    const { clinicId } = req.user;
    if (!clinicId) return res.status(401).json({ status: statusText.ERROR, data: "Clinic id is required" })
    const updateData = { ...req.body };
    try {
        if (updateData.clinicName) {
            const slug = getSlug(updateData.clinicName)
            const duplicate = await Clinic.findOne({
                $or: [{ clinicName: updateData.clinicName }, { slug }],
                _id: { $ne: clinicId },
            })
            if (duplicate) return res.status(409).json({ status: statusText.FAIL, data: "Clinic name is already in use" })
            updateData.slug = slug
        }

        const clinic = await Clinic.findByIdAndUpdate(
            clinicId,
            { $set: updateData },
            { new: true, runValidators: true }
        )
        if (!clinic) return res.status(404).json({ status: statusText.ERROR, data: "Clinic not found" })
        return res.json({ status: statusText.SUCCESS, data: clinic })
    } catch (err) {
        if (err?.code === 11000) return res.status(409).json({ status: statusText.FAIL, data: "Clinic name or slug is already in use" })
        return res.status(500).json({ status: statusText.ERROR, data: "Unable to update clinic" })
    }
}

const getClinicDetails = async (req, res) => {
    if (req.clinic) return res.json({ status: statusText.SUCCESS, clinic: req.clinic })
    return res.status(404).json({ status: statusText.FAIL, data: "Clinic Not Found" })
}

const getAllClinics = async (req, res) => {
    try {
        const clinics = await Clinic.find().sort({ createdAt: -1 });
        return res.json({ status: statusText.SUCCESS, clinics })
    } catch {
        return res.status(500).json({ status: statusText.ERROR, data: "Unable to load clinics" })
    }
}

const subscribe = async (req, res) => {
    try {
        const { clinicId, plan } = req.body;
        if (!clinicId) return res.status(400).json({ status: statusText.ERROR, data: "Clinic id is required" })

        const clinic = await Clinic.findById(clinicId)
        if (!clinic) return res.status(404).json({ status: statusText.ERROR, data: "العيادة غير موجودة" })

        const now = dayjs()
        const currentPeriodEnd = clinic.subscription?.currentPeriodEnd
            ? dayjs(clinic.subscription.currentPeriodEnd)
            : now
        const startDate = currentPeriodEnd.isAfter(now) ? currentPeriodEnd : now
        const update = {
            "subscription.plan": plan,
            "subscription.status": "active",
            "subscription.startedAt": now.toDate(),
        }

        if (plan === plans.LIFETIME) {
            update["subscription.currentPeriodEnd"] = null
        } else {
            const daysToAdd = plan === plans.MONTHLY ? 30 : 365
            update["subscription.currentPeriodEnd"] = startDate.add(daysToAdd, "day").toDate()
        }

        const updated = await Clinic.findByIdAndUpdate(
            clinicId,
            {
                $set: update,
                $unset: { "subscription.trialEndsAt": "" }
            },
            { new: true, runValidators: true }
        )

        return res.json({ status: statusText.SUCCESS, data: updated })
    } catch (err) {
        res.status(500).json({ status: statusText.ERROR, data: err.message || "Internal Server Error" })
    }
}

module.exports = {
    getClinicBySlug,
    getSubscribedClinics,
    getAllClinics,
    updateClinic,
    getClinicDetails,
    subscribe
}