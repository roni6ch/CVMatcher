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
	}).when('/Candidates/:_id', {
		templateUrl : 'candidates.html',
		controller : 'candidatesController'
	}).when('/Candidates/:id/resume/:_id', {
		templateUrl : 'resume.html',
		controller : 'resumeController'
	}).when('/resume/:id', {
		templateUrl : 'resume.html',
		controller : 'resumeController'
	}).when('/Archive', {
		templateUrl : 'archive.html',
		controller : 'archiveController'
	}).when('/job/:_id', {
		templateUrl : 'job.html',
		controller : 'jobController'
	}).when('/jobParameters/:_id', {
		templateUrl : 'jobparameters.html',
		controller : 'jobController'
	}).when('/companyProfile', {
		templateUrl : 'companyprofile.html'
	}).when('/newJob', {
		templateUrl : 'job.html'
	})
	// job seeker
	.when('/searchJobs', {
		templateUrl : 'job_seeker/searchJobs.html',
		controller : 'jobSeekerSearchJobsController'
	}).when('/searchJobs/:_id', {
		templateUrl : 'job_seeker/jobpage.html',
		controller : 'jobpagebyIDController'
	}).when('/yourjobs/:_id', {
		templateUrl : 'job_seeker/jobpage.html',
		controller : 'jobpagebyIDController'
	}).when('/yourjobs', {
		templateUrl : 'job_seeker/yourjobs.html',
		controller : 'yourjobSeekerController'
	}).when('/searchJobs/matchpage/:_id', {
		templateUrl : 'job_seeker/matchpage.html',
		controller : 'matchpageController'
	}).when('/Profile', {
		templateUrl : 'job_seeker/profile.html',
		controller : 'seekerProfileControler'
	}).when('/mycv', {
		templateUrl : 'job_seeker/mycv.html',
		controller : 'mycvController'
	})
	// Other
	.when('/About', {
		templateUrl : 'about.html'
	}).when('/Contact', {
		templateUrl : 'contact.html'
	})

}).run(function($rootScope, $http) {
	$rootScope.userSignInType = "";
	$rootScope.profile = "";
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

// google - Sign-In - SignOut
var profile;
function onSignIn(googleUser) {
	// Useful data for your client-side scripts:
	profile = googleUser.getBasicProfile();

	// The ID token you need to pass to your backend:
	var id_token = googleUser.getAuthResponse().id_token;
}
function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function() {
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
app.controller('jobSeekerSearchJobsController', function($rootScope, $scope,
		$sce, $http) {
	$rootScope.userSignInType = user;
	$rootScope.profile = "#/Profile";
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
		$http.get("json/myjobstest.json").success(function(data) {
			$scope.jobSeekerJobs = data;
		}).error(function() {
			alert("myjobstest AJAX failed!");
		});
	}

	$scope.sort = function(sort) {
		$scope.sortby = sort;
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
 * ********************* job by Search Controller ****************
 */
app.controller('jobpagebyIDController', function($scope, $http, $location) {
	$id = $location.path().split('/');

	$http.get("json/myjobstest.json").success(
			function(data) {
				angular.forEach(data, function(value, key) {
					if (value["_id"] == $id[2]) {
						$scope.job = value;
						var jobCircle = new ProgressBar.Circle(
								'#job-circle-container', {
									color : '#ee5785',
									strokeWidth : 5,
									fill : '#aaa'
								});
						angular.element("#job-circle-container>h5").html(
								value.compability + "%");
						jobCircle.animate(value.compability / 100);

					}
				})
			});

});
/*
 * ********************* yourjobs Seeker Controller ****************
 */

app.controller('yourjobSeekerController', function($scope, $http, $sce) {
	$scope.getMainJson = function() {
		// myjobstest.json
		$http.get("json/myjobstest.json").success(function(data) {
			$scope.jobSeekerJobs = data;
			console.log(data);
			// return the current json
		}).error(function(data) {
			alert("myjobstest AJAX failed!");
		});
	}
	$scope.sort = function(sort) {
		$scope.sortby = sort;
	}
	$scope.highlight = function(text, search) {
		if (!search) {
			return $sce.trustAsHtml(text);
		}
		return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'),
				'<span class="highlighted">$&</span>'));
	};
	$scope.rating = function(rateNumber) {
		$scope.user["stars"] = rateNumber;
	}

});

/*
 * ********************* Job Seeker Profile Page Controller ****************
 */
app
		.controller(
				'seekerProfileControler',
				function($scope, $http) {

					$scope.addExperience = function() {
						angular
								.element(".parseExperience")
								.append(
										'<input type="text" required class="form-control" id="experience" name="experience" placeholder="Example: Java"> <select class="form-control" name="address" id="years"><option>0 No-Experience</option><option>1-2 Years</option><option>3-4 Years</option><option>5+ Years</option></select>');
					}
				})

/*
 * ********************* Match Page Controller ****************
 */
app
		.controller(
				'matchpageController',
				function($scope, $http) {

					$scope.getMainJson = function() {
						// myjobstest.json
						$http
								.get("json/resume.json")
								.success(
										function(data) {
											angular
													.forEach(
															data,
															function(value, key) {
																if (value[0]["id"] == '1') {
																	var userCircle = new ProgressBar.Circle(
																			'#user-container',
																			{
																				color : '#ee5785',
																				strokeWidth : 5,
																				fill : '#aaa'
																			});
																	angular
																			.element(
																					"#user-container>h5")
																			.html(
																					value[0]["compability"]
																							+ "%");
																	userCircle
																			.animate(value[0]["compability"] / 100);
																}
															})
										});
					}
					$http
							.get("json/formulas.json")
							.success(
									function(data) {
										angular
												.forEach(
														data,
														function(value, key) {
															angular
																	.element(
																			"#formulasAppend")
																	.append(
																			'<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: '
																					+ value
																					+ '%">'
																					+ key
																					+ ' '
																					+ value
																					+ '%</div></div>');
														})
									})

					// circle animation
					var circle = new ProgressBar.Circle('#circle-container', {
						color : '#57b7ee',
						strokeWidth : 5,
						fill : '#e6e6e6'
					});
					var circle2 = new ProgressBar.Circle('#circle-container2',
							{
								color : '#6c57ee',
								strokeWidth : 5,
								fill : '#aaa'
							});
					var circle3 = new ProgressBar.Circle('#circle-container3',
							{
								color : '#be57ee',
								strokeWidth : 5,
								fill : '#e6e6e6'
							});
					var circle4 = new ProgressBar.Circle('#circle-container4',
							{
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
 * ********************* My CV Controller ****************
 */
app
		.controller(
				'mycvController',
				function($scope, $http) {

					$scope.parseExperience = function() {
						// TODO: ajax to API parse and for loop into
						// ".experience > section"
						angular.element(".experience").removeClass("hidden");
						angular.element(".experienceBeforeParse").addClass(
								"hidden");
					}

					$scope.addExperience = function() {
						angular
								.element(".experience > section")
								.append(
										'<input type="text" required class="form-control" id="experience" name="experience" placeholder="Example: Java"> <select class="form-control" name="address" id="years"><option>0 No-Experience</option><option>1-2 Years</option><option>3-4 Years</option><option>5+ Years</option></select>');
					}
				});

/** ************************************************************Employer****************************************************** */

/*
 * ********************* myjobs controller ****************
 */

app.controller('myjobsController', function($rootScope, $scope, $http, $sce) {
	$rootScope.userSignInType = user;
	$rootScope.profile = "#/companyProfile";
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
	$scope.sort = function(sort) {
		$scope.sortby = sort;
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
 * ********************* archive controller ****************
 */
app.controller('archiveController', function($scope, $http, $sce) {
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

	$scope.sort = function(sort) {
		$scope.sortby = sort;
	}
});

/*
 * ********************* Candidates controller ****************
 */
app.controller('candidatesController',
		function($scope, $http, $location, $sce) {
			$id = $location.path().split('/');
			$scope.jobId = $id[2];
			var candidates = [];
			$http.get("json/resume.json").success(
					function(data, status, headers, config) {
						angular.forEach(data, function(value, key) {
							candidates.push(data[key][0]);
						});
						$scope.candidates = candidates;
					}).error(function(data, status, headers, config) {
				alert("resume AJAX failed!");
			});
			$scope.highlight = function(text, search) {
				if (!search) {
					return $sce.trustAsHtml(text);
				}
				return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'),
						'<span class="highlighted">$&</span>'));
			};

			$scope.sort = function(sort) {
				$scope.sortby = sort;
			}

			$scope.addCandidateToFavorites = function(index, candidate) {
				// TODO: SEND TO DB THE CANDIDATE TO FAVORITE / UNFAVORITE
				if (angular.element("#candidateStar-" + index).hasClass(
						"fa fa-star fa-2x"))
					angular.element("#candidateStar-" + index).removeClass(
							"fa fa-star fa-2x").addClass("fa fa-star-o fa-2x");
				else
					angular.element("#candidateStar-" + index).removeClass(
							"fa fa-star-o fa-2x").addClass("fa fa-star fa-2x");
			}
			$scope.addCandidateToLike = function(index, candidate) {
				// TODO: SEND TO DB THE CANDIDATE TO LIKE / DISLIKE
				if (angular.element("#candidateLike-" + index).hasClass(
						"fa-thumbs-o-up"))
					angular.element("#candidateLike-" + index).removeClass(
							"fa-thumbs-o-up").addClass("fa-thumbs-up");
				else
					angular.element("#candidateLike-" + index).removeClass(
							"fa-thumbs-up").addClass("fa-thumbs-o-up");
			}

		});

/*
 * ********************* resume controller ****************
 */
app.controller('resumeController',
		function($scope, $http, $location, $timeout) {
			var path = $location.path().split('/')[4];
			$scope.getUserJson = function() {
				$http.get("json/resume.json").success(
						function(data, status, headers, config) {
							angular.forEach(data, function(value, key) {

								if (value[0].id == path) {
									for ($i = 1; $i <= value[0].stars; $i++)
										angular.element(
												"#rating-" + $i + " + label")
												.css("background-position",
														"0 0");
									$scope.user = value[0];
								}
							});

						}).error(function(data, status, headers, config) {
					alert("users AJAX failed!");
				});
			}

			$scope.rating = function(rateNumber) {
				$scope.user["stars"] = rateNumber;
			}

			$scope.addCandidateToLike = function(candidate) {
				// TODO: SEND TO DB THE CANDIDATE TO LIKE / DISLIKE
				if (angular.element("#candidateLike")
						.hasClass("fa-thumbs-o-up"))
					angular.element("#candidateLike").removeClass(
							"fa-thumbs-o-up").addClass("fa-thumbs-up");
				else
					angular.element("#candidateLike").removeClass(
							"fa-thumbs-up").addClass("fa-thumbs-o-up");
			}
			$scope.addCandidateToUnLike = function(candidate) {
				// TODO: SEND TO DB THE CANDIDATE TO LIKE / DISLIKE
				if (angular.element("#candidateUnLike").hasClass(
						"fa-thumbs-o-up"))
					angular.element("#candidateUnLike").removeClass(
							"fa-thumbs-o-up").addClass("fa-thumbs-up");
				else
					angular.element("#candidateUnLike").removeClass(
							"fa-thumbs-up").addClass("fa-thumbs-o-up");
			}

			// if i came from unreadresume's page
			if ($location.path().split('/')[1] == "Candidates") {
				var users = document.getElementById('users');

				// create a simple instance
				// by default, it only adds horizontal recognizers
				$user = new Hammer(users);
				// SWIPE LEFT - USER
				$user.on("swipeleft", function(ev) {
					$(".starModal").click();
					$http.get("json/resume.json").success(function() {
					}).success(function(data, status, headers, config) {
						angular.forEach(data, function(value, key) {
							// TODO: REMOVE THE LAST ID FROM UNREAD IN
							// THE DB TO -> FAVORITES OR READ'CVS,
							// BECAUSE I DONT WANT OT ANYMORE
							$scope.user = data[key][0];
						});

					}).error(function(data, status, headers, config) {
						alert("users AJAX failed!");
					});
					$("#users").fadeOut(300, function() {
						$("#users").fadeIn(300)
					});

				});
				// SWIPE RIGHT - USER
				$user.on("swiperight", function(ev) {
					$(".starModal").click();
					$http.get("json/resume.json").success(function() {
					}).success(function(data, status, headers, config) {
						angular.forEach(data, function(value, key) {
							// TODO: REMOVE THE LAST ID FROM UNREAD IN
							// THE DB TO -> FAVORITES OR READ'CVS,
							// BECAUSE I DONT WANT OT ANYMORE
							$scope.user = data[key][0];
						});
					}).error(function(data, status, headers, config) {
						alert("users AJAX failed!");
					});

					$("#users").fadeOut(300, function() {
						$("#users").fadeIn(300)
					});
				});
			}

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
				angular.element("#slider" + $slider_id)
						.slider(
								{
									orientation : "vertical",
									range : "min",
									min : 0,
									max : 100,
									value : 20,
									slide : function(event, ui) {
										var oldVal = angular.element(
												"#slider" + $slider_id).slider(
												"value");
										var newVal = ui.value;
										var difference = (newVal - oldVal);
										$slider = $(this).data("slide");
										for ($i = 1; $i < 6; $i++) {
											if ($i != $slider) {
												var newNum = angular.element(
														"#slider" + $i).slider(
														"value");
												if (difference > 0)
													newNum = newNum
															- difference / 4;
												else
													newNum = newNum
															+ difference / 4;

												angular.element("#amount" + $i)
														.val(newNum);
												angular.element("#slider" + $i)
														.slider({
															min : 0,
															max : 100,
															value : newNum
														})
											}
										}

										$slider_id_amount = event.target["id"]
												.split("slider")[1];
										angular.element(
												"#amount" + $slider_id_amount)
												.val(ui.value);
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

// google Button
app
		.directive(
				"compileGoogle",
				function($compile, $timeout) {
					return {
						link : function(scope, element) {
							element
									.html($compile(
											'<div class="g-signin2" data-onsuccess="onSignIn" data-theme="dark" ng-model="googleButton" ng-show="googleButton" ng-click="showUsers=true; googleButton=false"></div>')
											(scope));
							$.getScript("js/platform.js");

						}
					}
				});

// Navigation
app
		.directive(
				"compileHtml",
				function($compile, $location, $rootScope, $http) {
					return {
						link : function(scope, element) {
							var path = $location.path().split('/');
							var navigation_path = "";
							// last_path = save me the real adress to link to
							// anchor
							var last_path = "";
							$job_parameters = "";
							if (path.length > 1 && path[1] != "") {
								for (var i = 1; i < path.length; i++) {
									last_path += "/" + path[i];
									if (path[i] == "resume" || path[i] == "job"
											|| path[i] == "Candidates")
										continue;
									if (path[i] == "myjobs")
										path[i] = "My Jobs";
									else if (path[i] == "companyProfile")
										path[i] = "Company Profile";
									else if (path[i] == "searchJobs")
										path[i] = "Search Jobs";
									else if (path[i] == "yourjobs")
										path[i] = "My Jobs";
									else if (path[i] == "mycv")
										path[i] = "My Resume";
									else if (path[i] == "matchpage")
										path[i] = "Match Page";
									else if (path[i] == "jobParameters") {
										$job_parameters = " Parameters";
										continue;
									}

									// TODO: BRING THE JOB NAME TO CANDIDTES
									// PAGE

									// if the path[i] is a number that came from
									// Candidates job page
									if (path[i - 1] == "My Jobs"
											|| path[i - 1] == "Match Page"
											|| path[i - 1] == "Candidates"
											|| path[i - 1] == "Search Jobs") {
										if (!isNaN(path[i])) {
											var pTemp = path[i];
											$http
													.get("json/myjobstest.json")
													.success(
															function(data) {
																// bring the job
																// name by id
																angular
																		.forEach(
																				data,
																				function(
																						value,
																						key) {
																					if (value["_id"] == pTemp) {
																						path[i] = value["job_name"];
																						navigation_path += "<span> > </span><a href='#"
																								+ last_path
																								+ "'>"
																								+ path[i]
																								+ $job_parameters
																								+ "</a>";

																						element
																								.html($compile(
																										"<a href='#/'>Homepage</a>"
																												+ navigation_path)
																										(
																												scope));
																					}
																				});
															})
													.error(
															function(data,
																	status,
																	headers,
																	config) {
																alert("myjobstest AJAX failed!");
															});

										}
									}
									// if the path[i] is a number that came from
									// Candidates job page to resume page
									else if (path[i - 1] == "resume") {
										if (!isNaN(path[i])) {
											var pTemp = path[i];
											$http
													.get("json/resume.json")
													.success(
															function(data) {
																// bring the job
																// name by id
																angular
																		.forEach(
																				data,
																				function(
																						value,
																						key) {
																					if (value[0].id == pTemp) {
																						path[i] = value[0].name;
																						jobSplitted = navigation_path
																								.split('<')[3]
																								.split('>')[1];
																						navigation_path = "<span> > </span><a href='#/Candidates/"
																								+ path[i - 3]
																								+ "'>"
																								+ jobSplitted
																								+ "</a> > <a href='#/Candidates/"
																								+ path[i - 3]
																								+ "/resume/"
																								+ pTemp
																								+ "'>"
																								+ path[i]
																								+ "</a>";

																						element
																								.html($compile(
																										"<a href='#/'>Homepage</a>"
																												+ navigation_path)
																										(
																												scope));
																					}
																				});
															})
													.error(
															function(data,
																	status,
																	headers,
																	config) {
																alert("resume AJAX failed!");
															});

										}
									}
									// check if im in parameters page
									else {
										navigation_path += "<span> > </span><a href='#"
												+ last_path
												+ "'>"
												+ path[i]
												+ $job_parameters + "</a>";

										element.html($compile(
												"<a href='#/'>Homepage</a>"
														+ navigation_path)(
												scope));
									}
								}
							}
						}
					}
				});
// focus on searchBox
app.directive('focus', function() {
	return {
		restrict : 'A',
		link : function(scope, element) {
			element[0].focus();
		}
	}
});

// compability in myjobs page
app.directive('circle', function($timeout) {
	return {
		restrict : 'A',
		link : function(scope, element, attr) {
			// COMPABILITY
			$timeout(function() {
				var circle = new ProgressBar.Circle("#" + attr.id, {
					color : '#2196F3',
					strokeWidth : 10,
					fill : '#aaa'
				});

				circle.animate(attr.compability / 100, function() {
				})
				return circle;
			});
		}
	}
});
