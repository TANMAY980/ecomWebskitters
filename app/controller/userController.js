const mongoose=require('mongoose')
const transporter=require('../config/emailConfig')
const usermodel=require('../model/usermodel')
const productmodel=require('../model/productmodel')
const categorymodel=require('../model/categorymodel')
const emailverifymodel=require('../model/verifyEmailmodel')
const cartmodel=require('../model/cartmodel')
const sendEmail=require('../helper/sendEmail')
const sendmessage=require('../helper/sendSms')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
class User{


    /********** ***** CHECKUSER (JWT) ******************************/

    // async UserCheck(req,res,next){
    //     if(req.user){
    //         console.log('after login',req.user);
    //         next()
    //     }else{
    //         res.redirect('/usersignin')
    //     }
    // }

/************************ USER SIGNUP EJS PAGE RENDERING FUNCTION*********************/
    async UserSignUp(req,res){
        try {
            res.render('user/signUp',{
                tite:"user sign up page"
            })
        } catch (error) {
            
        }
    }


/************************* USER SIGNIN EJS PAGE RENDERING FUNCTION *****************/
    async UserSignIn(req,res){
        try {
            res.render('user/signIn',{
                title:"user sign in page"
            })
        } catch (error) {
            console.log(error);
            
        }
    }

/****************USER SIGNIN FUNCTION**************/
// async Signin(req, res) {
//     try {
//       const { emailOrUsername, password } = req.body;
  
//       // Check for empty fields
//       if (!(emailOrUsername && password)) {
//         return res.redirect('/usersignin');
//       }
  
//       const input = emailOrUsername.trim();
//       const user = await usermodel.findOne({
//         $or: [{ email: input }, { username: input }]
//       });
  
//       // Check if user exists
//       if (!user) {
//         return res.redirect('/usersignup');
//       }
  
//       // Check email verification
//       if (!user.is_verified) {
//         const otp = await sendEmail.SendEmailVerificationOTP(req, res, user);
//         const sendMessageStatus = await sendmessage.SendMessage(req, res, user, otp);
//         if (otp && sendMessageStatus) {
//           return res.redirect('/verifyemail');
//         }
//         return res.redirect('/usersignup');
//       }
  
//       // Verify role and password
//       if (await bcrypt.compare(password, user.password)) {
//         const tokenPayload = {
//           _id: user._id,
//           email: user.email,
//           name:user.name,
//           username: user.username,
//           role: user.role,
//           phonenumber: user.phonenumber || null
//         };
  
//         const secretKey = user.role === 'admin' ? process.env.ADMIN_SECRET_KEY : process.env.USER_SECRET_KEY;
//         const tokenExpiry = user.role === 'admin' ? "45d" : "55d";
//         const token = jwt.sign(tokenPayload, secretKey, { expiresIn: tokenExpiry });
  
//         if (token) {
//           const url = user.role === 'admin' ? '/admin/adminsignin' : '/usersignin';
//           res.cookie(user.role === 'admin' ? "adminToken" : "userToken", token);
  
//           // Send login messages based on role
//           const loginEmail = await sendEmail.SendSiginingMessage(req, res, user, url);
//           if (user.role === 'user') {
//             await sendmessage.SendLoginMessage(req, res, user, url);
//           }
  
//           // Redirect to respective dashboard
//           return res.redirect(user.role === 'admin' ? '/admin/admindashboard' : '/productpage');
//         }
//       }
  
//       // Redirect back if login fails
//       return res.redirect('/usersignin');
//     } catch (error) {
//       console.log(error);
//       res.status(500).send("Internal Server Error");
//     }
//   }

/****************** USER SIGININ FUNCTION USING PASSPORT ************************/
async Signin(req,res){
    try {
        const user = req.user;    
            if (!user.is_verified) {
                const otp = await sendEmail.SendEmailVerificationOTP(req, res, user);
                await sendmessage.SendMessage(req, res, user, otp);
                return res.redirect('/verifyemail');
            }

            if (user.role === 'admin') {
                const url="https://ecomwebskitters.onrender.com/usersignin"
                const loginEmail = await sendEmail.SendSiginingMessage(req, res, user, url);
                const loginmessage=await sendmessage.SendLoginMessage(req,res,user)
                return res.redirect('/admin/admindashboard');
            }
            const url="https://ecomwebskitters.onrender.com/usersignin"
            const loginEmail = await sendEmail.SendSiginingMessage(req, res, user, url);
            return res.redirect('/productpage');
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

/*********************** USER FORGOT PASSWORD EJS PAGE RENDERING FUNCTION ***************************/
    async ForgotPassword(req,res){
        try {
            res.render('user/forgotpassword',{
                title:"forgot password page"
            })
        } catch (error) {
            console.log(error);
            
        }
    }

/************* HOME EJS PAGE RENDERING***************/

    async Home(req,res){
        try {
            const allcategory = await categorymodel.find();
            const page = parseInt(req.query.page) || 1;
            const limit = 12;
            const skip = (page - 1) * limit;
            const totalProducts = await productmodel.countDocuments();
            const allproduct = await productmodel.find().skip(skip).limit(limit);
    
            const categoryMap = allcategory.reduce((map, category) => {
                map[category._id] = category.name; 
                return map;
            }, {});
    
            const productsWithCategoryNames = allproduct.map(product => ({
                ...product.toObject(),
                categoryName: categoryMap[product.categoryId] || 'Unknown Category' 
            }));
    
            res.render('user/home', {
                data: productsWithCategoryNames,
                categorydata: allcategory,
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit)
            });
        } catch (error) {
            console.log(error);
            
        }    
    }

/**************** EMAIL VERIFY EJS PAGE RENDERING FUNCTION**********************************/

    async VerifyEmail(req,res){
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
    async VerifyMail(req,res){
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
                if (!existuser.is_verified) {
                   const sendotp= await sendEmail.SendEmailVerificationOTP(req,res,existuser);
                   const sendOtp= await sendmessage.SendMessage(req,existuser)
                    return res.redirect('/verifyemail');
                }
                return res.redirect('/verifyemail');
            }
            const currentTime = new Date();
        const expirationTime = new Date(emailverification.createdAt.getTime() + 15 * 60 * 1000);

        if (currentTime > expirationTime) {
           const sendotp= await sendEmail.SendEmailVerificationOTP(req,res,existuser);
            return res.redirect('/verifyemail');
        }
        existuser.is_verified = true;
        await existuser.save();

        await emailverifymodel.deleteMany({ userId: existuser._id });

        return res.redirect('/usersignin');
        } catch (error) {
            console.log(error);      
        }
    }

/***************************** VERIFY TOW FACTOR AUTHENTICATION FUNCTION ********************************************/


/***************** USER REGISTER FUNCTION***************/
    async UserRegister(req,res){
        try {
            const{email,name,username,password,confirm_password,phonenumber}=req.body
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
            const formattedPhoneNumber = phonenumber.startsWith('+91') ? phonenumber : `+91${phonenumber}`;
            const user_password=password
            const user={
                email,
                name,
                username,
                password: bcrypt.hashSync(password,bcrypt.genSaltSync(10)),
                phonenumber:formattedPhoneNumber
            }
            const userdata=await usermodel.create(user)
            if(!userdata){
                return res.redirect('/usersignup')
            }
            const url=`https://ecomwebskitters.onrender.com/usersignin`
            const ecomwebskittersurl=`https://ecomwebskitters.onrender.com`
            const sendmail = await sendEmail.SendRegistrationEmail(req,res,user,user_password,url,ecomwebskittersurl)
            const sendsms= await sendmessage.SendRegisterMessage(req,res,user)
            if(sendmail && sendsms){
                console.log("mail and sms sent successfully");
                return res.redirect('/usersignin');
            }         

        } catch (error) {
            console.log(error);
        }
    }


  
/******************** UPDATE PASSWORD EJS PAGE RENDERING FUNCTION**************************/

    async UpdatePassword(req,res){
    try {
        res.render('user/updatePassword',{
            data:req.user
        })
    } catch (error) {
        console.log(error);
        
    }
    }


//*********************** UPDATE PASSWORD FUNCTION**************************** */
    async UpdatePasskey(req,res){
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
            const sendupdate=await sendEmail.SendUpdatePasswordMessage(req,res,user)
            if(sendupdate){
            return res.redirect('/usersignin')
            }
        }else{
            res.redirect('/usersignup')
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
        
    }
    }

/******* PRODUCT EJS PAGE RENDERING****************/

// async Product(req,res){
//     try {
//         const allcategory = await categorymodel.find();
//         const allproduct = await productmodel.find();

//         const categoryMap = allcategory.reduce((map, category) => {
//             map[category._id] = category.name;
//             return map;
//         }, {});
//         const productsWithCategoryNames = allproduct.map(product => ({
//             ...product.toObject(),
//             categoryName: categoryMap[product.categoryId] || 'Unknown Category'
//         }));
//         let cartCount = 0;
//         if (req.user) {
//           const cart = await cartmodel.findOne({ user: req.user._id });
//           cartCount = cart ? cart.items.length : 0;
//         }
//         res.render('product/product', {
//             data: productsWithCategoryNames,
//             categorydata: allcategory,
//             userdata: req.user || null ,
//             cartCount
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Error fetching data');
//     }
// }
async Product(req, res) {
  try {
    const allcategory = await categorymodel.find();
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;
    const totalProducts = await productmodel.countDocuments();
    const allproduct = await productmodel.find().skip(skip).limit(limit);
    const categoryMap = allcategory.reduce((map, category) => {
      map[category._id] = category.name;
      return map;
    }, {});

    const productsWithCategoryNames = allproduct.map(product => ({
      ...product.toObject(),
      categoryName: categoryMap[product.categoryId] || 'Unknown Category'
    }));

    let cartCount = 0;
    if (req.user) {
      const cart = await cartmodel.findOne({ user: req.user._id });
      cartCount = cart ? cart.items.length : 0;
    }  
    res.render('product/product', {
      data: productsWithCategoryNames,
      categorydata: allcategory,
      userdata: req.user || null,
      cartCount,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit)
    });

  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching data');
  }
}


/*********************** PRODUCT SEARCH APPLYING WITH THE HELP OF CATEGORY NAME PRICE****************************************/

async ProductSearch(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;
        const totalProducts = await productmodel.countDocuments();
        const allproducts = await productmodel.find().skip(skip).limit(limit);
        const { name = "", category, minPrice = "0", maxPrice = "Infinity" } = req.query;
  
      const filters = {
        productName: { $regex: name.trim(), $options: "i" }, 
        ...(minPrice || maxPrice
            ? {
                price: {
                  ...(minPrice ? { $gte: parseFloat(minPrice) } : {}),
                  ...(maxPrice ? { $lte: parseFloat(maxPrice) } : {}),
                },
              }
            : {})
      };
  
      if (category) {
        filters.categoryId = new mongoose.Types.ObjectId(category);
      }
  
      const allproduct = await productmodel.aggregate([
        { $match: filters },
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
      const userData=req.user
      let cartCount = 0;
    if (req.user) {
          const cart = await cartmodel.findOne({ user: req.user._id });
          cartCount = cart ? cart.items.length : 0;
        }
  
      if (userData) {
        res.render("product/product", {
          data: allproduct,
          categorydata: allcategory,
          userdata: req.user,
          currentPage:page,
          cartCount,
          totalPages: Math.ceil(totalProducts / limit)
                 
        });
        
      } else {
        res.render("user/home", {
          data: allproduct,
          currentPage:page,
          categorydata: allcategory,
          totalPages: Math.ceil(totalProducts / limit)
        });
      }
  
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Internal Server Error");
    }
  }

/*************** ADD TO CART EJS PAGE RENDERING FUNCTION *******************/
async AddToCart(req, res) {
  try {
    const userId = req.user._id;
    const userdata=req.user
    const cart = await cartmodel
      .findOne({ user: userId })
      .populate('items.product')
      .lean();
    let cartCount = 0;
    if (cart && cart.items) {
      cartCount = cart.items.length;
    }   
    res.render('user/addcart', { cart: cart || { items: [] },cartCount,userdata });
  } catch (error) {
    console.log("Error in AddToCart:", error);
    res.status(500).send("Internal Server Error");
  }
}


async AddInCart(req,res){
    try {
        const userId=req.user._id
        const productId = req.body.productId;
        let cart = await cartmodel.findOne({ user: userId });
        if (!cart) {
      cart = new cartmodel({
        user: userId,
        items: [{ product: productId, quantity: 1 }]
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );
          if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity += 1;
      } else {
        cart.items.push({ product: productId, quantity: 1 });
      }
    }

    await cart.save();
    res.redirect('/productpage'); 
    } catch (error) {
        console.log(error);
    }
}

async RemoveItem(req,res){
    try {
        const userid=req.user
        const id=req.body.productId
        const data=await cartmodel.updateOne({user : userid},{$pull:{items:{product:id}}})
        if(data){
            return res.redirect('/addcart')
        }else{
            return res.redirect('/addcart')
        }
    } catch (error) {
        console.log(error);
    }
}

async EditAddress(req,res){
    try {
        const userid=req.params.id
       return res.render('user/editaddress',{
        userdata:req.user,
        userid
       }) 
    } catch (error) {
        console.log(error);
        
    }
}
async UpdateAddress(req,res){
    try {
        const userid=req.params.id
        const address=req.body.address
        const useraddress=await usermodel.findByIdAndUpdate(userid,{address})
        if(useraddress){
            return res.redirect('/addcart')
        }else{
            return res.redirect('/product')
        }
    } catch (error) {
        console.log(error);
        
    }
}
/******************************** FOROGOT PASSWORD FUNCTION**********************************************/
async ForgotPasskey(req,res){
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
        const resetLink=`https://ecomwebskitters.onrender.com/${exisituser._id}/${token}`;

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
              <a href="https://ecomwebskitters.onrender.com/resetpassword/${exisituser._id}/${token}">
              </a>
              https://ecomwebskitters.onrender.com/resetpassword/${exisituser._id}/${token}
            </p>
            <p>Thank you!</p>
          `,
        })
        console.log("forgot password reset link send");
        
        return res.redirect('/usersignin')
    } catch (error) {
        console.log(error);
        
    }
}
/****************************** RESET PASSWORD EJS PAGE**********************************/
async Reset(req,res){
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
async ResetPasskey(req,res){
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
async Logout(req,res){
    try{
        req.logout((err) => {
            if (err) {
                return res.status(500).send("Error during logout");
            }
            res.redirect('/');
        });
    }catch(error){
        console.log(error);   
        res.status(500).send("Internal Server Error");    
    }
}


}
module.exports=new User()