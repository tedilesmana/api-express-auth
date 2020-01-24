const localStrategy = require("passport-local").Strategy;
const facebookStrategy = require("passport-facebook");
const bcrypt = require("bcryptjs");

// Load User Model
const UserModel = require("../models/user");

module.exports = passport => {
    passport.use(
        new localStrategy({
                usernameField: "email"
            },
            (email, password, done) => {
                UserModel.findOne({ email }).then(user => {
                    if (!user) {
                        return done(null, false, {
                            message: "That email is not registered"
                        });
                    }

                    // Compare password
                    bcrypt.compare(password, user.password, (err, isFound) => {
                        if (err) throw err;
                        if (isFound) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: "Your Password incorrect" });
                        }
                    });
                });
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        UserModel.findById(id, (err, user) => {
            done(err, user);
        });
    });
};