const router = require("express").Router()

// controllers
const { createAppointment, loadAppointments, getTodayAppointments, getUpcomingAppointments, getExpiredAppointments, confirmAppointment, declineAppointment, searchAppointments, getBooked, checkPhoneNumber } = require("../controllers/appointment.controller")

const { appointmentSchema } = require("../validations/appointment.validation")

//middlwares
const validate = require("../middleware/validate.middleware")
const verifyToken = require("../middleware/verifyToken")
const checkSubscription = require("../middleware/checkSubscription")
const checkSmsSubscriped = require("../middleware/checkSmsSubscriped")
const limiter = require("../middleware/limiter")


router.post("/", validate(appointmentSchema), checkSmsSubscriped, createAppointment)
router.post("/check-number", checkPhoneNumber)
router.use(verifyToken)
router.use(checkSubscription)


router.get("/", loadAppointments)
router.get("/today", getTodayAppointments)
router.get("/upcoming", getUpcomingAppointments)
router.get("/expired", getExpiredAppointments)
router.get("/search", searchAppointments)
router.get("/booked", getBooked)

router.patch("/confirm/:id", confirmAppointment)
router.patch("/decline/:id", declineAppointment)

module.exports = router