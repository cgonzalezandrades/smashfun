myApp.controller("HomeController", [
  "$scope",
  "$rootScope",
  "$state",
  "$stateParams",
  "$http",
  "$timeout",
  "HomeService",
  function(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $http,
    $timeout,
    HomeService
  ) {
    $scope.currentUser = {};
    $scope.fighterModal = { IMAGE: "", NAME: "", FIGHTER_ID: 0 };
    $scope.totalGivenDamage = 0;
    $scope.fights = [];
    $scope.damage = 0;
    $scope.fightInProgress = false;
    $scope.position = "";
    $scope.loggedIn = false;
    $scope.newUser = {
      name: "",
      lastName: "",
      pictureLink: "",
      alias: ""
    };

    const FIRST_PLACE_SCORE = 15;
    const SECOND_PLACE_SCORE = 10;
    const THIRD_PLACE_SCORE = 5;
    const POINTS_PER_DAMAGE = 0.01;
    const POINTS_PER_KILLS = 1;

    // Set the date we're counting down to
    var countDownDate = new Date("Dec 7, 2018 24:00:00").getTime();
    var countDownTorunament = new Date("Dec 6, 2018 24:00:00").getTime();

    // Update the count down every 1 second
    var x = setInterval(function() {
      // Get todays date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Output the result in an element with id="demo"
      document.getElementById("demo").innerHTML =
        days +
        " dias " +
        hours +
        " horas " +
        minutes +
        " minutos " +
        seconds +
        " segundos ";

      // If the count down is over, write some text
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("demo").innerHTML = "EXPIRED";
      }
    }, 1000);

    var y = setInterval(function() {
      // Get todays date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownTorunament - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Output the result in an element with id="demo"
      document.getElementById("countdown-tournament").innerHTML =
        days + " dias " + hours + " horas " + minutes + " minutos ";

      // If the count down is over, write some text
      if (distance < 0) {
        clearInterval(y);
        document.getElementById("countdown-tournament").innerHTML =
          "Torneo Terminado";
      }
    }, 1000);

    HomeService.getFighters().then(function(response) {
      $scope.fighters = response;
    });

    $scope.getUsers = function() {
      HomeService.getUsers().then(function(response) {
        $scope.users = response;
        console.log($scope.users);
      });
    };
    $scope.getUsers();

    $scope.positions = ["1re Lugar", "2do Lugar", "3re Lugar"];
    // $scope.modes = [{ TYPE: "1 Vs 1" }, { TYPE: "Todos Contra Todos" }];
    // $scope.optionSelected = function(optionSelected) {
    //   $scope.modeSelected = optionSelected;
    //   console.log(optionSelected);
    // };
    // $scope.showBackground = false;
    // $scope.backgroundImage = "";

    $scope.userSelected = function(userSelected) {
      HomeService.getUser(userSelected.USER_ID).then(function(response) {
        $scope.user = response;
        console.log($scope.user);
        $scope.currentUser = userSelected;
        $scope.loggedIn = true;
      });
    };

    $scope.resetObject = function() {
      $scope.fighterModal = { IMAGE: "", NAME: "", FIGHTER_ID: 0 };
      $scope.position = "";
    };

    $scope.gameFinished = function() {
      console.log($scope.fights);
      var totalKills = 0;
      $scope.fights.forEach(function(fight) {
        $scope.totalGivenDamage = $scope.totalGivenDamage + fight.DAMAGE;
        fight.DAMAGE_SCORE = fight.DAMAGE * POINTS_PER_DAMAGE;
        fight.KILLS_SCORE = fight.KILLS * POINTS_PER_KILLS;
        totalKills += fight.KILLS;
      });

      var gameFormattedData = {
        USER_DATA: $scope.currentUser,
        FIGHTS: $scope.fights,
        TOTAL_FIGHTS: $scope.fights.length,
        TOTAL_KILLS: totalKills
      };
      console.log(gameFormattedData);
      HomeService.gameOver(gameFormattedData).then(function(response) {
        $scope.getUsers();
      });

      $scope.fighterModal = { IMAGE: "", NAME: "", FIGHTER_ID: 0 };
      $scope.fights = [];
      $scope.fightInProgress = false;
    };

    $scope.setPosition = function(positionSelected) {
      console.log(positionSelected);
      if (positionSelected == "1re Lugar") {
        $scope.fights[$scope.fights.length - 1].POSITION = 1;
        $scope.fights[
          $scope.fights.length - 1
        ].POSITION_SCORE = FIRST_PLACE_SCORE;
      } else if (positionSelected == "2do Lugar") {
        $scope.fights[$scope.fights.length - 1].POSITION = 2;
        $scope.fights[
          $scope.fights.length - 1
        ].POSITION_SCORE = SECOND_PLACE_SCORE;
      } else {
        $scope.fights[$scope.fights.length - 1].POSITION = 3;
        $scope.fights[
          $scope.fights.length - 1
        ].POSITION_SCORE = THIRD_PLACE_SCORE;
      }
    };

    $scope.beginFight = function() {
      console.log($scope.fighterModal);
      $scope.fights.push({
        NAME: $scope.fighterModal.NAME,
        IMAGE: $scope.fighterModal.IMAGE,
        POSITION: 0,
        POSITION_SCORE: 0,
        DAMAGE_SCORE: 0,
        DAMAGE: "",
        FIGHTER_ID: $scope.fighterModal.FIGHTER_ID,
        KILLS: ""
      });
      // console.log($scope.backgroundImage);
      // document.body.style.background = "url(" + $scope.backgroundImage + ")";
      // document.body.style.backgroundRepeat = "no-repeat";
      // document.body.style.backgroundSize = "cover";

      // $scope.showBackground = true;

      // $timeout(function() {
      //   $scope.showBackground = false;
      //   document.body.style.backgroundImage = "url('img_tree.png')";
      // }, 3000);

      console.log($scope.fights);
    };

    $scope.fighterSelected = function(fighterSelected) {
      console.log(fighterSelected);
      $scope.fighterModal.IMAGE = fighterSelected.PICTURE_PATH;
      $scope.fighterModal.NAME = fighterSelected.NAME;
      $scope.fighterModal.FIGHTER_ID = fighterSelected.FIGHTER_ID;
      // $scope.backgroundImage = fighterSelected.BACKGROUND_IMAGE;
    };

    $scope.deletePlayer = function(userId) {
      HomeService.deleteUser(userId).then(function(response) {
        $scope.getUsers();
      });
    };

    $scope.userConnected = function(index) {
      $scope.users[index].ADDED = true;
    };

    $scope.saveUser = function(action) {
      HomeService.addUser($scope.newUser).then(function(response) {
        $scope.getUsers();
        if (action === "fighterModal") {
          $("#fightersModal").modal("toggle");
        } else {
          $("#addUserModal").modal("toggle");
        }
      });
    };
  }
]);
