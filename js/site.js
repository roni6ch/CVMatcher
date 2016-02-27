/** **********************************ANGULAR*************************************** */

var app = angular.module('cvmatcherApp', [ "ngRoute", 'infinite-scroll' ]);

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
	}).when('/favorites/resume/:name', {
		templateUrl : 'resume.html',
		controller : 'resumeController'
	})
});

/*
 * ********************* myjobs controller ****************
 */

app.controller('myjobsController', function($scope, $http) {
});

/*
 * ********************* readcvs controller ****************
 */
app.controller('readcvsController', function($scope, $http) {

});
/*
 * ********************* unreadcvs controller ****************
 */
app.controller('unreadcvsController', function($scope, $http) {

});

/*
 * ********************* favorites controller ****************
 */
app.controller('favoritesController', function($scope, $http) {
	$scope.getMainJson = function() {
		$http.get("json/myjobs.json").success(function() {
		}).success(function(data, status, headers, config) {
			$scope.jobs = data
	    }).error(function(data, status, headers, config) {
	        alert("myjobs AJAX failed!");
	    });
	}

});
/*
 * ********************* resume controller ****************
 */
app.controller('resumeController', function($scope, $http,$location) {
	var path = $location.path().split('/')[3];
	$http.get("json/resume.json").success(function() {
	}).success(function(data, status, headers, config) {
		$scope.user = data[path][0];
    }).error(function(data, status, headers, config) {
        alert("users AJAX failed!");
    });
});


/*
 * ********************* DIRECTIVES ****************
 */
app.directive("compileHtml", function($compile, $location) {
	return {
		link : function(scope, element) {
			var path = $location.path().split('/');
			var navigation_path = "";
			//last_path = save me the real adress to link to anchor
			var last_path ="";
			if (path.length > 1 && path[1]!=""){
				for (var i=1; i<path.length; i++){
					last_path += "/" + path[i];
					if (path[i] == "resume")
						continue;
					navigation_path+="<span> > </span><a href='#" + last_path + "'>" + path[i] + "</a>";
				}
			}
			element.html($compile("<a href='#/'>Homepage</a>" + navigation_path)(scope));
		}
	}
});

/*
 * $("input").keypress(function(e) { if (e.which == 13 &&
 * $(this).hasClass('input') ) { $scope.loginSystem(); return false; } });
 */
