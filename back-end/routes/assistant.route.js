const { generateResponse } = require("../services/ai")

const router = require("express").Router()

router.post("/", async (req, res) => {
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