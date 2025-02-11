const express=require('express')
const uploadimage=require('../helper/imageupload')
const Admin=require('../middleware/checkauth')
const adminController = require('../controller/adminController')
const router=express.Router()


/**** ADMIN SIGNIN ROUTER TO RENDER ADMIN LOGIN EJS PAGE******/
// router.get('/adminsignin',adminController.AdminSignIn)

/****************ADMIN SIGN IN ROUTER FOR SIGNIN FUNCTION**********************/
// router.post('/adminSignin',adminController.AdminSignin)

/**** ADMIN DASHBOARD ROUTER TO RENDER ADMIN DASHBOARD EJS PAGE******/
router.get('/admindashboard',Admin.AdminAuth,adminController.AdminCheck,adminController.AdminDashboard)

/**** CREATE PRODUCT PAGE ROUTER TO RENDER CREATE PRODUCT EJS PAGE******/
router.get('/createproduct',Admin.AdminAuth,adminController.AdminCheck,adminController.CreateProduct)

/****************** CREATE PRODUCT PAGE FUNCTION ROUTER**************************************/
router.post('/createproducts',Admin.AdminAuth,adminController.AdminCheck,uploadimage.single('image'),adminController.CreateProducts)

/**************** ALL PRODUCT EJS PAGE ROUTER **************/
router.get('/allproducts',Admin.AdminAuth,adminController.AdminCheck,adminController.AllProduct)

/****************** ALL CATEGORY PAGE ROUTER TO RENDER ALL CATEGORY*******************************/
router.get('/allcategory',Admin.AdminAuth,adminController.AdminCheck,adminController.AllCategory)

/*********************** ALL USERS ROUTER**************************/
router.get('/alluser',Admin.AdminAuth,adminController.AdminCheck,adminController.AllUsers)

/****************************** DELTE USERS BY ID ROUTER*******************************/
router.get('/deleteuser/:id',Admin.AdminAuth,adminController.AdminCheck,adminController.DeleteUser)

/****************************** SEARCH PRODUCT ROUTER*************************/
router.get('/getproduct',Admin.AdminAuth,adminController.AdminCheck,adminController.SearchProduct)

/******CREATE CATEGORY PAGE ROUTER TO RENDER CREATE CATEGORY EJS PAGE********/
router.get('/createcategory',Admin.AdminAuth,adminController.AdminCheck,adminController.CreateCategory)

/**************** CREATE CATEGORY FUNCTION ROUTER**************/
router.post('/createallcategory',Admin.AdminAuth,adminController.AdminCheck,adminController.CreateCategories)

/******************** DELETE CATEGORY FUNCTION ROUTER********************/
router.get('/deletecategory/:id',Admin.AdminAuth,adminController.AdminCheck,adminController.DeleteCategory)

/*********************** UPDATE CATEGORY ROUTER FOR EJS PAGE*************************/
router.get('/Updatecategory/:id',Admin.AdminAuth,adminController.AdminCheck,adminController.UpdateCategory)

/********************* UPDATE CATEGORY FUNCTION ROUTER*******************************/
router.post('/updatecategory/:id',Admin.AdminAuth,adminController.AdminCheck,adminController.UpdateCategories)

/************************* UPDATE PRODUCT EJS PAGE ROUTER****************************************/
router.get('/updateproducts/:id',Admin.AdminAuth,adminController.AdminCheck,adminController.UpdateProduct)

/************************* UPDATE PRODUCT FUNCTION ROUTER****************************************/
router.post('/updateproduct/:id',Admin.AdminAuth,adminController.AdminCheck,uploadimage.single('image'),adminController.UpdateProducts)

/**************************** DELETE PRODUCT FUNCTION*******************************************************/
router.get('/deleteproduct/:id',Admin.AdminAuth,adminController.AdminCheck,adminController.DeleteProduct)


/**************************************PASSWORD FUNCTIONALITY ROUTER****************************************/

         /*************** UPDATE PASSWORD  EJS PAGE ROUTER ********************/
router.get('/updatepass/:id',Admin.AdminAuth,adminController.AdminCheck,adminController.UpdatePassword)

        /******************** UPDATE PASSWORD FUNCTION ROUTER ********************/
router.post('/updatePassword/:id',Admin.AdminAuth,adminController.AdminCheck,adminController.UpdatePasswords)

/********************* LOGOUT FUNCTION ROUTER ****************/
router.get('/logoutuser',Admin.AdminAuth,adminController.AdminCheck,adminController.Logout)

/****************** FORGOT PASSOWRD EJS PAGE RENDERING******************************/
router.get('/forgotpass',adminController.Forgot_Password)


/******************** FORGOT PASSWORD ROUTER*************************/
router.post('/forgotpassword',adminController.ForgotPassword)

/**********************RESET PASSWORD EJS PAGE RENDERING*********************/

router.get('/reset/:id/:token',adminController.Reset)
/*********************** RESET PASSWORD FUNCTION******************************/
router.post('/resetpassword/:id/:token',adminController.ResetPassword)


/**********************ALL ORDER LIST**********************************/
router.get('/allorder',Admin.AdminAuth,adminController.AdminCheck,adminController.AllorderProduct)

/******************** ALERT PAGE*********************** */
router.get('/alert',Admin.AdminAuth,adminController.AdminCheck,adminController.AlertPage)

/********************** EMAIL VERIFY EJS PAGE ROUTER *************************/
router.get('/emailverify',adminController.VerifyEmail)

/********************** EMAIL VERIFY FUNCTION ROUTER *************************/
router.post('/emailverifying',adminController.EmailVerify)


/******************************ORDER CREATE FUNCTION********************/
router.post('/createorder',Admin.AdminAuth,adminController.AdminCheck,adminController.CreateOrders)


/**************************** SEND ORDER STATUS NOTIFICATION FUNCTION **************************/
router.post('/notification',Admin.AdminAuth,adminController.AdminCheck,adminController.Notify)


module.exports=router