const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic"
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    type: {
        type: String,
        required: true,
    },
    details: String
}, { timestamps: true });

const Invoice = mongoose.model('invoice', invoiceSchema);
module.exports = Invoice;