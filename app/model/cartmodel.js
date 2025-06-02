const mongoose=require('mongoose')
const {Schema}=mongoose

const CartSchema=new Schema({
    user:{type:Schema.Types.ObjectId,ref:"usermodel"},
    items:[{
        product:{type:Schema.Types.ObjectId,ref:"productModel"},
        quantity:{type:Number,default:1}
    }],
    
})
const cartmodel=mongoose.model("cart",CartSchema)
module.exports=cartmodel