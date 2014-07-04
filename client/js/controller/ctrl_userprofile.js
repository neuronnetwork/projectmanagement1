'use strict';

app.controller('UserprofileCtrl', function($scope, $http, $filter, $rootScope) {
	if ($rootScope.user == undefined) {
   		console.log('PorjektCtrl - user is undefined');
   		$http.get('/loggedin').success(function(user) {
			// Authenticated
			if (user !== '0') { 
				$rootScope.user = user;
		    	$rootScope.isLoggedIn = true;
			} // Not Authenticated
			else {
				// $rootScope.message = 'You need to log in.';
				$rootScope.user = {};
		    	$rootScope.isLoggedIn = false;
			}
		});
   	}
});
 
  
