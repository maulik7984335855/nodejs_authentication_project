import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    profileImg:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
})


export const userModel = mongoose.model("authenticate",userSchema)