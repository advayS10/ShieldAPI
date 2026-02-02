const mongoose = require('mongoose')
const config = require('./env')

const connectDB = async () => {
    try{
        await mongoose.connect(config.mongodbURI);
        console.log("MongoDB connected successfully");
    }
    catch(err){
        console.log("Error in MongoDB connection", err);
        process.exit(1);
    }
};

module.exports = connectDB;