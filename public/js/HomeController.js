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
    console.log(HomeService);

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
    $scope.totalKills = { kill: "" };

    const FIRST_PLACE_SCORE = 15;
    const SECOND_PLACE_SCORE = 10;
    const THIRD_PLACE_SCORE = 5;
    const POINTS_PER_DAMAGE = 0.5;
    const POINTS_PER_KILLS = 1;

    HomeService.getFighters().then(function(response) {
      $scope.fighters = response;
    });

    $scope.getUsers = function() {
      HomeService.getUsers().then(function(response) {
        $scope.users = response;
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
      $scope.fights.forEach(function(fight) {
        $scope.totalGivenDamage = $scope.totalGivenDamage + fight.DAMAGE;
        fight.DAMAGE_SCORE = fight.DAMAGE * POINTS_PER_DAMAGE;
      });

      var formattedData = {
        USER_DATA: $scope.currentUser,
        FIGHTS_DATA: $scope.fights,
        TOTAL_FIGHTS: $scope.fights.length,
        TOTAL_KILLS: $scope.totalKills.kill
      };

      console.log(formattedData);

      $scope.fighterModal = { IMAGE: "", NAME: "", FIGHTER_ID: 0 };
      $scope.fights = [];
      $scope.fightInProgress = false;
    };

    $scope.setPosition = function(positionSelected) {
      console.log(positionSelected);
      if (positionSelected == " 1re Lugar") {
        $scope.fights[$scope.fights.length - 1].POSITION = 1;
        $scope.fights[
          $scope.fights.length - 1
        ].POSITION_SCORE = FIRST_PLACE_SCORE;
      } else if (positionSelected == " 2do Lugar") {
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
