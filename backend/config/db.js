const mongoose = require("mongoose");
require("dotenv").config(); 

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://someshrocks144:somesh2004@cluster0.u16mu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0z/test"
    );
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
