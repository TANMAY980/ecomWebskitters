const twilio=require('twilio')(process.env.TWILIO_SID,process.env.TWILIO_AUTH_TOKEN)

const sendMessage=async(req,user,otp)=>{
    if (!user.phonenumber) {
        throw new Error('User phone number is missing');
    }
    const message=await twilio.messages.create({
        body:`OTP: ${otp} - Verify your email account`,
        from: process.env.TWILIO_NUMBER,
        to:user.phonenumber
    })
    console.log(message);
    
}
const sendLoginMessage=async(req,user)=>{
    const message=await twilio.messages.create({
        body:`dear user ${user.email } logging successfully in your account  `,
        from: process.env.TWILIO_NUMBER,
        to:user.phonenumber
    })
    console.log(message);
    
}

const sendorderstatusMessage=async(req,message)=>{
    const result =await twilio.messages.create({
        body:`dear user your product status is  ${message }  `,
        from: process.env.TWILIO_NUMBER,
        to:user.phonenumber
    })
    console.log(result);
}
module.exports={sendMessage,sendLoginMessage,sendorderstatusMessage}
