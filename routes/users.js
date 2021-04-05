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
        expires: new Date(Date.now() + 3600000),
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

router.get("/private", auth.authenticateToken, (req, res, next) => {
  res.json({ message: "youre in" });
});
module.exports = router;
