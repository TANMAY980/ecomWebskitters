const express=require('express')
const uploadimage=require('../helper/imageupload')
const Admin=require('../middleware/checkauth')
const adminController = require('../controller/adminController')
const router=express.Router()
const passport=require('passport')
const PassportMiddleware=require('../middleware/passportMiddleware')


/**** ADMIN SIGNIN ROUTER TO RENDER ADMIN LOGIN EJS PAGE******/
// router.get('/adminsignin',adminController.AdminSignIn)

/****************ADMIN SIGN IN ROUTER FOR SIGNIN FUNCTION**********************/
// router.post('/adminSignin',adminController.AdminSignin)

/**** ADMIN DASHBOARD ROUTER TO RENDER ADMIN DASHBOARD EJS PAGE******/
//router.get('/admindashboard',Admin.AdminAuth,adminController.AdminCheck,adminController.AdminDashboard)

router.get('/admindashboard',passport.authenticate('session', { failureRedirect: '/usersignin' }),adminController.AdminDashboard)


/**** CREATE PRODUCT PAGE ROUTER TO RENDER CREATE PRODUCT EJS PAGE (JWT)******/
// router.get('/createproduct',Admin.AdminAuth,adminController.AdminCheck,adminController.CreateProduct)

/**** CREATE PRODUCT PAGE ROUTER TO RENDER CREATE PRODUCT EJS PAGE (PASSPORT)******/
router.get('/createproduct',PassportMiddleware.IsAdmin,adminController.CreateProduct)

/****************** CREATE PRODUCT PAGE FUNCTION ROUTER (JWT) **************************************/
// router.post('/createproducts',Admin.AdminAuth,adminController.AdminCheck,uploadimage.single('image'),adminController.CreateProducts)

/****************** CREATE PRODUCT PAGE FUNCTION ROUTER (PASSPORT )**************************************/
router.post('/createproducts',PassportMiddleware.IsAdmin,uploadimage.single('image'),adminController.CreateProducts)

/**************** ALL PRODUCT EJS PAGE ROUTER (JWT)**************/
// router.get('/allproducts',Admin.AdminAuth,adminController.AdminCheck,adminController.AllProduct)

/**************** ALL PRODUCT EJS PAGE ROUTER (PASSPORT)**************/
router.get('/allproducts',PassportMiddleware.IsAdmin,adminController.AllProduct)

/****************** ALL CATEGORY PAGE ROUTER TO RENDER ALL CATEGORY (JWT) *******************************/
// router.get('/allcategory',Admin.AdminAuth,adminController.AdminCheck,adminController.AllCategory)

/****************** ALL CATEGORY PAGE ROUTER TO RENDER ALL CATEGORY(PASSPORT) *******************************/
router.get('/allcategory',PassportMiddleware.IsAdmin,adminController.AllCategory)

/*********************** ALL USERS ROUTER (JWT) **************************/
// router.get('/alluser',Admin.AdminAuth,adminController.AdminCheck,adminController.AllUsers)

/*********************** ALL USERS ROUTER (PASSPORT )**************************/
router.get('/alluser',PassportMiddleware.IsAdmin,adminController.AllUsers)

/****************************** DELTE USERS BY ID ROUTER (JWT)  *******************************/
// router.get('/deleteuser/:id',Admin.AdminAuth,adminController.AdminCheck,adminController.DeleteUser)

/****************************** DELTE USERS BY ID ROUTER (PASSPORT) *******************************/
router.get('/deleteuser/:id',PassportMiddleware.IsAdmin,adminController.DeleteUser)

/****************************** SEARCH PRODUCT ROUTER (JWT)*************************/
// router.get('/getproduct',Admin.AdminAuth,adminController.AdminCheck,adminController.SearchProduct)

/****************************** SEARCH PRODUCT ROUTER (PASSPORT)*************************/
router.get('/getproduct',PassportMiddleware.IsAdmin,adminController.SearchProduct)

/******CREATE CATEGORY PAGE ROUTER TO RENDER CREATE CATEGORY EJS PAGE (JWT) ********/
// router.get('/createcategory',Admin.AdminAuth,adminController.AdminCheck,adminController.CreateCategory)

/******CREATE CATEGORY PAGE ROUTER TO RENDER CREATE CATEGORY EJS PAGE (PASSPORT) ********/
router.get('/createcategory',PassportMiddleware.IsAdmin,adminController.CreateCategory)

/**************** CREATE CATEGORY FUNCTION ROUTER (JWT)**************/
// router.post('/createallcategory',Admin.AdminAuth,adminController.AdminCheck,adminController.CreateCategories)

/**************** CREATE CATEGORY FUNCTION ROUTER(PASSPORT)**************/
router.post('/createallcategory',PassportMiddleware.IsAdmin,adminController.CreateCategories)


/******************** DELETE CATEGORY FUNCTION ROUTER(JWT)********************/
// router.get('/deletecategory/:id',Admin.AdminAuth,adminController.AdminCheck,adminController.DeleteCategory)

/******************** DELETE CATEGORY FUNCTION ROUTER (PASSPORT) ********************/
router.get('/deletecategory/:id',PassportMiddleware.IsAdmin,adminController.DeleteCategory)

/*********************** UPDATE CATEGORY ROUTER FOR EJS PAGE(JWT)*************************/
// router.get('/Updatecategory/:id',Admin.AdminAuth,adminController.AdminCheck,adminController.UpdateCategory)

/*********************** UPDATE CATEGORY ROUTER FOR EJS PAGE(PASSPORT)*************************/
router.get('/Updatecategory/:id',PassportMiddleware.IsAdmin,adminController.UpdateCategory)

/********************* UPDATE CATEGORY FUNCTION ROUTER (JWT)*******************************/
// router.post('/updatecategory/:id',Admin.AdminAuth,adminController.AdminCheck,adminController.UpdateCategories)
/********************* UPDATE CATEGORY FUNCTION ROUTER (PASSPORT)*******************************/
router.post('/updatecategory/:id',PassportMiddleware.IsAdmin,adminController.UpdateCategories)

/************************* UPDATE PRODUCT EJS PAGE ROUTER (JWT)****************************************/
// router.get('/updateproducts/:id',Admin.AdminAuth,adminController.AdminCheck,adminController.UpdateProduct)

/************************* UPDATE PRODUCT EJS PAGE ROUTER (PASSPORT)****************************************/
router.get('/updateproducts/:id',PassportMiddleware.IsAdmin,adminController.UpdateProduct)

/************************* UPDATE PRODUCT FUNCTION ROUTER(JWT)****************************************/
// router.post('/updateproduct/:id',Admin.AdminAuth,adminController.AdminCheck,uploadimage.single('image'),adminController.UpdateProducts)

/************************* UPDATE PRODUCT FUNCTION ROUTER(PASSPORT)****************************************/
router.post('/updateproduct/:id',PassportMiddleware.IsAdmin,uploadimage.single('image'),adminController.UpdateProducts)

// /**************************** DELETE PRODUCT FUNCTION (JWT)*******************************************************/
// router.get('/deleteproduct/:id',Admin.AdminAuth,adminController.AdminCheck,adminController.DeleteProduct)

/**************************** DELETE PRODUCT FUNCTION(PASSPORT)*******************************************************/

router.get('/deleteproduct/:id',PassportMiddleware.IsAdmin,adminController.DeleteProduct)


/**************************************PASSWORD FUNCTIONALITY ROUTER****************************************/

/*************** UPDATE PASSWORD  EJS PAGE ROUTER (JWT) ********************/
// router.get('/updatepass/:id',Admin.AdminAuth,adminController.AdminCheck,adminController.UpdatePassword)

/*************** UPDATE PASSWORD  EJS PAGE ROUTER (PASSPORT) ********************/

router.get('/updatepass/:id',PassportMiddleware.IsAdmin,adminController.UpdatePassword)

/******************** UPDATE PASSWORD FUNCTION ROUTER (PASSPORT) ********************/

router.post('/updatePassword/:id',PassportMiddleware.IsAdmin,adminController.UpdatePasswords)


/********************* LOGOUT FUNCTION ROUTER ****************/

router.get('/logoutuser',adminController.Logout)

/****************** FORGOT PASSOWRD EJS PAGE RENDERING******************************/

router.get('/forgotpass',adminController.Forgot_Password)


/******************** FORGOT PASSWORD ROUTER*************************/

router.post('/forgotpassword',adminController.ForgotPassword)

/**********************RESET PASSWORD EJS PAGE RENDERING*********************/

router.get('/reset/:id/:token',adminController.Reset)

/*********************** RESET PASSWORD FUNCTION******************************/

router.post('/resetpassword/:id/:token',adminController.ResetPassword)


/**********************ALL ORDER LIST (JWT)**********************************/
// router.get('/allorder',Admin.AdminAuth,adminController.AdminCheck,adminController.AllorderProduct)

/**********************ALL ORDER LIST (PASSPORT)**********************************/

router.get('/allorder',PassportMiddleware.IsAdmin,adminController.AllorderProduct)

/******************** ALERT PAGE (JWT)************************/
// router.get('/alert',Admin.AdminAuth,adminController.AdminCheck,adminController.AlertPage)

/******************** ALERT PAGE (PASSPORT)************************/

router.get('/alert',PassportMiddleware.IsAdmin,adminController.AlertPage)

/********************** EMAIL VERIFY EJS PAGE ROUTER *************************/

router.get('/emailverify',adminController.VerifyEmail)

/********************** EMAIL VERIFY FUNCTION ROUTER *************************/

router.post('/emailverifying',adminController.EmailVerify)


/******************************ORDER CREATE FUNCTION (JWT)********************/
// router.post('/createorder',Admin.AdminAuth,adminController.AdminCheck,adminController.CreateOrders)

/******************************ORDER CREATE FUNCTION (PASSPORT)********************/

router.post('/createorder',PassportMiddleware.IsAdmin,adminController.CreateOrders)


/**************************** SEND ORDER STATUS NOTIFICATION FUNCTION (JWT)**************************/
// router.post('/notification',Admin.AdminAuth,adminController.AdminCheck,adminController.Notify)

/**************************** SEND ORDER STATUS NOTIFICATION FUNCTION (PASSPORT)**************************/

router.post('/notification',PassportMiddleware.IsAdmin,adminController.Notify)


module.exports=router