const mongoose = require("mongoose");

const MarketPlaceSchema = new mongoose.Schema(
{
    name: { type: String, required: true },
    userId: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    position: { type: String, required: true },
    isBlocked: { type: Boolean, default: false}
},
{ timestamps: true }
);

module.exports = mongoose.model("MarketPlace", MarketPlaceSchema);