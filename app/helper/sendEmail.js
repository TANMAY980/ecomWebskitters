const transporter=require('../config/emailConfig')
const otpVerifyModel=require('../model/verifyEmailmodel')

class SendEmailAndSms{


  /******************************* SENDING OTP USING EMAIL TO VERIFY EMAIL  ***************************************/
  async SendEmailVerificationOTP(req,res,user){
    try {
      const otp=Math.floor(100 + Math.random()*9000);
      const onetimep=await otpVerifyModel({userId:user._id,otp:otp}).save()
      console.log('onetimep',onetimep);

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "OTP - Verify your account",
        html: `<p>Dear ${user.name},</p><p>Thank you for signing up with our website. To complete your registration, please verify your email address by entering the following one-time password (OTP)</p>
        <h2>OTP: ${otp}</h2>
        <p>This OTP is valid for 5 minutes. If you didn't request this OTP, please ignore this email.</p>`
      })
    
      return otp
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error"); 
    }
  }


/**************************** SENDEMAIL AFTER REGISTRAION*******************************************/
  async SendRegistrationEmail(req,res,user,user_password,url,ecomwebskittersurl){
    try {
      const sendmail=await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "user Credentials",
        html: `<p>Dear${user.name},welcome to Ecommerce </p>
        <p>shop with us ${ecomwebskittersurl}</p>
        <p>your email address is : ${user.email} </p>
        <P> Username is:${user.username}</p>
        <p>password : ${user_password} , change your password and protect your account </p>
        <p>while loging you have to verify your email first please verify your email </P>
        <p>please login from here :${url}</p>
        `

      })
      return true;
      
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error");
    }

  }


/*********************************SENDING SIGING MESSAGE**************************************/
  async SendSiginingMessage(req,res,user,url){
    try {
      const ecommerce="https://ecomwebskitters.onrender.com"
      const siginingsms =await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "login info ",
            html: `<p>Dear${user.name},welcome to Ecommerce ${ecommerce}</p>
            <p>dear user ${user.email } logging successfull in your account. 
            <p>your can login 
            from here anytime ${url} </p>`
              
          })
          return true
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error");
    }
  }
  
/**************************************SEND UPDATE PASSWORD MESSAGE***************************************************/

  async SendUpdatePasswordMessage(req,res,user){
  try {
    const sendupdatemessage=await transporter.sendMail({
      from:process.env.EMAIL_FROM,
      to: user.email,
      subject: "password info ",
      html: `<p>Dear${user.name},welcome to Ecommerce</p>
      <p>dear user ${user.email } password updated successfully please signin your account again in your account.</p>`
    })
    return true
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
    }

/***************************************SEND STATUS ORDER********************************************************/
  async SendOrderStatus(req,res,email,message){
  try {
    const loginUrl = "https://ecomwebskitters.onrender.com/usersignin"; 
    const ecommerce="https://ecomwebskitters.onrender.com"
    const sendstatus=await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Order Status Notification",
      html: `
        <p>Dear ${email}, welcome to Ecommerce ${ecommerce}!</p>
        <p>Your order's current status is: <strong>${message}</strong>.</p>
        <p>You can log in to your account <a href="${loginUrl}">here</a> for more details.</p>
      `,
    });

    console.log(`Email sent to ${email} successfully.`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).send("Internal Server Error");
  }
    }
  
  async SendOrderNotification(req,res,email,message){
  try {
    const loginUrl = "https://ecomwebskitters.onrender.com/usersignin"; 
    const ecommerce="https://ecomwebskitters.onrender.com"
    const sendstatus=await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Order Notification",
      html: `
        <p>Dear user : ${email} your order is successfully placed</p>
        <p>Your order's current status is: <strong>ordered</strong>.</p>
        <p>You can log in to your account <a href="${loginUrl}">here</a> for more details.</p>
      `,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).send("Internal Server Error");
  }
    }

}

module.exports=new SendEmailAndSms()