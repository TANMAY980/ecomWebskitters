const jwt = require('jsonwebtoken');

class JwtAuth{

    /**********************USERAUTH MIDDLEWARE FUNCTION ******************************/
    async UserAuth(req,res,next){
        try {
            if(req.cookies && req.cookies.userToken){
                
                jwt.verify(req.cookies.userToken,process.env.USER_SECRET_KEY,(err,data)=>{
                    if(err){
                        return res.redirect('/usersignin');
                    }
                    console.log("userdata",data);
                    req.user=data;
                    next()
                })
            }else{
                return res.redirect('/usersignin')
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
            
        }
    }
    /*********************** ADMINAUTH MIDDLEWARE FUNCTION****************************/
    async AdminAuth(req,res,next){
        try {
            if(req.cookies && req.cookies.adminToken){

                jwt.verify(req.cookies.adminToken,process.env.ADMIN_SECRET_KEY,(err,data)=>{
                    if(err){
                        return res.redirect('/admin/adminsignin');   
                    }

                    console.log('Decoded admin data:', data);
                    req.admin=data
                    next()
                })

            }else{
                return res.redirect('/admin/adminsignin');
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }

}



module.exports=new JwtAuth()