import { asyncHandler } from "../utils/asyncHandler.js";//this is higerorder function which take function as a argument
import {Apierror} from "../utils/apierror.js"
import {User} from "../models/user.model.js"
import {uploadonCloudnary} from "../utils/cloudnary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

//generate Aceess and Refresh Tokens
const generateAccessAndRefreshToken =async(userId)=>{
   try{
      const user= await User.findById(userId);//this is user from database
      const accessToken = user.generateAccessToken();//get the access tokens and refesh tokens
      const refreshToken =  user.generateRefreshToken();

      //now save the refresh token in the database
       user.refreshToken  =refreshToken//this one from userSchema
      await  user.save({validateBeforeSave :false})//its save that refresh token
      
      return {accessToken,refreshToken};//its return access token and refersh token of user and return that
   }
   catch(err){
      throw new Apierror(500,"Something went wrong while generating acces and ref token!")
   }
}

const registerUser =asyncHandler(async( req,res)=>{ //the async is used bec the upload takes times
    //steps need to registor 
    //step 1:take user info from frontend  //throught postman

    //we get those models details from postman or say front end

    //step :2::Validation not empty the details

    //step :3..Check if already exits in database(by email ,username )

    //step :4..files are available or not ie 'avatar' ..required from model details

    //step 5://Upload on cloudnary the photos and vedios//Url

    //step :6..check the successful upload of avatar on cloudnary

    //step :7..create object of user--create entry in db

    //step 7:..remove password and refresh token field from response

    //check for user creation 

    //step 9: if user get created return response

    //step 10: if not found return null

    const {username,email,fullName,password} =  req.body;//its on the multer provide req
    console.log("email :",email); 
    console.log("The req body contains :",req.body);
    
    //Approch :1=> if(fullName==""){//check for all error possible
    //     throw new Apierror(400,"Full name is required");//here we return or throw that inbuilt error
    // }
    // if(email==""){
    //     throw new Apierror(400,"Email is required!")
    // }
    //Method 2:
    if([username,email,fullName,email].some((field)=>{//some traverse through each ele of arr
        return field?.trim()===""//here the field return true if it get ""(any field)
    })){
     throw new Apierror(400,`All field are compulsory!`)
    }
    //checking for that Registering user is already present or not in DataBase

   const existedUser=await User.findOne({//chahe email se find kro ya username se 
        $or:[{username},  {email}]
    })
    if(existedUser) throw new Apierror(409, "User with email or username already exits!");


    //now handle the images or avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;//its path for avatar on multer
  let coverImgLocalPath;
  //advance way to check that we file is uploaded or not from multer server
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    coverImgLocalPath =req.files.coverImage[0].path;//its path for coverImage
  }

  console.log("Avatar path:",avatarLocalPath);
  console.log("coverImg path:",coverImgLocalPath);

  if(!avatarLocalPath) throw new Apierror(400,"Avatar file is required!");//its required in models

  //step:5 Upload on coudnary 
 const avatar =await uploadonCloudnary(avatarLocalPath);//this take time thats why we use async function
 const coverImage=await uploadonCloudnary(coverImgLocalPath);//its also get uploaded on cloudnary

 //step 6:Now check for avatar is it uploaded correctly on cloudnary or not
 if(!avatar) throw new Apierror(404,"Avatar image is not found!");
 


 //step:7 Make object of user and upload on database
 const uploadUser =await User.create({//its form object to upload on a cloudnary
    username:username.toLowerCase(),
    avatar :avatar.url,
    coverImage:coverImage?.url ||"",//agar hai to thik nhi to khali string hi chalegi
    fullName,
    password,
    email,
 })
 const createdUser =await User.findById(uploadUser._id).select(//its not select both pass and refToken
    "-password -refreshToken"
 ) //here we get the user
 if(!createdUser) {
    throw new Apierror(500,"Something went wrong !");
 }

 return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered Successfully")
 )

 //checking for user already exit or not in database

//now make loginUser from accesstokesn and refresh Tokens
//Todos of Login
//step 1-> take credentials info from user/client (email or username)
//step 2->check these are empty or not if empty then return Apierror
//stemp 3->check their username or email is match in database or not
//step 5->compare their password with hash password 
//step 4->if got match geneate their refresh token and Accesstokens


})

const loginUser =asyncHandler(async(req,res)=>{
   const {username,email,password}= req.body;//extract username,email or password from req body
   //now we check is it empty or not
   console.log("Console body in Login User:",req.body);
    if((!username && !email) || !password){
      throw new Apierror(400,"username or email is required");
    }
    //find the user though matchig email or username
    const user = await User.findOne({
      $or :[{username},{email}]//inn dono me se koi bhi find kar do from Userdatabase
    })
    if(!user){
      throw new Apierror(404,"User does not exit in database");
    }
    //now check the password
    const passwordValid =await user.isPasswordCorrect(password);//check for password valid
    if(!passwordValid) throw new Apierror(401,"Invalid user Password ..Try Again");

    //now make the access and refresh tokens for users

     //now fetch userId from given input login data
     const userID =user._id;//this is user id that we generate

     const {accessToken,refreshToken} =await generateAccessAndRefreshToken(userID);
     console.log("Access Token Generated!",accessToken);
     console.log("Refresh Token!",refreshToken);
     //here we generate the accesstoken and refreshToken
     //
     //select property remove the important credetials 
     const loggedInUser =await User.findById(userID).select("-password -refreshToken" )

     //its help to send the cookies to the browsers
     const options ={
      httpOnly :true,
      secure :true,
     }

     return res
     .status(200)
     .cookie("accessToken",accessToken,options)//
     .cookie("refreshToken",refreshToken,options)
     .json(
        new ApiResponse(//this is because for custom response 
         200,
         {
            user :loggedInUser ,accessToken,refreshToken
         },
         "Hello User logged In Successfully",
        )
     )
    
})

const logoutUser =asyncHandler(async (req,res)=>{
   //we have to find out the user which is logged in already to get logged out
   await User.findByIdAndUpdate(
      req.user._id,//yhi to user hai
      {
         $set :{
            refreshToken:undefined//set new refreshToken
         }
      },
      {
         new :true
      }
   )
   const options ={//set new options
      httpOnly :true,
      secure :true,
   }

   return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,{},"User logged out Successfully!"))
})

export {registerUser,loginUser,logoutUser};//export these  
//controllers ke ander vo rahengo jo baar baar function use honge

