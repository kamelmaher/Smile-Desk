const { ERROR } = require("../data/statusText")
const { MANAGER } = require("../data/roles")

module.exports = async (req, res, next) => {
    const user = req.user;
    if (user.role === MANAGER) {
        next()
    }
    else return res.json({ status: statusText.ERROR, data: "UnAuthorized" })
}