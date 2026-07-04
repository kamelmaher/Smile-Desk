const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const app = express()
const allowedOrigins = [
    "http://localhost:5173",
    process.env.WEBSITE_URL
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS blocked"));
        }
    },
    credentials: true
}));

app.use(express.json())
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
const smsRoutes = require("./routes/sms.route")
const staticsRoutes = require("./routes/statics.route")
const invoiceRoutes = require("./routes/invoice.route")

// Routes
app.use("/user", userRoutes)
app.use("/clinic", clinicRoutes)
app.use("/appointment", appointmentRoutes)
app.use("/sms", smsRoutes)
app.use("/statics", staticsRoutes)
app.use("/invoice", invoiceRoutes)
