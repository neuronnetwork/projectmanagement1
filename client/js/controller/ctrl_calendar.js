'use strict';

// Declare app level module which depends on filters, and services
   
app.controller('CalendarCtrl', function($scope, $http, $filter, $rootScope) {
	
	$scope.showProjectsInCalendar = true; 
	
	$scope.showDifferentAppointmentsInCalendar = true; 
	
	$scope.calendarData = { dfsffsf : 'sdsd' }; 
	
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
 
  
