const Clinic = require("../models/Clinic")
const Appointment = require("../models/Appointment")
const mongoose = require("mongoose")
const statusText = require("../data/statusText")
const { ACCEPTED, PENDING, DECLINED } = require("../data/appointmentStatus")
const dayjs = require("dayjs")

exports.dashboardStatics = async (req, res) => {
    const { clinicId } = req.params
    const userId = req.user?._id
    if (!mongoose.isValidObjectId(clinicId) || !userId) {
        return res.status(400).json({ status: statusText.ERROR, data: "Invalid statistics request" })
    }

    try {
        const clinic = await Clinic.findById(clinicId)
        if (!clinic) return res.status(404).json({ status: statusText.ERROR, data: "Clinic not found" })

        if (clinic.userId.toString() !== userId.toString()) {
            return res.status(403).json({ status: statusText.ERROR, data: "Unauthorized" })
        }

        const now = dayjs()
        const startOfToday = now.startOf("day").toDate()
        const startOfTomorrow = now.add(1, "day").startOf("day").toDate()
        const [
            totalAppointments,
            pendingAppointments,
            acceptedAppointments,
            declinedAppointments,
            todayAppointments,
            upcomingAppointments,
        ] = await Promise.all([
            Appointment.countDocuments({ clinicId }),
            Appointment.countDocuments({ clinicId, status: PENDING }),
            Appointment.countDocuments({ clinicId, status: ACCEPTED }),
            Appointment.countDocuments({ clinicId, status: DECLINED }),
            Appointment.countDocuments({ clinicId, date: { $gte: startOfToday, $lt: startOfTomorrow } }),
            Appointment.countDocuments({ clinicId, date: { $gte: startOfTomorrow } }),
        ])
        const data = {
            totalAppointments,
            pendingAppointments,
            acceptedAppointments,
            declinedAppointments,
            todayAppointments,
            upcomingAppointments,
        }
        return res.status(200).json({ status: statusText.SUCCESS, statics: data })
    } catch (err) {
        return res.status(500).json({ status: statusText.ERROR, data: "Internal Server Error" })
    }
}