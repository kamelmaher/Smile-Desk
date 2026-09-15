const express = require("express")
const router = express.Router()

//controllers
const { getClinicBySlug, getAllClinics, getSubscribedClinics, updateClinic, getClinicDetails, subscribe } = require("../controllers/clinic.controller")

// middlewares
const verifyToken = require("../middleware/verifyToken")
const checkSubscription = require("../middleware/checkSubscription")
const verifyManager = require("../middleware/verifyManager")
const limiter = require("../middleware/limiter")
const validate = require("../middleware/validate.middleware")
const { updateClinicSchema, subscribeSchema } = require("../validations/clinic.validation")

// Genereal Clinics
router.get("/", getSubscribedClinics)
router.get("/slug/:slug", getClinicBySlug)

// User Clinic
router.patch("/subscribe", verifyToken, verifyManager, validate(subscribeSchema), subscribe)
router.get("/all", verifyToken, verifyManager, getAllClinics)

router.use(verifyToken)
router.use(checkSubscription)

router.get("/dashboard", getClinicDetails)
router.patch("/update", limiter(12, 3), validate(updateClinicSchema), updateClinic)

module.exports = router