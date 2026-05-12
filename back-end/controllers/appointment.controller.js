const Appointment = require("../models/Appointment")
const statusText = require("../data/statusText")
const { MAIN_LIMIT } = require("../data/constants")
const { ACCEPTED, DECLINED } = require("../data/appointmentStatus")
const { removeCancelled, checkIfTwoPendingAppointments } = require("../utils/appointments")
const dayjs = require('dayjs');

const createAppointment = async (req, res) => {
    const data = req.body;
    try {
        if (!data.clinicId) return res.json({ status: statusText.ERROR, data: "يجب اختيار عيادة" })

        if (!data.date) {
            return res.status(400).json({ status: statusText.ERROR, message: "التاريخ مطلوب" });
        }

        if (dayjs(data.date).isBefore(dayjs())) {
            return res.status(400).json({ status: statusText.ERROR, data: "لا يمكن حجز موعد في تاريخ سابق" });
        }

        const existingAppointment = await Appointment.findOne({
            clinicId: data.clinicId,
            date: data.date
        });

        if (existingAppointment) {
            return res.status(400).json({
                status: statusText.ERROR,
                data: "هذا الموعد محجوز مسبقاً، يرجى اختيار وقت آخر"
            });
        }

        const newAppointment = new Appointment({
            ...data
        });

        await newAppointment.save();

        return res.status(201).json({
            status: statusText.SUCCESS,
            data: newAppointment
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: statusText.ERROR,
            data: "حدث خطأ تقني، يرجى المحاولة لاحقاً"
        });
    }
}

const loadAppointments = async (req, res) => {
    const user = req.user;
    const page = req.query.page

    const skip = MAIN_LIMIT * (+page - 1)
    if (!user) return res.json({ status: statusText.ERROR, data: "UnAuthorized" })
    const appointments = await Appointment.find({ clinicId: user.clinicId }).limit(MAIN_LIMIT).skip(skip)
    if (appointments.length == 0) return res.json({ status: statusText.FAIL, data: "No Appointments for this Clinic" })

    const total = await Appointment.countDocuments({ clinicId: user.clinicId });
    res.json({
        status: statusText.SUCCESS,
        data: appointments,
        pages: Math.ceil(total / MAIN_LIMIT)
    });

}

const getTodayAppointments = async (req, res) => {
    const user = req.user
    if (!user) return res.json({ status: statusText.ERROR, data: "UnAuthorized" })
    try {
        const startOfDay = dayjs().startOf('day').toDate();

        const startOfNextDay = dayjs().add(1, 'day').startOf('day').toDate();

        const appointments = await Appointment.find({
            clinicId: user.clinicId,
            date: {
                $gte: startOfDay,
                $lt: startOfNextDay
            }
        });

        res.json({ status: statusText.SUCCESS, data: appointments });
    } catch (error) {
        res.status(500).json({ message: "خطأ في جلب المواعيد", error });
    }
};

const getUpcomingAppointments = async (req, res) => {
    const user = req.user;
    if (!user) return res.json({ status: statusText.ERROR, data: "UnAuthorized" })
    try {
        const startOfTomorrow = dayjs().add(1, 'day').startOf('day').toDate();

        const endOfRange = dayjs().add(11, 'day').startOf('day').toDate();

        const appointments = await Appointment.find({
            clinicId: user.clinicId,
            date: {
                $gte: startOfTomorrow,
                $lt: endOfRange
            }
        }).sort({ date: 1 });

        return res.json({
            status: statusText.SUCCESS,
            data: appointments,
        });

    } catch (err) {
        return res.json({
            status: statusText.ERROR,
            data: "Internal Server Error",
        });
    }
};

const getExpiredAppointments = async (req, res) => {
    const { clinicId } = req.user;
    try {

        const now = dayjs().toDate();

        const expiredAppointments = await Appointment.find({
            clinicId,
            date: { $lt: now }
        }).sort({ date: -1 });

        return res.json({
            status: statusText.SUCCESS,
            data: expiredAppointments
        });

    } catch (error) {
        console.error("Get Expired Appointments Error:", error);

        res.status(500).json({
            status: statusText.FAIL,
            data: "Something went wrong"
        });
    }
};

const confirmAppointment = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.json({ status: statusText.FAIL, data: "Id is required" })
    try {
        const appointment = await Appointment.findByIdAndUpdate(id, { status: ACCEPTED }, { new: true })
        if (appointment) {
            return res.json({ status: statusText.SUCCESS, data: appointment })
        }
        return res.json({ status: statusText.FAIL, data: "Failed Accept Appointment" })
    } catch (err) {
        return res.json({ status: statusText.ERROR, data: "Internal Server Error" })
    }
}

const declineAppointment = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.json({ status: statusText.FAIL, data: "Id is required" })
    try {
        const appointment = await Appointment.findByIdAndUpdate(id, { status: ACCEPTED }, { new: true })
        if (appointment) {
            return res.json({ status: statusText.SUCCESS, data: appointment })
        }
        return res.json({ status: statusText.FAIL, data: "Failed Decline Appointment" })
    } catch (err) {
        return res.json({ status: statusText.ERROR, data: "Internal Server Error" })
    }
}

const searchAppointments = async (req, res) => {
    const { term } = req.query
    const { clinicId } = req.user
    if (!term || term.trim() === "") {
        return res.status(200).json({
            status: "success",
            data: []
        })
    }
    try {
        const results = await Appointment.find({
            clinicId: clinicId,
            patientName: {
                $regex: term,
                $options: "i"
            }
        }).sort({ date: -1 })
        res.json({ status: statusText.SUCCESS, data: results })
    } catch (err) {
        res.json({ status: statusText.ERROR, data: "Something went wrong" })
    }
}

const getBooked = async (req, res) => {
    const { date } = req.query;
    const { clinicId } = req.user;

    if (!date) {
        return res.json({
            status: statusText.ERROR,
            data: "Date is required",
        });
    }

    try {
        const startOfDay = dayjs(date).startOf('day');
        const startOfNextDay = startOfDay.add(1, 'day');

        const appointments = await Appointment.find({
            clinicId,
            date: {
                $gte: startOfDay.toDate(),
                $lt: startOfNextDay.toDate()
            },
        });

        const bookedHours = appointments.map((a) => {
            return dayjs(a.date).format("hh:mm");
        });

        return res.json({
            status: statusText.SUCCESS,
            data: bookedHours,
        });

    } catch (err) {
        return res.json({
            status: statusText.ERROR,
            data: "Something went wrong",
        });
    }
};

const checkPhoneNumber = async (req, res) => {
    const phoneNumber = req.query.number;
    const clinicId = req.body.clinicId
    if (!clinicId) return res.json({ status: statusText.ERROR, data: "العيادة غير موجودة" })
    if (!phoneNumber) return res.json({ status: statusText.ERROR, data: "يجب ادخال رقم الهاتف" })
    try {
        const appointmentsWithPhoneNumber = await Appointment.find({
            clinicId: clinicId,
            patientPhoneNumber: phoneNumber
        })

        if (checkIfTwoPendingAppointments(appointmentsWithPhoneNumber))
            return res.json({ status: statusText.ERROR, data: "لا يمكن حجز اكثر من موعدين" })
        return res.json({ status: statusText.SUCCESS })
    } catch (err) {
        return res.json({ status: statusText.ERROR })
    }

}

module.exports = {
    createAppointment,
    loadAppointments,
    getTodayAppointments,
    getUpcomingAppointments,
    getExpiredAppointments,
    confirmAppointment,
    declineAppointment,
    searchAppointments,
    getBooked,
    checkPhoneNumber
}


