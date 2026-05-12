const express = require("express")
const router = express.Router()

//controllers
const { getClinicBySlug, getClinics, updateClinic, getClinicDetails, subscribe } = require("../controllers/clinic.controller")

// middlewares
const verifyToken = require("../middleware/verifyToken")
const checkSubscription = require("../middleware/checkSubscription")
const verifyManager = require("../middleware/verifyManager")
const limiter = require("../middleware/limiter")
// Genereal Clinics
router.get("/", getClinics)
router.get("/slug/:slug", getClinicBySlug)

// User Clinic
router.patch("/subscribe", verifyToken, verifyManager, subscribe)

router.use(verifyToken)
router.use(checkSubscription)

router.get("/dashboard", getClinicDetails)
router.patch("/update", limiter(12, 3), updateClinic)

module.exports = router