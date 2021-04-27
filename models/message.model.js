var db = require("../utils/db");
var messageModel = {
  getRecentMessage: (id, skip) => {
    return db.load(`SELECT user.displayname AS name, user.id, message.content, message.senderId, message.date, message.unread
    FROM message, user,
    (SELECT conversationId, MAX(date) lastest_date
     FROM message
     WHERE senderId=${id} OR receiverId=${id}
     GROUP BY conversationId) lastest_Message
    WHERE lastest_Message.conversationId=message.conversationId
    AND lastest_Message.lastest_date= message.date
    AND user.id <> ${id}
    AND (message.senderId=user.id OR message.receiverId=user.id)
    ORDER BY message.date DESC
    LIMIT ${skip},10`);
  },

  getNewestMessage: (conversationId, skip) => {
    return db.load(`SELECT message.*
    FROM message
    WHERE conversationId='${conversationId}'
    ORDER BY message.id DESC
    LIMIT ${skip},10`);
  },

  add: (message) => {
    return db.insert("message", message);
  },
};

module.exports = messageModel;
