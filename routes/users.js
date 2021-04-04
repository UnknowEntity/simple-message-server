const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const userModel = require("../models/users.model");
const auth = require("../middlewares/auth");
var router = express.Router();

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    req.logIn(user, (err) => {
      if (err) return next(err);
      console.log(user);
      return res.json({ user, token: auth.generateAccessToken(user) });
    });
  })(req, res, next);
});

router.post("/register", (req, res, next) => {
  let saltRounds = 12;
  let hash = bcrypt.hashSync(req.body.password, saltRounds);
  const entity = {
    Username: req.body.username,
    Password: hash,
    Email: req.body.email,
  };
  userModel
    .add(entity)
    .then((n) => {
      res.json({ id: n.insertId });
    })
    .catch(next);
});
module.exports = router;
