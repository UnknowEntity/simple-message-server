const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("../middlewares/passport");
const userModel = require("../models/users.model");
const auth = require("../middlewares/auth");
var router = express.Router();

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : err,
        success: false,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) return res.json({ message: err, success: false });
      let token = auth.generateAccessToken(user);
      res.cookie("token", token, {
        expires: new Date(Date.now() + 604800000),
        httpOnly: true,
        sameSite: true,
      });
      return res.json({ user, success: true });
    });
  })(req, res, next);
});

router.post("/register", (req, res, next) => {
  let saltRounds = 10;
  let hash = bcrypt.hashSync(req.body.password, saltRounds);
  const entity = {
    username: req.body.username,
    displayname: req.body.displayName,
    password: hash,
    email: req.body.email,
  };
  userModel.singleByUserName(entity.username).then((n) => {
    if (n.length !== 0) {
      res.json({ err: true, message: "Username already existed" });
      return next();
    }
    userModel.singleByEmail(entity.email).then((n) => {
      if (n.length !== 0) {
        res.json({ err: true, message: "Email already existed" });
        return next();
      }

      userModel.add(entity).then((n) => {
        res.json({ err: false, id: n.insertId });
      });
    });
  });
});

router.get("/private", auth.authenticateToken, (req, res, next) => {
  res.json({ message: "youre in" });
});
module.exports = router;
