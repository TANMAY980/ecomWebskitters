const passport = require("passport");

class PassportMiddleware {

    /******************** PASSPORT AUTHENTICATE MIDDLEWARE **************/
    
    async AuthenticateUser(req, res, next) {
        passport.authenticate("local", async (err, user, info) => {
            if (err) {
                console.error("Authentication Error:", err);
                return next(err);
            }

            if (!user) {
                console.log("Authentication failed: ", info?.message);
                if (info && info.message === "User not verified" && info.unverifiedUser) {
                    return res.redirect('/verifyemail');
                }
                return res.redirect('/usersignin');
            }

            req.logIn(user, (err) => {
                if (err)
                    console.error("Login error:", err); 
                return next(); 
            });
        })(req, res, next);
    }

    /************ ADMIN CHECK MIDDLEWARE *********************/

    IsAdmin(req, res, next) {
       try {
        if (req.isAuthenticated() && req.user.role === "admin") {
            return next();
        }
        res.redirect('/usersignin');
       } catch (error) {
        console.log(error);
        
       }
    }
    
    /********************* USER CHECK MIDDLEWARE **********************/

    IsUser(req,res,next){
        try {
            if(req.isAuthenticated() && req.user.role === "user"){
                return next();
            }
            res.redirect('/usersignin')
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = new PassportMiddleware();
