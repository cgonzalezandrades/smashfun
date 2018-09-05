angular.module("myApp").service("HomeService", function($http) {
  console.log("service");

  this.something = "test";

  this.getFighters = function() {
    return $http.get("/figthers").then(
      function(response) {
        return response.data;
      },
      function(error) {
        console.log(error);
      }
    );
  };

  this.getUsers = function() {
    return $http.get("/users").then(
      function(response) {
        return response.data;
      },
      function(error) {
        console.log(error);
      }
    );
  };

  this.deleteUser = function(userId) {
    return $http.post("/deleteUser", { userId: userId }).then(
      function(response) {
        return response.data;
      },
      function(error) {
        console.log(error);
      }
    );
  };

  this.getUser = function(userId) {
    return $http.get("/user/" + userId).then(
      function(response) {
        return response.data;
      },
      function(error) {
        console.log(error);
      }
    );
  };

  this.addUser = function(body) {
    return $http.post("/addUser", body).then(
      function(response) {
        return response;
      },
      function(error) {
        console.log(error);
      }
    );
  };

  this.gameOver = function(body) {
    return $http.post("/gameover", body).then(
      function(response) {
        return response;
      },
      function(error) {
        console.log(error);
      }
    );
  };
});
