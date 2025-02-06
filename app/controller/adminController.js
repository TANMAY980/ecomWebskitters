const mongoose=require('mongoose')
const transporter=require('../config/emailConfig')
const ordermodel=require('../model/ordermodel')
const categorymodel=require('../model/categorymodel')
const productmodel=require('../model/productmodel')
const usermodel=require('../model/usermodel')
const emailotpmodel=require('../model/verifyEmailmodel')
const Fs=require('fs')
const Path=require('path')
const sendEmail=require('../helper/sendEmail')
const{sendMessage,sendLoginMessage}=require('../helper/sendSms')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')




class Admin{


    /*************CHEKING ADMINUSER *******************/
    async AdminCheck(req,res,next){
        try {
            if(req.admin){
                console.log('after login',req.admin);
                next()
            }else{
                res.redirect('/admin/adminsignin')
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }  
    }


    /** ADMIN SIGNIN EJS PAGE RENDERING**/
    async AdminSignIn(req,res){
        try {
            res.render('admin/adminSignIn',{
                title:"admin login page",    
            })
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }

    /********** ADMIN SIGNIN FUNCTION ************/
    async AdminSignin(req,res){
        try {
            const {emailOrUsername,password}=req.body
            if(!(emailOrUsername && password)){
                return res.redirect('/admin/adminsignin')
            }
            console.log(emailOrUsername);
            
            const input = emailOrUsername.trim();
            const existuser = await usermodel.findOne({
                $or: [{ email: input },
                     { username: input }]
              });
              if(!existuser){
                return res.redirect('/admin/adminsignin')
               
              }
            console.log(existuser);
              
             if(!existuser.is_verified){
                const otp= await sendEmail.SendEmailVerificationOTP(req,res,existuser)
                const sendmessage=await sendMessage(req,existuser,otp)
                if(otp && sendmessage){
                    return res.redirect('/admin/emailverify')
                }
                
             } 
            
            if(existuser && existuser.role=="admin"  && (await bcrypt.compare(password,existuser.password))){
                const token=jwt.sign({
                    _id:existuser._id,
                    email:existuser.email,
                    username:existuser.username,
                    role:existuser.role,
                    two_factor:existuser.two_factor
                },process.env.ADMIN_SECRET_KEY,{expiresIn:"45d"})
                console.log(token);
                if(token){
                    const url=`https://ecomwebskitters.onrender.com/admin/adminsignin`
                    res.cookie("adminToken",token)
                   const sendsigingmessage= await sendEmail.SendSiginingMessage(req,res,existuser,url)
                    // sendLoginMessage(req,existuser)
                    return res.redirect('/admin/admindashboard')
                }else{
                    return res.redirect('/admin/adminsignin')   
                }  
            }
            return res.redirect('/admin/adminsignin')
        } catch (error) {
            console.log(error);  
            res.status(500).send("Internal Server Error"); 
        }
    }

     /************************* VERIFY EMAIL EJS PAGE FUNCTION *****************************/
     async VerifyEmail(req,res){
        try {
            res.render('admin/emailverify',{
            })
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
            
        }
    }

    /***************** VERIFY EMAIL FUNCTION ***************/
    async EmailVerify(req,res){
        try {
            const{email,otp}=req.body
            if(!email && otp){
                return res.redirect('/admin/emailverify')
            }
            const existuser=await usermodel.findOne({email})
            if(!existuser){
                return res.redirect('admin/adminsignin')
            }
            if(existuser.two_factor){
                return res.redirect('/admin/adminsignin')
            }
            const emailverification=await emailotpmodel.findOne({userId:existuser._id,otp})



            if (!emailverification) {
                // If no matching OTP and user is not verified, resend OTP
                if (!existuser.is_verified) {
                   const emailverification = await sendEmail.SendEmailVerificationOTP(req,res,existuser);
                   if(emailverification){
                    return res.redirect('/admin/emailverify')
                   }   
                }
                return res.redirect('/admin/emailverify')
            }
            const currentTime = new Date();
        const expirationTime = new Date(emailverification.createdAt.getTime() + 15 * 60 * 1000); // 15 minutes

        if (currentTime > expirationTime) {
            // OTP expired, send new OTP
            const sendotp=await sendEmail.SendEmailVerificationOTP(req,res,existuser);
            return res.redirect('/admin/emailverify');
        }

        // OTP is valid and not expired, mark the email as verified
        existuser.two_factor = true;
        await existuser.save();

        // Delete email verification document
        await emailotpmodel.deleteMany({ userId: existuser._id });

        return res.redirect('/admin/adminsignin');
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");    
        }
    }
   

    /** ADMIN DASHBOARD EJS PAGE RENDERING FUNCTION**/
    async AdminDashboard(req,res){
        try {
            const categorydata=await categorymodel.countDocuments()
            const productdata=await productmodel.countDocuments()
            const userdata=await usermodel.countDocuments()
            res.render('admin/adminDashboard',{
                title:"admin Dashboard page",  
                categorydata:categorydata,
                productCount: productdata,
                userCount:userdata,
                data:req.admin
                
            })
            console.log('Admin Data in Dashboard:', req.admin);
        } catch (error) {
            console.log(error);
            
        }
    }

    /******** CREATE PRODUCT EJS PAGE RENDERING********/
    async CreateProduct(req,res){
        try {
            const category=await categorymodel.find()
            res.render('admin/createProduct',{
                title:"create product page",
                data:category,
                userdata:req.admin
            })
        } catch (error) {
            console.log(error);
            
        }
    }


    /****************** ALL CATEGORY EJS PAGE RENDERING*****************/
    async AllCategory(req,res){
        try {
            const alldata=await categorymodel.find()
            res.render('admin/allcategory',{
                title:"all category page",
                data:alldata,
                userdata:req.admin
            })
        } catch (error) {
            console.log(error);
            
        }
    }

    /****************** CREATE CATEGORY EJS PAGE RENDERING*****************************/
    async CreateCategory(req,res){
        try {
            res.render('admin/createcategory',{
                title:"create category",
                userdata:req.admin
            })
        } catch (error) {
            console.log(error);
            
        }
    }

    /************************** CREATE CATEGORY FUNCTION**************************/
    async Create_Category(req,res){
        try {
            const {name}=req.body
            const nameexists=name.trim()
            const categoryexist=await categorymodel.findOne({ name: nameexists })
            if(categoryexist){
                return res.redirect('/admin/createcategory')
            }
            const category= new categorymodel({
                name
            })
            const categorydata=await categorymodel.create(category)
            if(categorydata){
                return res.redirect('/admin/allcategory')
            }else{
                return res.redirect('admin/createcategory')
            }

        } catch (error) {
            console.log(error);
            
        }
    }
/*********************** ALL USERS EJS PAGE*****************************/
    async AllUsers(req,res){
    try {
        const userdata=await usermodel.find({ role: { $ne: "admin" } })
        res.render('admin/allusers',{
            data:userdata,
            
        })
    } catch (error) {
        console.log(error);
        return res.staus(500).status({

        })
    }
    }

/**************************** DELETE USERS FUNCTION**********************************/
    async DeleteUser(req,res){
    try {
        const id= req.params.id
        const user= await usermodel.findById(id)
        if(user.role=="admin"|| user.role=="Admin"){
            return res.redirect('/admin/alluser')
        }else{
            const existuser=await usermodel.findByIdAndDelete(id)
            return res.redirect('/admin/alluser')
        }
    } catch (error) {
        console.log(error);
        
    }
    }
    /**********************DELETE CATEGORY FUNCTION *********************/

    async DeleteCategory(req,res){
        try {
            const id=req.params.id
            const category=await categorymodel.findByIdAndDelete(id)
            if(category){
                return res.redirect('/admin/allcategory')
            }
        } catch (error) {
            console.log(error);
            
        }
    }

    /*********************UPDATE CATEGORY  EJS PAGE RENDERING FUNCTION*************************/
    async UpdateCategory(req,res){
        try {
            const id=req.params.id
            const edit=await categorymodel.findById(id)
            res.render('admin/updatecategory',{
                data:edit
            })
        } catch (error) {
            console.log(error);
            
        }
    }
    /**************************UPDATE CATEGORY FUNCTION****************************/
    async Update_Category(req,res){
        try {
            const id=req.params.id
            const {name}=req.body
            const updateCategory = await categorymodel.findByIdAndUpdate(
                id,
                { name },
                { new: true } 
            );
            if(updateCategory){
                return res.redirect('/admin/allcategory')
            }else{
                return res.redirect('/admin/updatecategory')
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    /************************** CREATE PRODUCT FUNCTION *************************/

    async Create_Product(req,res){
        try {
            const { productName, price, stock, description, categoryId } = req.body;
            console.log(productName, price, stock, description, categoryId );
            
            if(!(productName && price && stock && description && categoryId)){
                return res.redirect('/admin/createproduct')
            }
            const newProduct = new productmodel({
                productName,
                price,
                stock,
                description,
                categoryId, // Use the category ID
                image: req.file ? req.file.path : null // Handle image upload
            });
    
            // Save the product to the database
            const product=await newProduct.save();
            if(product){
                return res.redirect('/admin/allproducts')
            }else{
                return res.redirect('/admin/createproduct')
            }
            
    } catch (error) {
        console.log(error);       
    }

}
    /************************ ALL PRODUCT EJS PAGE RENDERING****************************/
    async AllProduct(req, res) {
        try {
            const allcategory = await categorymodel.find();
            const allproduct = await productmodel.find();
    
            // Map categories by ID for easy lookup
            const categoryMap = allcategory.reduce((map, category) => {
                map[category._id] = category.name; // Store category name using category ID as key
                return map;
            }, {});
    
            // Pass category name instead of ID
            const productsWithCategoryNames = allproduct.map(product => ({
                ...product.toObject(),
                categoryName: categoryMap[product.categoryId] || 'Unknown Category' // Add category name to each product
            }));
    
            // Pass 'userdata' only if req.user exists, otherwise pass null
            res.render('admin/allproducts', {
                data: productsWithCategoryNames,
                categorydata: allcategory,
                userdata: req.admin || null // This will pass 'userdata' only if it's defined
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Error fetching data');
        }
    }
    

    /**************************** UPDATE PRODUCT EJS PAGE RENDERING************************************/
    async UpdateProduct(req,res){
        try {
            const id=req.params.id
            const edit=await productmodel.findById(id)
            const category=await categorymodel.find()
            res.render('admin/updateproduct',{
                data:edit,
                categorydata:category
            })
        } catch (error) {
            console.log(error);    
        }
    }

    /**********************************UPDATE PRODUCT FUNTION ROUTER**********************/
    async Update_Product(req, res) {
        try {
            const id = req.params.id;
                const existingProduct = await productmodel.findById(id);       
                const data = req.body;  
                if (req.file) {
                    data.image = req.file.path;
                }
                console.log(data);
            const update = await productmodel.findByIdAndUpdate(id, data, { new: true });
    
            if (update) {
                return res.redirect('/admin/allproducts');
            } else {
                return res.redirect('/admin/createproduct');
            }
        } catch (error) {
            console.error(error);
        }
    }

    /************************ DELETE PRODUCT FUNCTION ******************************/
    async DeleteProduct(req,res){
        try {
            const id=req.params.id
            const product=await productmodel.findById(id)
            if(!product){
                return res.redirect('/admin/allproducts')
            }
            const imagepath=Path.join(__dirname,'../uploads', product.image)
            if(Fs.existsSync(imagepath)){
                Fs.unlink(imagepath,(err)=>{
                    if(err){
                        console.log("something went worng",err);
                    }else{
                        console.log("Image deleted successfully");    
                    }
                })
            }
            const productstatus=await productmodel.findByIdAndDelete(id)
            if(productstatus){
                return res.redirect('/admin/allproducts')
            }
            return res.redirect('/admin/allproducts')
        } catch (error) {
            console.log(error);
            
        }
    }


    /********************* ALL ORDER EJS PAGE RENDERING FUNCTION**************************************/
    async AllorderProduct(req, res) {
        try {
          // Fetch all orders and populate related product, category, and user data
          const allorder = await ordermodel
            .find()
            .populate("productId", "productName price")
            .populate("categoryId", "name")
            .populate("userId", "email");
      
          const allcategory = await categorymodel.find();
      
          res.render("admin/allorderlist", {
            title: "All Order List",
            categorydata: allcategory,
            orderdata: allorder,
          });
        } catch (error) {
          console.error("Error fetching order data:", error);
          res.status(500).send("Internal Server Error");
        }
      }
      

     /************************************** CREATE ORDER API FUNCTION************************************************/
   async Create_Order(req,res){
    try {
        const{order_stage,productId,categoryId,userId}=req.body
        const order=new ordermodel({
            order_stage,productId,categoryId,userId
        })
        const order_data=await ordermodel.create(order)
        if(order_data){
            return res.status(200).json({
                status:true,
                message:order_data
            })
        }else{
            return res.status(400).json({
                status:false,
                message:"something went wrong"}
            )
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status:false,
            message:error.message
        })  
        
    }
   }


    /***************************** SEARCH PRODUCT FUNCTION****************************************************/
    async SearchProduct(req, res) {
        try {
          const { name = "", category, minPrice = "0", maxPrice = "Infinity" } = req.query;
      
          const allproduct = await productmodel.aggregate([
            {
              $addFields: {
                priceCleaned: {
                  $toDouble: {
                    $replaceAll: {
                      input: { $ifNull: ["$price", "0"] },
                      find: ",",
                      replacement: "",
                    },
                  },
                },
              },
            },
            {
              $match: {
                productName: { $regex: name.trim(), $options: "i" },
                categoryId: category ? new mongoose.Types.ObjectId(category) : { $exists: true },
                priceCleaned: {
                  $gte: parseFloat(minPrice),
                  $lte: parseFloat(maxPrice !== "Infinity" ? maxPrice : Number.MAX_VALUE),
                },
              },
            },
            {
              $lookup: {
                from: "categorymodels",
                localField: "categoryId",
                foreignField: "_id",
                as: "categoryDetails",
              },
            },
            {
              $addFields: {
                categoryName: { $arrayElemAt: ["$categoryDetails.name", 0] },
              },
            },
            {
              $project: {
                _id: 1,
                productName: 1,
                stock: 1,
                description: 1,
                price: 1,
                categoryName: 1,
              },
            },
          ]);
      
          const allcategory = await categorymodel.find();
      
          res.render("admin/allproducts", {
            data: allproduct,
            categorydata: allcategory,
          });
        } catch (error) {
          console.error("Error fetching products:", error);
          res.status(500).send("Internal Server Error");
        }
      }
         
   /****************************** NOTIFY USER  FUNCTION **********************************/
   
   async Notify(req, res) {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).send('Order ID is required');
        }

        // Fetch order and populate both product and user in one query
        const order = await ordermodel
            .findById(orderId)
            .populate('userId')
            .populate('productId');

        if (!order) {
            return res.status(404).send('Order not found');
        }

        const userEmail = order.userId?.email;
        const productName = order.productId?.productName || 'N/A'; // Fallback if no product name

        if (!userEmail) {
            return res.status(400).send('User email not found');
        }

        const message = `Your order with ID ${orderId} for product "${productName}" is currently in "${order.order_stage}" stage.`;
        const notification = await sendEmail.SendOrderStatus(req,res,userEmail, message);
        if(notification){
            return res.redirect('/admin/allorder');
        }
       
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ message: 'Failed to send notification' });
    }
    }   

      
    
/*************************************************PASSWORD FUNCTIONALITY*********************************************************************/    

    /********************************** UPDATE PASSWORD EJS PAGE RENDERING***********************************/
    
    async UpdatePassword(req,res){
        try {
            res.render('admin/updatepassword',{
                data:req.admin,
                title:"update password page"
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }
    }
    /*********************************UPDATE PASSWORD FUNCTION ROUTER**********************************/
    async Update_Password(req,res){
        try{
            const user_id=req.params.id
            const{password}=req.body;
            const user=await usermodel.findOne({_id:user_id});
            console.log(user);
            
            if(user){
                const newpassword=await bcrypt.hashSync(password,bcrypt.genSaltSync(10))
                await usermodel.findByIdAndUpdate({_id:user_id},
                {
                    $set:{
                        password:newpassword
                    }
                })
                return res.redirect('/admin/adminsignin')
            }else{
                res.redirect('/register')
            }
    

        }catch(error){
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }
    }

    /*************************** LOGOUT USER FUNCTION**********************************/
    async Logout(req, res) {
        try { 
            res.clearCookie("adminToken");
            res.redirect('/admin/adminsignin');
        } catch (error) {
            console.log('Error during logout:', error);
            return res.status(500).send("Internal Server Error");
        }
    }
    
    
    /******************** FORGOT PASSWORD EJS PAGE RENDERING FUNCTION*************************/
    async Forgot_Password(req,res){
        try {
            res.render('admin/forgotpassword',{
                title:"forgot password page"
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
            
        }
    }

/*******************ALERT EJS PAGE RENDERING FUNCTION**********************/
    async AlertPage(req,res){
        try {
            res.render('admin/alert',{
                title:"alert page"
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");  
        }
        
    }

    /**************FORGOT PASSWORD FUNCTION ***************/
    async ForgotPassword(req,res){
        try {
            const {email}=req.body;
            if(!email){
                return res.redirect('/admin/forgotpass')
            }
            const user=await usermodel.findOne({email});
            if(!user){
                return res.redirect('/admin/adminsignin')
            }
            const secret=user._id+process.env.ADMIN_SECRET_KEY;
            const token =jwt.sign({userID:user._id},secret,{expiresIn:'5m'})
            const resetLink=`https://ecomwebskitters.onrender.com/admin/reset/${user._id}/${token}`;

            const sendresetlink=await transporter.sendMail({
                from:process.env.EMAIL_FROM,
                to:user.email,
                subject:"Password Reset Link",
                html:`<p>Hi ${user.name},</p>
                <p>As you have requested for reset password instructions, here they are, please follow the URL:<br> <a href="${resetLink}"</a>Reset.</p>
                <p>Alternatively, open the following url in your browser <a href="https://ecomwebskitters.onrender.com/admin/reset/674d8fd078fcefbfeda6aff4/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NzRkOGZkMDc4ZmNlZmJmZWRhNmFmZjQiLCJpYXQiOjE3MzMzNDAyNzksImV4cCI6MTczMzM0MTE3OX0.Yn1zLDAIl1ESmnyKThsTK59r6DwvhSANHjBm8mx38ds"</a></p>
                `
            })
            console.log("forgot password reset link send");
            if(sendresetlink){
                return res.redirect('/admin/adminsignin')
            }
            return res.redirect('/admin/adminsignin')
        } catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }
    }

    /************************RESET PASSWORD EJS PAGE RENDERING************************/
    async Reset(req,res){
        try {
            const { id, token } = req.params;
            res.render('admin/resetpassword',{
                id,token
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");   
        }
    }

    /************************RESET PASSWORD FUNCTION********************************/
    async ResetPassword(req,res){
        try {
            const {id,token}=req.params;
        const {password,confirm_password}=req.body;
            
        const user=await usermodel.findById(id);
        if(!user){
            return res.redirect('/admin/adminsignin')
        }
        const new_secret=user._id + process.env.ADMIN_SECRET_KEY
        jwt.verify(token,new_secret);
    
        if(!password || ! confirm_password){
            return res.redirect(`/admin/reset/${id}/${token}`)
        }
        if(password !== confirm_password){
            return res.redirect(`/admin/reset/${id}/${token}`)
        }
    
        const salt=await bcrypt.genSalt(10);
        const newhashpassword=await bcrypt.hash(password,salt);
    
    
        await usermodel.findByIdAndUpdate(user._id,{
            $set:{
                password:newhashpassword
            }
        })
        return res.redirect('/admin/adminsignin')
        } catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
            
        }
    }

    

}
module.exports= new Admin()