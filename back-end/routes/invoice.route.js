const router = require("express").Router();

const { createInvoice, getInvoices, updateInvoice, overview } = require("../controllers/invoice.controller");

const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken)

router.route("/").get(getInvoices).post(createInvoice);
router.patch("/:id", updateInvoice);
router.get("/overview", overview);
module.exports = router;