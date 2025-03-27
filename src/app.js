import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app =express();

//app.use() its uses as a middleware or as a configuration

app.use(cors({//only ethical user or srver can communicate with our backend 
    origin:process.env.CORS_ORIGIN,//origin of connection
    credentials  :true
}))
//cors make the origin connection with our backend
//json data,urldata,from data on app so setting on these
//these are the different middleware for different {req,res} from clients
app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended:true,limit:"16kb"}))//its for url encoded req in nested objects forms

app.use(express.static("public"))//its for loading of file and folder in express
//here "Public " is a folder name where we store file and images

app.use(cookieParser())//configure the cookie parser to use the CURD operation on server

//importing the routers and the asynchandler function ise controller

//routes
import  {userrouter } from "./routes/user.routes.js";//we import that route from routes where login router takes place

//routes declaration
app.use("/user",userrouter)//its pass the control to the userrouter path /file
//ye iske baad responsiblity userroutes ko de deta hai as a middleware use hone ke lie
//for standered practise we wiil use
//app.use("/api/v1/users",userroute);//
//agar hame chahe register karna ho , login karna ho we use these practise to send on reginster router for async authentication and for login also

export {app}//export the app not by default