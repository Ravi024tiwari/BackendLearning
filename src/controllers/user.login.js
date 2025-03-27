import { asyncHandler } from "../utils/asyncHandler.js";

const loginUser =asyncHandler(async (req,res)=>{//async handler function hame ek promise return karta hai jo ki ek highly order function hai
    res.status(200).json({
        message :"Welcome ! You logged in  Succesfully!"
    })
})

export {loginUser}