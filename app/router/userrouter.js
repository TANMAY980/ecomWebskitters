const express=require('express')
const userController = require('../controller/userController')

const passportmiddleware=require('../middleware/passportMiddleware')

const router=express.Router()
const passport=require('passport')

/**** USER SIGNUP ROUTER TO RENDER USER SIGNUP EJS PAGE******/
router.get('/usersignup',userController.UserSignUp)

/**** USER LOGIN ROUTER TO RENDER USER LOGIN EJS PAGE******/
router.get('/usersignin',userController.UserSignIn)

/****** FORGOT PASSWORD ROUTER TO RENDER FORGOT PASSWORD EJS PAGE*******/
router.get('/forgotpassword',userController.ForgotPassword)


/****** FORGOT PASSWORD FUNCTION ROUTER*******/
router.post('/forgotPassword',userController.ForgotPasskey)

/********** PRODUCT PAGE ROUTER TO RENDER PRODUCT EJS PAGE ***********/
router.get('/productpage', passportmiddleware.IsUser, userController.Product);


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
router.post('/userlogin',passport.authenticate('local'),userController.Signin)

/*************** LOGOUT USER EJS***************/
router.get('/userlogout',userController.Logout)

/********************** UPDATE USER PASSWORD EJS PAGE ROUTER(JWT) ************************/

// router.get('/updatepass/:id',User.UserAuth,userController.UserCheck,userController.UpdatePassword)

/********************** UPDATE USER PASSWORD EJS PAGE ROUTER (PASSPORT) ************************/

router.get('/updatepass/:id',passportmiddleware.IsUser,userController.UpdatePassword)

/*************** UPDATE USER PASSWORD FUNCTION ROUTER (JWT) ****************/
// router.post('/updatepasskey/:id',User.UserAuth,userController.UpdatePasskey)

/*************** UPDATE USER PASSWORD FUNCTION ROUTER (PASSPORT) ****************/
router.post('/updatepasskey/:id',passportmiddleware.IsUser,userController.UpdatePasskey)

/************************* RESET PASSWORD EJS PAGE RENDERING FUNCTION ROUTER **************************************/
router.get('/resetpassword/:id/:token',userController.Reset)

/******************************* RESET PASSWORD FUNCTION ROUTER*********************************************/
router.post('/resetPassword/:id/:token',userController.ResetPasskey)

/****************** CART EJS PAGE ROUTER ***************/
router.get('/addcart',passportmiddleware.IsUser,userController.AddToCart)
router.post('/addtocart',passportmiddleware.IsUser,userController.AddInCart)
router.get('/editaddress/:id',passportmiddleware.IsUser,userController.EditAddress)
router.post('/updateaddress/:id',passportmiddleware.IsUser,userController.UpdateAddress)
router.get('/userDetails/:id',passportmiddleware.IsUser,userController.UserDetails)
router.post('/remove',passportmiddleware.IsUser,userController.RemoveItem)
router.get('/product/:id',userController.ProductPage)
router.post('/buynow',passportmiddleware.IsUser,userController.BuyNow)



module.exports=router