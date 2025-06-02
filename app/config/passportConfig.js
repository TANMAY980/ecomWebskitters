const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const usermodel = require('../model/usermodel');

class PassportAuth {
    /***************** PASSPORT LOCAL STRATEGY CONTROLLER FUNCTION *********************/

    async PassportLocalStrategy() {
        passport.use(new LocalStrategy(
            { usernameField: "emailOrUsername", passwordField: "password" },
            async (emailOrUsername, password, done) => {
                try {
                    const input = emailOrUsername.trim();
                    
                    const user = await usermodel.findOne({
                        $or: [{ email: input }, { username: input }],
                    });
                    if (!user) {
                        return done(null, false, { message: "User not found" });
                    }
                    
                    if (!user.is_verified) {
                        return done(null, false, { message: "User not verified", unverifiedUser: user });
                    }
                    const matchPassword = await bcrypt.compare(password, user.password);
                    if (!matchPassword) {
                        return done(null, false, { message: "Password is invalid" });
                    }
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        ));
    }

    /***************** PASSPORT SERIALIZEUSER CONTROLLER FUNCTION *********************/

    async PassportSerialize() {
        passport.serializeUser((user, done) => {
            done(null, user._id); 
        });
    }

    /****************** PASSPORT DESERIALIZEUSER CONTROLLER FUNCTION ********************/

    async PassportDeSerialize() {
        passport.deserializeUser(async (_id, done) => {
            try {
                const user = await usermodel.findById(_id);
                if (!user) {
                    return done(new Error('User not found'));
                }
                done(null, user);
            } catch (error) {
                done(error);
            }
        });
    }
}

module.exports = new PassportAuth();
