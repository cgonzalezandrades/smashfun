var mysql = require("mysql");
var connection;

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  // connection = mysql.createConnection({
  //   host: "localhost",
  //   user: "root",
  //   password: "root",
  //   database: "points"
  // });

  connection = mysql.createConnection({
    host: "localhost",
    user: "kh25u3iu1dz254qk",
    password: "a26s5k6hjtq66m4p",
    database: "r44ezfddc6fcbn66"
  });
}

module.exports = connection;
