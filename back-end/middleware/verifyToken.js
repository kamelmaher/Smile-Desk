const statusText = require("../data/statusText")
const jwt = require("jsonwebtoken")
module.exports = (req, res, next) => {
    const token = req.cookies?.token
    if (!token) return res.status(401).json({ status: statusText.ERROR, data: "Token Required" })
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!user?._id) return res.status(401).json({ status: statusText.ERROR, data: "Invalid Token" })
        req.user = user
        return next()
    } catch {
        return res.status(401).json({ status: statusText.ERROR, data: "Invalid or expired token" })
    }
}