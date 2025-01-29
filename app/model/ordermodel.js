const mongoose=require('mongoose')
const {Schema}=mongoose

const orderSchema = new Schema(
    {
      order_stage: {
        type: String,
        enum: ["not_ordered", "ordered", "shipped", "delivered"],
        default: "ordered",
      },
      productId: {
        type: Schema.Types.ObjectId,
        ref: "productModel",
      },
      categoryId: {
        type: Schema.Types.ObjectId,
        ref: "categoryModel",
      },
      userId:{
        type:Schema.Types.ObjectId,
        ref:"userModel"
      }
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );
  const ordermodel=mongoose.model("ordermodel",orderSchema)
  module.exports=ordermodel
  