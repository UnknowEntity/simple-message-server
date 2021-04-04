const express = require("express");
const userModel = require("../models/users.model");
var router = express.Router();

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
});

module.exports = router;
