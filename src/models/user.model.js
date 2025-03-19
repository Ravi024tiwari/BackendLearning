import { type } from "express/lib/response";
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema =new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index :true //its make serching easily in database //importent point
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    avatar:{
      type:String,//cloundnary url of images Url
      required:true,
    },
    coverImage :{
        type:String,
    },
    watchHistory:[//its store the id of those video which we watch in array of objects 
            {
                type:Schema.Types.ObjectId,
                 ref :"Video",
            },
        ],
    password:{//passwrd should be incripted form by using bcrypt package and compare the encrypt password
        type:String,
        required:[true ,'Password is required!'],//custom error message
    },
    refreshToken :{
        type:String,
    }
},
    
    {timestamps:true}//its give createdAt and UpdatedAt for each documents
)



userSchema.pre("save", async function (next) {//this is a prehook which take a callback to use schema
    if(!this.isModified("password")) return next();//this for save//if password not modified then return 
    //otherwise the password always change on changing any documents on Schema

    this.password = await bcrypt.hash(this.password, 10)//Rounds,salts kya hai to encrypt
    next()//after this middleware goto another middleware
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)//bcrypt compare the encypt password with "password" which pass in string and return bool rturn type
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(//JWT have sign methd //payload,buffer,callback
        {
            _id: this._id,
            email: this.email,
            username: this.username,//these are payloads on jwtsign
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,//this is access token given to userSchema
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){//this is all methods models used in different Schema //its refresh access tokens 
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User =mongoose.model("User",userSchema)