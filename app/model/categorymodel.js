const mongoose=require('mongoose')
const{Schema}=mongoose

const categorySchema=new Schema({

    name:{
        type:String,
        unique: true,
        required:true,
        lowercase:true,
    }
},{
    timestamps:true,
    versionkey:false,
})
const categorymodel=mongoose.model('categoryModel',categorySchema)
module.exports=categorymodel