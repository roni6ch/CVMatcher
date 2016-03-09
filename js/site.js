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
	}).when('/unreadcvs/resume/:name', {
		templateUrl : 'resume.html',
		controller : 'resumeController'
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
	// Other
	.when('/about', {
		templateUrl : 'about.html'
	}).when('/contact', {
		templateUrl : 'contact.html'
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
		if (profile && user == 'employer')
			location.replace("#/myjobs");
		else if (profile && user == 'jobSeeker')
			location.replace("#/searchJobs");
	}
	
});

/*
 * ********************* JS Functions ****************
 */
var profile;
var auth2; // The Sign-In object.



/**
 * Calls startAuth after Sign in V2 finishes setting up.
 */
var appStart = function() {
	gapi.load('auth2', initSigninV2);
};

window.onLoadCallback = function() {
	appStart();
}


/**
 * Initializes Signin v2 and sets up listeners.
 */
var initSigninV2 = function() {
	auth2 = gapi.auth2.init({
		client_id: '407423434023-8rkttsudrfno6pombu5eu4vuc3b0n6gr.apps.googleusercontent.com',
		scope: 'profile'
	});

	// Sign in the user if they are currently signed in.
	if (auth2.isSignedIn.get() == true) {
		console.log("signed in");
		auth2.signIn();

	}
}

// Google Sign-in (new)
function onSignIn(googleUser) {
	// Useful data for your client-side scripts:
	profile = googleUser.getBasicProfile();

	// The ID token you need to pass to your backend:
	var id_token = googleUser.getAuthResponse().id_token;

	var appElement = document.querySelector('[ng-app=cvmatcherApp]');
	var appScope = angular.element(appElement).scope();
	var controllerScope = appScope.$$childHead;
	//console.log(controllerScope.user);

	console.log(controllerScope.showUsers);
	console.log(controllerScope.googleButton);
	controllerScope.showUsers = true;
	controllerScope.googleButton = false;
	controllerScope.$apply();
}
function onSignInFailure() {
	// Handle sign-in errors
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
app.controller('unreadcvsController', function($scope, $http,$timeout) {
	
	//Swipe LEFT-RIGHT
	var myManagmentJobs = document.getElementById('myManagmentJobs');
	var mySoftwareJobs = document.getElementById('mySoftwareJobs');
	var myElectrialJobs = document.getElementById('myElectrialJobs');
	var myMechanicalJobs = document.getElementById('myMechanicalJobs');

	// create a simple instance
	// by default, it only adds horizontal recognizers
	$mmj = new Hammer(myManagmentJobs);
	$ms = new Hammer(mySoftwareJobs);
	$me = new Hammer(myElectrialJobs);
	$mm = new Hammer(myMechanicalJobs);
	
	// SWIPE LEFT - Managment
	$mmj.on("panleft tap press", function(ev) {
		$swipe_id = $("#myJobs > section:last").data("id");
		$scope.jobs.managment.length -=1;
		$scope.$apply();
		$("#myManagmentJobs > section[data-id ="+$swipe_id+"]").fadeOut(300, function(){ $(this).remove();});
	});
	//SWIPE RIGHT - Managment
	$mmj.on("panright tap press", function(ev) {
		$swipe_id = $("#myJobs > section:last").data("id");
		$scope.jobs.managment.length -=1;
		$scope.$apply();
		$("#myManagmentJobs > section[data-id ="+$swipe_id+"]").fadeOut(300, function(){ $(this).remove();});
	});
	
	// SWIPE LEFT - Software
	$ms.on("panleft tap press", function(ev) {
		$swipe_id = $("#mySoftwareJobs > section:last").data("id");
		$scope.jobs.software.length -=1;
		$scope.$apply();
		$("#mySoftwareJobs > section[data-id ="+$swipe_id+"]").fadeOut(300, function(){ $(this).remove();});
	});
	//SWIPE RIGHT - Software
	$ms.on("panright tap press", function(ev) {
		$swipe_id = $("#mySoftwareJobs > section:last").data("id");
		$scope.jobs.software.length -=1;
		$scope.$apply();
		$("#mySoftwareJobs > section[data-id ="+$swipe_id+"]").fadeOut(300, function(){ $(this).remove();});
	});
	
	// SWIPE LEFT - Electrial
	$me.on("panleft tap press", function(ev) {
		$swipe_id = $("#myElectrialJobs > section:last").data("id");
		$scope.jobs.electrial.length -=1;
		$scope.$apply();
		$("#myElectrialJobs > section[data-id ="+$swipe_id+"]").fadeOut(300, function(){ $(this).remove();});
	});
	//SWIPE RIGHT - Electrial
	$me.on("panright tap press", function(ev) {
		$swipe_id = $("#myElectrialJobs > section:last").data("id");
		$scope.jobs.electrial.length -=1;
		$scope.$apply();
		$("#myElectrialJobs > section[data-id ="+$swipe_id+"]").fadeOut(300, function(){ $(this).remove();});
	});
	
	// SWIPE LEFT - Mechanical
	$mm.on("panleft tap press", function(ev) {
		$swipe_id = $("#myMechanicalJobs > section:last").data("id");
		$scope.jobs.mechanical.length -=1;
		$scope.$apply();
		$("#myMechanicalJobs > section[data-id ="+$swipe_id+"]").fadeOut(300, function(){ $(this).remove();});
		
		//TODO: REMOVE FROM DB - AND MOVE TO READ / FAVORITES
	});
	//SWIPE RIGHT - Mechanical
	$mm.on("panright tap press", function(ev) {
		$swipe_id = $("#myMechanicalJobs > section:last").data("id");
		$scope.jobs.mechanical.length -=1;
		$scope.$apply();
		$("#myMechanicalJobs > section[data-id ="+$swipe_id+"]").fadeOut(300, function(){ $(this).remove();});
		
		//TODO: REMOVE FROM DB - AND MOVE TO READ / FAVORITES
	});

	//SWIPE ICON
	$scope.swipeIcon = function(){
		$timeout(function() {
			angular.element(".tabsContent > img").fadeOut(1000, function(){ $(this).remove();});
	    }, 1000);
	};
	
	//SET TO EACH RESUME, Z-INDEX
	$scope.setZIndex = function(index)
	  {
	    return {
	      'z-index': +index,
	    }
	  };
	
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
	if ($location.path().split('/')[1] == "unreadcvs")
		{
			//im in unreadCVS page
		
		var users = document.getElementById('users');

		// create a simple instance
		// by default, it only adds horizontal recognizers
		$user = new Hammer(users);
		// SWIPE LEFT - USER
		$user.on("swipeleft tap press", function(ev) {
			$( ".starModal" ).click();
			  $http.get("json/resume.json").success(function() {
				}).success(function(data, status, headers, config) {
					angular.forEach(data, function(value, key) {
							//TODO: REMOVE THE LAST ID FROM UNREAD IN THE DB TO -> FAVORITES OR READ'CVS, BECAUSE I DONT WANT OT ANYMORE
							$scope.user = data[key][0];
					});
					
					
				}).error(function(data, status, headers, config) {
					alert("users AJAX failed!");
				});
			$("#users").fadeOut(300, function(){ $("#users").fadeIn(300)});
			
		});
		//SWIPE RIGHT - USER
		$user.on("swiperight tap press", function(ev) {
			$( ".starModal" ).click();
			  $http.get("json/resume.json").success(function() {
				}).success(function(data, status, headers, config) {
					angular.forEach(data, function(value, key) {
						//TODO: REMOVE THE LAST ID FROM UNREAD IN THE DB TO -> FAVORITES OR READ'CVS, BECAUSE I DONT WANT OT ANYMORE
						$scope.user = data[key][0];
					});
				}).error(function(data, status, headers, config) {
					alert("users AJAX failed!");
				});

			  $("#users").fadeOut(300, function(){ $("#users").fadeIn(300)});
		});

		//SWIPE ICON
		/*$scope.swipeIcon = function(){
			$timeout(function() {
				angular.element(".tabsContent > img").fadeOut(1000, function(){ $(this).remove();});
		    }, 1000);
		};*/
		}
	
	
	
	
	
	$http.get("json/resume.json").success(function() {
	}).success(function(data, status, headers, config) {
		$scope.user = data[path][0];
		console.log(data[path][0].name);
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
							value : 20,
							slide : function(event, ui) {
								var oldVal = angular.element("#slider" + $slider_id).slider("value");
								var newVal = ui.value;
								var difference = (newVal - oldVal);
								$slider = $(this).data("slide");
								for ($i=1;$i<6 ; $i++){
									if ($i != $slider)
										{
										var newNum = angular.element("#slider" + $i).slider("value");
										if (difference > 0)
											newNum = newNum - difference/4;
										else
											newNum = newNum + difference/4;
											
											angular.element("#amount" + $i).val(newNum);
											angular.element("#slider" + $i).slider(
													{	min : 0,
														max : 100,
														value : newNum
													}
											)
										}
								}
								
								
								
								
								
								$slider_id_amount = event.target["id"].split("slider")[1];
								angular.element("#amount" + $slider_id_amount).val(ui.value);
							}
						});
				// initialize sliders
				var sliderDoubleVal = 20;
				angular.element("#amount" + $slider_id).val(sliderDoubleVal);
			})

});

/*
 * ********************* DIRECTIVES ****************
 */

//google Button 
app.directive("compileGoogle", function($compile, $timeout) {
	return {
		link : function(scope, element) {
			element.html($compile('<div class="g-signin2" data-onsuccess="onSignIn" data-theme="dark" ng-model="googleButton" ng-show="googleButton" ng-click="showUsers=true; googleButton=false"></div>')(scope));
			$.getScript("js/platform.js");
		}
	}
});



//Navigation
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
//focus on searchBox
app.directive('focus', function() {
	return {
		restrict : 'A',
		link : function(scope, element) {
			element[0].focus();
		}
	}
});


//compability in myjobs page
app.directive('circle', function($timeout) {
	return {
		restrict : 'A',
		link : function(scope, element,attr) {
			//COMPABILITY
			 $timeout(function(){
				 	console.log(attr.compability/100);
					var circle = new ProgressBar.Circle("#"+attr.id, {
						color : '#2196F3',
						strokeWidth : 10,
						fill : '#aaa'
					});
		
					circle.animate(attr.compability/100, function() {})
					return circle;
			    });     
		}
	}
});




/*
 * $("input").keypress(function(e) { if (e.which == 13 &&
 * $(this).hasClass('input') ) { $scope.loginSystem(); return false; } });
 */
