// MongoDB Connection URI (Localhost)
import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

dotenv.config();//configure the environmental variable used

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";//firslty we make our mongodb connnection with the hlep of mongoose


const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`)
        console.log(`\n connection succesful !! DB HOST : ${connection.connection.host}`);//
        //to check in which development production host at working
    } catch (error) {
        console.log("conntion Error DB index.js",error) 
        process.exit(1);
    }
}

export default connectDB