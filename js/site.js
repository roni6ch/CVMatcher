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

/*
 * ********************* myjobs controller ****************
 */

app.controller('myjobsController', function($scope) {
	$scope.navigation = "Homepage";

});

/*
 * ********************* readcvs controller ****************
 */
app.controller('readcvsController', function($scope) {
	$scope.navigation = "Homepage > Read CV's";
	

});
/*
 * ********************* unreadcvs controller ****************
 */
app.controller('unreadcvsController', function($scope) {
	$scope.navigation = "Homepage > Unread CV's";
	

});

/*
 * ********************* favorites controller ****************
 */
app.controller('favoritesController', function($scope) {
	$scope.navigation = "Homepage > Favorites";
	

});



//background: url("../img/ProfileImg.png") no-repeat;
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

/*$("input").keypress(function(e) {
	if (e.which == 13 && $(this).hasClass('input') ) {
		$scope.loginSystem();
		return false;
	}
});	*/
