import { asyncHandler } from "../utils/asyncHandler.js";//this is higerorder function which take function as a argument

const registerUser =asyncHandler(async( req,res)=>{
   return res.status(400).json({//response is in json format 
        message :"Chai aur Code got registor!"
    })
})


export {registerUser};//export these 


