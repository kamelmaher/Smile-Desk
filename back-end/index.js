const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const cors = require("cors")
const cookieParser = require("cookie-parser")

const app = express()
app.use(express.json())
app.use(cors({
    origin: process.env.WEBSITE_URL,
    credentials: true
}));
app.use(cookieParser())

const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl).then(() => {
    console.log("Connected To Db")
    app.listen(3000, () => {
        console.log("Port 3000")
    })
}).catch((err) => {
    console.log("Error Connecting To Db")
    console.log(err)
})

const userRoutes = require("./routes/user.route")
const clinicRoutes = require("./routes/clinic.route")
const appointmentRoutes = require("./routes/appointment.route")

// Routes
app.use("/user", userRoutes)
app.use("/clinic", clinicRoutes)
app.use("/appointment", appointmentRoutes)
