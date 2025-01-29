const mongoose=require('mongoose')
const {Schema}=mongoose

const productSchema=new Schema({
    productName:{
        type:String,
        required:true,
        lowercase:true,
    },
    price:{
        type:String,
        required:true,
        minlength:1
    },
    stock:{
        type:Number,
        minlength:1,
        required:true,
    },
    description:{
        type:String,
        required:true,
        minlength:5,
    },
    categoryId:{
        type:Schema.Types.ObjectId,
        ref:"categoryModel"
    },
    orderId:{
        type:Schema.Types.ObjectId,
        ref:"orderModel"
    },
    image:{
        type:String,
    },
    status: {
        type: String,
        enum: ["Available", "Out of Stock"],
        default: "Available",
      },
},{
    timestamps:true,
    versionKey:false,
})
const productmodel=mongoose.model("productModel",productSchema)
module.exports=productmodel