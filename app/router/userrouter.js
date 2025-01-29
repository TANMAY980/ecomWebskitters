const express=require('express')
const userController = require('../controller/userController')
const{userAuth}=require('../middleware/checkauth')
const router=express.Router()


/**** USER SIGNUP ROUTER TO RENDER USER SIGNUP EJS PAGE******/
router.get('/usersignup',userController.userSignUp)

/**** USER LOGIN ROUTER TO RENDER USER LOGIN EJS PAGE******/
router.get('/usersignin',userController.userSignIn)

/****** FORGOT PASSWORD ROUTER TO RENDER FORGOT PASSWORD EJS PAGE*******/
router.get('/forgotpassword',userController.forgotPassword)


/****** FORGOT PASSWORD FUNCTION ROUTER*******/
router.post('/forgotPassword',userController.forgot_password)

/********** PRODUCT PAGE ROUTER TO RENDER PRODUCT EJS PAGE ***********/
router.get('/productpage',userAuth,userController.product)

router.get('/searchproduct',userController.productsearch)

/************* EMAIL VERIFY PAGE ROUTER TO RENDER EJS PAGE***********/
router.get('/verifyemail',userController.verifyemail)

/************* EMAIL VERIFY FUNCTION ROUTER***********/
router.post('/verifyEmail',userController.verify_email)

/*************** TWO FACTOR EJS PAGE ROUTER ******************/
router.get('/verifyusingemail',userController.twofactor)

/************* TWO FACTOR  EMAIL VERIFY FUNCTION ROUTER***********/
router.post('/twofactor',userController.verify_email_twofactor)

/************** HOME PAGE ROUTER TO RENDER HOME EJS PAGE **************/

router.get('/',userController.home)

/*********** USER REGISTER FUNCTION  ROUTER*****/
router.post('/signupuser',userController.user_register)

/*********** USER LOGIN FUNCTION  ROUTER*****/
router.post('/userlogin',userController.usersignin)

/*************** LOGOUT USER EJS***************/
router.get('/userlogout',userController.logout.bind(userController))

/********************** UPDATE USER PASSWORD EJS PAGE ROUTER ************************/
router.get('/updatepass/:id',userAuth,userController.updatepassword)

/*************** UPDATE USER PASSWORD FUNCTION****************/
router.post('/updatepasskey/:id',userAuth,userController.update_password)

router.get('/resetpassword/:id/:token',userController.reset)

router.post('/resetPassword/:id/:token',userController.reset_password)
/****************** CART EJS PAGE ROUTER ***************/
router.get('/addcart',userController.addtocart)

router.post('/cart',userController.usercheck,userController.add_to_cart)

/**************************** CHANGE USER TWO FACTOR FUNCTION ROUTER*****************************/
router.post('/twofactor',userController.change_twofactor)


module.exports=router