/*var app = angular.module("sharefair", []);

app.config(['$locationProvider', function($locationProvider) {
	  $locationProvider.hashPrefix('');
	}]);

app.controller("dashboardController", function($scope, $http, $location){
	
	$scope.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
		  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		];

	$scope.Username = "Shiva Srinivas";
	$scope.getExpenses = function(){
		
		$http.get('http://localhost:8080/ShareFairAPI/rest/services/UserService/expenses')
        .then(function (response) {
        		$scope.expenses = response.data;
        })
        .catch(function (response) {
        		
        });
		
	}
	
	$scope.getMonthName = function(dateString) {
		date = new Date(dateString);
		return $scope.monthNames[date.getMonth()];
	}
	
	$scope.getDateNumber = function(dateString){
		date = new Date(dateString);
		return date.getDate();
	}
})*/
