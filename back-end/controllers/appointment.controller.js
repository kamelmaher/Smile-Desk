const Appointment = require("../models/Appointment")
const mongoose = require("mongoose")
const statusText = require("../data/statusText")
const { MAIN_LIMIT } = require("../data/constants")
const { ACCEPTED, DECLINED, PENDING } = require("../data/appointmentStatus")
const { getTodayDate, getUpcomingDate, getExpiredDate } = require("../utils/appointments")
const { createAppointment: bookAppointment } = require("../services/appointment.service")
const dayjs = require('dayjs');

const createAppointment = async (req, res) => {
    try {
        const newAppointment = await bookAppointment(req.body, req.clinic)
        return res.status(201).json({
            status: statusText.SUCCESS,
            data: newAppointment
        });
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            status: statusText.ERROR,
            data: err.statusCode ? err.message : "حدث خطأ تقني، يرجى المحاولة لاحقاً"
        })
    }
}

const loadAppointments = async (req, res) => {
    const user = req.user;
    const { dateRange, page, status } = req.query
    const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1)
    const skip = MAIN_LIMIT * (currentPage - 1)
    if (!user?.clinicId) return res.status(401).json({ status: statusText.ERROR, data: "UnAuthorized" })
    try {
        let filters = { clinicId: user.clinicId }
        switch (dateRange) {
            case "today":
                filters.date = getTodayDate()
                break;
            case "upcoming":
                filters.date = getUpcomingDate()
                break;
            case "expired":
                filters.date = getExpiredDate()
                break;
        }
        if ([PENDING, ACCEPTED, DECLINED].includes(status)) {
            filters.status = status;
        }
        const [
            appointments,
            total
        ] = await Promise.all([
            Appointment.find(filters).sort({ date: 1 }).limit(MAIN_LIMIT).skip(skip),
            Appointment.countDocuments(filters)
        ])
        return res.json({
            status: statusText.SUCCESS,
            appointments,
            pages: Math.ceil(total / MAIN_LIMIT)
        });
    } catch (err) {
        return res.status(500).json({
            status: statusText.ERROR,
            data: "Internal Server Error",
        });
    }
}

const confirmAppointment = async (req, res) => {
    const { id } = req.params;
    if (!id || !mongoose.isValidObjectId(id)) return res.status(400).json({ status: statusText.FAIL, data: "Invalid appointment id" })
    try {
        const appointment = await Appointment.findOneAndUpdate(
            { _id: id, clinicId: req.user.clinicId, status: PENDING },
            { status: ACCEPTED },
            { new: true, runValidators: true }
        )
        if (appointment) {
            return res.json({ status: statusText.SUCCESS, data: appointment })
        }
        return res.status(404).json({ status: statusText.FAIL, data: "Appointment not found or already processed" })
    } catch (err) {
        return res.status(500).json({ status: statusText.ERROR, data: "Internal Server Error" })
    }
}

const declineAppointment = async (req, res) => {
    const { id } = req.params;
    if (!id || !mongoose.isValidObjectId(id)) return res.status(400).json({ status: statusText.FAIL, data: "Invalid appointment id" })
    try {
        const appointment = await Appointment.findOneAndUpdate(
            { _id: id, clinicId: req.user.clinicId, status: PENDING },
            { status: DECLINED },
            { new: true, runValidators: true }
        )
        if (appointment) {
            return res.json({ status: statusText.SUCCESS, data: appointment })
        }
        return res.status(404).json({ status: statusText.FAIL, data: "Appointment not found or already processed" })
    } catch (err) {
        return res.status(500).json({ status: statusText.ERROR, data: "Internal Server Error" })
    }
}

const getBooked = async (req, res) => {
    const { date } = req.query;
    const clinicId = req.clinic?._id || req.user?.clinicId;

    if (!clinicId) {
        return res.status(400).json({ status: statusText.ERROR, data: "Clinic id is required" })
    }
    if (!date) {
        return res.status(400).json({
            status: statusText.ERROR,
            data: "Date is required",
        });
    }
    if (!dayjs(date).isValid()) {
        return res.status(400).json({ status: statusText.ERROR, data: "Invalid date" })
    }

    try {
        const startOfDay = dayjs(date).startOf('day');
        const startOfNextDay = startOfDay.add(1, 'day');

        const appointments = await Appointment.find({
            clinicId,
            status: { $in: [PENDING, ACCEPTED] },
            date: {
                $gte: startOfDay.toDate(),
                $lt: startOfNextDay.toDate()
            },
        });

        const bookedHours = appointments.map((a) => {
            return dayjs(a.date).format("HH:mm");
        });

        return res.status(200).json({
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



module.exports = {
    createAppointment,
    loadAppointments,
    confirmAppointment,
    declineAppointment,
    getBooked,
}


