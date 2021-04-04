const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const userModel = require("../models/users.model");

dotenv.config();

module.exports = {
  generateAccessToken: (user) => {
    return jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
      expiresIn: "30m",
    });
  },
  authenticateToken: (req, res, next) => {
    const authHeader = req.header["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token === null) {
      return res.json({ success: false, message: "not found token" });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
      console.log(err);

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
          res.user = user;
          return res.json({ success: true });
        })
        .catch((err) => {
          return res.json({ success: false, message: err });
        });

      next();
    });
  },
};
