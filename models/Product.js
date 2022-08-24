const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
{
    domainId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "MarketPlace",
	},
    title: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    category: { type: String },
    price: { type: Number, required: true },
    size: { type: String },
    color: { type: String },
    inStock: { type: Boolean, default: true },
},
{ timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);