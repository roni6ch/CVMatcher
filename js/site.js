/** **********************************ANGULAR*************************************** */

var app = angular.module('cvmatcherApp', [ "ngRoute", 'infinite-scroll' ]);

app.config(function($routeProvider) {
	$routeProvider
	// employer
	.when('/', {
		templateUrl : 'googleSignIn.html',
		controller : 'googleSignInController'
	}).when('/myjobs', {
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
	// job seeker
	.when('/searchJobs', {
		templateUrl : 'job_seeker/searchJobs.html',
		controller : 'jobSeekerSearchJobsController'
	}).when('/searchJobs/:_id', {
		templateUrl : 'job_seeker/jobpage.html',
		controller : 'jobpagebyIDController'
	}).when('/yourjobs', {
		templateUrl : 'job_seeker/yourjobs.html',
		controller : 'yourjobSeekerController'
	}).when('/matchpage', {
		templateUrl : 'job_seeker/matchpage.html',
		controller : 'matchpageController'
	})
}).run(function($rootScope, $http) {
	// call rootScope for RenderHTML later
	// myjobstest.json
	$http.get("json/myjobstest.json").success(function() {
	}).success(function(data, status, headers, config) {
		$rootScope.myjobstest = data;
	}).error(function(data, status, headers, config) {
		alert("myjobstest AJAX failed!");
	});

	$rootScope.userSignInType = "";
});

/*
 * ********************* googleSignIn controller ****************
 */
var user;
app.controller('googleSignInController', function($scope, $http, $sce) {
	$scope.userType = function(type) {
		user = type;
	}

});

/*
 * ********************* JS Functions ****************
 */
var profile;
function onSignIn(googleUser) {
	// Useful data for your client-side scripts:
	profile = googleUser.getBasicProfile();

	// The ID token you need to pass to your backend:
	var id_token = googleUser.getAuthResponse().id_token;
	if (profile && user == 'employer')
		location.replace("#/myjobs");
	else if (profile && user == 'jobSeeker')
		location.replace("#/searchJobs");
}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }

/**
 * ************************************************************Job
 * Seeker******************************************************
 */

/*
 * ********************* jobSeeker Search Jobs Controller ****************
 */
app.controller('jobSeekerSearchJobsController', function($rootScope,$scope, $http) {
	$rootScope.userSignInType = user;
	if (profile && user) {
		console.log("ID: " + profile.getId());
		console.log("Name: " + profile.getName());
		console.log("Image URL: " + profile.getImageUrl());
		console.log("Email: " + profile.getEmail());
		angular.element("#profileImg").attr("src", profile.getImageUrl());
	} else {
		// please sign in - or chek if cookie exist!
	}
	
	$scope.getMainJson = function() {
		// myjobstest.json
		$http.get("json/myjobstest.json").success(function() {
		}).success(function(data, status, headers, config) {
			$scope.jobSeekerJobs = data;
		}).error(function(data, status, headers, config) {
			alert("myjobstest AJAX failed!");
		});
	}

});

/*
 * ********************* job by Search Controller ****************
 */
app.controller('jobpagebyIDController', function($scope, $http) {
	$scope.getMainJson = function() {
		// myjobstest.json
		$http.get("json/myjobstest.json").success(function() {
		}).success(function(data, status, headers, config) {
			$scope.jobSeekerJobs = data;
		}).error(function(data, status, headers, config) {
			alert("myjobstest AJAX failed!");
		});
	}
});
/*
 * ********************* yourjobs Seeker Controller ****************
 */

app.controller('yourjobSeekerController', function($scope, $http) {
	$scope.getMainJson = function() {
		// myjobstest.json
		$http.get("json/myjobstest.json").success(function() {
		}).success(function(data, status, headers, config) {
			$scope.jobSeekerJobs = data;
			// return the current json
		}).error(function(data, status, headers, config) {
			alert("myjobstest AJAX failed!");
		});
	}
});

/*
 * ********************* Match Page Controller ****************
 */
app.controller('matchpageController', function($scope, $http) {

	// circle animation
	var circle = new ProgressBar.Circle('#circle-container', {
		color : '#57b7ee',
		strokeWidth : 5,
		fill : '#e6e6e6'
	});
	var circle2 = new ProgressBar.Circle('#circle-container2', {
		color : '#6c57ee',
		strokeWidth : 5,
		fill : '#aaa'
	});
	var circle3 = new ProgressBar.Circle('#circle-container3', {
		color : '#be57ee',
		strokeWidth : 5,
		fill : '#e6e6e6'
	});
	var circle4 = new ProgressBar.Circle('#circle-container4', {
		color : '#ee5785',
		strokeWidth : 5,
		fill : '#aaa'
	});

	circle.animate(0.7, function() {
		circle.animate(0.0, function() {
			circle.animate(0.7);
		})
	})
	circle2.animate(0.2, function() {
		circle2.animate(0.0, function() {
			circle2.animate(0.2);
		})
	})
	circle3.animate(0.5, function() {
		circle3.animate(0.0, function() {
			circle3.animate(0.5);
		})
	})
	circle4.animate(0.9, function() {
		circle4.animate(0.0, function() {
			circle4.animate(0.9);
		})
	})
});

/** ************************************************************Employer****************************************************** */

/*
 * ********************* myjobs controller ****************
 */

app.controller('myjobsController', function($rootScope,$scope, $http, $sce) {
	$rootScope.userSignInType = user;
	if (profile && user) {
		console.log("ID: " + profile.getId());
		console.log("Name: " + profile.getName());
		console.log("Image URL: " + profile.getImageUrl());
		console.log("Email: " + profile.getEmail());
		angular.element("#profileImg").attr("src", profile.getImageUrl());
	} else {
		// please sign in - or chek if cookie exist!
	}
	$scope.getMainJson = function() {
		// myjobstest.json
		$http.get("json/myjobstest.json").success(function() {
		}).success(function(data, status, headers, config) {
			$scope.myjobs = data;
		}).error(function(data, status, headers, config) {
			alert("myjobstest AJAX failed!");
		});
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
app.controller('readcvsController', function($scope, $http) {
	$scope.getMainJson = function() {
		// myjobstest.json
		$http.get("json/myjobstest.json").success(function() {
		}).success(function(data, status, headers, config) {
			$scope.myjobstest = data;
		}).error(function(data, status, headers, config) {
			alert("myjobstest AJAX failed!");
		});
	}
});
/*
 * ********************* unreadcvs controller ****************
 */
app.controller('unreadcvsController', function($scope, $http) {
	$scope.getMainJson = function() {
		// myjobs.json
		$http.get("json/myjobs.json").success(function() {
		}).success(function(data, status, headers, config) {
			$scope.jobs = data;
		}).error(function(data, status, headers, config) {
			alert("myjobs AJAX failed!");
		});
	}
});

/*
 * ********************* favorites controller ****************
 */
app.controller('favoritesController', function($scope, $http) {
	$scope.getMainJson = function() {
		// myjobs.json
		$http.get("json/myjobs.json").success(function() {
		}).success(function(data, status, headers, config) {
			$scope.jobs = data;
		}).error(function(data, status, headers, config) {
			alert("myjobs AJAX failed!");
		});
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

	// circle animation
	var circle = new ProgressBar.Circle('#circle-container', {
		color : '#57b7ee',
		strokeWidth : 5,
		fill : '#e6e6e6'
	});
	var circle2 = new ProgressBar.Circle('#circle-container2', {
		color : '#6c57ee',
		strokeWidth : 5,
		fill : '#aaa'
	});
	var circle3 = new ProgressBar.Circle('#circle-container3', {
		color : '#be57ee',
		strokeWidth : 5,
		fill : '#e6e6e6'
	});
	var circle4 = new ProgressBar.Circle('#circle-container4', {
		color : '#ee5785',
		strokeWidth : 5,
		fill : '#aaa'
	});

	circle.animate(0.7, function() {
		circle.animate(0.0, function() {
			circle.animate(0.7);
		})
	})
	circle2.animate(0.2, function() {
		circle2.animate(0.0, function() {
			circle2.animate(0.2);
		})
	})
	circle3.animate(0.5, function() {
		circle3.animate(0.0, function() {
			circle3.animate(0.5);
		})
	})
	circle4.animate(0.9, function() {
		circle4.animate(0.0, function() {
			circle4.animate(0.9);
		})
	})

});

/*
 * ********************* job controller ****************
 */

app.controller('jobController', function($scope, $http, $location) {
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
				// initialize sliders
				angular.element("#amount" + $slider_id).val(
						angular.element("#slider1").slider("value"));
			})

});

/*
 * ********************* DIRECTIVES ****************
 */

app.directive("compileGoogle", function($compile, $timeout) {
	return {
		link : function(scope, element) {
			element.html($compile('<div class="g-signin2" data-onsuccess="onSignIn" data-theme="dark"></div>')(scope));
			$.getScript("js/platform.js");
		}
	}
});

app.directive("compileHtml", function($compile, $location, $rootScope, $http) {
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
