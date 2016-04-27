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
    }).when('/searchJobs/:_id/matchpage', {
        templateUrl: 'job_seeker/matchpage.html',
        controller: 'matchpageController'
    }).when('/Profile', {
        templateUrl: 'job_seeker/profile.html',
        controller: 'seekerProfileControler'
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
app.controller('usersLoginController', function ($scope, $http, $sce, $rootScope, $compile, $timeout) {

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
                        "email": profile.emails[0].value
                    }
                }).then(function (data) {
                        if ($.isArray(data.data)) {
                            $.cookie('user_id', data.data[0]._id);
                            $rootScope.user_id = data.data[0]._id;
                        }
                        else {
                            $.cookie('user_id', data.data._id);
                            $rootScope.user_id = data.data._id;
                        }
                        location.replace("#/companyProfile");

                    },
                    function (response) { // optional
                        console.log("addUser AJAX failed!");
                        location.replace("#/companyProfile");
                    });

            }
            else {

                $http({
                    url: 'https://cvmatcher.herokuapp.com/getUser',
                    method: "POST",
                    data: {
                        "user_id": $.cookie('user_id')
                    }
                }).then(function (data) {
                        if (data) {
                            if ($.isArray(data.data)) {
                                $.cookie('user_id', data.data[0]._id);
                                $rootScope.user_id = data.data[0]._id;
                            }
                            else {
                                $.cookie('user_id', data.data._id);
                                $rootScope.user_id = data.data._id;
                            }

                            location.replace("#/myjobs");

                        }
                    },
                    function (response) { // optional
                        console.log("getUser AJAX failed!");
                        location.replace("#/myjobs");
                    });

            }

            firstTimeLogIn = false;
        }
        else if (type == 'jobSeeker') {
            $rootScope.userSignInType = "jobSeeker";
            $.cookie('profile', "#/Profile");
            $.cookie('userSignInType', "jobSeeker");
            angular.element("#profileImg").parent().attr("href", $.cookie('profile'));
            if ($.cookie('user'))
                $("#profileImg").attr("src", $.parseJSON($.cookie('user')).image);

            if (firstTimeLogIn == true) {

                if (profile.name.givenName == '')
                    userName = '';
                if (profile.name.familyName == '')
                    familyName = '';
                //add new user
                $http({
                    url: 'https://cvmatcher.herokuapp.com/addUser',
                    method: "POST",
                    data: {
                        "google_user_id": profile.id,
                        "first_name": profile.name.givenName,
                        "last_name": profile.name.familyName,
                        "email": profile.emails[0].value
                    }
                }).then(function (data) {
                        firstTimeLogIn = false;

                        if ($.isArray(data.data)) {
                            $.cookie('user_id', data.data[0]._id);
                            $rootScope.user_id = data.data[0]._id;
                        }
                        else {
                            $.cookie('user_id', data.data._id);
                            $rootScope.user_id = data.data._id;
                        }


                        location.replace("#/Profile");

                    },
                    function (response) { // optional
                        console.log("addUser AJAX failed!");
                    });

            }
            else {
                $http({
                    url: 'https://cvmatcher.herokuapp.com/getUser',
                    method: "POST",
                    data: {
                        "user_id": $.cookie('user_id')
                    }
                }).then(function (data) {
                        firstTimeLogIn = false;

                        if ($.isArray(data.data)) {
                            $.cookie('user_id', data.data[0]._id);
                            $rootScope.user_id = data.data[0]._id;
                        }
                        else {
                            $.cookie('user_id', data.data._id);
                            $rootScope.user_id = data.data._id;
                        }


                        location.replace("#/searchJobs");
                    },
                    function (response) { // optional
                        console.log("getUser AJAX failed!");
                    });
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
app.controller('jobSeekerSearchJobsController', function ($rootScope, $scope, $sce, $http, $compile) {
    $scope.getMainJson = function () {
        $http({
            url: 'https://cvmatcher.herokuapp.com/jobSeeker/getJobsBySector',
            method: "POST",
            data: {
                "user_id": $.cookie('user_id'),
                "sector": "software engineering"
            }
        })
            .then(function (data) {
                    $scope.jobSeekerJobs = data.data;
                    console.log(data.data);
                    angular.element(".fa-pulse").hide();

                    //navigation in site
                    var navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/searchJobs'>Search Jobs</a>"
                    $(".navigation")[0].innerHTML = navigation;

                    //fix date string
                    angular.forEach(data.data, function (value, key) {
                        data.data[key].date = value.date.split("T")[0];
                    });
                },
                function (response) { // optional
                    angular.element(".fa-pulse").hide();
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
app.controller('jobpagebyIDController', function ($scope, $http, $location, $rootScope) {


    $id = $location.path().split('/');


    $http({
        url: 'https://cvmatcher.herokuapp.com/getMatchingObject',
        method: "POST",
        data: {
            "matching_object_id": $id[2],
            "matching_object_type": "job"
        }
    })
        .then(function (data) {
                $rootScope.stringPathUrl = data.data[0].original_text.title;
                var jobCircle = new ProgressBar.Circle(
                    '#job-circle-container', {
                        color: '#ee5785',
                        strokeWidth: 5,
                        fill: '#aaa'
                    });

                //navigation in site
                console.log($id[1]);
                if ($id[1] == 'yourjobs'){
                    var navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/yourjobs'>My Jobs</a><span> > </span><a href='#/searchJobs/" + data.data[0]._id + "'>" + data.data[0].original_text.title + "</a>"
                    $scope.page = 'yourjobs';
                }
                   else {
                    var navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/searchJobs'>Search Jobs</a><span> > </span><a href='#/searchJobs/" + data.data[0]._id + "'>" + data.data[0].original_text.title + "</a>"
                    $scope.page = 'searchjobs';
                }
                $(".navigation")[0].innerHTML = navigation;

                $.cookie('jobTitle', data.data[0].original_text.title);
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
        $http({
            url: 'https://cvmatcher.herokuapp.com/jobSeeker/getMyJobs',
            method: "POST",
            data: {
                "user_id": $.cookie('user_id')
            }
        })
            .then(function (data) {
                    //navigation in site
                    var navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/yourjobs'>My Jobs</a>"
                    $(".navigation")[0].innerHTML = navigation;

                    console.log(data);
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
            var cvId;

            $scope.getMainJson = function () {

                //job seeker Details
                $http({
                    url: 'https://cvmatcher.herokuapp.com/getUser',
                    method: "POST",
                    data: {
                        "user_id": $rootScope.user_id
                    }
                })
                    .then(function (data) {
                            //navigation in site
                            var navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/Profile'>Profile</a>"
                            $(".navigation")[0].innerHTML = navigation;

                            $scope.jobSeeker = data.data[0];
                            console.log(data.data[0]);
                            //userId = data.data[0]._id;
                            angular.element(".fa-pulse").hide();
                        },
                        function (response) { // optional
                            angular.element(".fa-pulse").hide();
                            alert("jobSeekerJobs AJAX failed!");
                        });

                $http({
                    url: 'https://cvmatcher.herokuapp.com/jobSeeker/getIdOfCV',
                    method: "POST",
                    data: {
                        "user_id": $rootScope.user_id
                    }
                }).then(function (data) {
                        console.log(data);
                        if (data) {
                            if ($.isArray(data.data)) {
                                cvId = data.data[0]._id;
                            }
                            else {
                                cvId = data.data._id;
                            }

                            //job seeker CV
                            $http({
                                url: 'https://cvmatcher.herokuapp.com/getMatchingObject',
                                method: "POST",
                                data: {
                                    "matching_object_id": cvId,
                                    "matching_object_type": "cv"
                                }
                            })
                                .then(function (data) {
                                        angular.element(".fa-pulse").hide();
                                        console.log(data);

                                        $scope.jobSeekerCV = data.data[0];


                                        if (!data) {

                                            $scope.addEducation('education');
                                            $scope.addEducation('employment');
                                        }
                                        /*if (data.length == 0 || data == undefined || data == "undefined" || data == null || data == []) {
                                         $scope.addEducation('education');
                                         $scope.addEducation('employment');
                                         }*/
                                    },
                                    function (response) { // optional
                                        angular.element(".fa-pulse").hide();
                                        console.log("jobSeekerJobs AJAX failed!");
                                    });
                        }
                    },
                    function (response) { // optional
                        angular.element(".fa-pulse").hide();
                        console.log("getIdOfCV AJAX failed!", response);
                    });


            }

            var fromExperience = '<label>From<select id="experience_years" name="experience_years"class="form-control" id="sel1"><option value="no_experience">0</option><option value="2005">2005</option><option value="2006">2006</option><option value="2007">2007</option><option value="2008">2008</option><option value="2009">2009</option><option value="2010">2010</option><option value="2011">2011</option><option value="2012">2012</option><option value="2013">2013</option><option value="2014">2014</option><option value="2015">2015</option><option value="2016">2016</option></select></label>';
            var toExperience = '<label>To<select id="experience_years" name="experience_years"class="form-control" id="sel1"><option value="no_experience">0</option><option value="2005">2005</option><option value="2006">2006</option><option value="2007">2007</option><option value="2008">2008</option><option value="2009">2009</option><option value="2010">2010</option><option value="2011">2011</option><option value="2012">2012</option><option value="2013">2013</option><option value="2014">2014</option><option value="2015">2015</option><option value="2016">2016</option></select></label>';

            var parseExpereince = {
                "expereince": []
            }
            var history_timeline = [];
            $scope.parseMyExperience = function () {
                angular.element(".fa-spin").show();
                //scope_of_position
                $.each($(".timeline .timeline-inverted"), function (key, val) {
                    var text = $(this).find('.timeline-body textarea').val();
                    var startdate = $(this).find('.timeline-heading label:nth-child(1) select').val();
                    var enddate = $(this).find('.timeline-heading label:nth-child(2) select').val();
                    parseExpereince.expereince.push({
                        "text": text,
                        "startdate": startdate,
                        "enddate": enddate
                    });
                });

                //scope_of_position
                var type;
                $.each($(".timeline li"), function (key, val) {
                    var text = $(this).find('.timeline-body textarea').val();
                    var startdate = $(this).find('.timeline-heading label:nth-child(1) select').val();
                    var enddate = $(this).find('.timeline-heading label:nth-child(2) select').val();
                    if ($(this).hasClass("timeline-inverted"))
                        type = 'experience';
                    else
                        type = 'education';
                    history_timeline.push({
                        "text": text,
                        "start_year": parseInt(startdate),
                        "end_year": parseInt(enddate),
                        "type": type
                    });
                });

                $http({
                    url: "https://cvmatcher.herokuapp.com/getKeyWordsBySector",
                    method: "POST",
                    data: {"sector": "software engineering"}
                })
                    .then(function (data) {
                            parseExpereince.words = data.data;

                            $http({
                                url: "https://matcherbuilders.herokuapp.com/findIfKeyWordsExistsCV",
                                method: "POST",
                                data: parseExpereince
                            })
                                .then(function (data) {
                                        console.log(data)
                                        angular.forEach(data.data, function (value, key) {
                                            var yearsExperience = '<label class="parserExperienceYearsLabel">Years<input type="text" class="form-control" class="parserExperienceYears" name="experience_years" value="' + value.years + '"></label>';
                                            angular.element(".parseExperience").append('<div class="parser"><label class="parserExperienceLanguage">Language<input type="text" required class="form-control " id="experience" name="experience"' +
                                                ' value="' + value.name + '"  /></label>' + yearsExperience) + '</div>';
                                        });
                                        angular.element(".fa-spin").hide();
                                        angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");

                                    },
                                    function (response) { // optional
                                        alert("findIfKeyWordsExistsCV AJAX failed!");
                                    });
                        },
                        function (response) { // optional
                            alert("getKeyWordsBySector AJAX failed!");
                        });

                angular
                    .element(".parseExperienceButton").hide();
                angular
                    .element(".parseExperiencePlusButton").removeClass("hidden");

            }
            $scope.addMoreExperience = function () {

                var yearsExperience = '<label class="parserExperienceYearsLabelAdded">Years<input type="text" class="form-control" class="parserExperienceYears" name="experience_years" value=""></label>';

                angular
                    .element(".parseExperience")
                    .append('<div class="parser"><label class="parserExperienceLanguageAdded">Language<input type="text" required class="form-control " id="experience" name="experience"' +
                        ' value=""  /></label>' + yearsExperience + '</div>');
            }

            $scope.addEducation = function (type) {
                if (type == 'education') {
                    var divTemplate = '<li><div class="timeline-badge" ng-click="addEducation(' + "'education'" + ')"><i class="fa fa-plus"></i></div><div class="timeline-panel"><div class="timeline-heading">' + fromExperience + toExperience + '</div><div class="timeline-body"><p><div class="form-group"><label for="content">Content:</label><textarea class="form-control" rows="3" name="content" id="content" required></textarea></div></p></div></div></li>';

                }
                else {
                    var divTemplate = '<li class="timeline-inverted"><div class="timeline-badge" ng-click="addEducation(' + "'employment'" + ')"><i class="fa fa-plus"></i></div><div class="timeline-panel"><div class="timeline-heading">' + fromExperience + toExperience + '</div><div class="timeline-body"><p><div class="form-group"><label for="content">Content:</label><textarea class="form-control" rows="3" name="content" id="content" required></textarea></div></p></div></div></li>';
                }
                var temp = $compile(divTemplate)($scope);
                angular.element(".timeline").append(temp);
            }
            $scope.submitUserDetails = function () {
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
                            $scope.tab = 1;
                        },
                        function (response) { // optional
                            alert("jobSeeker send form AJAX failed!");
                        });
            }
            var combination = [];
            $scope.submitUserCV = function () {

                $('.parser').each(function (i, obj) {
                    combination.push({
                        "name": $(this).find('label:nth-child(1) input').val(),
                        "years": parseInt($(this).find('label:nth-child(2) input').val())
                    })
                });
                console.log(combination);


                var jobSeekerCVScopeOfPosition = [];
                //scope_of_position

                $.each($(".jobSeekerCVScopeOfPosition input:checked"), function () {
                    jobSeekerCVScopeOfPosition.push($(this).val());
                });

                /*var key = 'scope_of_position';
                 var val = $('.scope_of_position').find(":selected").val();*/
                var jobSeekerCVAcademy = [];
                $.each($(".jobSeekerCVAcademy input:checked"), function () {
                    jobSeekerCVAcademy.push($(this).val());
                });

                var jobSeekerCVHistoryTimeLine = [];
                //history_timeline
                $.each($(".timeline-panel textarea"), function () {
                    jobSeekerCVHistoryTimeLine.push($(this).val());
                });

                var jobSeekerCV = {
                    "matching_object_type": "cv",
                    "date": new Date(),
                    "personal_properties": {
                        "university_degree": $scope.University,
                        "degree_graduation_with_honors": $scope.honors,
                        "above_two_years_experience": $scope.experience,
                        "psychometric_above_680": $scope.score,
                        "multilingual": $scope.foreign,
                        "volunteering": $scope.volunteering,
                        "full_army_service": $scope.military,
                        "officer": $scope.Officer,
                        "high_school_graduation_with_honors": $scope.graduate,
                        "youth_movements": $scope.Youth

                    },
                    "original_text": {
                        "history_timeline": history_timeline
                    },
                    "sector": $('.jobSeekerCVsector').find(":selected").val(),
                    "locations": [$('#geocomplete').val()],
                    "candidate_type": [$('.jobSeekerCVCandidateType').find(":selected").val()],
                    "scope_of_position": jobSeekerCVScopeOfPosition,
                    "academy": {
                        "academy_type": jobSeekerCVAcademy,
                        "degree_name": $.trim($('.degree_name').find(":selected").val()),
                        "degree_type": [$('.degree_type').find(":selected").val()]
                    },
                    "requirements": [{
                        "combination": combination
                    }],
                    "user": $rootScope.user_id
                }


                console.log("send form: ", jobSeekerCV);
                /* if ($scope.jobSeekerCV == "undefined" || $scope.jobSeekerCV == null) {*/
                //if i got data then do update, else do add
                url = "https://cvmatcher.herokuapp.com/addMatchingObject";
                $http({
                    url: url,
                    method: "POST",
                    data: jobSeekerCV
                })
                    .then(function (data) {
                            console.log(data);
                        },
                        function (response) { // optional
                            alert("jobSeekerJobs send form AJAX failed!");
                        });
                /*}
                 else {
                 window.location.href = '/cvmatcher/#/searchJobs'
                 url = "https://cvmatcher.herokuapp.com/updateMatchingObject";
                 }*/


            }

        });

/*
 * ********************* Match Page Controller ****************
 */
app
    .controller(
        'matchpageController',
        function ($scope, $http, $location, $rootScope, $timeout) {
            $jobId = $location.path().split('/')[2];
            var compabilitJobSeeker;
            $scope.checkMyCV = function () {
                $http({
                    url: 'https://cvmatcher.herokuapp.com/jobSeeker/getIdOfCV',
                    method: "POST",
                    data: {
                        "user_id": $rootScope.user_id
                    }
                }).then(function (data) {
                    if (data.data.length > 0) {
                        console.log(data);
                        $http({
                            url: 'https://cvmatcher.herokuapp.com/jobSeeker/checkCV',
                            method: "POST",
                            data: {
                                "cv_id": data.data[0]._id,
                                "job_id": $jobId
                            }
                        })
                            .then(function (data) {
                                    //navigation in site
                                    var navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/searchJobs'>Search Jobs</a><span> > </span><a href='#/searchJobs/" + $jobId + "'>" + $.cookie('jobTitle') + "</a><span> > </span><a href='#/searchJobs/" + $jobId + "/matchpage'>Match Page</a>"
                                    $(".navigation")[0].innerHTML = navigation;

                                    console.log("data: ", data.data);
                                    var colors = ['#F74CF0', '#9F4CF7', '#4C58F7', '#4CBEF7', '#4CF7F0', '#4CF772', '#ACF74C', '#F7EB4C'];
                                    var fillColors = ['#C1BFBF', '#e6e6e6'];
                                    //Big circle percentages
                                    console.log(data.data.formula.requirements.details);
                                    angular.forEach(data.data.formula.requirements.details, function (value, key) {
                                        circle = new ProgressBar.Circle('#circle-container' + (key + 1), {
                                            color: colors[key],
                                            strokeWidth: 5,
                                            fill: fillColors[key % 2]
                                        });
                                        angular.element(".langsMatch").append("<span style='color:" + colors[key] + "'> | " + value.name + " = " + Math.max(parseInt(value.grade), 1) + "</span>");
                                        compabilitJobSeeker = value.grade;
                                        circle.animate(value.grade / 100, function () {
                                        })
                                    });
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
                                        angular.element(".matchResult > h2").append("Oops");
                                        angular.element(".matchResult > h2 > i").addClass("fa-thumbs-down");
                                        angular.element(".matchResult h3").html('You did not passed the minimum requirements');
                                        $scope.sendcv = false;
                                    }
                                    else {
                                        angular.element(".matchResult > h2").append("Great!");
                                        angular.element(".matchResult > h2 > i").addClass("fa-thumbs-up");
                                        angular.element(".matchResult h3").html('Harray!! You Passed The Minimum requirements');
                                        $scope.sendcv = true;
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
                                },
                                function (response) { // optional
                                    alert("checkCV AJAX failed!");
                                });
                    }
                })
            }


            $scope.sendCV = function () {
                $http({
                    url: 'https://cvmatcher.herokuapp.com/jobSeeker/getIdOfCV',
                    method: "POST",
                    data: {
                        "user_id": $rootScope.user_id
                    }
                }).then(function (data) {
                    console.log(data.data[0]._id);
                    console.log($jobId);
                    $http({
                        url: 'https://cvmatcher.herokuapp.com/jobSeeker/addCvToJob',
                        method: "POST",
                        data: {
                            "job_id": $jobId,
                            "cv_id": data.data[0]._id
                        }
                    }).then(function (data) {
                        console.log(data);
                        if (data != null) {
                            $scope.status = "your Resume Send!"
                        }
                        else {
                            $scope.status = "Problem send resume"
                        }
                    }), function (response) { // optional
                        console.log(response);
                        console.log("addCvToJob AJAX failed!");
                    };
                });

            }
            $scope.exitStatus = function () {
                //if user clickd ok then move to search jobs page - need to wait to close modal
                $timeout(function () {
                    window.location.href = '/cvmatcher/#/searchJobs';
                }, 1000);
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
            $http({
                url: 'https://cvmatcher.herokuapp.com/jobSeeker/getFavoritesJobs',
                method: "POST",
                data: {
                    "user_id": $.cookie('user_id')
                }
            })
                .then(function (data) {
                        var navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/Favorites'>Favorites Jobs</a>"
                        $(".navigation")[0].innerHTML = navigation;
                        console.log(data);
                        $scope.jobSeekerJobs = data.data;
                        console.log(data.data);
                        angular.element(".fa-pulse").hide();
                        //fix date string
                        angular.forEach(data.data, function (value, key) {
                            data.data[key].date = value.date.split("T")[0];
                        })
                    },
                    function (response) { // optional
                        console.log("myjobsController AJAX failed!");
                    });
        });


/** ************************************************************Employer****************************************************** */

/*
 * ********************* myjobs controller ****************
 */

app.controller('myjobsController', function ($rootScope, $location, $scope, $http, $sce) {
    var archive;
    $id = $location.path().split('/');
    if ($id[1] == 'myjobs') {
        archive = false;
        $scope.jobPage = "myJobs"

        var navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/myjobs'>My Jobs</a>"
        $(".navigation")[0].innerHTML = navigation;
    }
    else {
        archive = true;
        $scope.jobPage = "Archive";

        var navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/Archive'>Deleted</a>"
        $(".navigation")[0].innerHTML = navigation;
    }
    var jobsArr = [];
    console.log($id[1]);
    $scope.getMainJson = function () {
        $http({
            url: 'https://cvmatcher.herokuapp.com/employer/getJobsBySector',
            method: "POST",
            data: {
                "user_id": $.cookie('user_id'),
                "sector": "software engineering",
                "archive": archive
            }
        })
            .then(function (data) {
                    console.log(data.data);
                    $scope.myjobs = data.data;
                    console.log(data.data);
                    jobsArr = data.data;
                    angular.element(".fa-pulse").hide();

                    //fix date string
                    angular.forEach(data.data, function (value, key) {
                        data.data[key].date = value.date.split("T")[0];
                    });


                },
                function (response) { // optional
                    angular.element(".fa-pulse").hide();
                    console.log("myjobsController AJAX failed!");
                });

    }
    $rootScope.sort = function (sort) {
        $scope.sortby = sort;
    }

    $scope.saveJobTitle = function (jobTitle) {
        $.cookie('jobTitle', jobTitle);
    }


    $scope.deleteJob = function (jobId) {
        $http({
            url: 'https://cvmatcher.herokuapp.com/deleteMatchingObject',
            method: "POST",
            data: {
                "matching_object_id": jobId
            }
        })
            .then(function () {
                    jobsArr = jobsArr.filter(function (obj) {
                        console.log(obj);
                        return obj._id !== jobId;
                    });
                    console.log(jobsArr);
                    $scope.myjobs = jobsArr;
                },
                function (response) { // optional
                    console.log("deleteMatchingObject AJAX failed!");
                });
    }

    $scope.revive = function (jobId) {
        $http({
            url: 'https://cvmatcher.herokuapp.com/reviveMatchingObject',
            method: "POST",
            data: {
                "matching_object_id": jobId
            }
        })
            .then(function () {
                    jobsArr = jobsArr.filter(function (obj) {
                        console.log(obj);
                        return obj._id !== jobId;
                    });
                    console.log(jobsArr);
                    $scope.myjobs = jobsArr;
                },
                function (response) { // optional
                    console.log("deleteMatchingObject AJAX failed!");
                });
    }


});


/*
 * ********************* company Profile controller ****************
 */
app.controller('companyProfileController',
    function ($scope, $http, $location, $sce, $rootScope) {
        var company = false;
        var companyId;
        $("#geocomplete").geocomplete();

        console.log($rootScope.user_id);
        console.log($.cookie('user_id'));
        //user details
        $http({
            url: 'https://cvmatcher.herokuapp.com/getUser',
            method: "POST",
            data: {
                "user_id": $.cookie('user_id')
            }
        })
            .then(function (data) {
                    if (data) {
                        var navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/companyProfile'>Company Profile</a>"
                        $(".navigation")[0].innerHTML = navigation;
                        $scope.employerProfile = data.data[0];
                        console.log(data.data[0]);
                        if (data.data[0].company) {
                            company = true;
                            companyId = data.data[0].company;
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
                                            $scope.companyProfile = data.data[0];
                                            console.log(data.data);
                                            angular.element(".fa-pulse").hide();
                                        },
                                        function (response) { // optional
                                            console.log("companyProfileController AJAX failed!");
                                        });
                            }
                        }

                        angular.element(".fa-pulse").hide();
                    }
                },
                function (response) { // optional
                    angular.element(".fa-pulse").hide();
                    console.log("companyProfileController AJAX failed!");
                });
        //company profile details
        var logo = '';
        $scope.newLogo = function () {
            logo = $(this).find("img").prevObject[0].logo;
            $.each($(".logos label"), function () {
                $(this).removeClass('active');
            });
        }
        $scope.logo = function (word) {

            $http({
                url: "https://cvmatcher.herokuapp.com/getLogoImages",
                method: "POST",
                data: {"word": word}
            }).then(function (data) {
                $scope.logos = data.data;
            })
        }


        $scope.submitUserDetails = function () {
            if (logo == '')
                logo = $(".companyLogo > img").attr("src");
            var userJson = {
                "_id": $.cookie('user_id'),
                "personal_id": $(".personalId").val(),
                "first_name": $(".firstName").val(),
                "last_name": $(".lastName").val(),
                "birth_date": $(".birthDay").val(),
                "address": $("#geocomplete").val(),
                "email": $(".email").val(),
                "phone_number": $(".phoneNumber").val(),
                "linkedin": $(".linkedin").val()
            }

            console.log(userJson);
            $http({
                url: 'https://cvmatcher.herokuapp.com/updateUser',
                method: "POST",
                data: userJson
            })
                .then(function (data) {
                        $scope.status = "User Updated Succesfully!"
                    },
                    function (response) { // optional
                        $scope.status = "Error User Update!"
                    });
        }
        $scope.submitCompanyDetails = function () {
            $scope.status = '';
            if (!company) {

                var companyJson = {
                    "user_id": $.cookie('user_id'),
                    "name": $(".companyName").val(),
                    "logo": logo,
                    "p_c": $(".companyPC").val(),
                    "address": $("#geocomplete2").val(),
                    "phone_number": $(".companyPhoneNumber").val()
                }

                console.log("send form: ", companyJson);
                $http({
                    url: 'https://cvmatcher.herokuapp.com/employer/addCompany',
                    method: "POST",
                    data: companyJson
                }).then(function (data) {
                        $scope.status = "Company Updated Succesfully!"
                        console.log(data);
                    },
                    function (response) { // optional
                        $scope.status = "Error Company Update!"
                    });
            }
            else {
                //push to json new key value

                var companyJson = {
                    "_id": $scope.employerProfile['company'],
                    "name": $(".companyName").val(),
                    "logo": logo,
                    "p_c": $(".companyPC").val(),
                    "address": $("#geocomplete2").val(),
                    "phone_number": $(".companyPhoneNumber").val()
                }
                console.log("send form: ", companyJson);
                $http({
                    url: 'https://cvmatcher.herokuapp.com/employer/updateCompany',
                    method: "POST",
                    data: companyJson
                }).then(function () {
                        $scope.status = "Company Updated Succesfully!"
                    },
                    function (response) { // optional
                        $scope.status = "Error Company Update!"
                    });
            }


        }
    });
/*
 * ********************* Candidates controller ****************
 */
app.controller('candidatesController',
    function ($scope, $http, $location, $sce, $rootScope) {
        $id = $location.path().split('/');
        $scope.jobId = $id[2];
        $scope.unreadCvs = function () {

            angular.element(".fa-pulse").show();
            $scope.candidates = '';
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getUnreadCvsForJob',
                method: "POST",
                data: {
                    "user_id": $.cookie('user_id'),
                    "job_id": $scope.jobId
                }
            })
                .then(function (data) {
                        var navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/myjobs'>My Jobs</a><span> > </span><a href='#/Candidates/" + $id[2] + "'>Candidates of " + $.cookie('jobTitle') + "</a>"
                        $(".navigation")[0].innerHTML = navigation;
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
                    "user_id": $.cookie('user_id'),
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
                    "user_id": $.cookie('user_id'),
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

        $scope.hire = function (cvId) {
            console.log(cvId);
        }

        $scope.bringNextCandidate = function (type, description, id) {
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/updateRateCV',
                method: "POST",
                data: {
                    "cv_id": id,
                    "status": {
                        "current_status": type,
                        "stars": stars,
                        "description": description,
                        "timestamp": new Date
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
        // circle animation
        var circle, tmpColor;
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
                        var navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/myjobs'>My Jobs</a><span> > </span><a href='#/Candidates/" + $id[2] + "'>Candidates of " + $.cookie('jobTitle') + "</a><span> > </span><a href='#/Unread/" + $id[2] + "/resume/" + id + "'>" + data.data[0].user.first_name + " " + data.data[0].user.last_name + " Resume</a>"
                        $(".navigation")[0].innerHTML = navigation;
                        $scope.user = data.data[0];
                        console.log(data.data[0])
                        angular.element(".fa-pulse").hide();
                        if ($id[1] == "Unread") {
                            $scope.user["stars"] = 0;
                        }


                        //circle
                        var colors = ['#F74CF0', '#9F4CF7', '#4C58F7', '#4CBEF7', '#4CF7F0', '#4CF772', '#ACF74C', '#F7EB4C'];
                        var fillColors = ['#C1BFBF', '#e6e6e6'];
                        //Big circle percentages
                        angular.forEach(data.data[0].formula.matching_requirements.details, function (value, key) {
                            circle = new ProgressBar.Circle('#circle-container' + (key + 1), {
                                color: colors[key],
                                strokeWidth: 5,
                                fill: fillColors[key % 2]
                            });
                            angular.element(".resumeSkillsBox").append("<span style='color:" + colors[key] + "'> | " + value.name + " = " + Math.max(parseInt(value.grade), 1) + "</span>");
                            circle.animate(value.grade / 100, function () {
                            })
                        });
                        angular.element(".resumeSkillsBox").append("<h2>Total Skills Grade: " + Math.max(parseInt(data.data[0].formula.matching_requirements.grade), 1) + "</h2>")

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
                    "cv_id": candidateId,
                    "status": {
                        "current_status": type,
                        "stars": $scope.user["stars"],
                        "description": description,
                        "timestamp": new Date
                    }
                }
            });

            var nextCandidate;
            angular.forEach(candidates, function (value, key) {
                if (value._id == candidateId) {
                    delete candidates[key];
                }
                else
                    nextCandidate = value._id;
            })

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


    });

/*
 * ********************* Job controller ****************
 */

app.controller('jobController', function ($scope, $http, $location, $timeout, $compile) {

        $id = $location.path().split('/')[1];
        $("#geocomplete").geocomplete();
        angular.element('.selectpicker').selectpicker();

        $jobId = $location.path().split('/')[2];
        var sumSliders = 0;
        var combinationForJob = [];
        var sumPrioroty = 0;
        var sumPrioroty2 = 0;
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
                        var navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/myjobs'>My Jobs</a><span> > </span><a href='#/job/" + $jobId + "'>Edit Job - " + data.data[0].original_text.title + "</a>"
                        $(".navigation")[0].innerHTML = navigation;

                        console.log(data.data[0]);
                        $scope.jobDetails = data.data[0];

                        $.each(data.data[0].requirements[0].combination, function (key, val) {
                            if (val.percentage) {
                                sumPrioroty += val.percentage;
                                combinationForJob.push({
                                    'name': val.name,
                                    'mode': val.mode,
                                    'years': val.years,
                                    'percentage': val.percentage
                                });
                            }
                            else
                                combinationForJob.push({'name': val.name, 'mode': val.mode, 'years': val.years});
                        });
                        $scope.parseExperience();

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
                        sumSliders = 100;
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
                                    sumSliders = total;
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

                var navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/myjobs'>My Jobs</a><span> > </span><a href='#/newJob'>New Job</a>"
                $(".navigation")[0].innerHTML = navigation;


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
                                sumSliders = total;
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

        /*
         $http.get("json/languages.json").success(function (data) {
         $scope.langs = data;
         //<div class='Item'><input type="text" value=""/><select class="form-control"><h3>Prioroty: </h3></div>
         });*/


        $scope.exitStatus = function () {
            //if user clickd ok then move to search jobs page - need to wait to close modal
            if (sumSliders == 100) {
                $timeout(function () {
                    //    window.location.href = '/cvmatcher/#/myjobs';
                }, 1000);
            }
            else {
                $scope.status = "";
            }
        }
        //send form
        $scope.submitForm = function () {
            $scope.status = 'Please wait';
            if (sumSliders == 100 && sumPrioroty == 100 && $("#Page2").hasClass("hidden") == true || sumSliders == 100 && sumPrioroty == 100 && sumPrioroty2 == 100 && $("#Page2").hasClass("hidden") == false) {


                var academy = [];
                //scope_of_position
                $.each($(".academy input:checked"), function () {
                    academy.push($(this).val());
                });
                var degree_type = [];
                //scope_of_position
                $.each($(".degree_type input:checked"), function () {
                    degree_type.push($(this).val());
                });
                var scope_of_position = [];
                //scope_of_position
                $.each($(".scope_of_position input:checked"), function () {
                    scope_of_position.push($(this).val());
                });
                var candidate_type = [];
                //scope_of_position
                $.each($(".candidate_type input:checked"), function () {
                    candidate_type.push($(this).val());
                });


                var requirements = [];
                //requerment- MUST
                var combination = [];
                $('#Items .mItem').each(function (idx, value) {
                    var name = $(value).find("input:nth-child(1)").val();
                    var years = $(value).find("select").val().split(" ")[0];

                    var mode = "must";
                    var percentage = $(value).find(".center1").val();
                    if (!percentage)
                        percentage = "0";
                    combination.push({
                        "name": name,
                        "years": parseInt(years),
                        "mode": mode,
                        "percentage": parseInt(percentage)
                    })
                })
                //requerment- ADVANTAGE
                $('#Items .aItem').each(function (idx, value) {
                    var name = $(value).find("input:nth-child(1)").val();
                    var years = $(value).find("select").val().split(" ")[0];
                    var mode = "adv";
                    combination.push({
                        "name": name,
                        "years": parseInt(years),
                        "mode": mode
                    })
                })
                $('#Items .oItem').each(function (idx, value) {
                    var name = $(value).find("input:nth-child(1)").val();
                    var years = $(value).find("select").val().split(" ")[0];
                    var mode = "or";
                    combination.push({
                        "name": name,
                        "years": parseInt(years),
                        "mode": mode
                    })
                })
                requirements.push({"combination": combination});

                //second requerments
                var combination2 = [];
                $('#Items2 .mItem2').each(function (idx, value) {
                    var name = $(value).find("input:nth-child(1)").val();
                    var years = $(value).find("select").val().split(" ")[0];

                    var mode = "must";
                    var percentage = $(value).find(".center2").val();
                    if (!percentage)
                        percentage = "0";
                    combination2.push({
                        "name": name,
                        "years": parseInt(years),
                        "mode": mode,
                        "percentage": parseInt(percentage)
                    })
                })
                $('#Items2 .aItem2').each(function (idx, value) {
                    var name = $(value).find("input:nth-child(1)").val();
                    var years = $(value).find("select").val().split(" ")[0];
                    var mode = "adv";
                    combination2.push({
                        "name": name,
                        "years": parseInt(years),
                        "mode": mode
                    })
                })
                $('#Items2 .oItem2').each(function (idx, value) {
                    var name = $(value).find("input:nth-child(1)").val();
                    var years = $(value).find("select").val().split(" ")[0];
                    var mode = "or";
                    combination2.push({
                        "name": name,
                        "years": parseInt(years),
                        "mode": mode
                    })
                })

                if (combination2.length > 0) {
                    requirements.push({"combination": combination2});
                }


                var addNewJob = {
                    "matching_object_type": "job",
                    "date": new Date(),
                    "original_text": {
                        "title": $(".jobName").val(),
                        "description": $("#description").html(),
                        "requirements": "Must: " + $("#requirementsMust").val() + " ||| Advantage:" + $("#requirementsAdvantage").val()
                    },
                    "sector": $(".sector :selected").val(),
                    "locations": [$("#geocomplete").val()],
                    "candidate_type": candidate_type,
                    "scope_of_position": scope_of_position,
                    "academy": {
                        "academy_type": academy,
                        "degree_name": $(".degree_name :selected").val(),
                        "degree_type": degree_type
                    },
                    "formula": {
                        "locations": parseInt($(".locationsSlider").text().split("/")[0]),
                        "candidate_type": parseInt($(".candidate_typeSlider").text().split("/")[0]),
                        "scope_of_position": parseInt($(".scope_of_positionSlider").text().split("/")[0]),
                        "academy": parseInt($(".academySlider").text().split("/")[0]),
                        "requirements": parseInt($(".requirementsSlider").text().split("/")[0])
                    },
                    "requirements": requirements,
                    "compatibility_level": $scope.compability,
                    "user": $.cookie('user_id')

                }

                console.log(addNewJob);

                $http({
                    url: 'https://cvmatcher.herokuapp.com/addMatchingObject',
                    method: "POST",
                    data: addNewJob
                })
                    .then(function (data) {
                            if (data != null)
                                $scope.status = "Job Send Succesfuly";
                        },
                        function (response) { // optional
                            $scope.status = "Job did not send";
                            console.log("addMatchingObject send form AJAX failed!");
                        });
                //$http.post('http://cvmatcher.herokuapp.com/employer/setNewJob', JSON.stringify($scope.form, ,employerId:$id, time:dformat)).success(function(){/*success callback*/});
            }
            if (sumSliders != 100) {
                $scope.status = "Please SUM the sliders to 100";
            }
            if (sumPrioroty != 100 && $("#Page2").hasClass("hidden") == true) {
                $scope.status = "Please SUM Prioroty to 100";
            }
            if (sumPrioroty != 100 && sumPrioroty2 != 100 && $("#Page2").hasClass("hidden") == false) {
                $scope.status = "Please SUM All Prioroty to 100";
            }

        };


        var prNum = 0;

        //click on parse Orange button
        $scope.parseExperience = function () {
            var parseExpereince;
            $http({
                url: "https://cvmatcher.herokuapp.com/getKeyWordsBySector",
                method: "POST",
                data: {"sector": "software engineering"}
            })
                .then(function (data) {
                        parseExpereince = {
                            "text": $("#requirementsMust").val(),
                            "words": data.data
                        };
                        angular.element(".fa-spin").show();


                        //Requerments Must
                        if ($id == 'job') {
                            angular.forEach(combinationForJob, function (value1, key1) {
                                years = value1.years;
                                percentage = value1.percentage;
                                if (value1.mode == 'must') {
                                    prioroty = '<div><div class="input-group" style="float: right; width: 15%;"><span class="input-group-btn"><button type="button" class="btn btn-danger btn-number minusButton" data-type="minus" data-field="quant[2]"><i class="fa fa-minus" aria-hidden="true"></i> </button></span> <input type="text" name="quant[2]" data-pr-num="' + prNum + '" class="form-control input-number center1" disabled value="' + percentage + '" min="0" max="100"> <span class="input-group-btn"> <button type="button" class="btn btn-success btn-number plusButton" data-type="plus" data-field="quant[2]"> <i class="fa fa-plus" aria-hidden="true"></i></button></span></div></div>';
                                    element = $("<div class='Item mItem'><input type='text'  value='" + value1.name + "' placeHolder='Please type Language'/><h3 style='float:left;'>Years:</h3><select id='select" + key1 + "' class='form-control' name='years'><option val='0'>0</option><option val='1'>1</option><option val='2'>2</option><option val='3'>3</option><option val='4'>4</option><option val='5'>5</option></select>" + prioroty + " <h3>Percentage: </h3></div>");
                                    $(".mustItem1").after(element);
                                    $('#select' + key1).find('option:contains("' + years + '")').attr("selected", true);
                                }
                                prioroty = '<div><div class="input-group" style="float: right; width: 15%;"><span class="input-group-btn"><button type="button" class="btn btn-danger btn-number minusButton" data-type="minus" data-field="quant[2]"><i class="fa fa-minus" aria-hidden="true"></i> </button></span> <input type="text" name="quant[2]" data-pr-num="' + prNum + '" class="form-control input-number center1" disabled value="' + percentage + '" min="0" max="100"> <span class="input-group-btn"> <button type="button" class="btn btn-success btn-number plusButton" data-type="plus" data-field="quant[2]"> <i class="fa fa-plus" aria-hidden="true"></i></button></span></div></div>';

                                if (value1.mode == 'adv') {
                                    element = $("<div class='Item aItem'><input type='text'  value='" + value1.name + "' placeHolder='Please type Language'/><h3 style='float:left;'>Years:</h3><select id='selectAdv" + key1 + "' class='form-control' name='years'><option val='0'>0</option><option val='1'>1</option><option val='2'>2</option><option val='3'>3</option><option val='4'>4</option><option val='5'>5</option></select></div>");
                                    $(".advantageItem1").after(element);
                                    $('#selectAdv' + key1).find('option:contains("' + years + '")').attr("selected", true);
                                }

                                if (value1.mode == 'or') {
                                    element = $("<div class='Item aItem'><input type='text'  value='" + value1.name + "' placeHolder='Please type Language'/><h3 style='float:left;'>Years:</h3><select id='selectOr" + key1 + "' class='form-control' name='years'><option val='0'>0</option><option val='1'>1</option><option val='2'>2</option><option val='3'>3</option><option val='4'>4</option><option val='5'>5</option></select></div>");
                                    $(".orItem1").after(element);
                                    $('#selectOr' + key1).find('option:contains("' + years + '")').attr("selected", true);
                                }

                                prNum++;

                                angular.element(".fa-spin").hide();
                                angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");
                            })
                        }
                        else {
                            $http({
                                url: "https://matcherbuilders.herokuapp.com/findIfKeyWordsExistsJOB",
                                method: "POST",
                                data: parseExpereince
                            })
                                .then(function (data1) {
                                        var years = 0;
                                        var prioroty;
                                        var element;
                                        var percentage;
                                        if (data1.data.length > 0) {
                                            angular.forEach(data1.data, function (value, key) {
                                                prioroty = '<div><div class="input-group" style="float: right; width: 15%;"><span class="input-group-btn"><button type="button" class="btn btn-danger btn-number minusButton" data-type="minus" data-field="quant[2]"><i class="fa fa-minus" aria-hidden="true"></i> </button></span> <input type="text" name="quant[2]" data-pr-num="' + prNum + '" class="form-control input-number center1" disabled value="0" min="0" max="100"> <span class="input-group-btn"> <button type="button" class="btn btn-success btn-number plusButton" data-type="plus" data-field="quant[2]"> <i class="fa fa-plus" aria-hidden="true"></i></button></span></div></div>';
                                                element = $("<div class='Item mItem'><input type='text'  value='" + value + "' placeHolder='Please type Language'/><h3 style='float:left;'>Years:</h3><select id='select2" + key + "' class='form-control' name='years'><option val='0'>0</option><option val='1'>1</option><option val='2'>2</option><option val='3'>3</option><option val='4'>4</option><option val='5'>5</option></select>" + prioroty + " <h3>Percentage: </h3></div>");
                                                $(".mustItem1").after(element);
                                                $('#select2' + key).find('option:contains("' + years + '")').attr("selected", true);
                                                prNum++;
                                                angular.element(".fa-spin").hide();
                                                angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");
                                            });
                                        }
                                        else {
                                            angular.element(".fa-spin").hide();
                                            angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");
                                        }
                                    },
                                    function (response) { // optional

                                        angular.element(".fa-spin").hide();
                                        console.log("findIfKeyWordsExistsJOB AJAX failed!");
                                    });

                            //Requerments Advantage

                            parseExpereince = {
                                "text": $("#requirementsAdvantage").val(),
                                "words": data.data
                            };
                            $http({
                                url: "https://matcherbuilders.herokuapp.com/findIfKeyWordsExistsJOB",
                                method: "POST",
                                data: parseExpereince
                            })
                                .then(function (data2) {
                                        angular.forEach(data2.data, function (value, key) {
                                            var years = 0;
                                            var element = '';
                                            element = $("<div class='Item aItem'><input type='text'  value='" + value + "' placeHolder='Please type Language'/><h3 style='float:left;'>Years:</h3><select id='selectAdv" + key + "' class='form-control' name='years'><option val='0'>0</option><option val='1'>1</option><option val='2'>2</option><option val='3'>3</option><option val='4'>4</option><option val='5'>5</option></select></div>");
                                            $(".advantageItem1").after(element);
                                            $('#selectAdv' + key).find('option:contains("' + years + '")').attr("selected", true);
                                            angular.element(".fa-spin").hide();
                                            angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");

                                        });
                                    },
                                    function (response) { // optional
                                        angular.element(".fa-spin").hide();
                                        console.log("findIfKeyWordsExistsJOB AJAX failed!");
                                    });

                        }

                    },
                    function (response) { // optional
                        console.log("getKeyWordsBySector AJAX failed!");
                    });


            angular.element(".operators").removeClass("hidden");
            angular.element(".experienceBeforeParse").addClass(
                "hidden");
            angular.element(".requirements").addClass(
                "hidden");

        }


        var itemCount = 0;
        var awaitingCopy = false;

        $(init);

        //click Plus Button


        $(function () {
            $(document).on("click", ".plusButton", function () {
                fieldName = $(this).attr('data-field');
                type = $(this).attr('data-type');
                var className = $(this).parent().parent().find(".input-number")[0].className.split(" ")[2];
                var dataPrNum = $(this).parent().parent().find("." + className + ".input-number").attr('data-pr-num');
                var input = $("input[data-pr-num='" + dataPrNum + "']");
                var currentVal = parseInt(input.val());
                if (!isNaN(currentVal)) {
                    if (type == 'plus' && sumPrioroty < 100 && className == 'center1') {

                        if (currentVal < input.attr('max')) {
                            input.val(currentVal + 10).change();
                            sumPrioroty += 10;
                        }
                        if (parseInt(input.val()) == input.attr('max')) {
                            $(this).attr('disabled', true);
                        }

                    }
                    else if (type == 'plus' && sumPrioroty2 < 100 && className == 'center2') {
                        if (currentVal < input.attr('max')) {
                            input.val(currentVal + 10).change();
                            sumPrioroty2 += 10;
                        }
                        if (parseInt(input.val()) == input.attr('max')) {
                            $(this).attr('disabled', true);
                        }
                    }
                } else {
                    input.val(0);
                }
                $('.input-number').focusin(function () {
                    $(this).data('oldValue', $(this).val());
                });
                $('.input-number').change(function () {

                    minValue = parseInt($(this).attr('min'));
                    maxValue = parseInt($(this).attr('max'));
                    valueCurrent = parseInt($(this).val());

                    name = $(this).attr('name');
                    if (valueCurrent >= minValue) {
                        $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
                    } else {
                        $(this).val($(this).data('oldValue'));
                    }
                    if (valueCurrent <= maxValue) {
                        $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
                    } else {
                        $(this).val($(this).data('oldValue'));
                    }


                });
            });
            //click Minus Button
            $(document).on("click", ".minusButton", function () {
                fieldName = $(this).attr('data-field');
                type = $(this).attr('data-type');
                var className = $(this).parent().parent().find(".input-number")[0].className.split(" ")[2];
                var dataPrNum = $(this).parent().parent().find("." + className + ".input-number").attr('data-pr-num');
                var input = $("input[data-pr-num='" + dataPrNum + "']");

                var currentVal = parseInt(input.val());
                if (!isNaN(currentVal)) {
                    if (type == 'minus') {

                        if (currentVal > input.attr('min')) {
                            input.val(currentVal - 10).change();
                            if (className == 'center1')
                                sumPrioroty -= 10;
                            else
                                sumPrioroty2 -= 10;
                        }
                        if (parseInt(input.val()) == 0) {
                            $(this).attr('disabled', true);
                        }

                    }
                } else {
                    input.val(0);
                }
            });
            $('.input-number').focusin(function () {
                $(this).data('oldValue', $(this).val());
            });
            $('.input-number').change(function () {

                minValue = parseInt($(this).attr('min'));
                maxValue = parseInt($(this).attr('max'));
                valueCurrent = parseInt($(this).val());

                name = $(this).attr('name');
                if (valueCurrent >= minValue) {
                    $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
                } else {
                    $(this).val($(this).data('oldValue'));
                }
                if (valueCurrent <= maxValue) {
                    $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
                } else {
                    $(this).val($(this).data('oldValue'));
                }


            });
        });


        function init() {
            $("#Items").sortable({
                revert: true,
                placeholder: "ItemPlaceHolder",
                opacity: 0.6,
                start: StartDrag,
                stop: StopDrag
            });
            $("#Items2").sortable({
                revert: true,
                placeholder: "ItemPlaceHolder",
                opacity: 0.6,
                start: StartDrag,
                stop: StopDrag
            });


            $("#NewItem").click(function (e) {
                e.preventDefault();
                itemCount++;
                var input = '<input type="text" placeholder="Please type Language"><h3 style="float:left;">Years:</h3><select class="form-control" name="years"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>';

                var element = $("<div class='Item newItem oItem' id='itemCount" + itemCount + "'>" + input + "</div>");
                $("#Items").append(element);
                element.hide().slideDown(500);
            });
            $("#NewItem2").click(function (e) {
                e.preventDefault();
                itemCount++;
                var input = '<input type="text" placeholder="Please type Language"><h3 style="float:left;">Years:</h3><select class="form-control" name="years"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>';

                var element = $("<div class='Item newItem oItem2' id='itemCount" + itemCount + "'>" + input + "</div>");
                $("#Items2").append(element);
                element.hide().slideDown(500);
            });

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


            var element = '<div><div class="input-group" style="float: right; width: 15%;"><span class="input-group-btn"><button type="button" class="btn btn-danger btn-number minusButton" data-type="minus" data-field="quant[2]"><i class="fa fa-minus" aria-hidden="true"></i> </button></span> <input type="text" name="quant[2]" data-pr-num="' + prNum + '" class="form-control input-number center1" disabled value="0" min="0" max="100"> <span class="input-group-btn"> <button type="button"   class="btn btn-success btn-number plusButton" data-type="plus"  ng-click="plusButton()" data-field="quant[2]"> <i class="fa fa-plus" aria-hidden="true"></i></button></span></div></div><h3>Percentage: </h3>';
            prNum++;
            // var element = '<input type="text" class="form-control" value="0"><h3>Percentage: </h3>';
            var prevClass = ui.item[0].previousElementSibling.className.split(" ")[1];
            var prevClassAfterClass = ui.item[0].previousElementSibling.className.split(" ")[2];

            if (prevClass == 'mustItem1' || prevClassAfterClass == 'mItem' || prevClass == 'mItem') {
                console.log(ui.item[0]);
                if (ui.item[0].innerHTML.indexOf("center") == -1)
                    ui.item[0].innerHTML += element;
                ui.item.addClass("mItem").removeClass("aItem").removeClass("oItem");
            }
            else if (prevClass == 'advantageItem1' || prevClassAfterClass == 'aItem' || prevClass == 'aItem') {
                if (ui.item[0].innerHTML.indexOf("center") != -1) {
                    console.log(ui.item[0]);
                    var text = ui.item[0].innerHTML.toString();
                    text = text.substring(0, text.length - element.length);
                    ui.item[0].innerHTML = text;
                }
                ui.item.removeClass("mItem").addClass("aItem").removeClass("oItem");
            }
            else if (prevClass == 'orItem1' || prevClassAfterClass == 'oItem' || prevClass == 'oItem') {
                if (ui.item[0].innerHTML.indexOf("center") != -1) {
                    var text = ui.item[0].innerHTML.toString();
                    text = text.substring(0, text.length - element.length);
                    ui.item[0].innerHTML = text;
                }
                ui.item.removeClass("mItem").removeClass("aItem").addClass("oItem");
            }

            //second operations - OR

            else if (prevClass == 'mustItem2' || prevClassAfterClass == 'mItem2' || prevClass == 'mItem2') {
                element = '<div><div class="input-group" style="float: right; width: 15%;"><span class="input-group-btn"><button type="button" class="btn btn-danger btn-number minusButton" data-type="minus" data-field="quant[2]"><i class="fa fa-minus" aria-hidden="true"></i> </button></span> <input type="text" name="quant[2]" data-pr-num="' + prNum + '" class="form-control input-number center2" disabled value="0" min="0" max="100"> <span class="input-group-btn"> <button type="button"  class="btn btn-success btn-number plusButton" data-type="plus"  ng-click="plusButton()" data-field="quant[2]"> <i class="fa fa-plus" aria-hidden="true"></i></button></span></div></div><h3>Percentage: </h3>';

                ui.item.addClass("mItem2").removeClass("aItem2").removeClass("oItem2");
                if (ui.item[0].innerHTML.indexOf("center") == -1)
                    ui.item[0].innerHTML += element;
                /*
                 if (ui.item[0].innerHTML.indexOf("Percentage") == -1)
                 ui.item[0].innerHTML += element;*/
            }
            else if (prevClass == 'advantageItem2' || prevClassAfterClass == 'aItem2' || prevClass == 'aItem2') {
                element = '<div><div class="input-group" style="float: right; width: 15%;"><span class="input-group-btn"><button type="button" class="btn btn-danger btn-number minusButton" data-type="minus" data-field="quant[2]"><i class="fa fa-minus" aria-hidden="true"></i> </button></span> <input type="text" name="quant[2]" data-pr-num="' + prNum + '" class="form-control input-number center2" disabled value="0" min="0" max="100"> <span class="input-group-btn"> <button type="button"  class="btn btn-success btn-number plusButton" data-type="plus"  ng-click="plusButton()" data-field="quant[2]"> <i class="fa fa-plus" aria-hidden="true"></i></button></span></div></div><h3>Percentage: </h3>';

                ui.item.removeClass("mItem2").addClass("aItem2").removeClass("oItem2");
                if (ui.item[0].innerHTML.indexOf("Percentage") != -1) {
                    var text = ui.item[0].innerHTML.toString();
                    text = text.substring(0, text.length - element.length);
                    ui.item[0].innerHTML = text;
                }
            }
            else if (prevClass == 'orItem2 ' || prevClassAfterClass == 'oItem2' || prevClass == 'oItem2') {
                element = '<div><div class="input-group" style="float: right; width: 15%;"><span class="input-group-btn"><button type="button" class="btn btn-danger btn-number minusButton" data-type="minus" data-field="quant[2]"><i class="fa fa-minus" aria-hidden="true"></i> </button></span> <input type="text" name="quant[2]" data-pr-num="' + prNum + '" class="form-control input-number center2" disabled value="0" min="0" max="100"> <span class="input-group-btn"> <button type="button"  class="btn btn-success btn-number plusButton" data-type="plus"  ng-click="plusButton()" data-field="quant[2]"> <i class="fa fa-plus" aria-hidden="true"></i></button></span></div></div><h3>Percentage: </h3>';

                ui.item.removeClass("mItem2").removeClass("aItem2").addClass("oItem2");
                if (ui.item[0].innerHTML.indexOf("Percentage") != -1) {
                    var text = ui.item[0].innerHTML.toString();
                    text = text.substring(0, text.length - element.length);
                    ui.item[0].innerHTML = text;
                }
            }

        }


        /* ADD ANOTHER OPERATOR */
        $("#addmust").click(function () {
            $('').appendTo((".operators"));
            angular.element("#Page2").removeClass("hidden");
            angular.element(".operators > h3").show();
            $("#addmust").hide();
        });


    }
);

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
        function ($compile, $location, $rootScope, $http, $timeout) {
            return {
                link: function (scope, element, attr) {
                    var path = $location.path().split('/');
                    var lastPath = '';
                    console.log(path);

                    var navigation_path = '';
                    for (var i = 1; i < path.length; i++) {
                        //check if sting url is number
                        if (!isNaN(parseInt(path[i]))) {
                            var currPath = path[i];
                            var lastPathI = path[i - 1];
                            $timeout(function () {
                                var title = attr.cell;
                                navigation_path = "<span> > </span><a href='#/" + lastPathI + '/' + currPath + "'>" + title + "</a>";
                                lastPath += navigation_path;
                            }, 1000)

                        }
                        else {
                            navigation_path = "<span> > </span><a href='#/" + path[i] + "'>" + path[i] + "</a>";
                            lastPath += navigation_path;
                        }
                    }
                    $timeout(function () {
                        element.html($compile("<a href='#/usersLogin'>Homepage</a>" + lastPath)(scope));
                    }, 2000)

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
                scope: 'https://www.googleapis.com/auth/userinfo.email',
                fetch_basic_profile: false
            });
            gapi.auth2.init({
                fetch_basic_profile: false,
                scope: 'https://www.googleapis.com/auth/userinfo.email'
            }).then(
                function () {
                    auth2 = gapi.auth2.getAuthInstance();
                    auth2.isSignedIn.listen(updateSignIn);
                    auth2.then(updateSignIn);
                });
        });
    });
}
