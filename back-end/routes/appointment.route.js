const router = require("express").Router()

// controllers
const { createAppointment, loadAppointments, getTodayAppointments, getUpcomingAppointments, getExpiredAppointments, confirmAppointment, declineAppointment, searchAppointments, getBooked } = require("../controllers/appointment.controller")

const { appointmentSchema } = require("../validations/appointment.validation")

//middlwares
const validate = require("../middleware/validate.middleware")
const verifyToken = require("../middleware/verifyToken")
const checkSubscription = require("../middleware/checkSubscription")

router.use(verifyToken)
router.use(checkSubscription)

router.post("/", validate(appointmentSchema), createAppointment)

router.get("/", loadAppointments)
router.get("/today", getTodayAppointments)
router.get("/upcoming", getUpcomingAppointments)
router.get("/expired", getExpiredAppointments)
router.patch("/confirm/:id", confirmAppointment)
router.patch("/decline/:id", declineAppointment)
router.get("/search", searchAppointments)
router.get("/booked", getBooked)
module.exports = router