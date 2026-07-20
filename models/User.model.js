const mongoose= require("mongoose")



const UserSchema= new mongoose.Schema({
    firstName:{type:String, required: true}, 
    lastName: {type: String, required:true},
    email: {type: String, required: true ,unique: true},
    password: {type: String, required: true, select:false},
    role:{type:String, enum:["admin", "user"], default:"user", required:true},
    profilePicture:{
        secure_url:{type:string},
        public_id:{type:string}
    }
}, {timestamps: true, strict: "throw"})


const UserModel = mongoose.model("user", UserSchema)

module.exports = UserModel