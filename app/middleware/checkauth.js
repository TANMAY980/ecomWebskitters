const jwt = require('jsonwebtoken');
    // Decode the token without verifying to check the role
    const userAuth = (req, res, next) => {
        if (req.cookies && req.cookies.userToken) {
            console.log('User token found:', req.cookies.userToken);
    
            jwt.verify(req.cookies.userToken, process.env.USER_SECRET_KEY, (err, data) => {
                if (err) {
                    return res.redirect('/usersignin');
                }
    
                console.log('Decoded user data:', data);
                req.user = data; 
                next();
            });
        } else {
            return res.redirect('/usersignin');
        }
    };

const adminAuth = (req, res, next) => {
    if (req.cookies && req.cookies.adminToken) {
        console.log('Admin token found:', req.cookies.adminToken);

        jwt.verify(req.cookies.adminToken, process.env.ADMIN_SECRET_KEY, (err, data) => {
            if (err) {
                return res.redirect('/admin/adminsignin');
            }

            console.log('Decoded admin data:', data);
            req.admin = data; 
            next();
        });
    } else {
        return res.redirect('/admin/adminsignin');
    }
};

module.exports={userAuth,adminAuth}