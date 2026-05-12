const express = require("express")
const router = express.Router()

// controllers 
const { login, register, me, logout, updateUser, getAllUsers } = require("../controllers/user.controller")

// Middlewares
const validate = require("../middleware/validate.middleware")
const verifyToken = require("../middleware/verifyToken")
const verifyManager = require("../middleware/verifyManager")
const limiter = require("../middleware/limiter")

// Validations 
const { registerSchema, loginSchema } = require("../validations/auth.validation")



// routes
router.post("/login", limiter(6, 10), validate(loginSchema), login)
router.post("/register", limiter(24, 8), validate(registerSchema), register)
router.post("/logout", logout)

router.get("/me", verifyToken, me)
router.patch("/", limiter(12, 3), verifyToken, updateUser)

router.get("/", verifyToken, verifyManager, getAllUsers)
module.exports = router