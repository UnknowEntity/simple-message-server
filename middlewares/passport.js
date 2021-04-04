var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var userModel = require("../models/users.model");
var bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    (username, password, done) => {
      userModel
        .singleByUserName(username)
        .then((rows) => {
          if (rows.length === 0) {
            return done(null, false, { message: "Invalid username" });
          }

          var user = {
            id: rows[0].id,
            username: rows[0].username,
            email: rows[0].email,
          };
          let userPass = rows[0].password;
          bcrypt.compare(password, userPass, (err, same) => {
            if (same) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: "Not matching password",
              });
            }
          });
        })
        .catch((err) => {
          return done(err, false);
        });
    }
  )
);

passport.serializeUser((user, done) => {
  return done(null, user);
});

passport.deserializeUser((user, done) => {
  return done(null, user);
});

module.exports = passport;
