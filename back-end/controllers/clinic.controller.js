const Clinic = require("../models/Clinic")
const statusText = require("../data/statusText");
const { MAIN_LIMIT } = require("../data/constants");
const plans = require("../data/plans");
const getSlug = require("../utils/geSlug")
const dayjs = require("dayjs")

const getSubscribedClinics = async (req, res) => {
    const page = req.query.page || 1
    const skip = (page - 1) * MAIN_LIMIT
    const clinics = await Clinic.find({
        plan: {
            $in: [
                plans.ANNUAL,
                plans.MONTHLY,
                plans.LIFETIME
            ]
        },
        validTo: {
            $gt: dayjs()
        }
    }).limit(MAIN_LIMIT).skip(skip)
    const total = await Clinic.countDocuments()
    res.json({ status: statusText.SUCCESS, clinics, pages: Math.ceil(total / MAIN_LIMIT) })
}

const getClinicBySlug = async (req, res) => {
    const { slug } = req.params;
    if (!slug)
        return res.json({ status: statusText.ERROR, data: "Clinic Not Found" })
    const clinic = await Clinic.findOne({ slug })
    if (!clinic)
        return res.json({ status: statusText.ERROR, data: "Clinic Not Found" })
    res.json({ status: statusText.SUCCESS, clinic })
}

const updateClinic = async (req, res) => {
    const { clinicId } = req.user;
    if (!clinicId) return res.json({ status: statusText.FAIL, data: "Id is required" })
    const allowedFields = ["clinicName", "email", "phoneNumber", "description", "logo", "address", "workingHours"];
    const updateData = {};

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
        }
    });
    try {
        let newClinic;
        const clinicDetails = await Clinic.findOne({ _id: clinicId })
        if (!clinicDetails) return res.json({ status: statusText.ERROR, data: "Clinic not found" })
        if (updateData.clinicName) {
            if (clinicDetails.clinicName === updateData.clinicName) {
                newClinic = await Clinic.findByIdAndUpdate(clinicId, updateData, { returnDocument: "after" })
            } else {
                newClinic = await Clinic.findByIdAndUpdate(clinicId, { ...updateData, slug: getSlug(req.body.clinicName) }, { returnDocument: "after" })
            }
        } else newClinic = await Clinic.findByIdAndUpdate(clinicId, updateData, { returnDocument: "after" })
        res.json({ status: statusText.SUCCESS, data: newClinic })
    } catch (err) {
        res.json({ status: statusText.ERROR, data: "Internal Server Error" })
    }
}

const getClinicDetails = async (req, res) => {
    const user = req.user;
    if (!user) return res.json({ status: statusText.ERROR, data: "UnAuthorized" })
    const clinic = await Clinic.findOne({ userId: user._id })
    if (clinic) return res.json({ status: statusText.SUCCESS, clinic })
    res.json({ status: statusText.FAIL, data: "Clinic Not Found" })
}

const getAllClinics = async (req, res) => {
    const clinics = await Clinic.find();
    return res.json({ status: statusText.SUCCESS, clinics })
}

const subscribe = async (req, res) => {
    const { clinicId } = req.body;
    if (!clinicId) return res.json({ status: statusText.ERROR, data: "User Not Found" })
    const { plan } = req.body
    if (!plan) return res.json({ status: statusText.FAIL, data: "not a Valid Plan" })

    let newPlan;
    switch (plan) {
        case plans.MONTHLY: newPlan = plans.MONTHLY
            break;
        case plans.ANNUAL: newPlan = plans.ANNUAL
            break
        case plans.LIFETIME: newPlan = plans.LIFETIME
            break
        default: return res.json({ status: statusText.FAIL, data: "not a Valid Plan" })
    }

    try {
        const clinic = await Clinic.findOne({ _id: clinicId })
        if (!clinic) return res.json({ status: statusText.ERROR, data: "العيادة غير موجودة" })

        const currentValidTo = dayjs(clinic.validTo);
        const startDate = currentValidTo.isAfter(dayjs()) ? currentValidTo : dayjs();

        let newValidTo;
        if (newPlan === plans.LIFETIME) {
            newValidTo = dayjs().add(100, 'year').toDate();
        } else {
            const daysToAdd = newPlan === plans.MONTHLY ? 30 : 365;
            newValidTo = startDate.add(daysToAdd, 'day').toDate();
        }


        const updated = await Clinic.findByIdAndUpdate(
            clinicId,
            {
                plan: newPlan,
                validTo: newValidTo
            },
            { returnDocument: "after" }
        );

        res.json({ status: statusText.SUCCESS, data: updated })
    } catch (err) {
        res.json({ status: statusText.ERROR, data: "Internal Server Error" })
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