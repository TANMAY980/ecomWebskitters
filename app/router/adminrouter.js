const express=require('express')
const uploadimage=require('../helper/imageupload')
const {adminAuth}=require('../middleware/checkauth')
const adminController = require('../controller/adminController')
const router=express.Router()


/**** ADMIN SIGNIN ROUTER TO RENDER ADMIN LOGIN EJS PAGE******/
router.get('/adminsignin',adminController.adminSignIn)

/****************ADMIN SIGN IN ROUTER FOR SIGNIN FUNCTION**********************/
router.post('/adminSignin',adminController.adminsignin)

/**** ADMIN DASHBOARD ROUTER TO RENDER ADMIN DASHBOARD EJS PAGE******/
router.get('/admindashboard',adminAuth,adminController.admincheck,adminController.adminDashboard)

/**** CREATE PRODUCT PAGE ROUTER TO RENDER CREATE PRODUCT EJS PAGE******/
router.get('/createproduct',adminAuth,adminController.createproduct)

/****************** CREATE PRODUCT PAGE FUNCTION ROUTER**************************************/
router.post('/createproducts',adminAuth,uploadimage.single('image'),adminController.create_product)

/**************** ALL PRODUCT EJS PAGE ROUTER **************/
router.get('/allproducts',adminAuth,adminController.allproduct)

/****************** ALL CATEGORY PAGE ROUTER TO RENDER ALL CATEGORY*******************************/
router.get('/allcategory',adminAuth,adminController.allcategory)

/*********************** ALL USERS ROUTER**************************/
router.get('/alluser',adminController.all_users)

/****************************** DELTE USERS BY ID ROUTER*******************************/
router.get('/deleteuser/:id',adminController.delelte_user)

/****************************** SEARCH PRODUCT ROUTER*************************/
router.get('/getproduct',adminController.searchproduct)

/******CREATE CATEGORY PAGE ROUTER TO RENDER CREATE CATEGORY EJS PAGE********/
router.get('/createcategory',adminAuth,adminController.createCategory)

/**************** CREATE CATEGORY FUNCTION ROUTER**************/
router.post('/createallcategory',adminAuth,adminController.create_category)

/******************** DELETE CATEGORY FUNCTION ROUTER********************/
router.get('/deletecategory/:id',adminAuth,adminController.delete_category)

/*********************** UPDATE CATEGORY ROUTER FOR EJS PAGE*************************/
router.get('/Updatecategory/:id',adminAuth,adminController.updatecategory)

/********************* UPDATE CATEGORY FUNCTION ROUTER*******************************/
router.post('/updatecategory/:id',adminController.update_category)

/************************* UPDATE PRODUCT EJS PAGE ROUTER****************************************/
router.get('/updateproducts/:id',adminAuth,adminController.updateproduct)

/************************* UPDATE PRODUCT FUNCTION ROUTER****************************************/
router.post('/updateproduct/:id',adminAuth,uploadimage.single('image'),adminController.update_product)

/**************************** DELETE PRODUCT FUNCTION*******************************************************/
router.get('/deleteproduct/:id',adminAuth,adminController.delete_product)


/**************************************PASSWORD FUNCTIONALITY ROUTER****************************************/

         /*************** UPDATE PASSWORD  EJS PAGE ROUTER ********************/
router.get('/updatepass/:id',adminAuth,adminController.updatepassword)

        /******************** UPDATE PASSWORD FUNCTION ROUTER ********************/
router.post('/updatePassword/:id',adminAuth,adminController.update_password)

/********************* LOGOUT FUNCTION ROUTER ****************/
router.get('/logoutuser',adminController.logout)

/****************** FORGOT PASSOWRD EJS PAGE RENDERING******************************/
router.get('/forgotpass',adminController.forgotpassword)

/******************** FORGOT PASSWORD ROUTER*************************/
router.post('/forgotpassword',adminController.forgotPassword)

/**********************RESET PASSWORD EJS PAGE RENDERING*********************/

router.get('/reset/:id/:token',adminController.reset)
/*********************** RESET PASSWORD FUNCTION******************************/
router.post('/resetpassword/:id/:token',adminController.resetpassword)



/**********************ALL ORDER LIST**********************************/
router.get('/allorder',adminController.allorder_product)

/******************** ALERT PAGE*********************** */
router.get('/alert',adminController.alertpage)

/********************** EMAIL VERIFY PAGE ROUTER *************************/
router.get('/emailverify',adminController.verifyemail)
router.post('/emailverifying',adminController.emailverify)


/******************************ORDER CREATE FUNCTION********************/
router.post('/createorder',adminController.create_Order)

router.post('/notification',adminController.notify)


module.exports=router