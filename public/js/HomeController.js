myApp.controller("HomeController", [
  "$scope",
  "$rootScope",
  "$state",
  "$stateParams",
  "$http",
  function($rootScope, $scope, $state, $stateParams, $http) {
    //    console.log('ins home controller')
    $scope.newUser = {};
    $scope.userIn = true;

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

    //  $scope.users = {something:'ss', another:'sds'}

    $scope.userConnected = function(index) {
      $scope.users[index].ADDED = true;
    };

    $scope.formFilled = function() {
      if (
        $scope.newUser.ACCOUNT_FIRST_NAME.length > 0 &&
        $scope.newUser.ACCOUNT_LAST_NAME.length > 0 &&
        $scope.newUser.ACCOUNT_LINK.length > 0
      ) {
        $scope.userIn = false;
      } else {
        $scope.userIn = true;
      }
    };

    $scope.addNewUser = function() {
      $http.post("/addAccount", $scope.newUser).then(
        function success(response) {},
        function errorCallback(error) {
          console.log(error);
        }
      );

      $scope.getAccounts();
      $scope.newUser = {};
    };
  }
]);
