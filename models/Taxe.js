const mongoose = require("mongoose");


const TaxeSchema = new mongoose.Schema(
{
    deliveryCost: { type: Number, default: 3 },
    fees: { type: Number, default: 0.3 },
    governorate: {type: String, required: true, unique: true}
},{ timestamps: true }
);

module.exports = mongoose.model("Taxe", TaxeSchema);