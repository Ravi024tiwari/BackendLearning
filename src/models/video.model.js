import { type } from "express/lib/response";
import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";//import the pageingae

const videoSchema =new mongoose.Schema(
    {
        videofile:{
            type:true,//cloudnary
            required:[true,'Video not found!'],
        },
        thumbnail:{ //cloundnary gives the info of videos
            type:String,
            required:true,
        },
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        duration:{//its by using cloudnary 
            type:Number,//cloundnary
            required:true,
        },
        views:{
            type:Number,
            default:0,
            required:true,
        },
        isPublished:{
            type:Boolean,
            default:true,
        },
        owner:{
            type :Schema.Types.ObjectId,
            ref :"User", 
           },

    }
    ,{timestamps:true}
)


    videoSchema.plugin(mongooseAggregatePaginate);


export const Video =mongoose.model("Video",videoSchema);