import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        default:null
    },
    email:{
        type:String,
        required:true,
        default:null
    },
    password:{
        type:String,
        required:true,
        default:null
    }
},{timestamps:true});

export default mongoose.model("User", userSchema);