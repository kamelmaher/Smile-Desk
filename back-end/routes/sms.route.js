const router = require("express").Router()

const { appointmentConfirm, appointmentPick } = require("../controllers/sms.controller")
const verifyToken = require("../middleware/verifyToken")
const checkSubscription = require("../middleware/checkSubscription")

router.use(verifyToken)
router.use(checkSubscription)
router.post("/pick-sms", appointmentPick)
router.post("/confirm-sms", appointmentConfirm)
module.exports = router