var mysql = require("mysql");
var createConnection = () => {
  return mysql.createConnection({
    host: "freedb.tech",
    port: 3306,
    user: "freedbtech_nhkhangllll",
    password: "85qg9AEgp",
    database: "freedbtech_bubblesMessagingAppDB",
  });
};

module.exports = {
  load: (sql) => {
    return new Promise((resolve, reject) => {
      var connection = createConnection();
      connection.connect();
      connection.query(sql, (error, results, fields) => {
        if (error) reject(error);
        resolve(results);
      });
      connection.end();
    });
  },

  insert: (tableName, obj) => {
    return new Promise((resolve, reject) => {
      var connection = createConnection();
      var sql = `INSERT INTO ${tableName} set ?`;
      connection.connect();
      connection.query(sql, obj, (error, results, fields) => {
        if (error) reject(error);
        resolve(results);
      });
      connection.end();
    });
  },

  bulkInsert: (tableName, property, obj) => {
    return new Promise((resolve, reject) => {
      var connection = createConnection();
      var sql = `INSERT INTO ${tableName} ${property} VALUES ?`;
      connection.connect();
      connection.query(sql, [obj], (error, results, fields) => {
        if (error) reject(error);
        resolve(results);
      });
      connection.end();
    });
  },

  update: (tableName, obj) => {
    return new Promise((resolve, reject) => {
      var connection = createConnection();
      connection.connect();

      var id = obj.Id;
      delete obj.Id;
      console.log(id);
      var sql = `update ${tableName} set ? where Id = ?`;

      connection.query(sql, [obj, id], (error, results, fields) => {
        if (error) reject(error);
        resolve(results.changedRows);
      });
      connection.end();
    });
  },
  updateCol: (tableName, obj) => {
    return new Promise((resolve, reject) => {
      var connection = createConnection();
      connection.connect();

      var id = obj.ID;
      delete obj.ID;
      console.log(id);
      var sql = `update ${tableName} set ? where ID = ?`;

      connection.query(sql, [obj, id], (error, results, fields) => {
        if (error) reject(error);
        resolve(results.changedRows);
      });
      connection.end();
    });
  },

  delete: (tableName, id) => {
    return new Promise((resolve, reject) => {
      var connection = createConnection();
      connection.connect();

      var sql = `delete from ${tableName} where Id = ?`;
      connection.query(sql, id, (error, results, fields) => {
        if (error) reject(error);
        resolve(results.affectedRows);
      });

      connection.end();
    });
  },

  deleteWithoutPrimary: (tableName, obj) => {
    return new Promise((resolve, reject) => {
      var sql = `delete from ${tableName} where ?`;
      connection.query(sql, obj, (error, results, fields) => {
        if (error) reject(error);
        resolve(results.affectedRows);
      });
      connection.end();
    });
  },
};
