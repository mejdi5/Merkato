const express = require('express')
const app = express()
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require('morgan')


dotenv.config();
//database connection
mongoose
    .connect("mongodb://localhost:27017/Delivery") 
    .then(() => console.log("Database connected.."))
    .catch((error) => {
    console.log(error, "Database is not connected..");
});


app.use(cors())
app.use(express.json())
app.use(morgan("dev"));
app.use("/api/auth", require('./routes/auth'));
app.use("/api/verify-account", require('./routes/verifyAccount'));
app.use("/api/users", require('./routes/user'));
app.use("/api/marketPlaces", require('./routes/marketPlace'));
app.use("/api/orders", require('./routes/order'));
app.use("/api/taxes", require('./routes/taxe'));
app.use("/api/products", require('./routes/product'));



app.listen(process.env.PORT || 5000, () => {
    console.log("server is running!!");
});