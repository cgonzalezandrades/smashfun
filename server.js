var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var connection = require("./public/config/connection");

//console.log(connection)
const FIRST_PLACE_SCORE = 15;
const SECOND_PLACE_SCORE = 10;
const THIRD_PLACE_SCORE = 5;
const POINTS_PER_DAMAGE = 0.5;
const POINTS_PER_KILLS = 1;

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
    "SELECT A.*, IFNULL(B.TOTAL_SCORE,0) AS TOTAL_SCORE ,IFNULL(B.TOTAL_SCORE_BY_FIRST_PLACE,0) AS TOTAL_SCORE_BY_FIRST_PLACE,IFNULL(B.TOTAL_SCORE_BY_SECOND_PLACE,0) AS TOTAL_SCORE_BY_SECOND_PLACE,IFNULL(B.TOTAL_SCORE_BY_THIRD_PLACE,0) AS TOTAL_SCORE_BY_THIRD_PLACE, IFNULL(B.TOTAL_SCORE_BY_KILLS,0) AS TOTAL_SCORE_BY_KILLS,IFNULL(B.TOTAL_SCORE_BY_DAMAGE,0) AS TOTAL_SCORE_BY_DAMAGE, IFNULL(COUNT(C.USER_ID),0) AS FIGHTS FROM USERS AS A " +
      "LEFT JOIN TOTAL_SCORES AS B " +
      "ON A.USER_ID = B.USER_ID " +
      "LEFT JOIN FIGHTS AS C " +
      "ON C.USER_ID = B.USER_ID " +
      "GROUP BY A.USER_ID",
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

app.post("/gameover", function(req, res) {
  const userId = req.body.USER_DATA.USER_ID;
  const fights = req.body.FIGHTS;
  insertFight(fights, userId);
  getCurrentScores(fights, userId, res);
});

function getCurrentScores(fights, userId, res) {
  var score;
  connection.query(
    "SELECT * FROM TOTAL_SCORES WHERE USER_ID = ?",
    [userId],
    function(error, results) {
      if (error) throw error;
      var formattedData = JSON.stringify(results);
      updateScore(fights, formattedData, userId, res);
    }
  );
}

function insertFight(fights, userId) {
  fights.forEach(fight => {
    connection.query(
      "INSERT INTO FIGHTS (POSITION, POSITION_SCORE, DAMAGE_GIVEN, DAMAGE_SCORE, KILLS, KILLS_SCORE, FIGHTER_ID, USER_ID) " +
        "VALUES(?,?,?,?,?,?,?,?)",
      [
        fight.POSITION,
        fight.POSITION_SCORE,
        fight.DAMAGE,
        fight.DAMAGE_SCORE,
        fight.KILLS,
        fight.KILLS * POINTS_PER_KILLS,
        fight.FIGHTER_ID,
        userId
      ],
      function(error, results) {
        if (error) throw error;
      }
    );
  });
}

function updateScore(fights, currentScores, userId, res) {
  currentScores = JSON.parse(currentScores);
  currentScores = currentScores[0];

  var dbFirstPlacePoints = currentScores.TOTAL_SCORE_BY_FIRST_PLACE;
  var dbSecondPlacePoints = currentScores.TOTAL_SCORE_BY_SECOND_PLACE;
  var dbThirdPlacePoints = currentScores.TOTAL_SCORE_BY_THIRD_PLACE;
  var dbDamageScore = currentScores.TOTAL_SCORE_BY_DAMAGE;
  var dbKillscore = currentScores.TOTAL_SCORE_BY_KILLS;
  var dbTotalScore = currentScores.TOTAL_SCORE;

  var currentDamageScore = 0;
  var currentKillscore = 0;
  var currentFirstPlaceScore = 0;
  var currentSecondPlaceScore = 0;
  var currentThirdPlaceScore = 0;
  var totalScore = 0;

  fights.forEach(function(fight) {
    currentDamageScore = currentDamageScore + fight.DAMAGE_SCORE;
    currentKillscore = currentKillscore + fight.KILLS;
    if (fight.POSITION == 1) {
      currentFirstPlaceScore = currentFirstPlaceScore + fight.POSITION_SCORE;
    } else if (fight.POSITION == 2) {
      currentSecondPlaceScore = currentSecondPlaceScore + fight.POSITION_SCORE;
    } else {
      currentThirdPlaceScore = currentThirdPlaceScore + fight.POSITION_SCORE;
    }
  });

  totalScore =
    dbTotalScore +
    currentFirstPlaceScore +
    currentSecondPlaceScore +
    currentThirdPlaceScore +
    currentDamageScore +
    currentKillscore;

  currentFirstPlaceScore += dbFirstPlacePoints;
  currentSecondPlaceScore += dbSecondPlacePoints;
  currentThirdPlaceScore += dbThirdPlacePoints;
  currentDamageScore += dbDamageScore;
  currentKillscore += dbKillscore;

  connection.query(
    "UPDATE TOTAL_SCORES SET TOTAL_SCORE_BY_FIRST_PLACE = ?, TOTAL_SCORE_BY_SECOND_PLACE = ?, TOTAL_SCORE_BY_THIRD_PLACE = ?, TOTAL_SCORE_BY_DAMAGE = ?, TOTAL_SCORE_BY_KILLS  = ?, TOTAL_SCORE = ? " +
      "WHERE USER_ID = ?",
    [
      currentFirstPlaceScore,
      currentSecondPlaceScore,
      currentThirdPlaceScore,
      currentDamageScore,
      currentKillscore,
      totalScore,
      userId
    ],
    function(error, results) {
      if (error) throw error;
      res.json(results);
    }
  );
}

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
  connection.query(
    "INSERT INTO USERS (FIRST_NAME, LAST_NAME, PATH, NICKNAME) VALUES(?,?,?,?)",
    [req.body.name, req.body.lastName, req.body.pictureLink, req.body.alias],
    function(error, results) {
      if (error) throw error;
      connection.query(
        "INSERT INTO TOTAL_SCORES " +
          "(TOTAL_SCORE_BY_FIRST_PLACE, TOTAL_SCORE_BY_SECOND_PLACE, TOTAL_SCORE_BY_THIRD_PLACE, TOTAL_SCORE_BY_DAMAGE, TOTAL_SCORE_BY_KILLS, TOTAL_SCORE, USER_ID) " +
          "VALUES(?,?,?,?,?,?,?)",
        [0, 0, 0, 0, 0, 0, results.insertId],
        function(error, results) {
          if (error) throw error;
        }
      );

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
