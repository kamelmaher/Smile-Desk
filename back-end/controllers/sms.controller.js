const smsSender = require("../services/smsSender")
const statusText = require("../data/statusText")
const { getPickApptMsg, getConfirmApptMsg } = require("../utils/index");

const appointmentPick = async (req, res) => {
    const { patientName, date } = req.body;
    try {
        const clinic = req.clinic
        if (!clinic) return res.json({ status: statusText.ERROR, data: "العيادة غير موجودة" })
        if (!patientName || !date) return res.json({ status: statusText.ERROR, data: "تاكد من صحة البيانات" })
        const message = getPickApptMsg(date, patientName)
        const result = await smsSender(message, clinic.phoneNumber)
        if (result?.status === statusText.ERROR) {
            return res.status(502).json({ status: statusText.ERROR, data: result.data || "Unable to send SMS" })
        }
        return res.json({ status: statusText.SUCCESS })
    } catch (err) {
        return res.json({ status: statusText.ERROR, data: "حدث خطا ما" })
    }
}

const appointmentConfirm = async (req, res) => {
    const { patientName, patientPhoneNumber, date, status } = req.body
    try {
        const clinic = req.clinic
        if (!clinic) return res.json({ status: statusText.ERROR, data: "العيادة غير موجودة" })

        if (!patientName || !date || !patientPhoneNumber || !status) return res.json({ status: statusText.ERROR, data: "تاكد من صحة البيانات" })

        const message = getConfirmApptMsg(date, status, patientName, clinic.clinicName)
        const result = await smsSender(message, patientPhoneNumber)
        if (result?.status === statusText.ERROR) {
            return res.status(502).json({ status: statusText.ERROR, data: result.data || "Unable to send SMS" })
        }
        return res.json({ status: statusText.SUCCESS, data: "تم اعلام المريض بنجاح" })
    } catch (err) {
        return res.json({ status: statusText.ERROR, data: "حدث خطا ما" })
    }
}

module.exports = {
    appointmentPick,
    appointmentConfirm
}