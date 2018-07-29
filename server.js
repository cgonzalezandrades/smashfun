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

//arrayNAME.replace(',', '')

app.get("/", function(req, res) {
  res.sendFile("index.html");
});

app.get("/users", function(req, res) {
  console.log("I received a get request.");

  connection.query("SELECT * FROM USERS", function(error, results, fields) {
    if (error) throw error;
    // connected!

    var formattedData = JSON.stringify(results);

    //  console.log(results[0].ACCOUNT_FIRST_NAME)
    //  console.log(results)
    res.json(results);
  });

  // var contactList = [person1,person2,person3];

  // res.json(contactList);
});

app.get("/scores", function(req, res) {
  //  console.log(req.body)
  // connection.query('INSERT INTO LINKEDIN_ACCOUNTS (ACCOUNT_FIRST_NAME, ACCOUNT_LAST_NAME, ACCOUNT_LINK) VALUES(?,?,?)', [req.body.ACCOUNT_FIRST_NAME, req.body.ACCOUNT_LAST_NAME, req.body.ACCOUNT_LINK], function (error, results, field) {
  //   if (error) throw error;
  // })

  connection.query("SELECT * FROM SCORES", function(error, results, fields) {
    if (error) throw error;
    // connected!

    var formattedData = JSON.stringify(results);

    //  console.log(results[0].ACCOUNT_FIRST_NAME)
    //  console.log(results)
    res.json(results);
  });
});

app.get("/data", function(req, res) {
  //  console.log(req.body)
  // connection.query('INSERT INTO LINKEDIN_ACCOUNTS (ACCOUNT_FIRST_NAME, ACCOUNT_LAST_NAME, ACCOUNT_LINK) VALUES(?,?,?)', [req.body.ACCOUNT_FIRST_NAME, req.body.ACCOUNT_LAST_NAME, req.body.ACCOUNT_LINK], function (error, results, field) {
  //   if (error) throw error;
  // })

  connection.query(
    "SELECT * FROM points.SCORES AS A JOIN points.USERS AS B ON A.USER_ID = B.USER_ID",
    function(error, results, fields) {
      if (error) throw error;
      // connected!

      var formattedData = JSON.stringify(results);

      //  console.log(results[0].ACCOUNT_FIRST_NAME)
      //  console.log(results)
      res.json(results);
    }
  );
});

app.post("/addUser", function(req, res) {
  console.log(req.body);
  connection.query(
    "INSERT INTO USERS (FIRST_NAME, LAST_NAME, PATH, NICKNAME) VALUES(?,?,?,?)",
    [req.body.name, req.body.lastName, req.body.pictureLink, req.body.alias],
    function(error, results) {
      if (error) throw error;

      var formattedData = JSON.stringify(results);
      insertIntoScore(results.insertId);
      res.json(formattedData);
    }
  );
});

app.post("/deleteUser", function(req, res) {
  console.log(req.body);
  connection.query(
    "DELETE FROM USERS WHERE USER_ID = " + req.body.userId,
    // [req.body.userId],
    function(error, results) {
      if (error) throw error;

      var formattedData = JSON.stringify(results);
      insertIntoScore(results.insertId);
      res.json(formattedData);
    }
  );
});

function insertIntoScore(userId) {
  console.log(userId);
  connection.query(
    "INSERT INTO SCORES (FIRST_PLACE_SCORE, SECOND_PLACE_SCORE, THIRD_PLACE_SCORE, DAMAGE_SCORE, KILL_SCORE, TOTAL, USER_ID) VALUES(?,?,?,?,?,?,?)",
    [0, 0, 0, 0, 0, 0, userId],
    function(error, results) {
      if (error) throw error;
      console.log(results);
    }
  );
}

var PORT = process.env.PORT || 3001;
app.listen(PORT, function() {
  //  console.log('IM LISTENING IS PORT ' + PORT);
});
