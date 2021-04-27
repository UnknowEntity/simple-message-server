var db = require("../utils/db");
var userModel = {
  singleByUserName: (userName) => {
    return db.load(`select * from user where username = '${userName}'`);
  },

  singleById: (id) => {
    var sql = `SELECT * FROM user WHERE id = ${id}`;
    return db.load(sql);
  },

  singleBySocketId: (id) => {
    var sql = `SELECT * FROM user WHERE socketId = ${id}`;
    return db.load(sql);
  },

  singleByEmail: (email) => {
    var sql = `SELECT * FROM user WHERE email = '${email}'`;
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
