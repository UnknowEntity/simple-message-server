var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var userModel = require("../models/users.model");
var bcrypt = require("bcrypt");

module.exports = function (app) {
  app.use(passport.initialize());
  app.use(passport.session());

  var ls = new LocalStrategy(
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
          bcrypt.compare(password, user.password, (err, same) => {
            if (same) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Not matching password" });
            }
          });
        })
        .catch((err) => {
          return done(err, false);
        });
    }
  );

  passport.use(ls);
  passport.serializeUser((user, done) => {
    return done(null, user);
  });

  passport.deserializeUser((user, done) => {
    return done(null, user);
  });
};
