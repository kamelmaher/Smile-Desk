const router = require("express").Router()

// controllers
const { createAppointment, loadAppointments, confirmAppointment, declineAppointment, getBooked } = require("../controllers/appointment.controller")

const { appointmentSchema } = require("../validations/appointment.validation")

//middlwares
const validate = require("../middleware/validate.middleware")
const verifyToken = require("../middleware/verifyToken")
const checkSubscription = require("../middleware/checkSubscription")


router.post("/", validate(appointmentSchema), createAppointment)

router.use(verifyToken)
router.use(checkSubscription)

router.get("/", loadAppointments)
router.get("/booked", getBooked)

router.patch("/confirm/:id", confirmAppointment)
router.patch("/decline/:id", declineAppointment)

module.exports = router