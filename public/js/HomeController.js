myApp.controller("HomeController", [
  "$scope",
  "$rootScope",
  "$state",
  "$stateParams",
  "$http",
  function($rootScope, $scope, $state, $stateParams, $http) {
    //    console.log('ins home controller')
    $scope.fighterModal = { IMAGE: "", NAME: "" };
    $scope.fights = [];
    $scope.newUser = {
      name: "",
      lastName: "",
      pictureLink: "",
      alias: ""
    };

    $scope.positions = ["1re Lugar", "2do Lugar", "3re Lugar"];
    $scope.startFight = false;
    $scope.modes = [{ TYPE: "1 Vs 1" }, { TYPE: "Todos Contra Todos" }];

    $scope.optionSelected = function(optionSelected) {
      $scope.modeSelected = optionSelected;
      console.log(optionSelected);
    };
    $scope.resetObject = function() {
      $scope.fighterModal = { IMAGE: "", NAME: "" };
    };
    $scope.beginFight = function() {
      console.log($scope.fighterModal);

      $scope.fights.push({
        NAME: $scope.fighterModal.NAME,
        IMAGE: $scope.fighterModal.IMAGE
      });

      console.log($scope.fights);
    };

    $scope.fighterSelected = function(fighterSelected) {
      $scope.fighterModal.IMAGE = fighterSelected.PICTURE_PATH;
      $scope.fighterModal.NAME = fighterSelected.NAME;
    };

    $scope.positionSelected = function(positionSelected) {
      $scope.position = positionSelected;
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
        console.log(response.data);
        $scope.scores = response.data;
      });
    };
    $scope.getScores();

    $scope.getFighters = function() {
      $http.get("/figthers").then(function success(response) {
        console.log(response.data);

        $scope.fighters = response.data;
      });
    };
    $scope.getFighters();

    $scope.getData = function() {
      $http.get("/data").then(function success(response) {
        console.log(response.data);
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
