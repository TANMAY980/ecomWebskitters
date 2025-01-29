const mongoose=require("mongoose");

// Defining Schema
const emailVerificationSchema = new mongoose.Schema({
  userId: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'userModel',
      required: true 
    },
  otp: { 
    type: String,
     required: true
  },
  createdAt: { type: Date, default: Date.now, expires: '5m' }
});

// Model
const EmailVerificationModel = mongoose.model("EmailVerification", emailVerificationSchema);

module.exports= EmailVerificationModel;