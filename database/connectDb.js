const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config

let connectionPromise= null

const connectDB = async()=>{
    if(mongoose.connection.readyState==1) return

    if(!connectionPromise) return connectionPromise

    connectionPromise= mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("Database connected successfully");
    })

    .catch((err)=>{
        console.error("Error connecting to db", err);
        throw error;
        
        
    })

    return connectionPromise
}

module.exports = connectDB;