const transporter=require('../config/emailConfig')
const otpVerifyModel=require('../model/verifyEmailmodel')

const sendEmailVerificationOTP=async(req, user)=>{
    // Generate a random 4-digit number
  const otp = Math.floor(1000 + Math.random() * 9000);

  // Save OTP in Database
  const onetimep=await new otpVerifyModel({ userId: user._id, otp: otp }).save();
  console.log('onetimep',onetimep);
  

  //  OTP Verification Link
  //const otpVerificationLink = `${process.env.FRONTEND_HOST}/account/verify-email`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "OTP - Verify your account",
    html: `<p>Dear ${user.name},</p><p>Thank you for signing up with our website. To complete your registration, please verify your email address by entering the following one-time password (OTP)</p>
    <h2>OTP: ${otp}</h2>
    <p>This OTP is valid for 5 minutes. If you didn't request this OTP, please ignore this email.</p>`
  })

  return otp
}

const sendEmail=async(user,user_password,url)=>{
    // Generate a random 4-digit number
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "user Credentials",
    html: `<p>Dear${user.name},welcome to Ecommerce</p>
    <p>your email address is : ${user.email} </p>
    <p>password : ${user_password}</p>
    <p>please login from here :${url}</p>
    <p>please verify your email first </P>
    `
  })


}

const sendsiginmessage=async(req,user,url)=>{
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "login info ",
    html: `<p>Dear${user.name},welcome to Ecommerce</p>
    <p>dear user ${user.email } logging successfull in your account 
    your login usl ${url} 
    </p>`
       
  })
}

const sendupdatepasswordmessage=async(req,user)=>{
  await transporter.sendMail({
    from:process.env.EMAIL_FROM,
    to: user.email,
    subject: "password info ",
    html: `<p>Dear${user.name},welcome to Ecommerce</p>
    <p>dear user ${user.email } password updated successfully please signin your account again in your account.</p>`
  })
}


const sendStatusorder = async (email, message) => {
  try {
    const loginUrl = "http://localhost:9000/usersignin"; 
    const ecommerce="http://localhost:9000"
    await transporter.sendMail({
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
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports={sendEmail,sendEmailVerificationOTP,sendsiginmessage,sendupdatepasswordmessage,sendStatusorder}