var mysql = require("mysql");
var connection;

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "points"
  });

  // connection = mysql.createConnection({
  //   host: "g8mh6ge01lu2z3n1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  //   user: "t7t1nd1jpz9eapq0",
  //   password: "qq2rmsamhtll8wq6",
  //   database: "up7k0kxbuvdxw75n"
  // });
}

module.exports = connection;
