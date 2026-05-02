const Clinic = require("../models/Clinic")
const statusText = require("../data/statusText");
const { MAIN_LIMIT } = require("../data/constants");
const getSlug = require("../utils/geSlug")

const getClinics = async (req, res) => {
    const page = req.query.page || 1
    const skip = (page - 1) * MAIN_LIMIT
    const clinics = await Clinic.find().limit(MAIN_LIMIT).skip(skip)
    const total = await Clinic.countDocuments()
    res.json({ status: statusText.SUCCESS, data: clinics, pages: Math.ceil(total / MAIN_LIMIT) })
}

const getClinicBySlug = async (req, res) => {
    const { slug } = req.params;
    if (!slug)
        return res.json({ status: statusText.ERROR, data: "Clinic Not Found" })
    const clinic = await Clinic.findOne({ slug })
    if (!clinic)
        return res.json({ status: statusText.ERROR, data: "Clinic Not Found" })
    res.json({ status: statusText.SUCCESS, data: clinic })
}

const updateClinic = async (req, res) => {
    const { clinicId } = req.user;
    if (!clinicId) return res.json({ status: statusText.FAIL, data: "Id is required" })
    try {
        let newClinic;
        const clinicDetails = await Clinic.findOne({ _id: clinicId })
        if (!clinicDetails) return res.json({ status: statusText.ERROR, data: "Clinic not found" })
        if (req.body.clinicName) {
            if (clinicDetails.clinicName === req.body.clinicName) {
                newClinic = await Clinic.findByIdAndUpdate(clinicId, req.body, { returnDocument: "after" })
            } else {
                newClinic = await Clinic.findByIdAndUpdate(clinicId, { ...req.body, slug: getSlug(req.body.clinicName) }, { returnDocument: "after" })
            }
        } else newClinic = await Clinic.findByIdAndUpdate(clinicId, req.body, { returnDocument: "after" })
        res.json({ status: statusText.SUCCESS, data: newClinic })
    } catch (err) {
        res.json({ status: statusText.ERROR, data: "Internal Server Error" })
    }
}

const getClinicDetails = async (req, res) => {
    const user = req.user;
    if (!user) return res.json({ status: statusText.ERROR, data: "UnAuthorized" })
    const clinic = await Clinic.findOne({ userId: user._id })
    if (clinic) return res.json({ status: statusText.SUCCESS, data: clinic })
    res.json({ status: statusText.FAIL, data: "Clinic Not Found" })
}

module.exports = {
    getClinicBySlug,
    getClinics,
    updateClinic,
    getClinicDetails
}