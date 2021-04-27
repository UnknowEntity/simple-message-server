const express = require("express");
const crypto = require("crypto");
const messageModel = require("../models/message.model");
const auth = require("../middlewares/auth");
var router = express.Router();

router.get("/recent", auth.authenticateToken, (req, res, next) => {
  const id = req.user.id;
  const count = req.query.count;
  messageModel.getRecentMessage(id, parseInt(count) * 10).then((n) => {
    res.json({
      recentList: n,
      info: { id: req.user.id, name: req.user.displayname },
    });
  });
});

router.get("/newest/:id", auth.authenticateToken, (req, res, next) => {
  const opponentId = req.params.id;
  const userId = req.user.id;
  const count = req.query.count;
  let smallId = parseInt(userId) > parseInt(opponentId) ? opponentId : userId;
  let largeId = parseInt(userId) > parseInt(opponentId) ? userId : opponentId;
  let conversationId = crypto
    .createHash("sha256")
    .update(`${smallId}_${largeId}`, "utf8")
    .digest("hex");
  messageModel
    .getNewestMessage(conversationId, parseInt(count) * 10)
    .then((n) => {
      res.json(n);
    });
});

router.post("/add", auth.authenticateToken, (req, res, next) => {
  const opponentId = req.body.receiverId;
  const userId = req.user.id;
  let smallId = parseInt(userId) > parseInt(opponentId) ? opponentId : userId;
  let largeId = parseInt(userId) > parseInt(opponentId) ? userId : opponentId;
  let conversationId = crypto
    .createHash("sha256")
    .update(`${smallId}_${largeId}`, "utf8")
    .digest("hex");
  const message = { ...req.body };
  message["conversationId"] = conversationId;
  message["senderId"] = userId;
  messageModel.add(message).then((n) => {
    res.json({ messageId: n.insertId });
  });
});
module.exports = router;
