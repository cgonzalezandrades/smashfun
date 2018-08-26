var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var connection = require("./public/config/connection");

//console.log(connection)

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  //  console.log('connected as id ' + connection.threadId);
});

app.get("/", function(req, res) {
  res.sendFile("index.html");
});

app.get("/users", function(req, res) {
  connection.query(
    "SELECT A.*, COALESCE(B.TOTAL_SCORE,0) AS TOTAL_SCORE, COALESCE(B.TOTAL_SCORE_BY_KILLS,0) AS TOTAL_SCORE_BY_KILLS, COUNT(C.FIGHT_ID) AS FIGHTS FROM USERS AS A " +
      "LEFT JOIN TOTAL_SCORES AS B " +
      "ON A.USER_ID = B.USER_ID " +
      "LEFT JOIN FIGHTS AS C " +
      "ON C.USER_ID = B.USER_ID ",
    function(error, results, fields) {
      if (error) throw error;
      var formattedData = JSON.stringify(results);
      res.json(results);
    }
  );
});

app.get("/user/:userId", function(req, res) {
  var userId = req.params.userId;
  connection.query(
    "SELECT *, (SELECT TOTAL_SCORE FROM TOTAL_SCORES WHERE USER_ID = ? ) as TOTAL_SCORE, (SELECT COUNT(USER_ID )FROM FIGHTS WHERE USER_ID = ?) as FIGHTS FROM USERS AS A WHERE A.USER_ID = ?",
    [userId, userId, userId],
    function(error, results, fields) {
      if (error) throw error;
      var formattedData = JSON.stringify(results);
      res.json(results);
    }
  );

  // var contactList = [person1,person2,person3];

  // res.json(contactList);
});

// app.get("/scores", function(req, res) {
//   //  console.log(req.body)
//   // connection.query('INSERT INTO LINKEDIN_ACCOUNTS (ACCOUNT_FIRST_NAME, ACCOUNT_LAST_NAME, ACCOUNT_LINK) VALUES(?,?,?)', [req.body.ACCOUNT_FIRST_NAME, req.body.ACCOUNT_LAST_NAME, req.body.ACCOUNT_LINK], function (error, results, field) {
//   //   if (error) throw error;
//   // })

//   connection.query("SELECT * FROM SCORES", function(error, results, fields) {
//     if (error) throw error;
//     // connected!

//     var formattedData = JSON.stringify(results);

//     //  console.log(results[0].ACCOUNT_FIRST_NAME)
//     //  console.log(results)
//     res.json(results);
//   });
// });

app.get("/figthers", function(req, res) {
  connection.query("SELECT * FROM FIGTHERS", function(error, results, fields) {
    if (error) throw error;
    var formattedData = JSON.stringify(results);
    res.json(results);
  });
});

app.get("/data", function(req, res) {});

app.post("/addUser", function(req, res) {
  console.log(req.body);
  connection.query(
    "INSERT INTO USERS (FIRST_NAME, LAST_NAME, PATH, NICKNAME) VALUES(?,?,?,?)",
    [req.body.name, req.body.lastName, req.body.pictureLink, req.body.alias],
    function(error, results) {
      if (error) throw error;

      var formattedData = JSON.stringify(results);
      // insertIntoScore(results.insertId);
      res.json(formattedData);
    }
  );
});

app.post("/deleteUser", function(req, res) {
  var userId = req.body.userId;
  connection.query(
    "DELETE FROM USERS WHERE USER_ID = ? ",
    [req.body.userId],
    // [req.body.userId],
    function(error, results) {
      if (error) throw error;

      var formattedData = JSON.stringify(results);
      // insertIntoScore(results.insertId);
      res.json(formattedData);
    }
  );
});

var PORT = process.env.PORT || 3001;
app.listen(PORT, function() {});
