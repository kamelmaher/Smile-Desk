const { dashboardStatics } = require("../controllers/statics.controller")
const verifyToken = require("../middleware/verifyToken")

const router = require("express").Router()

router.get("/:clinicId", verifyToken, dashboardStatics)

module.exports = router