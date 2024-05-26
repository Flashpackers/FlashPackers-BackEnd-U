const mongoose = require("mongoose");

const connectDB = (uri)=>{
    console.log("connected");
    return mongoose.connect(uri);
};

module.exports = connectDB;