const router = require("express").Router();

const { createInvoice, getInvoices, updateInvoice, overview } = require("../controllers/invoice.controller");

const verifyToken = require("../middleware/verifyToken");
const checkSubscription = require("../middleware/checkSubscription");
const validate = require("../middleware/validate.middleware");
const { createInvoiceSchema, updateInvoiceSchema } = require("../validations/invoice.validation");

router.use(verifyToken)
router.use(checkSubscription)

router.route("/").get(getInvoices).post(validate(createInvoiceSchema), createInvoice);
router.patch("/:id", validate(updateInvoiceSchema), updateInvoice);
router.get("/overview", overview);
module.exports = router;