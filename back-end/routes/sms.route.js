const router = require("express").Router()

const { sendOtp, verifyOtp, appointmentConfirm, appointmentPick } = require("../controllers/sms.controller")
const checkSmsSubscriped = require("../middleware/checkSmsSubscriped")
const verifyToken = require("../middleware/verifyToken")

router.use(checkSmsSubscriped)
router.post("/send-otp", sendOtp)
router.post("/verify-otp", verifyOtp)
router.post("/pick-sms", appointmentPick)
router.post("/confirm-sms", appointmentConfirm)
module.exports = router