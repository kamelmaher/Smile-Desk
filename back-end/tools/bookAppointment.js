const Appointment = require("../models/Appointment")
const statusText = require("../data/statusText")
const dayjs = require("dayjs")

module.exports = async (appt, clinicId) => {
    try {
        if (!clinicId) return ({ status: statusText.ERROR, data: "يجب اختيار عيادة" })

        if (!appt.date) {
            return ({ status: statusText.ERROR, message: "التاريخ مطلوب" });
        }

        if (dayjs(appt.date).isBefore(dayjs())) {
            return ({ status: statusText.ERROR, data: "لا يمكن حجز موعد في تاريخ سابق" });
        }

        const existingAppointment = await Appointment.findOne({
            clinicId,
            date: appt.date
        });

        if (existingAppointment) {
            return ({
                status: statusText.ERROR,
                data: "هذا الموعد محجوز مسبقاً، يرجى اختيار وقت آخر"
            });
        }

        const newAppointment = new Appointment({
            clinicId,
            ...appt
        });

        await newAppointment.save();

        return ({
            status: statusText.SUCCESS,
            data: newAppointment
        });

    } catch (err) {
        console.log(err)
        return ({
            status: statusText.ERROR,
            data: "حدث خطأ تقني، يرجى المحاولة لاحقاً"
        });
    }
}