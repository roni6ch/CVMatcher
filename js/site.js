/** **********************************ANGULAR*************************************** */

var app = angular.module('cvmatcherApp', ["ngRoute", 'infinite-scroll']);

app.config(function ($routeProvider) {
    $routeProvider
    // employer
        .when('/', {
            templateUrl: 'googleSignIn.html'
        }).when('/usersLogin', {
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
    }).when('/Like/Candidates/:id/resume/:_id', {
        templateUrl: 'employer/resume.html',
        controller: 'resumeController'
    }).when('/UnLike/Candidates/:id/resume/:_id', {
        templateUrl: 'employer/resume.html',
        controller: 'resumeController'
    }).when('/Unread/:id/resume/:_id', {
        templateUrl: 'employer/resume.html',
        controller: 'resumeController'
    }).when('/resume/:id', {
        templateUrl: 'employer/resume.html',
        controller: 'resumeController'
    }).when('/Archive', {
        templateUrl: 'employer/archive.html',
        controller: 'myjobsController'
    }).when('/job/:_id', {
        templateUrl: 'employer/job.html',
        controller: 'jobController'
    }).when('/companyProfile', {
        templateUrl: 'employer/companyProfile.html',
        controller: 'companyProfileController'
    }).when('/newJob', {
            templateUrl: 'employer/job.html',
            controller: 'jobController'
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
    }).when('/Favorites', {
            templateUrl: 'job_seeker/favorites.html',
            controller: 'favoritesController'
        })


        // Other
        .when('/About', {
            templateUrl: 'about.html'
        }).when('/Contact', {
        templateUrl: 'contact.html'
    })

}).run(function ($rootScope, $http) {
    //set the header navigation
    if ($.cookie('userSignInType')) {
        $rootScope.userSignInType = $.cookie('userSignInType');
        $rootScope.user_id = $.cookie('user_id');
    }
    if ($.cookie('google_id'))
        $rootScope.google_id = $.cookie('google_id');
}).filter('highlight', function ($sce) {
    return function (text, phrase) {
        if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
            '<span class="highlighted">$1</span>')
        return $sce.trustAsHtml(text)
    }
});


/*
 * ********************* usersLogin controller ****************
 */

var user;
app.controller('usersLoginController', function ($scope, $http, $sce, $rootScope, $compile) {

    if (profile)
        $.cookie('google_id', profile.id);

    $scope.userType = function (type) {
        if (type == 'employer') {
            $rootScope.userSignInType = "employer";
            $.cookie('userSignInType', "employer");
            $.cookie('profile', "#/companyProfile");
            angular.element("#profileImg").parent().attr("href", $.cookie('profile'));
            if ($.cookie('user'))
                $("#profileImg").attr("src", $.parseJSON($.cookie('user')).image);

            if (firstTimeLogIn == true) {
                //add new user
                $http({
                    url: 'https://cvmatcher.herokuapp.com/addUser',
                    method: "POST",
                    data: {
                        "google_user_id": profile.id,
                        "first_name": profile.name.givenName,
                        "last_name": profile.name.familyName,
                        "email": "roni@gmail.com"
                    }
                }).then(function (data) {
                        console.log(data.data[0]._id);
                        $.cookie('user_id', data.data[0]._id);
                        $rootScope.user_id = data.data._id;
                    },
                    function (response) { // optional
                        console.log("addUser AJAX failed!");
                    });

                firstTimeLogIn = false;
                location.replace("#/companyProfile");
            }
            else {
                $http({
                    url: 'https://cvmatcher.herokuapp.com/getUser',
                    method: "POST",
                    data: {
                        "user_id": $.cookie('user_id')
                    }
                }).then(function (data) {
                        console.log(data);
                        $.cookie('user_id', data.data._id);
                        $rootScope.user_id = data.data._id;
                    },
                    function (response) { // optional
                        console.log("addUser AJAX failed!");
                    });

                firstTimeLogIn = false;
                location.replace("#/myjobs");
            }
        }
        else if (type == 'jobSeeker') {
            $rootScope.userSignInType = "jobSeeker";
            $.cookie('profile', "#/Profile");
            $.cookie('userSignInType', "jobSeeker");
            angular.element("#profileImg").parent().attr("href", $.cookie('profile'));
            if ($.cookie('user'))
                $("#profileImg").attr("src", $.parseJSON($.cookie('user')).image);

            if (firstTimeLogIn == true) {

                //add new user
                $http({
                    url: 'https://cvmatcher.herokuapp.com/addUser',
                    method: "POST",
                    data: {
                        "google_user_id": profile.id,
                        "first_name": profile.name.givenName,
                        "last_name": profile.name.familyName,
                        "email": "roni@gmail.com"
                    }
                }).then(function (data) {
                        console.log(data);
                        $.cookie('user_id', data.data._id);
                        $rootScope.user_id = data.data._id;
                    },
                    function (response) { // optional
                        console.log("addUser AJAX failed!");
                    });

                firstTimeLogIn = false;
                location.replace("#/Profile");
            }
            else {
                firstTimeLogIn = false;
                location.replace("#/searchJobs");
            }
        }

    }
});

/**
 * ************************************************************Job-Seeker******************************************************
 */

/*
 * ********************* jobSeeker Search Jobs Controller ****************
 */
app.controller('jobSeekerSearchJobsController', function ($rootScope, $scope, $sce, $http) {
    $scope.getMainJson = function () {
        $http({
            url: 'https://cvmatcher.herokuapp.com/jobSeeker/getJobsBySector',
            method: "POST",
            data: {
                "google_user_id": $.cookie('google_id'),
                "sector": "software engineering"
            }
        })
            .then(function (data) {
                    $scope.jobSeekerJobs = data.data;
                    console.log(data.data);
                    angular.element(".fa-pulse").hide();
                    //fix date string
                    angular.forEach(data.data, function (value, key) {
                        data.data[key].date = value.date.split("T")[0];
                    });
                },
                function (response) { // optional
                    console.log("resumeController AJAX failed!");
                });
    }
    $scope.sort = function (sort) {
        $scope.sortby = sort;
    }

})


/*
 * ********************* job page by ID Controller ****************
 */
app.controller('jobpagebyIDController', function ($scope, $http, $location) {


    $id = $location.path().split('/');
    console.log($id[2])
    console.log("jobpagebyIDController");


    $http({
        url: 'https://cvmatcher.herokuapp.com/getMatchingObject',
        method: "POST",
        data: {
            "matching_object_id": $id[2],
            "matching_object_type": "job"
        }
    })
        .then(function (data) {
                var jobCircle = new ProgressBar.Circle(
                    '#job-circle-container', {
                        color: '#ee5785',
                        strokeWidth: 5,
                        fill: '#aaa'
                    });

                $.cookie('compatibility_level', data.data[0].compatibility_level);
                angular.element(".fa-pulse").hide();
                angular.element("#job-circle-container>h5").html(
                    data.data[0].compatibility_level + "%");
                jobCircle.animate(data.data[0].compatibility_level / 100);
                $scope.jobDetails = data.data[0];
                console.log(data.data[0]);
            },
            function (response) { // optional
                alert("jobSeekerJobs AJAX failed!");
            });

});
/*
 * ********************* MY JOBS - Job Seeker Controller ****************
 */

app.controller('yourjobSeekerController', function ($scope, $http, $sce) {


    $scope.getMainJson = function () {
        console.log("yourjobSeekerController");
        $http({
            url: 'https://cvmatcher.herokuapp.com/jobSeeker/getMyJobs',
            method: "POST",
            data: {
                "google_user_id": $.cookie('google_id')
            }
        })
            .then(function (data) {
                    $scope.jobSeekerJobs = data.data;
                    console.log(data.data);
                    angular.element(".fa-pulse").hide();
                    //fix date string
                    angular.forEach(data.data, function (value, key) {
                        data.data[key].date = value.date.split("T")[0];
                    });
                },
                function (response) { // optional
                    alert("jobSeekerJobs AJAX failed!");
                });
    }

    $scope.sort = function (sort) {
        $scope.sortby = sort;
    }
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
        function ($scope, $http, $compile, $rootScope) {
            $("#geocomplete").geocomplete();
            $("[rel='popover']").popover({trigger: "hover", container: "body"});
            var userId;

            $scope.getMainJson = function () {
                console.log("seekerProfileControler");

                //job seeker Details
                $http({
                    url: 'https://cvmatcher.herokuapp.com/getUser',
                    method: "POST",
                    data: {
                        "user_id": $rootScope.user_id
                    }
                })
                    .then(function (data) {
                            $scope.jobSeeker = data.data[0];
                            console.log(data.data[0]);
                            userId = data.data[0]._id;
                            angular.element(".fa-pulse").hide();
                        },
                        function (response) { // optional
                            alert("jobSeekerJobs AJAX failed!");
                        });
                //job seeker CV
                $http({
                    url: 'https://cvmatcher.herokuapp.com/getMatchingObject',
                    method: "POST",
                    data: {
                        "matching_object_id": userId,
                        "matching_object_type": "cv"
                    }
                })
                    .then(function (data) {
                            $scope.jobSeekerCV = data.data[0];
                            if (data.length == 0 || data == undefined || data == "undefined" || data == null || data == []) {
                                $scope.addEducation('education');
                                $scope.addEducation('employment');
                            }
                            //console.log(data.data[0]);
                        },
                        function (response) { // optional
                            alert("jobSeekerJobs AJAX failed!");
                        });
            }


            var fromExperience = '<label>From<select id="experience_years" name="experience_years"class="form-control" id="sel1"><option value="no_experience">0</option><option value="2005">2005</option><option value="2006">2006</option><option value="2007">2007</option><option value="2008">2008</option><option value="2009">2009</option><option value="2010">2010</option><option value="2011">2011</option><option value="2012">2012</option><option value="2013">2013</option><option value="2014">2014</option><option value="2015">2015</option><option value="2016">2016</option></select></label>';
            var toExperience = '<label>To<select id="experience_years" name="experience_years"class="form-control" id="sel1"><option value="no_experience">0</option><option value="2005">2005</option><option value="2006">2006</option><option value="2007">2007</option><option value="2008">2008</option><option value="2009">2009</option><option value="2010">2010</option><option value="2011">2011</option><option value="2012">2012</option><option value="2013">2013</option><option value="2014">2014</option><option value="2015">2015</option><option value="2016">2016</option></select></label>';

            $scope.parseMyExperience = function () {
                //TODO: parse go here
                angular
                    .element(".parseExperienceButton").hide();
                $scope.addMoreExperience();
                angular
                    .element(".parseExperiencePlusButton").removeClass("hidden");


            }
            $scope.addMoreExperience = function () {
                angular
                    .element(".parseExperience")
                    .append(
                        '<div><input type="text" required class="form-control" id="experience" name="experience" placeholder="Example: Java">' + fromExperience + toExperience) + '</div>';
            }

            $scope.addEducation = function (type) {
                console.log("type: " + type);
                if (type == 'education') {
                    var divTemplate = '<li><div class="timeline-badge" ng-click="addEducation(' + "'education'" + ')"><i class="fa fa-plus"></i></div><div class="timeline-panel"><div class="timeline-heading">' + fromExperience + toExperience + '</div><div class="timeline-body"><p><div class="form-group"><label for="content">Content:</label><textarea class="form-control" rows="3" name="content" id="content" required></textarea></div></p></div></div></li>';
                    console.log("education");
                }
                else {
                    var divTemplate = '<li class="timeline-inverted"><div class="timeline-badge" ng-click="addEducation(' + "'employment'" + ')"><i class="fa fa-plus"></i></div><div class="timeline-panel"><div class="timeline-heading">' + fromExperience + toExperience + '</div><div class="timeline-body"><p><div class="form-group"><label for="content">Content:</label><textarea class="form-control" rows="3" name="content" id="content" required></textarea></div></p></div></div></li>';
                }
                var temp = $compile(divTemplate)($scope);
                angular.element(".timeline").append(temp);
            }
            $scope.submitUserDetails = function () {
                console.log("send form: ", $scope.jobSeeker);
                    //add more parameters to json
                    var key = 'birth_date';
                    var val = $(".birthDay").val();
                    $scope.jobSeeker[key] = val;
                    var key = 'address';
                    var val = $("#geocomplete").val();
                    $scope.jobSeeker[key] = val;
                    var key = 'phone_number';
                    var val = $(".phoneNumber").val();
                    $scope.jobSeeker[key] = val;
                    var key = 'linkedin';
                    var val = $(".linkedin").val();
                    $scope.jobSeeker[key] = val;

                    console.log("send form: ", $scope.jobSeeker);
                    $http({
                        url: 'https://cvmatcher.herokuapp.com/updateUser',
                        method: "POST",
                        data: $scope.jobSeeker
                    })
                        .then(function (data) {
                            },
                            function (response) { // optional
                                alert("jobSeeker send form AJAX failed!");
                            });
            }
            $scope.submitUserCV = function () {

                /*var jobSeekerCVsector = [];
                //scope_of_position
                $.each($(".jobSeekerCVsector input:checked"), function(){
                    jobSeekerCVsector.push($(this).val());
                });*/
                var key = 'jobSeekerCVsector';
                var val = $('.jobSeekerCVsector').find(":selected").val();



//TODO: GET THE JOB SEEKER CV
                var jobSeekerCV = {
                    "matching_object_type": "cv",
                    "date": "01/03/2016",
                    "personal_properties": {
                        "university_degree": true,
                        "degree_graduation_with_honors": true,
                        "above_two_years_experience": false,
                        "psychometric_above_680": true,
                        "multilingual": true,
                        "volunteering": true,
                        "full_army_service": true,
                        "officer": false,
                        "high_school_graduation_with_honors": true,
                        "youth_movements": true

                    },
                    "original_text": {
                        "title": null,
                        "description": null,
                        "requirements": null,
                        "history_timeline": [
                            {
                                "text": "Metro High School Ranana - An outstanding student majoring computer science . GPA 93 test.",
                                "start_year": "2004",
                                "end_year": "2006",
                                "type": "education"
                            }
                        ]
                    },
                    "sector": "software engineering",
                    "locations": [
                        "Raanana", "Haifa", "Tel Aviv"
                    ],
                    "candidate_type": ["discharged_soldiers", "no_experience", "mothers", "pensioners"],
                    "scope_of_position": ["part time", "by hours"],
                    "academy": {
                        "academy_type": ["college"],
                        "degree_name": "software engineering",
                        "degree_type": ["bsc"]
                    },
                    "sub_sector": [],
                    "formula": null,
                    "requirements": [{
                        "combination": [],
                        "compatibility_level": null,
                        "status": null,
                        "favorites": [],
                        "cvs": [],
                        "google_user_id": "104",
                        "archive": false,
                        "active": true,
                        "user": "56edc7abe4b0fd187fd7ac33"
                    }]
                }







                console.log("send form: ", $scope.jobSeekerCV);
                /* $http({
                 url: 'https://cvmatcher.herokuapp.com/addMatchingObject',
                 method: "POST",
                 data: $scope.jobSeekerCV
                 })
                 .then(function (data) {
                 },
                 function (response) { // optional
                 alert("jobSeekerJobs send form AJAX failed!");
                 });*/
            }

        });

/*
 * ********************* Match Page Controller ****************
 */
app
    .controller(
        'matchpageController',
        function ($scope, $http) {

            // circle animation
            var circle, tmpColor;
            $http({
                url: 'json/skills.json'
            })
                .then(function (data) {

                        angular.element(".fa-pulse").hide();
                        //user percentage
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
                            .html(Math.max(parseInt(data.data.total_grade), 1)
                                + "%");
                        userCircle
                            .animate(data.data.total_grade / 100);

                        //check if user passed the Match!!!
                        if (data.data.total_grade < $.cookie('compatibility_level')) {
                            console.log($.cookie('compatibility_level'));
                            angular.element(".matchResult > h2").append("Oops");
                            angular.element(".matchResult > h2 > i").addClass("fa-thumbs-down");

                            angular.element(".matchResult h3").html('You did not passed the minimum requirements');
                        }
                        else {

                            console.log($.cookie('compatibility_level'));
                            angular.element(".matchResult > h2").append("Great!");
                            angular.element(".matchResult > h2 > i").addClass("fa-thumbs-up");
                            angular.element(".matchResult h3").html('Harray!! You Passed The Minimum requirements');
                        }

                        angular.forEach(data.data.formula, function (value, key) {
                            if (key == 'requirements') {
                                angular.element("#formulasAppend").append('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: ' +
                                    value.grade + '%">' + key + ' ' + value.grade + '%</div></div>');
                            }
                            else
                                angular.element("#formulasAppend").append('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: ' +
                                    value + '%">' + key + ' ' + value + '%</div></div>');
                        });

                        var colors = ['#F74CF0', '#9F4CF7', '#4C58F7', '#4CBEF7', '#4CF7F0', '#4CF772', '#ACF74C', '#F7EB4C'];
                        var fillColors = ['#C1BFBF', '#e6e6e6'];
                        //Big circle percentages
                        angular.forEach(data.data.formula.requirements.details, function (value, key) {
                            circle = new ProgressBar.Circle('#circle-container' + (key + 1), {
                                color: colors[key],
                                strokeWidth: 5,
                                fill: fillColors[key % 2]
                            });
                            angular.element(".langsMatch").append("<span style='color:" + colors[key] + "'> | " + value.name + " = " + Math.max(parseInt(value.grade), 1) + "</span>");
                            circle.animate(value.grade / 100, function () {
                            })
                        });
                    },
                    function (response) { // optional
                        console.log("resumeController AJAX failed!");
                    });

        });

/*
 * ********************* My CV Controller ****************
 */
app
    .controller(
        'mycvController',
        function ($scope, $http) {


            angular.element(".fa-pulse").hide();
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


/*
 * ********************* Favorites Controller ****************
 */
app
    .controller(
        'favoritesController',
        function ($scope, $http) {

            angular.element(".fa-pulse").hide();
            console.log("favoritesController");
        });


/** ************************************************************Employer****************************************************** */

/*
 * ********************* myjobs controller ****************
 */

app.controller('myjobsController', function ($rootScope, $location, $scope, $http, $sce) {

    $id = $location.path().split('/');
    if ($id[1] == 'myjobs')
        $scope.jobPage = "Candidates";
    else
        $scope.jobPage = "Archive/Candidates";

    console.log($.cookie('google_id'));

    $scope.getMainJson = function () {
        $http({
            url: 'https://cvmatcher.herokuapp.com/employer/getJobsBySector',
            method: "POST",
            data: {
                "google_user_id": $.cookie('google_id'),
                "sector": "software engineering",
                "archive": "false"
            }
        })
            .then(function (data) {
                    $scope.myjobs = data.data;
                    console.log(data.data);

                    angular.element(".fa-pulse").hide();

                    //fix date string
                    angular.forEach(data.data, function (value, key) {
                        data.data[key].date = value.date.split("T")[0];
                    });


                },
                function (response) { // optional
                    console.log("myjobsController AJAX failed!");
                });

    }
    $rootScope.sort = function (sort) {
        $scope.sortby = sort;
    }

    $scope.saveJobTitle = function (jobTitle) {
        console.log(jobTitle);
        $rootScope.jobTitle = jobTitle;
    }


});


/*
 * ********************* company Profile controller ****************
 */
app.controller('companyProfileController',
    function ($scope, $http, $location, $sce, $rootScope) {
        var company = false;
        var companyId;
        console.log("user_id: " + $.cookie('user_id'));
        console.log("user_id: " + $rootScope.user_id);
        $("#geocomplete").geocomplete();

        //user details
        $http({
            url: 'https://cvmatcher.herokuapp.com/getUser',
            method: "POST",
            data: {
                "user_id": $.cookie('user_id')
            }
        })
            .then(function (data) {
                    $scope.employerProfile = data.data[0];
                    console.log(data.data[0]);
                    if (data.data[0].company) {
                        console.log("true");
                        company = true;
                        companyId = data.data[0].company;
                    }

                    angular.element(".fa-pulse").hide();
                },
                function (response) { // optional
                    console.log("companyProfileController AJAX failed!");
                });
        //company profile details


        if (company) {
            url = 'https://cvmatcher.herokuapp.com/employer/getCompany';
            $http({
                url: url,
                method: "POST",
                data: {
                    "company_id": companyId
                }
            })
                .then(function (data) {
                        $scope.companyProfile = data.data;
                        console.log(data.data);
                        angular.element(".fa-pulse").hide();
                    },
                    function (response) { // optional
                        console.log("companyProfileController AJAX failed!");
                    });
        }

        //uploadPhoto
        $(function () {
            $(":file").change(function () {
                if (this.files && this.files[0]) {
                    var reader = new FileReader();
                    reader.onload = imageIsLoaded;
                    reader.readAsDataURL(this.files[0]);
                }
            });
        });

        function imageIsLoaded(e) {
            $('#myImg').attr('src', e.target.result);
        };

        $scope.submitUserDetails = function () {
            //add more parameters to json
            var key = 'birth_date';
            var val = $(".birthDay").val();
            $scope.employerProfile[key] = val;
            var key = 'address';
            var val = $("#geocomplete").val();
            $scope.employerProfile[key] = val;
            var key = 'phone_number';
            var val = $(".phoneNumber").val();
            $scope.employerProfile[key] = val;
            var key = 'linkedin';
            var val = $(".linkedin").val();
            $scope.employerProfile[key] = val;

            //url = 'https://cvmatcher.herokuapp.com/addUser';
            console.log("send form: ", $scope.employerProfile);
            $http({
                url: 'https://cvmatcher.herokuapp.com/updateUser',
                method: "POST",
                data: $scope.employerProfile
            })
                .then(function (data) {
                    },
                    function (response) { // optional
                        alert("jobSeekerJobs send form AJAX failed!");
                    });
        }
        $scope.submitCompanyDetails = function () {
            if (!company)
                url = 'https://cvmatcher.herokuapp.com/employer/addCompany';
            else
                url = 'https://cvmatcher.herokuapp.com/employer/updateCompany';

            //push to json new key value
            var key = 'user_id';
            var val = $.cookie('user_id');

            $scope.companyProfile[key] = val;
            var key = 'logo';
            var val = 'logo';

            $scope.companyProfile[key] = val;
            console.log("send form: ", $scope.companyProfile);
            console.log(url);
            $http({
                url: url,
                method: "POST",
                data: $scope.companyProfile
            }).then(function () {
            })
        }
    });
/*
 * ********************* Candidates controller ****************
 */
app.controller('candidatesController',
    function ($scope, $http, $location, $sce, $rootScope) {
        $id = $location.path().split('/');
        $scope.jobId = $id[2];
        console.log($.cookie('google_id'));
        $scope.unreadCvs = function () {

            angular.element(".fa-pulse").show();
            $scope.candidates = '';
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getUnreadCvsForJob',
                method: "POST",
                data: {
                    "google_user_id": $.cookie('google_id'),
                    "job_id": $scope.jobId
                }
            })
                .then(function (data) {
                        $scope.candidates = data.data;
                        $rootScope.unreadCandidates = data.data;
                        console.log(data.data);

                        angular.element(".fa-pulse").hide();
                    },
                    function (response) { // optional
                        console.log("unreadCvs AJAX failed!");
                    });
        }
        $scope.likedCvs = function () {
            $scope.likeCandidates = '';

            angular.element(".fa-pulse").show();
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getRateCvsForJob',
                method: "POST",
                data: {
                    "google_user_id": $.cookie('google_id'),
                    "job_id": $scope.jobId,
                    "current_status": "liked"
                }
            })
                .then(function (data) {
                        $rootScope.likeCandidates = data.data;
                        $scope.likeCandidates = data.data;
                        console.log(data.data);
                        angular.element(".fa-pulse").hide();
                    },
                    function (response) { // optional
                        console.log("likedCvs AJAX failed!");
                    });
        }
        $scope.unlikeCvs = function () {
            angular.element(".fa-pulse").show();
            $scope.unlikeCandidates = '';
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getRateCvsForJob',
                method: "POST",
                data: {
                    "google_user_id": $.cookie('google_id'),
                    "job_id": $scope.jobId,
                    "current_status": "unliked"
                }
            })
                .then(function (data) {
                        $rootScope.unlikeCandidates = data.data;
                        $scope.unlikeCandidates = data.data;
                        console.log(data.data);
                        angular.element(".fa-pulse").hide();
                    },
                    function (response) { // optional
                        console.log("unlikeCvs AJAX failed!");
                    });
        }


        $scope.sort = function (sort) {
            $scope.sortby = sort;
        }

        $scope.addCandidateToLike = function (index, candidate, id) {
            if (angular.element("#candidateLike-" + candidate).hasClass(
                    "fa-thumbs-o-up")) {
                angular.element("#candidateLike-" + candidate).removeClass(
                    "fa-thumbs-o-up").addClass("fa-thumbs-up");
                $scope.userId = id;
                $(".starModal").click();
            }
            else {
                angular.element("#candidateLike-" + candidate).removeClass(
                    "fa-thumbs-up").addClass("fa-thumbs-o-up");
                $scope.userId = id;
                $(".leftModal").click();
            }

        }
        var stars = 0;
        $scope.rating = function (rateNumber) {
            stars = rateNumber;
        }
        $scope.bringNextCandidate = function (type, description, id) {
            console.log(id);
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/updateRateCV',
                method: "POST",
                data: {
                    "matching_object_id": id,
                    "status": {
                        "current_status": type,
                        "stars": stars,
                        "description": description
                    }
                }
            });
        }

    });

/*
 * ********************* resume controller ****************
 */
var candidateId;
app.controller('resumeController',
    function ($scope, $http, $location, $timeout, $rootScope) {
        $id = $location.path().split('/');
        console.log("resumeController");
        console.log("cv id: " + $id[5]);
        var id;
        if ($id[5])
            id = $id[5];
        else
            id = $id[4];
        $scope.getUserJson = function () {

            $http({
                url: 'https://cvmatcher.herokuapp.com/getMatchingObject',
                method: "POST",
                data: {
                    "matching_object_id": id,
                    "matching_object_type": "cv"
                }
            })
                .then(function (data) {
                        $scope.user = data.data[0];
                        console.log(data.data[0])
                        angular.element(".fa-pulse").hide();
                        console.log($id[1]);
                        if ($id[1] == "Unread") {
                            $scope.user["stars"] = 0;
                        }
                    },
                    function (response) { // optional
                        console.log("resumeController AJAX failed!");
                    });
        }

        $scope.rating = function (rateNumber) {
            $scope.user["stars"] = rateNumber;
        }


        $scope.addCandidateToLikeUnlike = function (candidate, likeORunlike) {
            candidateId = candidate;
            if (likeORunlike == 'liked') {
                if (angular.element("#candidateLike")
                        .hasClass("fa-thumbs-o-up"))
                    angular.element("#candidateLike").removeClass(
                        "fa-thumbs-o-up").addClass("fa-thumbs-up");
                else
                    angular.element("#candidateLike").removeClass(
                        "fa-thumbs-up").addClass("fa-thumbs-o-up");
                $(".starModal").click();
            }
            if (likeORunlike == 'unliked') {
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
        var candidates;
        $scope.bringNextCandidate = function (type, description) {
            var url;
            if ($id[1] == 'Like') {
                candidates = $rootScope.likeCandidates;
                delete candidateslike
                url = 'https://cvmatcher.herokuapp.com/employer/updateRateCV';
            }
            else if ($id[1] == 'UnLike') {
                candidates = $rootScope.unlikeCandidates;
                url = 'https://cvmatcher.herokuapp.com/employer/updateRateCV';
            }
            else {
                //i came from UnreadCVS
                candidates = $rootScope.unreadCandidates;
                url = 'https://cvmatcher.herokuapp.com/employer/rateCV';
            }
            //add user to like and rate stars
            $http({
                url: url,
                method: "POST",
                data: {
                    "matching_object_id": candidateId,
                    "status": {
                        "current_status": type,
                        "stars": $scope.user["stars"],
                        "description": description
                    }
                }
            });

            var nextCandidate;
            angular.forEach(candidates, function (value, key) {
                if (value._id == candidateId) {
                    console.log(key);
                    delete candidates[key];
                }
                else
                    nextCandidate = value._id;
            })
            console.log(candidates);

            //bring next candidate
            if (!nextCandidate) {
                console.log("no more candidates!");
                angular.element(".noMoreCandidates").show();
                angular.element("#users").hide();

            }
            else {
                $http({
                    url: 'https://cvmatcher.herokuapp.com/getMatchingObject',
                    method: "POST",
                    data: {
                        "matching_object_id": nextCandidate,
                        "matching_object_type": "cv"
                    }
                })
                    .then(function (data) {
                        $scope.user = data.data[0];
                        console.log(data.data[0]);
                        if ($id[1] == "Unread") {
                            $scope.user["stars"] = 0;
                        }

                        //remove like unlike clicks view
                        angular.element("#candidateLike").removeClass(
                            "fa-thumbs-up").addClass("fa-thumbs-o-up");
                        angular.element("#candidateUnLike").removeClass(
                            "fa-thumbs-up").addClass("fa-thumbs-o-up")
                    });
                $("#users").fadeOut(300, function () {
                    $("#users").fadeIn(300);
                });
            }
        }

        // if i came from Unread page
        if ($id[1] == "Unread") {
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
        if ($id[1] == "Candidates") {
            var users = document.getElementById('users');
            // create a simple instance
            // by default, it only adds horizontal recognizers
            $user = new Hammer(users);
            // SWIPE LEFT - USER
            $user.on("swipeleft", function (ev) {
                $(".bringNextCandidate").click();
            });
            // SWIPE RIGHT - USER
            $user.on("swiperight", function (ev) {
                $(".bringNextCandidate").click();
            });

        }


        // circle animation
        var circle, tmpColor;
        $http({
            url: 'json/skills.json'
        })
            .then(function (data) {
                    console.log(data);
                    var colors = ['#F74CF0', '#9F4CF7', '#4C58F7', '#4CBEF7', '#4CF7F0', '#4CF772', '#ACF74C', '#F7EB4C'];
                    var fillColors = ['#C1BFBF', '#e6e6e6'];
                    //Big circle percentages
                    angular.forEach(data.data.formula.requirements.details, function (value, key) {
                        circle = new ProgressBar.Circle('#circle-container' + (key + 1), {
                            color: colors[key],
                            strokeWidth: 5,
                            fill: fillColors[key % 2]
                        });
                        angular.element(".resumeSkillsBox").append("<span style='color:" + colors[key] + "'> | " + value.name + " = " + Math.max(parseInt(value.grade), 1) + "</span>");
                        circle.animate(value.grade / 100, function () {
                        })
                    });
                    angular.element(".resumeSkillsBox").append("<h2>Total Skills Grade: " + Math.max(parseInt(data.data.total_grade), 1) + "</h2>")
                },
                function (response) { // optional
                    console.log("resumeController AJAX failed!");
                });

    });

/*
 * ********************* Job controller ****************
 */

app.controller('jobController', function ($scope, $http, $location) {
    $id = $location.path().split('/')[1];
    $("#geocomplete").geocomplete();
    angular.element('.selectpicker').selectpicker();

    $jobId = $location.path().split('/')[2];
    //edit job - get AJAX details
    $scope.getJobJson = function () {

        if ($id == 'job') {
            $http({
                url: 'https://cvmatcher.herokuapp.com/getMatchingObject',
                method: "POST",
                data: {
                    "matching_object_id": $jobId,
                    "matching_object_type": "job"
                }
            })
                .then(function (data) {
                    $scope.jobDetails = data.data[0];
                    console.log(data.data[0]);

                    angular.element(".fa-pulse").hide();


                    //SLIDERS
                    var sliders = $("#sliders .slider");
                    var formulaJson = ["academy", "candidate_type", "locations", "requirements", "scope_of_position"];
                    var i = 0;
                    $scope.formula = data.data[0].formula;
                    var j = 0;
                    var tmpNum = 0;
                    sliders.each(function () {
                        tmpNum += Number(data.data[0].formula[formulaJson[j++]]);
                    });
                    $scope.totalSum = tmpNum;
                    sliders.each(function () {
                        var availableTotal = 100;
                        $(this).empty().slider({
                            value: data.data[0].formula[formulaJson[i++]],
                            min: 0,
                            max: 100,
                            range: "min",
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

                });
        }
        //im in newJob - init parameters
        else {

            //setTimeout for 1 mil sec because there is a problem loading js after angular
            setTimeout(function () {
                angular.element(".fa-pulse").hide();
                var sliders = $("#sliders .slider");
                sliders.each(function () {
                    var availableTotal = 100;
                    $(this).slider({
                        value: 0,
                        min: 0,
                        max: 100,
                        range: "min",
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
                    })
                })
            }, 100);
        }
    }


    $http.get("json/languages.json").success(function (data) {
        $scope.langs = data;
        //<div class='Item'><input type="text" value=""/><select class="form-control"><h3>Prioroty: </h3></div>
    });


    //send form
    $scope.submitForm = function () {
        console.log("posting data....");
        console.log($scope.jobDetails);

        var academy = [];
        //scope_of_position
        $.each($(".academy input:checked"), function(){
         academy.push($(this).val());
        });
        var scope_of_position = [];
        //scope_of_position
        $.each($(".scope_of_position input:checked"), function(){
            scope_of_position.push($(this).val());
        });
        var candidate_type = [];
        //scope_of_position
        $.each($(".candidate_type input:checked"), function(){
            candidate_type.push($(this).val());
        });
        console.log(candidate_type);



        var addNewJob ={
            "matching_object_type": "job",
            "google_user_id": $.cookie('google_id'),
            "date": "",
            "personal_properties": null,
            "original_text": {
                "title":$( ".jobName" ).val(),
                "description":$( "#description" ).html(),
                "requirements":$( "#requirements" ).html(),
                "history_timeline":""
            },
            "sector":"software engineering",
            "locations":$( "#geocomplete" ).val(),
            "candidate_type":candidate_type,
            "scope_of_position":scope_of_position,
            "academy": {
                "academy_type":academy,
                "degree_name":"software engineering",
                "degree_type":"bsc"
            },
            "sub_sector":$scope.jobDetails.sub_sector,
            "formula": {
                "locations":$( ".locationsSlider" ).text().split("/")[0],
                "candidate_type":$( ".candidate_typeSlider" ).text().split("/")[0],
                "scope_of_position":$( ".scope_of_positionSlider" ).text().split("/")[0],
                "academy":$( ".academySlider" ).text().split("/")[0],
                "requirements":$( ".requirementsSlider" ).text().split("/")[0]
            },
            "requirements": "",
            "compatibility_level":$scope.compability,
            "status": null,
            "favorites": [],
            "cvs": [],
            "archive": true,
            "active": false,
            "user":$.cookie('user_id')

        }

        console.log(addNewJob);

       // console.log(addNewJob);
        $http({
            url: 'https://cvmatcher.herokuapp.com/addMatchingObject',
            method: "POST",
           // data: $scope.jobDetails
            data: addNewJob
        })
            .then(function (data) {
                },
                function (response) { // optional
                    alert("jobSeekerJobs send form AJAX failed!");
                });
        //$http.post('http://cvmatcher.herokuapp.com/employer/setNewJob', JSON.stringify($scope.form, ,employerId:$id, time:dformat)).success(function(){/*success callback*/});
    };


    $scope.priority = function () {
    }

    //click on parse Orange button
    $scope.parseExperience = function () {
        // TODO: ajax to API parse and for loop into
        angular.element(".operators").removeClass("hidden");
        angular.element(".experienceBeforeParse").addClass(
            "hidden");
        angular.element(".requirements").addClass(
            "hidden");

    }

    $("#addOr").click(function () {
        $('').appendTo((".operators"));
        $("#addOr").hide();
    });


    angular.element("#addmust").click(function () {
        $('').appendTo((".operators"));
        angular.element("#Page2").removeClass("hidden");
        angular.element(".operators > h3").show();
        $("#addmust").hide();
    });


    angular.element("#NewItem").click(function () {
        var element = $("<div class='Item'><input type='text' placeHolder='Please type Language'/><select class='form-control' name='years'><option>0 No-Experience</option><option>1-2 Years</option><option>3-4 Years</option><option>5+ Years</option></select><input type='text' class='form-control' value='0'/><h3>Priority: </h3></div>");
        $("#Items").append(element);
        element.hide().slideDown(500);
    });

    angular.element('body').on('click', '#NewItem2', function () {
        var element = $("<div class='Item'><input type='text' placeHolder='Please type Language'/><select class='form-control' name='years'><option>0 No-Experience</option><option>1-2 Years</option><option>3-4 Years</option><option>5+ Years</option></select><input type='text' class='form-control' value='0'/><h3>Priority: </h3></div>");
        $("#Items2").append(element);
        element.hide().slideDown(500);
    });


    $scope.mustOrAdv = function (index) {
        if (angular.element("#mustOrAdv" + index).hasClass("toggleAdv")) {
            angular.element("#mustOrAdv" + index).removeClass("toggleAdv");
            angular.element("#mustOrAdv" + index).addClass("toggleMust");
            angular.element("#mustOrAdvCheckBox" + index).hide();
        }
        else {
            angular.element("#mustOrAdv" + index).removeClass("toggleMust");
            angular.element("#mustOrAdv" + index).addClass("toggleAdv");
            angular.element("#mustOrAdvCheckBox" + index).show();
        }
    }


    var itemCount = 3;
    var awaitingCopy = false;
    init();
    function init() {
        angular.element("#Items").sortable({
            revert: true,
            placeholder: "ItemPlaceHolder",
            opacity: 0.6,
            start: StartDrag,
            stop: StopDrag
        });
        angular.element("#Items2").sortable({
            revert: true,
            placeholder: "ItemPlaceHolder",
            opacity: 0.6,
            start: StartDrag2,
            stop: StopDrag2
        });

        angular.element("#CopyItem").droppable({
            hoverClass: "CopyItemActive",
            drop: function (event, ui) {
                awaitingCopy = true;
            }
        });
        angular.element("#CopyItem2").droppable({
            hoverClass: "CopyItemActive",
            drop: function (event, ui) {
                awaitingCopy = true;
            }
        });
        function CopyItem(element) {
            if (element.hasClass("mustItem") || element.hasClass("advantageItem") || element.hasClass("orItem")) {
                return;
            }
            awaitingCopy = false;
            var clone = element.clone();
            $("#Items").append(clone);
            clone.hide().slideDown(500);
        }

        function StartDrag() {
            $("#NewItem").hide();
            $("#CopyItem").show();
        }

        function StopDrag(event, ui) {
            if (awaitingCopy) {
                $(this).sortable('cancel');
                CopyItem($(ui.item));
            }
            $("#NewItem").show();
            $("#CopyItem").hide();
        }

        function CopyItem2(element) {
            if (element.hasClass("mustItem") || element.hasClass("advantageItem") || element.hasClass("orItem")) {
                return;
            }
            awaitingCopy = false;
            var clone = element.clone();
            $("#Items2").append(clone);
            clone.hide().slideDown(500);
        }

        function StartDrag2() {
            $("#NewItem2").hide();
            $("#CopyItem2").show();
        }

        function StopDrag2(event, ui) {
            if (awaitingCopy) {
                $(this).sortable('cancel');
                CopyItem2($(ui.item));
            }
            $("#NewItem2").show();
            $("#CopyItem2").hide();
        }

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
                            '<div id="gConnect"><button id="signin-button" data-scope="email"> </button></div>')(scope));
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
                    var job_parameters = "";
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
                                job_parameters = " Parameters";
                                continue;
                            }


                            // if the path[i] is a number that came from
                            // Candidates job page
                            var likeOrUnlikeTab;
                            if (path[i - 1] == "Like")
                                likeOrUnlikeTab = Like;
                            if (path[i - 1] == "My Jobs" || path[i - 1] == "jobParameters" || path[i - 1] == "job"
                                || path[i - 1] == "Match Page"
                                || path[i - 1] == "Candidates"
                                || path[i - 1] == "Search Jobs" || path[i - 1] == "Like") {

                                var pTemp = path[i];
                                if (path[i - 1] == "Candidates" || path[i - 1] == "job" || path[i - 1] == "Search Jobs" || path[i - 1] == "Like") {
                                    var myjobsTmp = '', editTmp = '';
                                    if (path[i - 1] == 'My Jobs')
                                        myjobsTmp = "<span> > </span><a href='#/myjobs'>My Jobs</a>"
                                    if (path[i - 2] == "job")
                                        editTmp = "<b>Edit </b>";

                                    navigation_path += myjobsTmp + "<span> > </span><a href='#" + last_path + "'>" + editTmp + $rootScope.jobTitle + likeOrUnlikeTab + "</a>";
                                    element
                                        .html($compile(
                                            "<a href='#/usersLogin'>Homepage</a>"
                                            + navigation_path)
                                        (
                                            scope));
                                }
                                else {
                                    var lastPath = last_path.split('/');
                                    if (!isNaN(path[i])) {
                                        navigation_path += "<span> > </span><a href='#" + last_path + "'>" + path[i] + job_parameters + "</a>";
                                        element
                                            .html($compile(
                                                "<a href='#/usersLogin'>Homepage</a>"
                                                + navigation_path)
                                            (
                                                scope));
                                    }
                                }

                            }
                            // if the path[i] is a number that came from
                            // Candidates job page to resume page
                            else if (path[i - 1] == "resume") {
                                var pTemp = path[i];
                                $http({
                                    url: 'https://cvmatcher.herokuapp.com/getMatchingObject',
                                    method: "POST",
                                    data: {
                                        "matching_object_id": pTemp,
                                        "matching_object_type": "cv"
                                    }
                                }).then(function (data) {
                                    path[i] = data.data[0].user["first_name"];
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
                                            "<a href='#/usersLogin'>Homepage</a>"
                                            + navigation_path)
                                        (
                                            scope));
                                })
                            }
                            // check if im in parameters page
                            else {
                                navigation_path += "<span> > </span><a href='#"
                                    + last_path
                                    + "'>"
                                    + path[i]
                                    + job_parameters + "</a>";

                                element.html($compile(
                                    "<a href='#/usersLogin'>Homepage</a>"
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

                scope.$watch('compability', function (newValue, oldValue) {
                    if (newValue) {
                        circle.animate(newValue / 100, function () {
                        })
                        angular.element("#circle-container-0 > h5")[0].innerHTML = newValue + "%";
                    }
                }, true);

                circle.animate(attr.compability / 100, function () {
                })
                return circle;
            });
        }
    }
});
// focus on searchBox
app.directive('profileimg', function ($compile) {
    return {
        replace: true,
        restrict: 'EA',
        link: function (scope, element, attr) {
            //userProfileImg
            if ($.cookie('user') && $.cookie('profile')) {
                var cookieImg = $.parseJSON($.cookie('user')).image;
                var profile = $.cookie('profile');
                var e = $compile(
                    '<a ng-href="' + profile + '"><img src="' + cookieImg + '" id="profileImg"></a>')(scope);
                $compile(angular.element("#profilePage").replaceWith(e))(scope);
            }

        }
    }
});


/*
 * ********************* JS Functions ****************
 */


$(document).ready(function () {

    $("#logo").click(function () {

        if (window.location.href.indexOf("localhost") > -1)
            window.location.href = '/cvmatcher/';
        else
            window.location.href = 'http://cvmatcher.000space.com';
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
var firstTimeLogIn = false;
var updateSignIn = function () {
    if (auth2.isSignedIn.get()) {
        if (firstTimeLogIn == true) {
            console.log("first time! so add user!!!");
        }
        else
            console.log("user loggen in before so get user!!!");
    } else {
        firstTimeLogIn = true;
    }

    helper.onSignInCallback(gapi.auth2.getAuthInstance());
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
