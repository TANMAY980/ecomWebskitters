const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    order_stage: {
      type: String,
      enum: ["not_ordered", "ordered", "shipped", "delivered"],
      default: "ordered",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "userModel",
      required: true
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "productModel",
          required: true
        },
        categoryId: {
          type: Schema.Types.ObjectId,
          ref: "categoryModel"
        },
        quantity: {
          type: Number,
          default: 1
        },
        price: {
          type: Number,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const ordermodel = mongoose.model("ordermodel", orderSchema);
module.exports = ordermodel;
