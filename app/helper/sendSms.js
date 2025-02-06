
const twilio=require('twilio')(process.env.TWILIO_SID,process.env.TWILIO_AUTH_TOKEN)



class Twilio{

    /*********************** SEND SMS FOR VERIFY EMAIL TWILIO FUNCTION ***************************/
    async SendMessage(req,res,user,otp){
        try {
                if (!user.phonenumber) {
                    throw new Error('User phone number is missing');
                }
                const message=await twilio.messages.create({
                    body:`OTP: ${otp} - Verify your email account`,
                    from: process.env.TWILIO_NUMBER,
                    to:user.phonenumber
                })
                console.log(message);
                return true         
            
        } catch (error) {
            console.log(error);
            
        }
    }

    /************************* SEND LOGIN SMS TWILIO FUNCTION***********************************/
    async SendLoginMessage(req,res,user){
        try {
            const message=await twilio.messages.create({
                body:`dear user ${user.email } logging successfully in your account  `,
                from: process.env.TWILIO_NUMBER,
                to:user.phonenumber
            })
            console.log(message);
        } catch (error) {
            console.log(error);
            
        }
    }

    /***************************** SEND REGISTER MESSAGE TWILIO FUNCTION ***************************/

    async SendRegisterMessage(req,res,user){
        try {
            const message=await twilio.messages.create({
                body:`dear ${user.email } your registration is successfull `,
                from: process.env.TWILIO_NUMBER,
                to:user.phonenumber
            
            })
            
            console.log(message);
            return true
            
        } catch (error) {
            console.log(error);
            
        }
    }

    /********************* SEND ORDER STATUS MESSAGE TWILIO FUNCTION******************************/

    async SendOrderStatusMessage(req,res,message){
        try {
            const result =await twilio.messages.create({
                body:`dear user your product status is  ${message }  `,
                from: process.env.TWILIO_NUMBER,
                to:user.phonenumber
            })
            console.log(result);
        } catch (error) {
            console.log(error);
            
        }
    }
}




module.exports = new Twilio() 
