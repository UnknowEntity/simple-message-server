var db = require("../utils/db");
var userModel = {
  singleByUserName: (userName) => {
    return db.load(`select * from user where Username = '${userName}'`);
  },

  singleById: (id) => {
    var sql = `SELECT * FROM user WHERE Id = ${id}`;
    return db.load(sql);
  },

  email: function (id) {
    var sql = "select `Email` from `user` where `Id` = " + id;
    console.log(sql);
    return db.load(sql);
  },

  add: function (user) {
    return db.insert("user", user);
  },

  update: function (user) {
    return db.update("user", user);
  },

  delete: function (user) {
    return db.delete("user", user);
  },
};

module.exports = userModel;
