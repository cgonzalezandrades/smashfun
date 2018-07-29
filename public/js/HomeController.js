myApp.controller("HomeController", [
  "$scope",
  "$rootScope",
  "$state",
  "$stateParams",
  "$http",
  function($rootScope, $scope, $state, $stateParams, $http) {
    //    console.log('ins home controller')
    $scope.newUser = {
      name: "",
      lastName: "",
      pictureLink: "",
      alias: ""
    };
    $scope.startFight = false;

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

    $scope.saveUser = function() {
      $http.post("/addUser", $scope.newUser).then(
        function success(response) {
          console.log("success");
          $scope.getUsers();
          console.log(JSON.parse(response.data));
          $("#addUserModal").modal("toggle");
        },
        function errorCallback(error) {
          console.log(error);
        }
      );
    };
  }
]);
