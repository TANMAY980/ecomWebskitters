const mongoose=require('mongoose')
const {Schema}=mongoose

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
            'Please enter a valid email address'
        ]
    },
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        minlength: 6,
        unique: true,
        match: [
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@._-])[A-Za-z\d@._-]{6,}$/,
            'Username must include at least one letter, one number, and one special character (@, ., _, or -)'
          ]
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    is_verified:{
        type:Boolean,
        default:false
    },
    phonenumber:{
        type:String,
        required:true
    }
},{
    timestamps:true,
    versionKey:false
})
const usermodel=mongoose.model("userModel",userSchema)
module.exports=usermodel