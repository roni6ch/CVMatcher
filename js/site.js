/** **********************************ANGULAR*************************************** */

var app = angular.module('cvmatcherApp', ["ngRoute", 'infinite-scroll']);

app.config(function ($routeProvider) {
    $routeProvider
    // employer
        .when('/', {
            templateUrl: 'googleSignIn.html',
            controller: 'googleSignInController'
        })
        .when('/usersLogin', {
            templateUrl: 'usersLogin.html',
            controller: 'usersLoginController'
        }).when('/myjobs', {
        templateUrl: 'employer/myjobs.html',
        controller: 'myjobsController'
    }).when('/Candidates/:_id', {
        templateUrl: 'employer/candidates.html',
        controller: 'candidatesController'
    }).when('/Archive/Candidates/:_id', {
        templateUrl: 'employer/candidates.html',
        controller: 'candidatesController'
    }).when('/Candidates/:id/resume/:_id', {
        templateUrl: 'employer/resume.html',
        controller: 'resumeController'
    }).when('/resume/:id', {
        templateUrl: 'employer/resume.html',
        controller: 'resumeController'
    }).when('/Archive', {
        templateUrl: 'employer/archive.html',
        controller: 'archiveController'
    }).when('/job/:_id', {
        templateUrl: 'employer/job.html',
        controller: 'jobController'
    }).when('/jobParameters/:_id', {
        templateUrl: 'employer/jobparameters.html',
        controller: 'jobController'
    }).when('/companyProfile', {
        templateUrl: 'employer/companyprofile.html',
        controller: 'companyProfileController'
    }).when('/newJob', {
            templateUrl: 'employer/job.html',
            controller: 'newjobController'
        })
        // job seeker
        .when('/searchJobs', {
            templateUrl: 'job_seeker/searchJobs.html',
            controller: 'jobSeekerSearchJobsController'
        }).when('/searchJobs/:_id', {
        templateUrl: 'job_seeker/jobpage.html',
        controller: 'jobpagebyIDController'
    }).when('/yourjobs/:_id', {
        templateUrl: 'job_seeker/jobpage.html',
        controller: 'jobpagebyIDController'
    }).when('/yourjobs', {
        templateUrl: 'job_seeker/yourjobs.html',
        controller: 'yourjobSeekerController'
    }).when('/searchJobs/matchpage/:_id', {
        templateUrl: 'job_seeker/matchpage.html',
        controller: 'matchpageController'
    }).when('/Profile', {
        templateUrl: 'job_seeker/profile.html',
        controller: 'seekerProfileControler'
    }).when('/mycv', {
            templateUrl: 'job_seeker/mycv.html',
            controller: 'mycvController'
        })
        // Other
        .when('/About', {
            templateUrl: 'about.html'
        }).when('/Contact', {
        templateUrl: 'contact.html'
    })

}).run(function ($rootScope, $http) {
    if ($.cookie('userSignInType'))
        $rootScope.userSignInType = $.parseJSON($.cookie('userSignInType'));
    else
        $rootScope.userSignInType = "";
    $rootScope.profile = "";
    $rootScope.userProfileDetails = ""


    if ($.cookie('user'))
        $("#profileImg").attr("src", $.parseJSON($.cookie('user')).image);
});


/*
 * ********************* googleSign controller ****************
 */

app.controller('googleSignInController', function ($scope, $http, $sce, $rootScope) {

});

/*
 * ********************* usersLogin controller ****************
 */

var user;
app.controller('usersLoginController', function ($scope, $http, $sce, $rootScope) {
    $scope.userType = function (type) {
        $.cookie('userSignInType', JSON.stringify(type));
        $rootScope.userSignInType = $.parseJSON($.cookie('userSignInType'));
        if (type == 'employer') {
            location.replace("#/myjobs");
            $rootScope.userProfileDetails = profile;
        }
        else if (type == 'jobSeeker')
            location.replace("#/searchJobs");
    }

});

/*
 * ********************* JS Functions ****************
 */


$(document).ready(function () {
    $("#logo").click(function () {
        //window.location.href = 'http://cvmatcher.000space.com';
        window.location.href = '/cvmatcher/';
    });
});
var profile;
var auth2 = {};
var helper = (function () {
    return {
        onSignInCallback: function (authResult) {

            if (authResult.isSignedIn.get()) {
                $('#authOps').show('slow');
                helper.profile();
            } else {
                if (authResult['error'] || authResult.currentUser.get().getAuthResponse() == null) {
                    console.log('There was an error: ' + authResult['error']);
                }
                $('#authResult').append('Logged out');
                $('#authOps').hide('slow');
                $('#gConnect').show();
            }

        },
        /**
         * Calls the OAuth2 endpoint to disconnect the app for the user.
         */
        disconnect: function () {
            // Revoke the access token.
            auth2.disconnect();
        },

        profile: function () {
            gapi.client.plus.people.get({
                'userId': 'me'
            }).then(function (res) {
                profile = res.result;

                //set coockies of user
                var user = {
                    id: profile.id,
                    name: profile.displayName,
                    image: profile["image"].url
                }
                $.cookie('user', JSON.stringify(user));

                $("#profileImg").attr("src", $.parseJSON($.cookie('user')).image);

                location.replace("#/usersLogin");


            }, function (err) {
                var error = err.result;
            });
        }
    };
})();


/**
 * Handler for when the sign-in state changes.
 *
 * @param {boolean} isSignedIn The new signed in state.
 */
var updateSignIn = function () {
    if (auth2.isSignedIn.get()) {
        helper.onSignInCallback(gapi.auth2.getAuthInstance());

    } else {
        helper.onSignInCallback(gapi.auth2.getAuthInstance());
    }
}

/**
 * This method sets up the sign-in listener after the client library loads.
 */
function startApp() {
    gapi.load('auth2', function () {
        gapi.client.load('plus', 'v1').then(function () {
            gapi.signin2.render('signin-button', {
                scope: 'https://www.googleapis.com/auth/plus.login',
                fetch_basic_profile: false
            });
            gapi.auth2.init({
                fetch_basic_profile: false,
                scope: 'https://www.googleapis.com/auth/plus.login'
            }).then(
                function () {
                    auth2 = gapi.auth2.getAuthInstance();
                    auth2.isSignedIn.listen(updateSignIn);
                    auth2.then(updateSignIn);
                });
        });
    });
}

/**
 * ************************************************************Job
 * Seeker******************************************************
 */

/*
 * ********************* jobSeeker Search Jobs Controller ****************
 */
app.controller('jobSeekerSearchJobsController', function ($rootScope, $scope,
                                                          $sce, $http) {
    $rootScope.profile = "#/Profile";

    $scope.getMainJson = function () {
        // myjobstest.json
        /*  $http.get("json/myjobstest.json").success(function (data) {
         $scope.jobSeekerJobs = data;
         }).error(function () {
         alert("myjobstest AJAX failed!");
         });*/


        $http({
            url: 'https://cvmatcher.herokuapp.com/jobSeeker/getJobsBySector',
            method: "POST",
            data: {
                "google_user_id": "0",
                "sector": "software engineering","archive": "false"
            }
        })
            .then(function (data) {
                    $scope.jobSeekerJobs = data.data;
                    console.log(data.data);
                },
                function (response) { // optional
                    console.log("resumeController AJAX failed!");
                });

    }

    $scope.sort = function (sort) {
        $scope.sortby = sort;
    }
    $scope.highlight = function (text, search) {
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
app.controller('jobpagebyIDController', function ($scope, $http, $location) {
    $id = $location.path().split('/');


    $http({
        url: 'https://cvmatcher.herokuapp.com/jobSeeker/getJobsBySector',
        method: "POST",
        data: {'google_user_id': "0", "sector": "software engineering"}
    })
        .then(function (data) {
                angular.forEach(data.data, function (value, key) {
                    if (value["_id"] == $id[2]) {
                        $scope.job = value;
                        var jobCircle = new ProgressBar.Circle(
                            '#job-circle-container', {
                                color: '#ee5785',
                                strokeWidth: 5,
                                fill: '#aaa'
                            });
                        angular.element("#job-circle-container>h5").html(
                            value.compatibility_level + "%");
                        jobCircle.animate(value.compatibility_level / 100);

                    }
                })
                $scope.jobPage = data.data[0];
                console.log(data.data[0]);
            },
            function (response) { // optional
                alert("jobSeekerJobs AJAX failed!");
            });

});
/*
 * ********************* yourjobs Seeker Controller ****************
 */

app.controller('yourjobSeekerController', function ($scope, $http, $sce) {
    $scope.getMainJson = function () {
console.log("yourjobSeekerController");
        $http({
            url: 'https://cvmatcher.herokuapp.com/jobSeeker/getJobsBySector',
            method: "POST",
            data: {"google_user_id": "0",
                "sector": "software engineering", "archive": "false"}
        })
            .then(function (data) {
                    $scope.jobSeekerJobs = data.data;
                    console.log(data.data);
                },
                function (response) { // optional
                    alert("jobSeekerJobs AJAX failed!");
                });


    }
    $scope.sort = function (sort) {
        $scope.sortby = sort;
    }
    $scope.highlight = function (text, search) {
        if (!search) {
            return $sce.trustAsHtml(text);
        }
        return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'),
            '<span class="highlighted">$&</span>'));
    };
    $scope.rating = function (rateNumber) {
        $scope.user["stars"] = rateNumber;
    }

});

/*
 * ********************* Job Seeker Profile Page Controller ****************
 */
app
    .controller(
        'seekerProfileControler',
        function ($scope, $http, $compile) {


            $scope.addExperience = function () {
                angular
                    .element(".parseExperience")
                    .append(
                        '<input type="text" required class="form-control" id="experience" name="experience" placeholder="Example: Java"> <select class="form-control" name="address" id="years"><option>0 No-Experience</option><option>1-2 Years</option><option>3-4 Years</option><option>5+ Years</option></select>');
            }

            $scope.addEducation = function () {
                var divTemplate = '<li><div class="timeline-badge" ng-click="addEducation()"><i class="fa fa-plus"></i></div><div class="timeline-panel"><div class="timeline-heading"><h4 class="timeline-title"><input type="text" placeholder="please write Education Experience"/></h4><p><small class="text-muted"><input type="text"placeholder="please type year"/></small></p></div><div class="timeline-body"><p><div class="form-group"><label for="content">Content:</label><textarea class="form-control" rows="3" name="content" id="content" required></textarea></div></p></div></div></li>';
                var temp = $compile(divTemplate)($scope);
                angular.element(".timeline").append(temp);

            }
            $scope.addEmployment = function () {
                var divTemplate = '<li class="timeline-inverted"><div class="timeline-badge" ng-click="addEmployment()"><i class="fa fa-plus"></i></div><div class="timeline-panel"><div class="timeline-heading"><h4 class="timeline-title"><input type="text" placeholder="please write Education Experience"/></h4><p><small class="text-muted"><input type="text"placeholder="please type year"/></small></p></div><div class="timeline-body"><p><div class="form-group"><label for="content">Content:</label><textarea class="form-control" rows="3" name="content" id="content" required></textarea></div></p></div></div></li>';
                var temp = $compile(divTemplate)($scope);
                angular.element(".timeline").append(temp);
            }
        })

/*
 * ********************* Match Page Controller ****************
 */
app
    .controller(
        'matchpageController',
        function ($scope, $http) {

            $scope.getMainJson = function () {
                // myjobstest.json
                $http
                    .get("json/resume.json")
                    .success(
                        function (data) {
                            angular
                                .forEach(
                                    data,
                                    function (value, key) {
                                        if (value[0]["id"] == '1') {
                                            var userCircle = new ProgressBar.Circle(
                                                '#user-container',
                                                {
                                                    color: '#ee5785',
                                                    strokeWidth: 5,
                                                    fill: '#aaa'
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
                    function (data) {
                        angular
                            .forEach(
                                data,
                                function (value, key) {
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
                color: '#57b7ee',
                strokeWidth: 5,
                fill: '#e6e6e6'
            });
            var circle2 = new ProgressBar.Circle('#circle-container2',
                {
                    color: '#6c57ee',
                    strokeWidth: 5,
                    fill: '#aaa'
                });
            var circle3 = new ProgressBar.Circle('#circle-container3',
                {
                    color: '#be57ee',
                    strokeWidth: 5,
                    fill: '#e6e6e6'
                });
            var circle4 = new ProgressBar.Circle('#circle-container4',
                {
                    color: '#ee5785',
                    strokeWidth: 5,
                    fill: '#aaa'
                });

            circle.animate(0.7, function () {
                circle.animate(0.0, function () {
                    circle.animate(0.7);
                })
            })
            circle2.animate(0.2, function () {
                circle2.animate(0.0, function () {
                    circle2.animate(0.2);
                })
            })
            circle3.animate(0.5, function () {
                circle3.animate(0.0, function () {
                    circle3.animate(0.5);
                })
            })
            circle4.animate(0.9, function () {
                circle4.animate(0.0, function () {
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
        function ($scope, $http) {


            $scope.parseExperience = function () {
                // TODO: ajax to API parse and for loop into
                // ".experience > section"
                angular.element(".experience").removeClass("hidden");
                angular.element(".experienceBeforeParse").addClass(
                    "hidden");
            }

            $scope.addExperience = function () {
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

app.controller('myjobsController', function ($rootScope, $scope, $http, $sce) {

    $rootScope.profile = "#/companyProfile";
    $scope.getMainJson = function () {
        $http({
            url: 'https://cvmatcher.herokuapp.com/employer/getJobsBySector',
            method: "POST",
            data: {'google_user_id': "0", "sector": "software engineering", "archive": false}
        })
            .then(function (data) {
                    $scope.myjobs = data.data;
                    console.log(data.data);
                },
                function (response) { // optional
                    console.log("myjobsController AJAX failed!");
                });

    }
    $scope.sort = function (sort) {
        $scope.sortby = sort;
    }

    $scope.highlight = function (text, search) {
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
app.controller('archiveController', function ($scope, $http, $sce) {
    $scope.getMainJson = function () {
        // myjobstest.json
        $http.get("json/myjobstest.json").success(function () {
        }).success(function (data, status, headers, config) {
            $scope.myjobs = data;
        }).error(function (data, status, headers, config) {
            alert("myjobstest AJAX failed!");
        });


    }
    $scope.highlight = function (text, search) {
        if (!search) {
            return $sce.trustAsHtml(text);
        }
        return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'),
            '<span class="highlighted">$&</span>'));
    };

    $scope.sort = function (sort) {
        $scope.sortby = sort;
    }
});

/*
 * ********************* company Profile controller ****************
 */
app.controller('companyProfileController',
    function ($scope, $http, $location, $sce) {
        $http({
            url: 'https://cvmatcher.herokuapp.com/getUser',
            method: "POST",
            data: {"google_user_id":"1",
                "user_type":"Employer"}
        })
            .then(function (data) {
                    $scope.companyProfile = data.data;
                console.log(data.data[0])
                },
                function (response) { // optional
                    console.log("companyProfileController AJAX failed!");
                });
    });
/*
 * ********************* Candidates controller ****************
 */
app.controller('candidatesController',
    function ($scope, $http, $location, $sce) {
        $id = $location.path().split('/');
        $scope.jobId = $id[2];
        var candidates = [];
        $scope.unreadCvs = function () {
            $http({
                url: 'http://localhost:8000/employer/getUnreadCvsForJob',
                method: "POST",
                data: {'google_user_id': "0", "job_id": $scope.jobId}
            })
                .then(function (data) {
                        angular.forEach(data.data, function (value, key) {
                            candidates.push(data.data[key][0]);
                        });
                        $scope.candidates = data.data;
                        console.log(data.data);
                    },
                    function (response) { // optional
                        console.log("getUnreadCvsForJob AJAX failed!");
                    });
        }
        $scope.likedCvs = function () {
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getRateCvsForJob',
                method: "POST",
                data: {'google_user_id': "1", "job_id": "56edd261e4b0fd187fd7acef",
                    "current_status":"liked"}
            })
                .then(function (data) {
                        angular.forEach(data.data, function (value, key) {
                            candidates.push(data.data[key][0]);
                        });
                        $scope.likeCandidates = data.data;
                        console.log(data.data);
                    },
                    function (response) { // optional
                        console.log("getUnreadCvsForJob AJAX failed!");
                    });
        }
        $scope.unlikeCvs = function () {
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getRateCvsForJob',
                method: "POST",
                data: {
                    "google_user_id": "1",
                    "job_id": "56eddb62e4b0fd187fd7ad5f",
                    "current_status": "unliked"
                }
            })
                .then(function (data) {
                        angular.forEach(data.data, function (value, key) {
                            candidates.push(data.data[key][0]);
                        });
                        $scope.unlikeCandidates = data.data;
                        console.log(data.data);
                    },
                    function (response) { // optional
                        console.log("getUnreadCvsForJob AJAX failed!");
                    });
        }
        $scope.favoritesCvs = function () {

            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getFavoriteCvs',
                method: "POST",
                data: {
                    "google_user_id": "1",
                    "job_id": "56edd261e4b0fd187fd7acef"
                }
            })
                .then(function (data) {
                        angular.forEach(data.data, function (value, key) {
                            candidates.push(data.data[key][0]);
                        });
                        $scope.favoritesCandidates = data.data;
                        console.log(data.data);
                    },
                    function (response) { // optional
                        console.log("getUnreadCvsForJob AJAX failed!");
                    });
        }


        $scope.highlight = function (text, search) {
            if (!search) {
                return $sce.trustAsHtml(text);
            }
            return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'),
                '<span class="highlighted">$&</span>'));
        };

        $scope.sort = function (sort) {
            $scope.sortby = sort;
        }

        $scope.addCandidateToFavorites = function (index, candidate) {
            // TODO: SEND TO DB THE CANDIDATE TO FAVORITE / UNFAVORITE
            if (angular.element("#candidateStar-" + index).hasClass(
                    "fa fa-star fa-2x"))
                angular.element("#candidateStar-" + index).removeClass(
                    "fa fa-star fa-2x").addClass("fa fa-star-o fa-2x");
            else
                angular.element("#candidateStar-" + index).removeClass(
                    "fa fa-star-o fa-2x").addClass("fa fa-star fa-2x");
        }
        $scope.addCandidateToLike = function (index, candidate) {
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
    function ($scope, $http, $location, $timeout) {
        var path = $location.path().split('/')[4];
        $scope.getUserJson = function () {
            /* $http.get("json/resume.json").success(
             function (data, status, headers, config) {
             angular.forEach(data, function (value, key) {

             if (value[0].id == path) {
             for ($i = 1; $i <= value[0].stars; $i++)
             angular.element(
             "#rating-" + $i + " + label")
             .css("background-position",
             "0 0");
             $scope.user = value[0];
             }
             });

             }).error(function (data, status, headers, config) {
             alert("users AJAX failed!");
             });*/

            $http({
                url: 'http://localhost:8000/jobSeeker/getJobsBySector',
                method: "POST",
                data: {
                    "google_user_id": "0",
                    "sector": "software engineering"
                }
            })
                .then(function (data) {
                        $scope.user = data.data[0];
                        console.log(data.data[0]);
                    },
                    function (response) { // optional
                        console.log("resumeController AJAX failed!");
                    });
        }

        $scope.rating = function (rateNumber) {
            $scope.user["stars"] = rateNumber;
        }

        $scope.addCandidateToFavorites = function (candidate) {
            // TODO: SEND TO DB THE CANDIDATE TO FAVORITE / UNFAVORITE
            if (angular.element("#candidateStar").hasClass(
                    "fa fa-star fa-2x"))
                angular.element("#candidateStar").removeClass(
                    "fa fa-star fa-2x").addClass("fa fa-star-o fa-2x");
            else
                angular.element("#candidateStar").removeClass(
                    "fa fa-star-o fa-2x").addClass("fa fa-star fa-2x");
        }
        $scope.addCandidateToLikeUnlike = function (candidate, likeORunlike) {
            // TODO: SEND TO DB THE CANDIDATE TO LIKE / DISLIKE
            if (likeORunlike == 'like') {
                if (angular.element("#candidateLike")
                        .hasClass("fa-thumbs-o-up"))
                    angular.element("#candidateLike").removeClass(
                        "fa-thumbs-o-up").addClass("fa-thumbs-up");
                else
                    angular.element("#candidateLike").removeClass(
                        "fa-thumbs-up").addClass("fa-thumbs-o-up");
                $(".starModal").click();
            }
            if (likeORunlike == 'unlike') {
                if (angular.element("#candidateUnLike").hasClass(
                        "fa-thumbs-o-up"))
                    angular.element("#candidateUnLike").removeClass(
                        "fa-thumbs-o-up").addClass("fa-thumbs-up");
                else
                    angular.element("#candidateUnLike").removeClass(
                        "fa-thumbs-up").addClass("fa-thumbs-o-up");
                $(".leftModal").click();
            }
        }

        $scope.bringNextCandidate = function () {
            $http.get("json/resume.json").success(function () {
            }).success(function (data, status, headers, config) {
                angular.forEach(data, function (value, key) {
                    // TODO: REMOVE THE LAST ID FROM UNREAD IN
                    // THE DB TO -> FAVORITES OR READ'CVS,
                    // BECAUSE I DONT WANT OT ANYMORE
                    $scope.user = data[key][0];

                    //remove like unlike clicks view
                    angular.element("#candidateLike").removeClass(
                        "fa-thumbs-up").addClass("fa-thumbs-o-up");
                    angular.element("#candidateUnLike").removeClass(
                        "fa-thumbs-up").addClass("fa-thumbs-o-up")

                });
            }).error(function (data, status, headers, config) {
                alert("users AJAX failed!");
            });
            $("#users").fadeOut(300, function () {
                $("#users").fadeIn(300)
            });
        }

        // if i came from Candidates's page
        if ($location.path().split('/')[1] == "Candidates") {
            var users = document.getElementById('users');
            // create a simple instance
            // by default, it only adds horizontal recognizers
            $user = new Hammer(users);
            // SWIPE LEFT - USER
            $user.on("swipeleft", function (ev) {
                $(".leftModal").click();
            });
            // SWIPE RIGHT - USER
            $user.on("swiperight", function (ev) {
                $(".starModal").click();
            });

        }

        // circle animation
        var circle = new ProgressBar.Circle('#circle-container', {
            color: '#57b7ee',
            strokeWidth: 5,
            fill: '#e6e6e6'
        });
        var circle2 = new ProgressBar.Circle('#circle-container2', {
            color: '#6c57ee',
            strokeWidth: 5,
            fill: '#aaa'
        });
        var circle3 = new ProgressBar.Circle('#circle-container3', {
            color: '#be57ee',
            strokeWidth: 5,
            fill: '#e6e6e6'
        });
        var circle4 = new ProgressBar.Circle('#circle-container4', {
            color: '#ee5785',
            strokeWidth: 5,
            fill: '#aaa'
        });

        circle.animate(0.7, function () {
            circle.animate(0.0, function () {
                circle.animate(0.7);
            })
        })
        circle2.animate(0.2, function () {
            circle2.animate(0.0, function () {
                circle2.animate(0.2);
            })
        })
        circle3.animate(0.5, function () {
            circle3.animate(0.0, function () {
                circle3.animate(0.5);
            })
        })
        circle4.animate(0.9, function () {
            circle4.animate(0.0, function () {
                circle4.animate(0.9);
            })
        })

    });

/*
 * ********************* New Job controller ****************
 */

app.controller('newjobController', function ($scope, $http, $location) {

    $("#geocomplete").geocomplete();

});

/*
 * ********************* job controller ****************
 */

app.controller('jobController', function ($scope, $http, $location) {
    $id = $location.path().split('/');
    $scope.initFormulas = function () {
        //sliders
        var sliders = $("#sliders .slider");
        var formulaJson = ["academy", "candidate_type", "locations", "requirements", "scope_of_position"];
        var i = 0;

        $http({
            url: 'http://cvmatcher.herokuapp.com/employer/getFormula',
            method: "POST",
            data: {"job_id": "56eddb62e4b0fd187fd7ad5f"}
        }).then(function (data) {
            console.log(data.data);


            $scope.formulas = data.data;
            var j = 0;
            var tmpNum = 0;
            sliders.each(function () {
                tmpNum += Number(data.data[formulaJson[j++]]);
            });
            $scope.totalSum = tmpNum;
            sliders.each(function () {
                var availableTotal = 100;
                $(this).empty().slider({
                    value: data.data[formulaJson[i++]],
                    min: 0,
                    max: 100,
                    range: "max",
                    step: 10,
                    slide: function (event, ui) {
                        // Update display to current value
                        $(this).siblings().text(ui.value);
                        var total = 0;

                        sliders.not(this).each(function () {
                            total += Number($(this).slider("option", "value"));
                        });

                        // Need to do this because apparently jQ UI
                        // does not update value until this event completes
                        total += ui.value;
                        if (total <= 100) {
                            var max = availableTotal - total;

                            // Update each slider
                            sliders.not(this).each(function () {
                                var t = $(this),
                                    value = t.slider("option", "value");
                                var sum = +Number(+max + +value);

                                t.slider("option", "max", sum)
                                    .siblings().text(value + '/' + sum);
                                t.slider('value', value);
                            });
                        }
                    }
                });
            });

        })
    }

});

/*
 * ********************* DIRECTIVES ****************
 */

// google Button
app
    .directive(
        "compileGoogle",
        function ($compile, $timeout) {
            return {
                link: function (scope, element) {
                    element
                        .html($compile(
                            '<div id="gConnect"><div id="signin-button"></div></div>')
                        (scope));
                    $.getScript("https://apis.google.com/js/client:platform.js?onload=startApp");

                }
            }
        });


// Navigation
app
    .directive(
        "compileHtml",
        function ($compile, $location, $rootScope, $http) {
            return {
                link: function (scope, element) {
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
                            else if (path[i] == "newJob")
                                path[i] = "New Job";
                            else if (path[i] == "jobParameters") {
                                $job_parameters = " Parameters";
                                continue;
                            }

                            // TODO: BRING THE JOB NAME TO CANDIDTES
                            // PAGE

                            // if the path[i] is a number that came from
                            // Candidates job page
                            if (path[i - 1] == "My Jobs" || path[i - 1] == "jobParameters" || path[i - 1] == "job"
                                || path[i - 1] == "Match Page"
                                || path[i - 1] == "Candidates"
                                || path[i - 1] == "Search Jobs") {
                                if (!isNaN(path[i])) {
                                    var pTemp = path[i];
                                    $http
                                        .get("json/myjobstest.json")
                                        .success(
                                            function (data) {
                                                // bring the job
                                                // name by id
                                                angular
                                                    .forEach(
                                                        data,
                                                        function (value,
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
                                            function (data,
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
                                            function (data) {
                                                // bring the job
                                                // name by id
                                                angular
                                                    .forEach(
                                                        data,
                                                        function (value,
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
                                            function (data,
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
app.directive('focus', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element[0].focus();
        }
    }
});

// compability in myjobs page
app.directive('circle', function ($timeout) {

    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            var circle;
            // COMPABILITY
            $timeout(function () {
                 circle = new ProgressBar.Circle("#" + attr.id, {
                    color: '#2196F3',
                    strokeWidth: 10,
                    fill: '#aaa'
                });

                scope.$watch('compability', function(newValue, oldValue) {
                    if (newValue)
                        circle.animate(newValue / 100, function () {})
                }, true);

                circle.animate(attr.compability / 100, function () {
                })
                return circle;
            });
        }
    }
});
