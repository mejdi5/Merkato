const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
{
    name: { type: String, required: true},
    cin: { type: Number, unique: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number },
    image: {type: String},
    address: {type: String, default: null},
    userType: { type: String, enum: ["admin", "delivery_guy", "user"], default: "user"},
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false},
    paymentDate: { type: Date, default: null},
}, 
{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);  