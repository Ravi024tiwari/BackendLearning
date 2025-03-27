class ApiResponse {
    constructor(statusCode,data,message ="success"){ //this is Success response of our server api when our data working properly to the client
        this.statusCode =statusCode
        this.data =data
        this.message =message
        this.success =statusCode < 400 //learn statusCode for different response of req
    }
}

export {ApiResponse}