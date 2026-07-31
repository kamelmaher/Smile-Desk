const { generateResponse } = require("../services/ai")

const router = require("express").Router()
const limiter = require("../middleware/limiter")

router.post("/", limiter(3, 10), async (req, res) => {
    const { msgs, clinicId } = req.body
    try {
        const result = await generateResponse(msgs, clinicId);
        return res.json({ result })
    } catch (err) {
        console.log(err)
        return res.json({ msg: "Internal Server Error" })
    }
})

module.exports = router