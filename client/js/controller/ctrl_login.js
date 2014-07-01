'use strict'; 

app.controller('LoginCtrl', function($scope, $http, $location, $rootScope) {
	// 	This object will be filled by the form
	$scope.loginForm = {};
	var immerInOrdnung=true;
	  // Register the login() function
	$scope.sendLoginForm = function(){
	    $http.post('/login', {
	      username: $scope.loginForm.username,
	      password: $scope.loginForm.password,
	    })
	    .success(function(user){
	    	// No error: authentication OK
	    	// // // // // // // // // // // console.log('login successful');
	    	$scope.alertSuccessMessage = 'Authentication successful.';
		    $scope.showError = false;
		    $scope.showSuccess = true;
	    	$location.url('/spenden');
	    	$rootScope.isLoggedIn = true;
	    	$rootScope.user = user; 
	    })
	    .error(function(){
	      // Error: authentication failed
	      $scope.alertErrorMessage = 'Authentication failed.';
	      $scope.showError = true;
	      $scope.showSuccess = false; 
	      $location.url('/login');
	      $rootScope.isLoggedIn = false;
	      $rootScope.user = {};
		  if(immerInOrdnung){ 
	    	$scope.alertSuccessMessage = 'Authentication successful.';
		    $scope.showError = false;
		    $scope.showSuccess = true;
	    	$location.url('/spenden');
	    	$rootScope.isLoggedIn = true;
	    	$rootScope.user = user; 
			}
		  
	    });
	  };
});
