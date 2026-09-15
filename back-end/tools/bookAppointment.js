const Clinic = require("../models/Clinic")
const statusText = require("../data/statusText")
const { createAppointment, toErrorResponse } = require("../services/appointment.service")

module.exports = async (appt, clinicId) => {
    try {
        const clinic = await Clinic.findById(clinicId)
        const appointment = await createAppointment(appt, clinic)
        return ({
            status: statusText.SUCCESS,
            data: appointment
        });
    } catch (err) {
        return toErrorResponse(err)
    }
}