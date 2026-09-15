const { dashboardStatics } = require("../controllers/statics.controller")
const verifyToken = require("../middleware/verifyToken")
const checkSubscription = require("../middleware/checkSubscription")

const router = require("express").Router()

router.get("/:clinicId", verifyToken, checkSubscription, dashboardStatics)

module.exports = router