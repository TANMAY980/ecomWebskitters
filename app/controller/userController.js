const mongoose=require('mongoose')
const transporter=require('../config/emailConfig')
const usermodel=require('../model/usermodel')
const productmodel=require('../model/productmodel')
const cartmodel=require('../model/cartmodel')
const categorymodel=require('../model/categorymodel')
const emailverifymodel=require('../model/verifyEmailmodel')
const{sendEmail,sendEmailVerificationOTP,sendupdatepasswordmessage}=require('../helper/sendEmail')
const{sendMessage}=require('../helper/sendSms')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
class User{


    /**********usercheck************/
    async usercheck(req,res,next){
        if(req.user){
            console.log('after login',req.user);
            next()
        }else{
            res.redirect('/usersignin')
        }
    }

/** USER SIGNUP EJS PAGE RENDERING**/
    async userSignUp(req,res){
        try {
            res.render('user/signUp',{
                tite:"user sign up page"
            })
        } catch (error) {
            
        }
    }


/** USER SIGNIN EJS PAGE RENDERING**/
    async userSignIn(req,res){
        try {
            res.render('user/signIn',{
                title:"user sign in page"
            })
        } catch (error) {
            console.log(error);
            
        }
    }



/** USER SIGNIN EJS PAGE RENDERING**/

    async forgotPassword(req,res){
        try {
            res.render('user/forgotpassword',{
                title:"forgot password page"
            })
        } catch (error) {
            console.log(error);
            
        }
    }



/************* HOME EJS PAGE RENDERING***************/
    async home(req,res){
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
            res.render('user/home', {
                data: productsWithCategoryNames,
                categorydata: allcategory,
            });
        } catch (error) {

        }    
    }

/**************** EMAIL VERIFY PAGE ROUTER**********************************/

    async verifyemail(req,res){
        try {
            res.render('user/emailverify',{
                title:"email verify page"
            })
        } catch (error) {
            console.log(error);
            
        }
    }

    async twofactor(req,res){
        try {
            res.render('user/twofactor')
        } catch (error) {
            console.log(error);
            
        }
    }
/**************** VERIFY EMAIL FUNCTION **********************************/
    async verify_email(req,res){
        try {
            const{email,otp}=req.body
            if(!(email && otp)){
                return res.redirect('/verifyemail')
            }
            const existuser = await usermodel.findOne({email})
            if(!(existuser)){
                return res.redirect('/usersignup')
            }
            if(existuser.is_verified){
                return res.render('/usersignin')
            }
            const emailverification=await emailverifymodel.findOne({ userId: existuser._id, otp })
            if (!emailverification) {
                // If no matching OTP and user is not verified, resend OTP
                if (!existuser.is_verified) {
                    await sendEmailVerificationOTP(req, existuser);
                    return res.redirect('/verifyemail');
                }
                return res.redirect('/verifyemail');
            }
            const currentTime = new Date();
        const expirationTime = new Date(emailverification.createdAt.getTime() + 15 * 60 * 1000); // 15 minutes

        if (currentTime > expirationTime) {
            // OTP expired, send new OTP
            await sendEmailVerificationOTP(req, existuser);
            return res.redirect('/verifyemail');
        }
        
        // OTP is valid and not expired, mark the email as verified
        existuser.is_verified = true;
        await existuser.save();

        // Delete email verification document
        await emailverifymodel.deleteMany({ userId: existuser._id });

        return res.redirect('/usersignin');
        } catch (error) {
            console.log(error);      
        }
    }

/***************************** VERIFY TOW FACTOR AUTHENTICATION FUNCTION ********************************************/
    async verify_email_twofactor(req,res){
        try {
            const{email,otp}=req.body
            if(!(email && otp)){
                return res.redirect('/verifyusingemail')
            }
            const existuser = await usermodel.findOne({email})
            if(!(existuser)){
                return res.redirect('/usersignup')
            }
            if(existuser.two_factor){
                return res.render('/usersignin')
            }
            const emailverification=await emailverifymodel.findOne({ userId: existuser._id, otp })
            if (!emailverification) {
                // If no matching OTP and user is not verified, resend OTP
                if (!existuser.is_verified) {
                    await sendEmailVerificationOTP(req, existuser);
                    return res.redirect('/verifyusingemail');
                }
                return res.redirect('/verifyusingemail');
            }
            const currentTime = new Date();
        const expirationTime = new Date(emailverification.createdAt.getTime() + 15 * 60 * 1000); // 15 minutes

        if (currentTime > expirationTime) {
            // OTP expired, send new OTP
            await sendEmailVerificationOTP(req, existuser);
            return res.redirect('/verifyusingemail');
        }
        
        // OTP is valid and not expired, mark the email as verified
        existuser.two_factor = true;
        await existuser.save();

        // Delete email verification document
        await emailverifymodel.deleteMany({ userId: existuser._id });

        return res.redirect('/usersignin');
        } catch (error) {
            console.log(error);      
        }
    }


/***************** USER REGISTER FUNCTION***************/
    async user_register(req,res){
        try {
            const{email,name,username,password,confirm_password,phonenumber}=req.body
            console.log(email,name,username,password,confirm_password,phonenumber);
            
            if(!(email && name && username && password  && confirm_password &&phonenumber)){
                return res.redirect('/usersignup')
            }
            if(password !==confirm_password){
                return res.redirect('/usersignup')
            }
            const existinguser= await usermodel.findOne({email})
            if(existinguser){
                return res.redirect('/usersignin')
            }
            const user_password=password
            const user={
                email,
                name,
                username,
                password: bcrypt.hashSync(password,bcrypt.genSaltSync(10)),
                phonenumber
            }
            const userdata=await usermodel.create(user)
            const url=`http://localhost:${process.env.PORT}/usersignin`
            sendEmail(user,user_password,url)
            if(sendEmail){
                return res.redirect('/usersignin')
            }         

        } catch (error) {
            console.log(error);
        }
    }

/****************USER SIGNIN FUNCTION**************/
async usersignin(req,res){
    try {
        const {emailOrUsername,password}=req.body
        if(!(emailOrUsername && password)){
            return res.redirect('/usersignin')
        }
        console.log(emailOrUsername);
        const input = emailOrUsername.trim();
        const existuser = await usermodel.findOne({
            $or: [{ email: input }, { username: input }]
          });
          if(!existuser){
            return res.render('/usersignin')
          }
          if(!existuser.is_verified){
            const otp= await sendEmailVerificationOTP(req,existuser)
            sendMessage(req,existuser,otp)
            if(sendEmailVerificationOTP && sendMessage){
                return res.redirect('/verifyemail')
            }  
          }
          if(!existuser.two_factor){
            const otp= await sendEmailVerificationOTP(req,existuser)
            sendMessage(req,existuser,otp)
            if(sendEmailVerificationOTP && sendMessage){
                return res.redirect('/verifyusingemail')
            }  
         }
         
        if(existuser && existuser.role=="user" && (await bcrypt.compare(password,existuser.password))){
            const token=jwt.sign({
                _id:existuser._id,
                email:existuser.email,
                username:existuser.username,
                phonenumber:existuser.phonenumber
            },process.env.USER_SECRET_KEY,{expiresIn:"15d"})
            console.log(token);
            if(token){
                res.cookie("userToken",token)
                return res.redirect('/productpage')
            }else{
                return res.redirect('/usersignin')
            }
           
        }
        return res.redirect('/usersignin')
    } catch (error) {
        console.log(error);   
        res.status(500).send("Internal Server Error");
    }
}

/******************** UPDATE PASSWORD EJS PAGE RENDERING FUNCTION**************************/

async updatepassword(req,res){
    try {
        res.render('user/updatepassword',{
            data:req.user
        })
    } catch (error) {
        console.log(error);
        
    }
}


//*********************** UPDATE PASSWORD FUNCTION**************************** */
async update_password(req,res){
    try {
        const user_id=req.params.id
        const{password}=req.body
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
            sendupdatepasswordmessage(req,user)
            return res.redirect('/usersignin')
        }else{
            res.redirect('/usersignup')
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
        
    }
}



async change_twofactor(userId) {
    try {
      if (!userId) {
        throw new Error("User ID is required to update two-factor.");
      }
  
      // Assuming your user model has a field `twoFactor`
      const updatedUser = await usermodel.findByIdAndUpdate(
        userId,
        { two_factor: false },
        { new: true }
      );
  
      if (updatedUser) {
        console.log("Two-factor updated successfully:", updatedUser);
      } else {
        console.log("User not found for two-factor update.");
      }
    } catch (error) {
      console.error("Error updating two-factor:", error);
    }
  }




/******* PRODUCT EJS PAGE RENDERING****************/

async product(req,res){
    try {
        const allcategory = await categorymodel.find();
        const allproduct = await productmodel.find();

        const categoryMap = allcategory.reduce((map, category) => {
            map[category._id] = category.name; // Store category name using category ID as key
            return map;
        }, {});

        // Pass category name instead of ID
        const productsWithCategoryNames = allproduct.map(product => ({
            ...product.toObject(),
            categoryName: categoryMap[product.categoryId] || 'Unknown Category' // Add category name to each product
        }));

        res.render('product/product', {
            data: productsWithCategoryNames,
            categorydata: allcategory,
            userdata: req.user || null 
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error fetching data');
    }
}

/*********************** PRODUCT SEARCH APPLYING WITH THE HELP OF CATEGORY NAME PRICE****************************************/

async productsearch(req, res) {
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
            productName: { $regex: name.trim(), $options: "i" }, // Partial name search
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
            image: 1,
          },
        },
      ]);
  
      const allcategory = await categorymodel.find();
  
      res.render("product/product", {
        data: allproduct,
        categorydata: allcategory,
        userdata: req.user,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Internal Server Error");
    }
  }
  
  
/*************** ADD TO CART EJS PAGE RENDERING FUNCTION*******************/
async addtocart(req,res){
    try {
        res.render('user/addcart')
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
        
    }
}

/*********************** ADD TO CART FUNCTION ***********************/
async add_to_cart(req,res){
    try {
        const { productId } = req.body; // Get product ID from the request
        const userId = req.user._id; // Assuming user is authenticated
    
        // Find the product in the database
        const product = await productmodel.findById(productId);
    
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
    
        // Find or create a cart for the user
        let cart = await cartmodel.findOne({ userId });
    
        if (!cart) {
          cart = new cartmodel({ userId, products: [] });
        }
    
        // Check if the product already exists in the cart
        const existingProduct = cart.products.find(
          (item) => item.productId.toString() === productId
        );
    
        if (existingProduct) {
          // Increase quantity if it already exists
          existingProduct.quantity += 1;
        } else {
          // Add a new product to the cart
          cart.products.push({
            productId: product._id,
            quantity: 1,
          });
        }
    
        // Save the updated cart
        await cart.save();
    
        res.json({ message: "Product added to cart successfully" });
      } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
}

/****************************** FORGOT PASSWORD EJS PAGE*************************************/
async forgotPassword(req,res){
    try {
        res.render('user/forgotpassword')
    } catch (error) {
        console.log(error);
        
    }
}

/******************************** FOROGOT PASSWORD FUNCTION**********************************************/
async forgot_password(req,res){
    try {
        const{email}=req.body
        if(!email){
            return res.redirect('/forgotpassword')
        }
        const exisituser=await usermodel.findOne({email})
        if(!exisituser){
            return res.redirect('/usersignin')
        }
        if(!exisituser.role=="admin"){
            return res.redirect('/usersignin')
        }
        const secret=exisituser._id+process.env.USER_SECRET_KEY;
        const token=jwt.sign({userID:exisituser._id},secret,{expiresIn:'5m'})
        const resetLink=`http://localhost:9000/resetpassword/${exisituser._id}/${token}`;

        await transporter.sendMail({
            from:process.env.EMAIL_FROM,
            to:exisituser.email,
            subject:"Password Reset Link",
            html: `
            <p>Hi ${exisituser.name},</p>
            <p>
              As you have requested for reset password instructions, here they are. Please follow the URL below:<br>
              <a href="${resetLink}">Reset Password</a>
            </p>
            <p>
              Alternatively, open the following URL in your browser:<br>
              <a href="http://localhost:9000/resetpassword/${exisituser._id}/${token}">
                http://localhost:9000/resetpassword/${exisituser._id}/${token}
              </a>
            </p>
            <p>Thank you!</p>
          `,
        })
        console.log("fogot password reset link send");
        
        return res.redirect('/usersignin')
    } catch (error) {
        console.log(error);
        
    }
}
/****************************** RESET PASSWORD EJS PAGE**********************************/
async reset(req,res){
    try {
        const { id, token } = req.params;
        res.render('user/resetpassword',{
            id,token
        })
    } catch (error) {
        console.log(error);
        
    }
}



/************************** RESET PASSWORD FUNCTION *******************************/
async reset_password(req,res){
    const {id,token}=req.params;
    const {password,confirm_password}=req.body;
        
    const user=await usermodel.findById(id);
    if(!user){
        return res.redirect('/usersignin')
    }
    const new_secret=user._id + process.env.USER_SECRET_KEY
    jwt.verify(token,new_secret);

    if(!password || ! confirm_password){
        return res.redirect(`/resetpassword/${id}/${token}`)
    }
    if(password !== confirm_password){
        return res.redirect(`/resetpassword/${id}/${token}`)
    }

    const salt=await bcrypt.genSalt(10);
    const newhashpassword=await bcrypt.hash(password,salt);


    await usermodel.findByIdAndUpdate(user._id,{
        $set:{
            password:newhashpassword
        }
    })
    return res.redirect('/usersignin')
}



/*********USER LOGOUT FUNCTION***********/
async logout(req,res){
    try{
        res.clearCookie("userToken")
        res.redirect('/')
    }catch(error){
        console.log(error);   
        res.status(500).send("Internal Server Error");    
    }
}


}
module.exports=new User()