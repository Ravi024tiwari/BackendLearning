//require('dotenv').config({path:'./env'})
import dotenv from "dotenv"//here we impor the dotenv
// import mongoose from "mongoose";
// import { DB_NAME } from "../constants";
import connectDB from "./db/index.js";
import {app} from "./app.js";

dotenv.config({
    path :'./env'
})


connectDB()//adding of database//its return promise //after connection of DB it return promise
.then((res)=>{
   app.listen(process.env.PORT || 8000,()=>{//here we use the port
    console.log(`app is listening at the port:${process.env.PORT}`)
   })
})
.catch((err)=>{
    console.log("Connection Error in Mongo Db:");
})//yaha tak apna first phase connection tha
