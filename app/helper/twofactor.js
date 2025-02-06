const Speakeasy=require('speakeasy')
const qrcode=require('qrcode')
const usermodel=require('../model/usermodel')

class TwoFactor{

    /********************* GENERATING QR CODE FOR TWO FACTOR **************************/
    async EableTwoFactor(req,res){
        const user= await usermodel.findById(req.user.id)
        const secret = Speakeasy.generateSecret({ name: 'Eommerceweb' });
        if(user){
             /******* Save the secret********/
            user.twoFASecret = secret.base32; 
            /***** Enable 2FA for the user ***********/
            user.twoFAEnabled = true;          
            await user.save();

            // Generate a QR code that the user can scan
            const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);
            res.render('user/enable2FA', {
                qrCode: qrCodeDataURL,
                secret: secret.base32,  
            });
        }
        
    }


    
}

module.exports=new TwoFactor()