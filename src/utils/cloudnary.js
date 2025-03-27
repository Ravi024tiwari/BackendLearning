import { v2 as cloudinary } from "cloudinary"
import fs from "fs" //fs is the file system


cloudinary.config({
    cloud_name: process.env.CLOUD_API_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

//after upload the files on server by multer we upload these localpath file into cloudnary
//uploading  the image or any files on the cloundnary

const uploadonCloudnary = async (localfilepath) => {//these local file path get upload on c
    try {
        if (!localfilepath) return null;//if the localfile path does not exit in server //localhost//we give our local file path de diya hai
        const response = await cloudinary.uploader.upload(localfilepath, {
            public_id: 'userregister',//ye id uploaded document ke url ke piche lagti hai
            resource_type: "auto"//we check propert of localfile path
        }
        ) //file have been uploaded succesfully
        console.log("file is uploaded successfully!", response.url);//here we get the response url
        //fs.unlinkSync(localfilepath);
        //this unlink the file system
        return response;//here after uploading it return response
    }
    catch (err) {
        console.log("Error is generated while uploading :", err);//firstly print the error if we got through uploading of file
       // fs.unlinkSync(localfilepath);//to delete that local path from server
        return null;
        //remove the locally saved temporty file as the upload operation got fail 

    }
}
export { uploadonCloudnary };//here we export these cloudnary files to export directly these 
//images avatar on cloudnary