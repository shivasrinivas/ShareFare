var app = angular.module("sharefair", []);

app.config(['$locationProvider', function($locationProvider) {
	  $locationProvider.hashPrefix('');
	}]);

/*
 * A directive to enable two way binding of file field
 */
/*
 * app.directive('demoFileModel', function ($parse) { return { restrict: 'A',
 * //the directive can be used as an attribute only /* link is a function that
 * defines functionality of directive scope: scope associated with the element
 * element: element on which this directive used attrs: key value pair of
 * element attributes
 * 
 * link: function (scope, element, attrs) { var model =
 * $parse(attrs.demoFileModel), modelSetter = model.assign; //define a setter
 * for demoFileModel
 * 
 * //Bind change event on the element element.bind('change', function () {
 * //Call apply on scope, it checks for value changes and reflect them on UI
 * scope.$apply(function () { //set the model value modelSetter(scope,
 * element[0].files[0]); }); }); } }; });
 */

app.controller("sharefairController", function($scope, $http, $location){
	$scope.login = function(){
		$http.get('http://localhost:8080/ShareFairAPI/rest/services/UserService/authenticate?username='+$scope.userName+'&password='+$scope.password)
        .then(function (response) {
        		$scope.status = "Login Successful";
        		$scope.accessToken = response.data.accessToken;
        		window.location = "html/dashboard.html?accesstoken="+$scope.accessToken;
        })
        .catch(function (response) {
        		$scope.status = "Login Failed";
        });
		
	}
	
	/*
	 * $scope.uploadFile = function () { $scope.status = "in uploadFile"; var
	 * file = $scope.myFile; var uploadUrl =
	 * "http://localhost:8080/ShareFairAPI/rest/services/ExpenseService/upload",
	 * //Url of webservice/api/server promise =
	 * fileUploadService.uploadFileToUrl(file, uploadUrl);
	 * 
	 * promise.then(function (response) { $scope.serverResponse = response;
	 * $scope.status = "success"; }, function () { $scope.serverResponse = 'An
	 * error has occurred'; $scope.status = "failure"; }) }
	 */
	
	$scope.uploadFile = function(files) {
	    var fd = new FormData();
	    // Take the first selected file
	    fd.append("file", files[0]);

	    $http.post("http://localhost:8080/ShareFairAPI/rest/services/ExpenseService/upload", fd, {
	        withCredentials: true,
	        headers: {'Content-Type': undefined },
	        transformRequest: angular.identity
	    }).then(function (response) {
            $scope.serverResponse = response;
            $scope.status = "success";
        }).catch (function () {
            $scope.serverResponse = 'An error has occurred';
            $scope.status = "failure";
        });

	}
	
	$scope.register = function(){
		$http.get('http://localhost:8080/ShareFairAPI/rest/services/UserService/register?firstname='+$scope.firstName+'&lastname='+$scope.lastName+'&email='+$scope.registerMail+'&password='+$scope.pwd)
        .then(function (response) {
        		$scope.status = "Registration Successful";
        		$scope.firstName = "";
        		$scope.lastName = "";
        		$scope.registerMail = "";
        		$scope.pwd = "";
        })
        .catch(function (response) {
        		$scope.status = "Registration Failed";
        });
		
	}
})

app.controller("dashboardController", function($scope, $http, $location){
	
	$scope.profile = "Profile"
	$scope.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
		  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		];

	var parameter = location.search;
	var accessToken = parameter.substring(13);
	
	$scope.Username = "Shiva Srinivas";
	$scope.getExpenses = function(){
		$http.get('http://localhost:8080/ShareFairAPI/rest/services/UserService/expenses')
        .then(function (response) {
        		$scope.expenses = response.data;
        })
        .catch(function (response) {
        		
        });
		
	}
	
	$scope.getFriends = function(){
		$scope.getExpenses();
		$http.get('http://localhost:8080/ShareFairAPI/rest/services/UserService/userid?usertoken='+accessToken)
        .then(function (response) {
        		$scope.currentUser = response.data;
        		
        		$http.get('http://localhost:8080/ShareFairAPI/rest/services/UserService/friends?UserId='+$scope.currentUser.id)
                .then(function (response) {
                		$scope.friends = response.data;
                })
                .catch(function (response) {
                		
                });
        })
        .catch(function (response) {
        		
        });
	}
	
	$scope.invite = function(){
		$http.get('http://localhost:8080/ShareFairAPI/rest/services/UserService/invite?email='+$scope.inviteEmail)
        .then(function (response) {
        		
        })
        .catch(function (response) {
        		
        });
	}
	
	$scope.exportExpenses = function(){
		$scope.newStatus = "in export";
		var self = this;
	    var deferred = $q.defer();
	    $http.get('http://localhost:8080/ShareFairAPI/rest/services/ExportService/export', { responseType: "arraybuffer" }).then(
	        function (data, status, headers) {
	            var type = headers('Content-Type');
	            var disposition = headers('Content-Disposition');
	            if (disposition) {
	                var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
	                if (match[1])
	                    defaultFileName = match[1];
	            }
	            defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
	            var blob = new Blob([data], { type: type });
	            saveAs(blob, defaultFileName);
	            deferred.resolve(defaultFileName);                    
	        }, function (data, status) {
	            var e = /* error */
	            deferred.reject(e);
	        });
	    return deferred.promise;
	} 
	
	$scope.profile = function(){
		window.location = "profile.html";
	}
	
	$scope.getMonthName = function(dateString) {
		date = new Date(dateString);
		return $scope.monthNames[date.getMonth()];
	}
	
	$scope.getDateNumber = function(dateString){
		date = new Date(dateString);
		return date.getDate();
	}
	
	$scope.addExpense = function(){
		window.location = "addexpense.html?accesstoken="+accessToken;
	}
	
	$scope.storeExpense = function(){
		
		$http.get('http://localhost:8080/ShareFairAPI/rest/services/UserService/userfromemail?email='+$scope.friendEmail)
        .then(function (response) {
        		$scope.friendUser = response.data;
        })
        .catch(function (response) {
        		
        });
		$scope.profile = accessToken;
		
		$http.get('http://localhost:8080/ShareFairAPI/rest/services/UserService/userid?usertoken='+accessToken)
        .then(function (response) {
        		$scope.currentUser = response.data;
        })
        .catch(function (response) {
        		
        });
		
		
		$http.get('http://localhost:8080/ShareFairAPI/rest/services/ExpenseService/add?payerid='+$scope.currentUser.id+'&payeeid='+$scope.friendUser.id+'&amount='+$scope.expenseAmount+'&description='+$scope.description+'&date=2017-11-5')
        .then(function (response) {
        	window.location = "dashboard.html?accesstoken="+$scope.accessToken;
        })
        .catch(function (response) {
        		$scope.status = "Login Failed";
        });
	}
	
	});