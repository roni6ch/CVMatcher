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
	}).when('/job/:_id', {
		templateUrl : 'job.html',
		controller : 'jobController'
	}).when('/jobParameters/:_id', {
		templateUrl : 'jobparameters.html',
		controller : 'jobController'
	})
}).run(function($rootScope, $http) {
	// myjobstest.json
	$http.get("json/myjobstest.json").success(function() {
	}).success(function(data, status, headers, config) {
		$rootScope.myjobstest = data;
	}).error(function(data, status, headers, config) {
		alert("myjobstest AJAX failed!");
	});

	// myjobs.json
	$http.get("json/myjobs.json").success(function() {
	}).success(function(data, status, headers, config) {
		$rootScope.jobs = data;
	}).error(function(data, status, headers, config) {
		alert("myjobs AJAX failed!");
	});

});
/*
 * ********************* myjobs controller ****************
 */

app.controller('myjobsController', function($scope, $http, $sce, $rootScope) {
	$scope.getMainJson = function() {
		$scope.myjobs = $rootScope.myjobstest;
	}

	$scope.highlight = function(text, search) {
		if (!search) {
			return $sce.trustAsHtml(text);
		}
		return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'),
				'<span class="highlighted">$&</span>'));
	};
});

/*
 * ********************* readcvs controller ****************
 */
app.controller('readcvsController', function($scope, $http, $rootScope) {
	$scope.getMainJson = function() {
		$scope.jobs = $rootScope.myjobstest;
	}
});
/*
 * ********************* unreadcvs controller ****************
 */
app.controller('unreadcvsController', function($scope, $http, $rootScope) {
	$scope.getMainJson = function() {
		$scope.jobs = $rootScope.jobs;
	}
});

/*
 * ********************* favorites controller ****************
 */
app.controller('favoritesController', function($scope, $http, $rootScope) {
	$scope.getMainJson = function() {
		$scope.jobs = $rootScope.jobs;
	}

});
/*
 * ********************* resume controller ****************
 */
app.controller('resumeController', function($scope, $http, $location) {
	var path = $location.path().split('/')[3];
	$http.get("json/resume.json").success(function() {
	}).success(function(data, status, headers, config) {
		$scope.user = data[path][0];
	}).error(function(data, status, headers, config) {
		alert("users AJAX failed!");
	});
	
});

/*
 * ********************* job controller ****************
 */

app.controller('jobController', function($scope, $http, $location) {
	// console.log($location.path().split('/'));
	$id = $location.path().split('/');
	$http.get("json/myjobstest.json").success(function() {
	}).success(function(data, status, headers, config) {
		angular.forEach(data, function(value, key) {
			if (value["_id"] == $id[2]) {
				$scope.jobDetails = value;
			}
		});
	}).error(function(data, status, headers, config) {
		alert("users AJAX failed!");
	});

	// slider
	angular.element(".jobSlider").each(
			function() {
				$slider_id = $(this).data("id");
				angular.element("#slider" + $slider_id).slider(
						{
							orientation : "vertical",
							range : "min",
							min : 0,
							max : 100,
							value : 60,
							slide : function(event, ui) {
								$slider_id_amount = event.target["id"]
										.split("slider")[1];
								angular.element("#amount" + $slider_id_amount)
										.val(ui.value);
							}
						});
				//initialize sliders
				angular.element("#amount" +$slider_id ).val(
						angular.element("#slider1").slider("value"));
			})
	

});

/*
 * ********************* DIRECTIVES ****************
 */
app.directive("compileHtml", function($compile, $location, $rootScope) {
	return {
		link : function(scope, element) {
			var path = $location.path().split('/');
			var navigation_path = "";
			// last_path = save me the real adress to link to anchor
			var last_path = "";
			$job_parameters = "";
			if (path.length > 1 && path[1] != "") {
				for (var i = 1; i < path.length; i++) {
					last_path += "/" + path[i];
					if (path[i] == "resume" || path[i] == "job")
						continue;
					// if the path[i] is a number that came from job page
					if (!isNaN(path[i])) {
						// bring the job name by id
						angular.forEach($rootScope.myjobstest, function(value,
								key) {
							if (value["_id"] == path[i]) {
								path[i] = value["job_name"];
							}
						});
					}
					// check if im in parameters page
					
					if (path[i] == "jobParameters") {
						$job_parameters = " Parameters";
						continue;
					}
					navigation_path += "<span> > </span><a href='#" + last_path
							+ "'>" + path[i] + $job_parameters + "</a>";
				}
			}
			element
					.html($compile(
							"<a href='#/'>Homepage</a>" + navigation_path)(
							scope));
		}
	}
});
app.directive('focus', function() {
	return {
		restrict : 'A',
		link : function(scope, element) {
			element[0].focus();
		}
	}
});

/*
 * $("input").keypress(function(e) { if (e.which == 13 &&
 * $(this).hasClass('input') ) { $scope.loginSystem(); return false; } });
 */
