const Clinic = require("../models/Clinic")
const Appointment = require("../models/Appointment")
const { PENDING, DECLINED } = require("../data/appointmentStatus")

exports.dashboardStatics = async (req, res) => {
    const clinicId = req.params.clinicId || ""
    const userId = req.user._id || ""
    if (!clinicId || !userId) return res.status(400).json({ msg: "cant get the statics" })
    try {
        const clinic = await Clinic.findById(clinicId)
        if (!clinic) return res.status(400).json({ msg: "Clinic not found" })

        // check the user is the owner
        if (clinic.userId.toString() !== userId.toString()) return res.status(400).json({ msg: "UnAuthorized" })

        // Access the statics
        const [
            totalAppointments,
            pendingAppointments,
            declinedAppointments
        ] = await Promise.all([
            Appointment.countDocuments({ clinicId }),
            Appointment.countDocuments({ clinicId, status: PENDING }),
            Appointment.countDocuments({ clinicId, status: DECLINED }),
        ])
        const data = {
            totalAppointments,
            pendingAppointments,
            declinedAppointments
        }
        return res.status(200).json({ data })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ msg: "Internal Server Error" })
    }
}