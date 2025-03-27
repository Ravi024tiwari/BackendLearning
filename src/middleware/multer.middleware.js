import multer  from "multer";

const storage = multer.diskStorage({//we use diskstorage to store the files or folder which we want to upload on cloudnary
    destination: function (req, file, cb) {//this file is upload on server by multer use
      cb(null, './public/temp')
      console.log(`About the file uploaded in server by multer:`,file);
    },
    filename: function (req, file, cb) {//ya hum koi suffix me de sakte hai //by use of crypto and hex code and path package 
      cb(null, file.originalname)//we can add suffix in our file name
    }
  })
  
  export const upload = multer({//here upload is a multer
     storage,
    })

