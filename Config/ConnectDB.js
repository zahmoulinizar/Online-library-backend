const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("DB connect"))
    .catch((error) => console.log(error));
};

module.exports = connectDB;