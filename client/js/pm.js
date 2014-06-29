'use strict';

// Declare app level module which depends on filters, and services

// , 'monitorApp.directives // ,
var app = angular.module('grgProjectmanagement', ['ngRoute', 'grgProjectmanagement.directives', 'angularFileUpload', 'ui.bootstrap', 'ui.date' ])
	.config(function($routeProvider, $locationProvider, $httpProvider) {
			$locationProvider.html5Mode(false);

			// $rootScope.user = {};
			$httpProvider.responseInterceptors.push(function($q, $location) {
				return function(promise) {
					return promise.then(
					// Success: just return the response
					function(response) {
						return response;
					},
					// Error: check the error status to get only the 401
					function(response) {
						if (response.status === 401)
							$location.url('/login');
						return $q.reject(response);
					});
				}
			});

			var checkLoggedin = function($q, $timeout, $http, $location) {
				// Initialize a new promise
				var deferred = $q.defer();

				// Make an AJAX call to check if the user is logged in
				$http.get('/loggedin').success(function(user) {
					// Authenticated
					if (user !== '0') {
						$timeout(deferred.resolve, 0);
					} // Not Authenticated
					else {
						// $rootScope.message = 'You need to log in.';
						$timeout(function() {
							deferred.reject();
						}, 0);
						$location.url('/login');
					}
				});

				return deferred.promise;
			};

			$routeProvider.when('/', {
				templateUrl : '/index.html',
				controller : ''
			}).when('/spenden', {
				templateUrl : '/partials/spenden.html',
				// controller: 'SpendenCtrl',
				resolve : {
					loggedin : checkLoggedin
				}
			}).when('/shop', {
				templateUrl : '/partials/shop.html',
				// controller: 'ShopCtrl',
				resolve : {
					loggedin : checkLoggedin
				}
			}).when('/diary', {
				templateUrl : '/partials/diary.html',
				// controller: 'DiaryCtrl',
				resolve : {
					loggedin : checkLoggedin
				}
			}).when('/kipa', {
				templateUrl : '/partials/kipa.html',
				// controller: 'DiaryCtrl',
				resolve : {
					loggedin : checkLoggedin
				}
			}).when('/fileupload', {
				templateUrl : '/partials/fileupload.html',
				// controller: 'FileuploadCtrl',
				resolve : {
					loggedin : checkLoggedin
				}
			}).when('/patenschaften', {
				templateUrl : '/partials/patenschaften.html',
				// controller: 'FileuploadCtrl',
				resolve : {
					loggedin : checkLoggedin
				}
			}).when('/sms', {
				templateUrl : '/partials/sms.html',
				resolve : {
					loggedin : checkLoggedin
				}
			}).when('/projekte', {
				templateUrl : '/partials/projekte.html',
				resolve : {
					loggedin : checkLoggedin
				}
			}).when('/aufrunden', {
				templateUrl : '/partials/aufrunden.html',
				resolve : {
					loggedin : checkLoggedin
				}
			}).when('/userprofile', {
				templateUrl : '/partials/userprofile.html',
				resolve : {
					loggedin : checkLoggedin
				}
			}).when('/admin', {
				templateUrl : '/partials/admin.html',
				resolve : {
					loggedin : checkLoggedin
				}
			}).when('/calendar', {
				templateUrl : '/partials/calendar.html',
				resolve : {
					loggedin : checkLoggedin
				}
			}).when('/login', {
				templateUrl : '/partials/login.html',
			// controller: 'LoginCtrl'
			}).otherwise({
				redirectTo : '/'
			});

		});

app.controller('HomeCtrl', function($scope) {
	// console.log('"HomeCtrl" ');
});
