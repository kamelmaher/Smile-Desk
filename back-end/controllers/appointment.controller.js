const Appointment = require("../models/Appointment")
const statusText = require("../data/statusText")
const { MAIN_LIMIT } = require("../data/constants")
const { ACCEPTED, DECLINED } = require("../data/appointmentStatus")
const { formatDate } = require("../utils/index")
const createAppointment = async (req, res) => {
    const data = new Appointment(req.body)
    await data.save()
    res.json({ status: statusText.SUCCESS, data })
}

const loadAppointments = async (req, res) => {
    const user = req.user;
    const page = req.query.page
    // res.send(req.query.page)
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

    const today = formatDate(new Date());

    const start = `${today}T00:00:00`;
    const end = `${today}T23:59:59`;

    const appointments = await Appointment.find({
        clinicId: user.clinicId,
        date: {
            $gte: start,
            $lte: end
        }
    }).sort({ date: 1 });

    res.json({ status: statusText.SUCCESS, data: appointments })
}

const getUpcomingAppointments = async (req, res) => {
    const user = req.user;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const next10Days = new Date();
    next10Days.setDate(next10Days.getDate() + 10);
    next10Days.setHours(23, 59, 59, 0);



    const start = formatDate(tomorrow);
    const end = formatDate(next10Days);

    const appointments = await Appointment.find({
        clinicId: user.clinicId,
        date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

    res.json({ status: "success", data: appointments });
};

const getExpiredAppointments = async (req, res) => {
    try {
        const { clinicId } = req.user;

        const now = formatDate(new Date())

        const appointments = await Appointment.find({
            clinicId,
            date: { $lt: now }
        }).sort({ date: -1 });

        res.status(200).json({
            status: statusText.SUCCESS,
            data: appointments
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
        const appointment = await Appointment.findOneAndUpdate({ _id: id }, { status: ACCEPTED })
        if (appointment) return res.json({ status: statusText.SUCCESS, data: appointment })
        return res.json({ status: statusText.FAIL, data: "Failed Accept Appointment" })
    } catch (err) {
        return res.json({ status: statusText.ERROR, data: "Internal Server Error" })
    }
}

const declineAppointment = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.json({ status: statusText.FAIL, data: "Id is required" })
    try {
        const appointment = await Appointment.findOneAndUpdate({ _id: id }, { status: DECLINED })
        if (appointment) return res.json({ status: statusText.SUCCESS, data: appointment })
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
    const { date } = req.query
    const { clinicId } = req.user

    const start = `${date}T00:00:00`;
    const end = `${date}T23:59:59`;

    try {
        const appointments = await Appointment.find({
            clinicId,
            date: { $gte: start, $lte: end },
        });
        const hours = appointments.map((a) => {
            return new Date(a.date).getHours();
        });

        res.json({
            status: statusText.SUCCESS,
            data: hours,
        });
    } catch (err) {
        res.json({ status: statusText.ERROR, data: "Something went wrong" })
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
    getBooked
}