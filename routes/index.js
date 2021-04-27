var express = require("express");
var auth = require("../middlewares/auth");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/auth", auth.authenticateToken, function (req, res, next) {
  res.json({ success: true });
});

module.exports = router;
