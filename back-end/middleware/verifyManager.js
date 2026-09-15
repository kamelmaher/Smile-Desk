const { MANAGER } = require("../data/roles")
const statusText = require("../data/statusText")
module.exports = (req, res, next) => {
    const user = req.user
    if (!user) return res.status(401).json({ status: statusText.ERROR, data: "User Not Found" })
    if (user.role === MANAGER) {
        return next()
    }
    return res.status(403).json({ status: statusText.ERROR, data: "Unauthorized" })
}