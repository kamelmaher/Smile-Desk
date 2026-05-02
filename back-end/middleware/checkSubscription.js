const Clinic = require("../models/Clinic")
const statusText = require("../data/statusText")

module.exports = async (req, res, next) => {
    const user = req.user
    const clinic = await Clinic.findById(user.clinicId)
    if (!clinic)
        return res.json({
            status: statusText.ERROR,
            data: "Clinic not found"
        });
        
    if (new Date() > new Date(clinic.validTo))
        return res.json({
            status: statusText.ERROR,
            data: "Clinic subscription expired"
        });

    next()
}