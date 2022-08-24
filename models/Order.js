const mongoose = require("mongoose");


const OrderSchema = new mongoose.Schema(
{
    userId: { type: String, required: true },
    domainId: { type: String, required: true },
    products: [
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product",
        },
        quantity: {
            type: Number,
            default: 1,
        },
    },
    ],
    total: { type: Number },
    deliveryCost: { type: Number },
    fees: { type: Number },
    totalToPay: { type: Number },
    address: {
        governorate: {type: String, required: true},
        city: {type: String, required: true},
        zipCode: {type: Number},
    },
    status: { type: String, default: "In Progress" },
},
{ timestamps: true }
);


module.exports = mongoose.model("Order", OrderSchema);