myApp.controller('AboutController', ['$scope', '$rootScope', '$rootScope', '$state', '$stateParams',
    function ($rootScope, $scope,$state, $stateParams) {

        $scope.state = $stateParams.current.name;

        console.log($scope.state);

        console.log("Hello from about controller");

        $scope.hello = 'about';

    }]);
