const mongoose=require("mongoose")

const profileSchema=mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    file: Buffer,
    message: String,
    userID:String
})
const ProfileModel=mongoose.model("profile",profileSchema)

module.exports={ProfileModel}