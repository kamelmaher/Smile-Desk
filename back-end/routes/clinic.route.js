const express = require("express")
const router = express.Router()

//controllers
const { getClinicBySlug, getClinics, updateClinic, getClinicDetails } = require("../controllers/clinic.controller")

// middlewares
const verifyToken = require("../middleware/verifyToken")
const checkSubscription = require("../middleware/checkSubscription")

// Genereal Clinics
router.get("/", getClinics)
router.get("/slug/:slug", getClinicBySlug)

// User Clinic
router.use(verifyToken)
router.use(checkSubscription)

router.get("/dashboard", getClinicDetails)
router.patch("/update", updateClinic)

module.exports = router