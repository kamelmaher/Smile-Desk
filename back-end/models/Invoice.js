const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "clinic",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    type: {
        type: String,
        required: true,
        enum: ["income", "outcome"],
    },
    details: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    }
}, { timestamps: true });

const Invoice = mongoose.model('invoice', invoiceSchema);
module.exports = Invoice;