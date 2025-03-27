import {Router} from "express";
import {registerUser} from "../controllers/user.controller.js";
import {loginUser} from "../controllers/user.controller.js";//i use default export
import {upload} from "../middleware/multer.middleware.js";//we use the multor on routes
import { logoutUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const userrouter = Router();//we track the router from express

//now after redircting from app.js routing path on apply the processing
//its like
//https://localhost:8000/users/register
userrouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)//kyuki hame registration krne se pahle img file chahiye thi
    upload.fields([//this give more field to req object
        {
            name :"avatar",
            maxCount:1
        },//avatar
        {
            name :"coverImage",
            maxCount:1,
        }//this is the method to use the middle ware
    ]),
    registerUser
//yha se route hona hai ie registerUser prr


userrouter.route("/login").post(loginUser)//here we get login 
//login me hame koi middleware nhi chahiye
//

//secured routes
userrouter.route("/logout").post(verifyJWT, logoutUser)
//pahle ye logout route par jakar pahle verifyJWT se req.user =user set kargea of that cookie
//and then logoutUser par cookie ko clear kar dega

export { userrouter};