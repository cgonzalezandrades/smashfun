myApp.controller("HomeController", [
  "$scope",
  "$rootScope",
  "$state",
  "$stateParams",
  "$http",
  "$timeout",
  function($rootScope, $scope, $state, $stateParams, $http, $timeout) {
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

    $scope.positions = ["1re Lugar", "2do Lugar", "3re Lugar"];
    // $scope.modes = [{ TYPE: "1 Vs 1" }, { TYPE: "Todos Contra Todos" }];
    // $scope.optionSelected = function(optionSelected) {
    //   $scope.modeSelected = optionSelected;
    //   console.log(optionSelected);
    // };
    // $scope.showBackground = false;
    // $scope.backgroundImage = "";

    $scope.userSelected = function(userSelected) {
      console.log(userSelected);
      $scope.currentUser = userSelected;
      $scope.loggedIn = true;
    };

    $scope.resetObject = function() {
      $scope.fighterModal = { IMAGE: "", NAME: "", FIGHTER_ID: 0 };
      $scope.position = "";
    };

    $scope.gameFinished = function() {
      console.log($scope.fights);
      $scope.fights.forEach(function(fight) {
        $scope.totalGivenDamage = $scope.totalGivenDamage + fight.DAMAGE;
      });
      console.log($scope.totalGivenDamage);
      $scope.fighterModal = { IMAGE: "", NAME: "", FIGHTER_ID: 0 };
      $scope.fights = [];
      $scope.fightInProgress = false;
    };

    $scope.setPosition = function(positionSelected) {
      console.log(positionSelected);
      if (positionSelected == " 1re Lugar") {
        $scope.fights[$scope.fights.length - 1].POSITION = 1;
      } else if (positionSelected == " 2do Lugar") {
        $scope.fights[$scope.fights.length - 1].POSITION = 2;
      } else {
        $scope.fights[$scope.fights.length - 1].POSITION = 3;
      }
    };

    $scope.beginFight = function() {
      console.log($scope.fighterModal);
      $scope.fights.push({
        NAME: $scope.fighterModal.NAME,
        IMAGE: $scope.fighterModal.IMAGE,
        POSITION: 0,
        DAMAGE: 0,
        FIGHTER_ID: $scope.fighterModal.FIGHTER_ID
      });
      $scope.fightInProgress = true;
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
      $http.post("/deleteUser", { userId: userId }).then(
        function success(response) {
          console.log(response.data);
          $scope.getUsers();
        },
        function errorCallback(error) {
          console.log(error);
        }
      );
    };

    $scope.getUsers = function() {
      $http.get("/users").then(function success(response) {
        console.log(response.data);
        $scope.users = response.data;
      });
    };
    $scope.getUsers();

    $scope.getScores = function() {
      $http.get("/scores").then(function success(response) {
        // console.log(response.data);
        $scope.scores = response.data;
      });
    };
    $scope.getScores();

    $scope.getFighters = function() {
      $http.get("/figthers").then(function success(response) {
        // console.log(response.data);
        $scope.fighters = response.data;
      });
    };
    $scope.getFighters();

    $scope.getData = function() {
      $http.get("/data").then(function success(response) {
        // console.log(response.data);
        $scope.scores = response.data;
      });
    };
    $scope.getData();

    //  $scope.users = {something:'ss', another:'sds'}

    $scope.userConnected = function(index) {
      $scope.users[index].ADDED = true;
    };

    $scope.saveUser = function(action) {
      $http.post("/addUser", $scope.newUser).then(
        function success(response) {
          console.log("success");
          $scope.getUsers();
          console.log(JSON.parse(response.data));
          if (action === "fighterModal") {
            $("#fightersModal").modal("toggle");
          } else {
            $("#addUserModal").modal("toggle");
          }
        },
        function errorCallback(error) {
          console.log(error);
        }
      );
    };
  }
]);
