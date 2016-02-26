/** **********************************ANGULAR*************************************** */

var app = angular.module('cvmatcherApp', [ "ngRoute" ]);

app.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl : 'myjobs.html',
		controller : 'myjobsController'
	}).when('/readcvs', {
		templateUrl : 'readcvs.html',
		controller : 'readcvsController'
	}).when('/unreadcvs', {
		templateUrl : 'unreadcvs.html',
		controller : 'unreadcvsController'
	}).when('/favorites', {
		templateUrl : 'favorites.html',
		controller : 'favoritesController'
	})
});

// background: url("../img/ProfileImg.png") no-repeat;
/*app.directive('backImg', function() {
 return function(scope, element, attrs) {
 attrs.$observe('backImg', function(value) {
 element.css({
 'background-image' : 'url(uploads/' + $.trim(value) + ')',
 'background-size' : 'cover'
 });
 });
 };
 });*/
/*
 * ********************* myjobs controller ****************
 */

app.controller('myjobsController', function($scope) {
	console.log("myjobsController");
	/*$("input").keypress(function(e) {
		if (e.which == 13 && $(this).hasClass('input') ) {
			$scope.loginSystem();
			return false;
		}
	});	*/

});

/*
 * ********************* readcvs controller ****************
 */
app.controller('readcvsController', function($scope) {
	console.log("readcvsController");
	/*$("input").keypress(function(e) {
		if (e.which == 13 && $(this).hasClass('input') ) {
			$scope.loginSystem();
			return false;
		}
	});	*/

});
/*
 * ********************* unreadcvs controller ****************
 */
app.controller('unreadcvsController', function($scope) {
	console.log("unreadcvsController");
	/*$("input").keypress(function(e) {
		if (e.which == 13 && $(this).hasClass('input') ) {
			$scope.loginSystem();
			return false;
		}
	});	*/

});

/*
 * ********************* favorites controller ****************
 */
app.controller('favoritesController', function($scope) {
	console.log("favoritesController");
	/*$("input").keypress(function(e) {
		if (e.which == 13 && $(this).hasClass('input') ) {
			$scope.loginSystem();
			return false;
		}
	});	*/

});
