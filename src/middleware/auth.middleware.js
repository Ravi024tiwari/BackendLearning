import { Apierror } from "../utils/apierror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        console.log("This is the cookie in req body :",req.cookies);
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token || token.trim() === "") {
            throw new Apierror(401, "Unauthorized request! Token is missing.");
        }        //hame chahe cookies se token mil jaenge ya phir jo headers bhejenge usse use kar lenge
        //user ki identification ke lie
        if (!token) {
            throw new Apierror(401, "Unauthorized request!");//if not get authorised access
        }
        //with the help of these APISECRET AND THEIR SIGNATURE it verity the token
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            //TODO NEXT_VIDEO:disscuss about frontend
            throw new Apierror(401, "Invalid AccessToken");
        }

        req.user = user;//add new object user on req object
        next()
        //go to next middleware
    } catch (error) {
        console.log("yhi par error hai");
        throw new Apierror(401, error?.message || "Invalid access token");
    }

})
