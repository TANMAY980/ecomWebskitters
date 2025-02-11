const express=require('express')
const userController = require('../controller/userController')
const User=require('../middleware/checkauth')
const router=express.Router()


/**** USER SIGNUP ROUTER TO RENDER USER SIGNUP EJS PAGE******/
router.get('/usersignup',userController.UserSignUp)

/**** USER LOGIN ROUTER TO RENDER USER LOGIN EJS PAGE******/
router.get('/usersignin',userController.UserSignIn)

/****** FORGOT PASSWORD ROUTER TO RENDER FORGOT PASSWORD EJS PAGE*******/
router.get('/forgotpassword',userController.ForgotPassword)


/****** FORGOT PASSWORD FUNCTION ROUTER*******/
router.post('/forgotPassword',userController.ForgotPasskey)

/********** PRODUCT PAGE ROUTER TO RENDER PRODUCT EJS PAGE ***********/
router.get('/productpage',User.UserAuth,userController.Product)

router.get('/searchproduct',userController.ProductSearch)

/************* EMAIL VERIFY PAGE ROUTER TO RENDER EJS PAGE***********/
router.get('/verifyemail',userController.VerifyEmail)

/************* EMAIL VERIFY FUNCTION ROUTER***********/
router.post('/verifyEmail',userController.VerifyMail)


/************** HOME PAGE ROUTER TO RENDER HOME EJS PAGE **************/

router.get('/',userController.Home)

/*********** USER REGISTER FUNCTION  ROUTER*****/
router.post('/signupuser',userController.UserRegister)

/*********** USER LOGIN FUNCTION  ROUTER*****/
router.post('/userlogin',userController.Signin)

/*************** LOGOUT USER EJS***************/
router.get('/userlogout',userController.Logout)

/********************** UPDATE USER PASSWORD EJS PAGE ROUTER ************************/
router.get('/updatepass/:id',User.UserAuth,userController.UserCheck,userController.UpdatePassword)

/*************** UPDATE USER PASSWORD FUNCTION****************/
router.post('/updatepasskey/:id',User.UserAuth,userController.UpdatePasskey)

router.get('/resetpassword/:id/:token',userController.Reset)

router.post('/resetPassword/:id/:token',userController.ResetPasskey)

/****************** CART EJS PAGE ROUTER ***************/
router.get('/addcart',userController.AddToCart)





module.exports=router