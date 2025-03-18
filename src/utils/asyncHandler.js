//Method 1:to write the asyncHandler function
 const asyncHandler =(requestHandler)=>{//here requestHandler is a function passed from index.js
     (req ,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=> next(err))
     }
 }



//this is async handler with higher Order function which take a function as a argument
//niche wala ye show kar rha hai ki ek function ko kisi dusre function ke andar pass kar rha hu.. as a high order function
//wrapper function in term of try catch ---->Method 2

// const asyncHandler =(fnc)=>async (req,res,next)=>{
//     try{
//         await fnc(req,res,next)
//      }
//      catch(err){
//         res.status(err.code || 500).json({//error of api to standrise the format
//             sucess :false,
//             message : err.message
//         })
//      }
// }