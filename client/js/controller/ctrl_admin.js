'use strict';

// Declare app level module which depends on filters, and services
   
app.controller('AdminCtrl', function($scope, $http, $filter, $rootScope ) {
 	// KiPas
	
	//$scope.showErrorUser = false;
	//$scope.alertSuccessMessageUser = false; 
	//$scope.alertErrorMessageUser = false;   
	$scope.newUser = {};
	
 	$scope.allUser = []; 
 
 	$http({method: 'GET', url: '/user'}).
	    success(function(data, status, headers, config) { 
	    		$scope.allUser = data.allUser;
			     
				console.log('data.allUser  : ' + JSON.stringify(data.allUser));
				// $scope.showErrorUser = false; 
	    }).
	    error(function(data, status, headers, config) { 
		     // $scope.alertErrorMessageKipa = data; 
		     // $scope.showErrorKipa = true;	
			console.log('GET /user :  ERROR');

	    });   
	
	$scope.userSpeichern = function( id) {
		var i = 0;  

		while (i < $scope.allUser.length) {
			if ($scope.allUser[i].id == id) {
				console.log('diese Werte wollen wir speichern - für id: '+ id + ' - ' +JSON.stringify($scope.allUser[i]))
				
				var json = $scope.allUser[i]; 
				
				$http({method: 'POST', url: '/user', data: json}).
		 	    	success(function(data, status, headers, config) {
		 	    		 
		 	    		console.log('alles ok');
					    Array.prototype.sortOn = function(key) {
				        	this.sort(function(a, b) {
				        	    if(a[key] < b[key]) {
				        	        return -1;
				        	    }else if(a[key] > b[key]){
				        	        return 1;
				        	    }
				        	    return 0;
				        	});
				        }  
					    $scope.allUser.sortOn('lastname'); 
 				    }).
				    error(function(data, status, headers, config) {
		 	    		console.log('error: data: ' + data);
		 	    		console.log('error: status: ' + status);
		 	    		console.log('error: headers: ' + headers);

 				    });   
				 
				break; 
			} 
			i++; 
		}
	}; 
	
	$scope.createUser = function() {
 		
        var json = JSON.parse(JSON.stringify($scope.newUser));
        console.log('newUser: ' + JSON.stringify(json));
        
        $http({method: 'POST', url: '/newuser', data: json}).
        	success(function(data, status, headers, config) {
 				
                console.log('newUser success: ' + JSON.stringify(json));
                console.log('newUser success: $scope.allUser   ' + JSON.stringify($scope.allUser));

 	    		
        		// add new entry
        		$scope.allUser.push(json);
					    
				Array.prototype.sortOn = function(key) {
					this.sort(function(a, b) {
						if (a[key] < b[key]) {
							return -1;
				        } else if(a[key] > b[key]) {
				        	return 1;
				        }
			        	return 0;
			        });
			     }  
				 $scope.allUser.sortOn('lastname');  
	                console.log('newUser success: $scope.allUser  after adding new user  ' + JSON.stringify($scope.allUser));

		    }).
		    error(function(data, status, headers, config) {
		    	$scope.alertErrorMessageIndividual = data; 
		 		$scope.showErrorIndividual = true;			    
		    });   
		} 
	
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
 
  
