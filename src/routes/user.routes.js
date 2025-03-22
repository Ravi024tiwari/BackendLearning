import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";

const userrouter = Router();//we track the router from express

//now after redircting from app.js routing path on apply the processing
//its like
//https://localhost:8000/users/register
userrouter.route("/register").post(registerUser)

//userrouter.route("/login").post(registerUser)//here we do our differetn funcionality like register,login, singup and many more things


export default userrouter;