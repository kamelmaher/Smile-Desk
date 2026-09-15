const Appointment = require("../models/Appointment")
const statusText = require("../data/statusText")
const { MAX_APPOINTMENTS_FOR_PATIENT } = require("../data/constants")
const { ACCEPTED, PENDING } = require("../data/appointmentStatus")
const dayjs = require("dayjs")

const APPOINTMENT_DURATION_MINUTES = 30

const bookingError = (message, statusCode = 400) => {
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}

const parseTime = (value) => {
    const [hours, minutes] = value.split(":").map(Number)
    return hours * 60 + minutes
}

const validateAvailability = (date, clinic) => {
    const appointmentDate = dayjs(date)
    const now = dayjs()
    if (!appointmentDate.isValid()) throw bookingError("Invalid appointment date")
    if (!appointmentDate.isAfter(now)) throw bookingError("لا يمكن حجز موعد في تاريخ سابق")

    const clinicDay = (appointmentDate.day() + 1) % 7
    const workingDay = clinic.workingHours.find((day) => day.day === clinicDay)
    if (!workingDay?.isOpen || !workingDay.start || !workingDay.end) {
        throw bookingError("العيادة مغلقة في هذا اليوم")
    }

    const appointmentMinutes = appointmentDate.hour() * 60 + appointmentDate.minute()
    const startMinutes = parseTime(workingDay.start)
    const endMinutes = parseTime(workingDay.end)
    const isSlotAligned = (appointmentMinutes - startMinutes) % APPOINTMENT_DURATION_MINUTES === 0
    const isWithinHours = appointmentMinutes >= startMinutes && appointmentMinutes + APPOINTMENT_DURATION_MINUTES <= endMinutes

    if (!isWithinHours || !isSlotAligned) {
        throw bookingError("وقت الموعد خارج ساعات عمل العيادة")
    }
}

const createAppointment = async (data, clinic) => {
    if (!clinic) throw bookingError("العيادة غير موجودة", 404)
    if (!clinic.isSubscriptionActive()) throw bookingError("انتهت صلاحية اشتراك العيادة", 402)
    if (!data?.date || !data.patientName || !data.patientPhoneNumber || !data.patientAddress) {
        throw bookingError("بيانات الموعد غير مكتملة")
    }

    validateAvailability(data.date, clinic)

    const pendingAppointmentsCount = await Appointment.countDocuments({
        clinicId: clinic._id,
        patientPhoneNumber: data.patientPhoneNumber,
        status: PENDING,
    })
    if (pendingAppointmentsCount >= MAX_APPOINTMENTS_FOR_PATIENT) {
        throw bookingError("لا يمكن حجز أكثر من موعد قيد الانتظار لهذا الرقم")
    }

    const existingAppointment = await Appointment.findOne({
        clinicId: clinic._id,
        date: new Date(data.date),
        status: { $in: [ACCEPTED, PENDING] },
    })
    if (existingAppointment) {
        throw bookingError("هذا الموعد محجوز مسبقاً، يرجى اختيار وقت آخر", 409)
    }

    try {
        return await Appointment.create({
            clinicId: clinic._id,
            date: new Date(data.date),
            patientName: data.patientName,
            patientPhoneNumber: data.patientPhoneNumber,
            patientEmail: data.patientEmail,
            patientAddress: data.patientAddress,
            notes: data.notes,
        })
    } catch (error) {
        if (error.code === 11000) {
            throw bookingError("هذا الموعد محجوز مسبقاً، يرجى اختيار وقت آخر", 409)
        }
        throw error
    }
}

const toErrorResponse = (error) => ({
    status: statusText.ERROR,
    data: error.message || "حدث خطأ تقني، يرجى المحاولة لاحقاً",
})

module.exports = {
    createAppointment,
    toErrorResponse,
}
