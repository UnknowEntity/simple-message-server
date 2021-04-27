const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const userModel = require("../models/users.model");

dotenv.config();

module.exports = {
  generateAccessToken: (user) => {
    return jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
      expiresIn: "7d",
    });
  },
  authenticateToken: (req, res, next) => {
    const authToken = req.cookies["token"];

    if (authToken === null) {
      return res.json({ success: false, message: "not found token" });
    }

    jwt.verify(authToken, process.env.TOKEN_SECRET, (err, data) => {
      if (err) {
        return res.json({ success: false, message: err });
      }

      userModel
        .singleById(data.id)
        .then((rows) => {
          if (rows.length === 0) {
            return res.json({
              success: false,
              message: "user not existed or invalid id",
            });
          }

          let user = rows[0];
          req.user = user;
          if (data.exp - Date.now() / 1000 < 86400) {
            const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
              expiresIn: "7d",
            });
            res.cookie("token", token, {
              expires: new Date(Date.now() + 3600000),
              httpOnly: true,
              sameSite: true,
            });
          }
          return next();
        })
        .catch((err) => {
          return res.json({ success: false, message: err });
        });
    });
  },
};
