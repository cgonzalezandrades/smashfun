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

app.get("/points", function(req, res) {
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

app.post("/addAccount", function(req, res) {
  //  console.log(req.body)
  // connection.query('INSERT INTO LINKEDIN_ACCOUNTS (ACCOUNT_FIRST_NAME, ACCOUNT_LAST_NAME, ACCOUNT_LINK) VALUES(?,?,?)', [req.body.ACCOUNT_FIRST_NAME, req.body.ACCOUNT_LAST_NAME, req.body.ACCOUNT_LINK], function (error, results, field) {
  //   if (error) throw error;
  // })
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  //  console.log('IM LISTENING IS PORT ' + PORT);
});
