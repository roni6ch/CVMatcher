/** **********************************ANGULAR*************************************** */

var app = angular.module('cvmatcherApp', ["ngRoute", "infinite-scroll", 'ngDragDrop']);

app.config(function ($routeProvider) {
    $routeProvider
    // employer
        .when('/', {
            templateUrl: 'googleSignIn.html',
            controller: 'googleSignInController'
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
        }).when('/yourjobs', {
        templateUrl: 'job_seeker/yourjobs.html',
        controller: 'yourjobSeekerController'
    }).when('/deleted', {
        templateUrl: 'job_seeker/yourjobs.html',
        controller: 'yourjobSeekerController'
    }).when('/searchJobs/:_id/matchpage', {
        templateUrl: 'job_seeker/matchpage.html',
        controller: 'matchpageController'
    }).when('/Profile', {
        templateUrl: 'job_seeker/profile.html',
        controller: 'seekerProfileControler'
    }).when('/Favorites', {
            templateUrl: 'job_seeker/yourjobs.html',
            controller: 'yourjobSeekerController'
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
}).filter('highlight', function ($sce) {
    return function (text, phrase) {
        if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
            '<span class="highlighted">$1</span>')
        return $sce.trustAsHtml(text)
    }
});


/*
 * ********************* googleSignIn controller ****************
 */

app.controller('googleSignInController', function ($rootScope) {
    $rootScope.userSignInType = '';
});

/*
 * ********************* usersLogin controller ****************
 */

var user;
app.controller('usersLoginController', function ($scope, $http, $sce, $rootScope, $compile, $timeout) {
    $("#profileImg").attr("src", "");
    $rootScope.userSignInType = "";
    if (profile)
        $.cookie('google_id', profile.id);
    var familyName;
    var givenName;
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
                console.log("givenName: " + profile.name.givenName);
                console.log("familyName: " + profile.name.familyName);
                console.log("id: " + profile.id);
                console.log("email: " + profile.emails[0].value);
                if (profile.name.givenName == '') {
                    givenName = "Name";
                }
                else {
                    givenName = profile.name.givenName;
                }
                if (profile.name.familyName == '') {
                    familyName = "Family";
                }
                else {
                    familyName = profile.name.familyName;
                }
                $http({
                    url: 'https://cvmatcher.herokuapp.com/addUser',
                    method: "POST",
                    data: {
                        "google_user_id": profile.id,
                        "first_name": givenName,
                        "last_name": familyName,
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

        }
        else if (type == 'jobSeeker') {
            $rootScope.userSignInType = "jobSeeker";
            $.cookie('profile', "#/Profile");
            $.cookie('userSignInType', "jobSeeker");
            angular.element("#profileImg").parent().attr("href", $.cookie('profile'));
            if ($.cookie('user'))
                $("#profileImg").attr("src", $.parseJSON($.cookie('user')).image);

            if (firstTimeLogInJobSeeker == true) {

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
                        firstTimeLogInJobSeeker = false;

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
    $scope.saveData = function (title, compatibility_level) {
        $.cookie('jobTitle', title);
        $.cookie('compatibility_level', compatibility_level);
    }

})


/*
 * ********************* job page by ID Controller ****************
 */
/*app.controller('jobpagebyIDController', function ($scope, $http, $location, $rootScope) {


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
 if ($id[1] == 'yourjobs') {
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
 console.log("jobSeekerJobs AJAX failed!");
 });


 });*/
/*
 * ********************* MY JOBS - Job Seeker Controller ****************
 */

app.controller('yourjobSeekerController', function ($scope, $http, $sce, $location) {
    var url;
    var path = $location.path().split('/')[1];
    var navigation;
    var data;
    $scope.getMainJson = function () {
        if (path == 'Favorites') {
            url = 'https://cvmatcher.herokuapp.com/jobSeeker/getFavoritesJobs';
            navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/Favorites'>Favorites Jobs</a>";
            $scope.title = "Favorites Jobs";
            $scope.page = 'favorites';
            data = {
                "user_id": $.cookie('user_id')
            }

        }
        else if (path == 'yourjobs') {
            url = 'https://cvmatcher.herokuapp.com/jobSeeker/getMyJobs';
            $scope.title = "My Jobs";
            $scope.page = 'myjobs';
            navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/yourjobs'>My Jobs</a>";
            data = {
                "user_id": $.cookie('user_id'),
                "active": true
            }
        }
        else if (path == 'deleted') {
            url = 'https://cvmatcher.herokuapp.com/jobSeeker/getMyJobs';
            $scope.title = "Deleted Jobs";
            $scope.page = 'deleted';
            data = {
                "user_id": $.cookie('user_id'),
                "active": false
            }
            navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/deleted'>Deleted Jobs</a>";
        }
        $http({
            url: url,
            method: "POST",
            data: data
        })
            .then(function (data) {
                    //navigation in site
                    $(".navigation")[0].innerHTML = navigation;
                    console.log(data.data);
                    if (data.data.length > 0) {

                        angular.element(".fa-pulse").hide();
                        $scope.jobSeekerJobs = data.data[0].jobs;


                        //fix date string
                        if (data.data[0].jobs.length > 0) {
                            angular.forEach(data.data[0].jobs, function (value, key) {
                                var currcent_status = value.cv.status.current_status;

                                data.data[0].jobs[key].job.date = value.job.date.split("T")[0];
                            });
                        }
                    } else {
                        //no jobs
                        angular.element(".fa-pulse").hide();
                    }
                },
                function (response) { // optional
                    console.log("jobSeekerJobs AJAX failed!");
                });
    }

    $scope.removeReviveJob = function (id, bool) {
        $http({
            url: 'https://cvmatcher.herokuapp.com/jobSeeker/updateActivityJob',
            method: "POST",
            data: {
                "job_seeker_job_id": id,
                "active": bool
            }
        })
            .then(function (data) {
                console.log(data);
                var jobsArr = $scope.jobSeekerJobs;
                jobsArr = jobsArr.filter(function (obj) {
                    return obj._id !== id;
                });
                $scope.jobSeekerJobs = jobsArr;
            });
    }

    $scope.favoriteJob = function (id, indx) {
        var favorite;
        if ($("#fav" + indx).hasClass("fa-heart-o")) {
            $("#fav" + indx).addClass("fa-heart").removeClass("fa-heart-o");
            favorite = true;
        }
        else {
            $("#fav" + indx).addClass("fa-heart-o").removeClass("fa-heart");
            favorite = false;
        }

        $http({
            url: 'https://cvmatcher.herokuapp.com/jobSeeker/updateFavoriteJob',
            method: "POST",
            data: {
                "job_seeker_job_id": id,
                "favorite": favorite
            }
        })
            .then(function (data) {
                    if (path == 'Favorites') {
                        var jobsArr = $scope.jobSeekerJobs;
                        jobsArr = jobsArr.filter(function (obj) {
                            return obj._id !== id;
                        });
                        $scope.jobSeekerJobs = jobsArr;
                    }
                },
                function (response) { // optional
                    console.log("updateFavoriteJob AJAX failed!");
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
        function ($scope, $http, $compile, $rootScope, $timeout) {
            $("#geocomplete").geocomplete();
            $("[rel='popover']").popover({trigger: "hover", container: "body"});
            var cvId;
            var cvJson = false;

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
                            if (typeof data.data[0].current_cv !== 'undefined' && data.data[0].current_cv != null) {
                                var currentId = data.data[0].current_cv;
                                $.cookie('current_cv', currentId);
                                console.log($.cookie('current_cv'));
                                $http({
                                    url: 'https://cvmatcher.herokuapp.com/getMatchingObject',
                                    method: "POST",
                                    data: {
                                        "matching_object_id": currentId,
                                        "matching_object_type": "cv"
                                    }
                                })
                                    .then(function (data) {
                                            angular.element(".fa-pulse").hide();
                                            console.log(data);

                                            $scope.jobSeekerCV = data.data[0];
                                            cvJson = true;
                                            if ($scope.jobSeekerCV.original_text.history_timeline.length == 0) {
                                                $scope.addEducation('education');
                                                $scope.addEducation('employment');
                                            }
                                            if (cvJson) {
                                                if ($scope.jobSeekerCV.requirements[0].combination.length > 0)
                                                    angular.forEach($scope.jobSeekerCV.requirements[0].combination, function (value, key) {
                                                        var yearsExperience = '<label class="parserExperienceYearsLabel">Years<input type="text" class="form-control" class="parserExperienceYears" name="experience_years" value="' + value.years + '"></label>';
                                                        angular.element(".parseExperience").append('<div class="parser"><label class="parserExperienceLanguage">Language<input type="text" required class="form-control " id="experience" name="experience"' +
                                                            ' value="' + value.name + '"  /></label>' + yearsExperience) + '</div>';
                                                    });
                                                /* angular
                                                 .element(".parseExperienceButton").hide();
                                                 angular
                                                 .element(".parseExperiencePlusButton").removeClass("hidden");*/
                                                angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");
                                            }
                                        },
                                        function (response) { // optional
                                            angular.element(".fa-pulse").hide();
                                            console.log("jobSeekerCv AJAX failed!");
                                        }
                                    );
                            } else {
                                $scope.addEducation('education');
                                $scope.addEducation('employment');

                                angular.element(".fa-pulse").hide();

                            }
                            //userId = data.data[0]._id;
                            angular.element(".fa-pulse").hide();
                        },
                        function (response) { // optional
                            angular.element(".fa-pulse").hide();
                            console.log("jobSeekerJobs AJAX failed!");
                        });
            }

            $scope.removeContentCV = function (index) {
                $scope.changeContent();

                angular.element("#submitAfterParse").addClass("disabled").css("pointer-events", "none");
                $("#cvLi" + index).remove();
            }
            $scope.changeContent = function () {

                angular.element("#submitAfterParse").addClass("disabled").css("pointer-events", "none");
                angular
                    .element(".parseExperienceButton").show();
                angular
                    .element(".parseExperiencePlusButton").addClass("hidden");

            }
            $scope.selectYear = function (startYear) {
                console.log(startYear);
            }

            var fromExperience = '<label>From<select id="experience_years" name="experience_years"class="form-control" id="sel1"><option value="2000">0</option><option value="2005">2005</option><option value="2006">2006</option><option value="2007">2007</option><option value="2008">2008</option><option value="2009">2009</option><option value="2010">2010</option><option value="2011">2011</option><option value="2012">2012</option><option value="2013">2013</option><option value="2014">2014</option><option value="2015">2015</option><option value="2016">2016</option></select></label>';
            var toExperience = '<label>To<select id="experience_years" name="experience_years"class="form-control" id="sel1"><option value="2000">0</option><option value="2005">2005</option><option value="2006">2006</option><option value="2007">2007</option><option value="2008">2008</option><option value="2009">2009</option><option value="2010">2010</option><option value="2011">2011</option><option value="2012">2012</option><option value="2013">2013</option><option value="2014">2014</option><option value="2015">2015</option><option value="2016">2016</option></select></label>';

            var parseExpereince = {
                "expereince": []
            }
            history_timeline = [];
            $scope.parseMyExperience = function () {
                parseExpereince = {
                    "expereince": []
                };
                if (cvJson) {
                    $(".parseExperience").html("");
                }
                angular.element(".fa-spin").show();
                $.each($(".timeline .timeline-inverted"), function (key, val) {
                    var text = $(this).find('.timeline-body textarea').val();
                    var startdate = $(this).find('.timeline-heading label:nth-child(2) select').val();
                    var enddate = $(this).find('.timeline-heading label:nth-child(3) select').val();
                    console.log(startdate);
                    console.log(enddate);

                    parseExpereince.expereince.push({
                        "text": text,
                        "startdate": startdate,
                        "enddate": enddate
                    });
                });

                var type;
                history_timeline = [];
                $.each($(".timeline li"), function (key, val) {
                    var text = $(this).find('.timeline-body textarea').val();
                    var startdate = $(this).find('.timeline-heading label:nth-child(2) select').val();
                    var enddate = $(this).find('.timeline-heading label:nth-child(3) select').val();
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
                                        console.log("findIfKeyWordsExistsCV AJAX failed!");
                                    });
                        },
                        function (response) { // optional
                            console.log("getKeyWordsBySector AJAX failed!");
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
                var indx = $(".timeline li").length;
                indx++;
                if (type == 'education') {
                    var divTemplate = '<li><div class="timeline-badge" id="cvLi' + indx + '" ng-click="addEducation(' + "'education'" + ')"><i class="fa fa-plus"></i></div><div class="timeline-panel"><div class="timeline-heading"> <i class="fa fa-times fa-2x removeContentCV" aria-hidden="true" ng-click="removeContentCV(' + indx + ')"></i>' + fromExperience + toExperience + '</div><div class="timeline-body"><p><div class="form-group"><label for="content">Content:</label><textarea class="form-control" rows="3" name="content" id="content" required></textarea></div></p></div></div></li>';

                }
                else {
                    var divTemplate = '<li class="timeline-inverted" id="cvLi' + indx + '"><div class="timeline-badge" ng-click="addEducation(' + "'employment'" + ')"><i class="fa fa-plus"></i></div><div class="timeline-panel"><div class="timeline-heading"> <i class="fa fa-times fa-2x removeContentCV" aria-hidden="true" ng-click="removeContentCV(' + indx + ')"></i>' + fromExperience + toExperience + '</div><div class="timeline-body"><p><div class="form-group"><label for="content">Content:</label><textarea class="form-control" rows="3" name="content" id="content" required></textarea></div></p></div></div></li>';
                }
                var temp = $compile(divTemplate)($scope);
                angular.element(".timeline").append(temp);

                if (cvJson) {
                    angular
                        .element(".parseExperienceButton").show();
                    angular
                        .element(".parseExperiencePlusButton").addClass("hidden");
                }
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
                            $scope.status = 'Deatils Sent Succesfully';
                            $('#myModal').modal('show');
                            $scope.tab = 1;
                        },
                        function (response) { // optional
                            console.log("jobSeeker send form AJAX failed!");
                        });
            }
            var combination;
            $scope.submitUserCV = function () {
                combination = [];
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
                if (jobSeekerCVScopeOfPosition.length == 0) {
                    $scope.status = 'Please fill the "Scope of Position" section';
                    $('#myModal').modal('show');
                    return;
                }
                /*var key = 'scope_of_position';
                 var val = $('.scope_of_position').find(":selected").val();*/
                var jobSeekerCVAcademy = [];
                $.each($(".jobSeekerCVAcademy input:checked"), function () {
                    jobSeekerCVAcademy.push($(this).val());
                });

                if (jobSeekerCVAcademy.length == 0) {
                    $scope.status = 'Please fill the "Academy" section';
                    $('#myModal').modal('show');
                    return;
                }

                var jobSeekerCVHistoryTimeLine = [];
                //history_timeline
                $.each($(".timeline-panel textarea"), function () {
                    jobSeekerCVHistoryTimeLine.push($(this).val());
                });

                if (cvJson) {
                    url = "https://cvmatcher.herokuapp.com/updateMatchingObject";
                    var jobSeekerCV = {
                        "_id": $scope.jobSeekerCV._id,
                        "matching_object_type": "cv",
                        "date": new Date(),
                        "personal_properties": {
                            "_id": $scope.jobSeekerCV.personal_properties._id,
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
                            "_id": $scope.jobSeekerCV.original_text._id,
                            "history_timeline": history_timeline
                        },
                        "sector": $('.jobSeekerCVsector').find(":selected").val(),
                        "locations": [$('#geocomplete').val()],
                        "candidate_type": [$('.jobSeekerCVCandidateType').find(":selected").val()],
                        "scope_of_position": jobSeekerCVScopeOfPosition,
                        "academy": {
                            "_id": $scope.jobSeekerCV.academy._id,
                            "academy_type": jobSeekerCVAcademy,
                            "degree_name": $.trim($('.degree_name').find(":selected").val()),
                            "degree_type": [$('.degree_type').find(":selected").val()]
                        },
                        "requirements": [{
                            "combination": combination
                        }],
                        "user": $rootScope.user_id
                    }
                }
                else {
                    console.log("first cv");
                    url = "https://cvmatcher.herokuapp.com/addMatchingObject";
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
                }


                console.log("send form: ", jobSeekerCV);
                /* if ($scope.jobSeekerCV == "undefined" || $scope.jobSeekerCV == null) {*/
                //if i got data then do update, else do add

                $http({
                    url: url,
                    method: "POST",
                    data: jobSeekerCV
                })
                    .then(function (data) {
                            $scope.status = 'Resume Sent Succesfully';
                            $('#myModal ').modal('show');

                        },
                        function (response) { // optional
                            console.log("jobSeekerJobs send form AJAX failed!");
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
            console.log("cv: " + $.cookie('current_cv'));
            console.log("job: " + $jobId);
            $scope.checkMyCV = function () {
                $http({
                    url: 'https://cvmatcher.herokuapp.com/jobSeeker/checkCV',
                    method: "POST",
                    data: {
                        "cv_id": $.cookie('current_cv'),
                        "job_id": $jobId
                    }
                })
                    .then(function (data) {
                            //navigation in site
                            var navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/searchJobs'>Search Jobs</a><span> > </span><a href='#/searchJobs/" + $jobId + "'>" + $.cookie('jobTitle') + "</a><span> > </span><a href='#/searchJobs/" + $jobId + "/matchpage'>Match Page</a>"
                            $(".navigation")[0].innerHTML = navigation;

                            if (data.data.formula !== undefined) {
                                console.log(data.data);


                                console.log("data: ", data.data);
                                if (data.data.formula.requirements.grade > 0) {
                                    var colors = ['#F74CF0', '#9F4CF7', '#4C58F7', '#4CBEF7', '#4CF7F0', '#4CF772', '#ACF74C', '#F7EB4C'];
                                    var fillColors = ['#C1BFBF', '#e6e6e6'];
                                    //Big circle percentages
                                    if (data.data.formula.requirements.details.length > 0) {
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
                                    }
                                }
                                else {
                                    $("#circle-container1 > h2").html("");
                                    $scope.status = 'there is no data for your skills - Please update your CV!';
                                    $('#sendCVstatus').modal('show');
                                }
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
                            }
                            else {
                                angular.element(".fa-pulse").hide();
                                $scope.status = "Please Update your CV!";
                                angular.element(".fa-pulse").hide();
                            }
                        },
                        function (response) { // optional
                            console.log(response);
                            angular.element(".fa-pulse").hide();
                            $scope.status = response.data.error;
                            $('#sendCVstatus').modal('show');
                        });

            }


            $scope.sendCV = function () {

                $http({
                    url: 'https://cvmatcher.herokuapp.com/jobSeeker/addCvToJob',
                    method: "POST",
                    data: {
                        "job_id": $jobId,
                        "cv_id": $.cookie('current_cv')
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
    function ($scope, $http, $location, $sce, $rootScope, $timeout) {
        var company = false;
        var companyId;
        var tabType = '';
        $("#geocomplete").geocomplete();
        $("#geocomplete2").geocomplete();
        $scope.chooseCompanyModal = false;
        $scope.passForCompany = '';
        $scope.changePassword = false;
        $scope.password = false;
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
                            if (companyId) {
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
                                            console.log("company: ", data.data[0]);
                                            angular.element(".fa-pulse").hide();
                                        },
                                        function (response) { // optional
                                            console.log("companyProfileController AJAX failed!");
                                        });
                            }

                        }
                        else
                            $scope.password = true;
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
                        $('#update').modal('show');
                        $scope.status = "User Updated Succesfully!"
                        $scope.tab = 1;
                    },
                    function (response) { // optional
                        $scope.status = "Error User Update!"
                    });
        }

        $scope.submitCompanyDetails = function () {
            if (logo == '')
                logo = $(".companyLogo > img").attr("src");
            if (logo == undefined)
                logo = 'http://www.megaicons.net/static/img/icons_sizes/53/135/256/default-icon-icon.png';

            tabType = 'profile';
            $scope.status = '';
            if (!company) {

                var companyJson = {
                    "user_id": $.cookie('user_id'),
                    "name": $(".companyName").val(),
                    "logo": logo,
                    "p_c": $(".companyPC").val(),
                    "address": $("#geocomplete2").val(),
                    "password": $(".passwordCompany").val(),
                    "phone_number": $(".companyPhoneNumber").val()
                }

                console.log("send form: ", companyJson);
                $http({
                    url: 'https://cvmatcher.herokuapp.com/employer/addCompany',
                    method: "POST",
                    data: companyJson
                }).then(function (data) {
                        $('#update').modal('show');
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

                tabType = 'company';
                console.log("send form: ", companyJson);
                $http({
                    url: 'https://cvmatcher.herokuapp.com/employer/updateCompany',
                    method: "POST",
                    data: companyJson
                }).then(function () {
                        $('#update').modal('show');
                        $scope.status = "Company Updated Succesfully!"
                    },
                    function (response) { // optional
                        $scope.status = "Error Company Update!"
                    });

                //send new password
                if ($scope.changePassword == true) {
                    console.log($scope.employerProfile['company']);
                    console.log($(".passwordCompany").val());
                    console.log($(".newPasswordCompany").val());
                    $http({
                        url: 'https://cvmatcher.herokuapp.com/employer/changeCompanyPassword',
                        method: "POST",
                        data: {
                            "company_id": $scope.employerProfile['company'],
                            "old_password": $(".passwordCompany").val(),
                            "new_password": $(".newPasswordCompany").val()
                        }
                    }).then(function () {
                            $('#update').modal('show');
                            $scope.status = "Company Updated Succesfully!"
                        },
                        function (response) { // optional
                            $scope.status = "Wrong Password!"
                        });
                }


            }


        }


        $scope.changePassword = function () {

            $scope.changePassword = true;
        }


        $scope.getCompanies = function () {
            $scope.chooseCompanyModal = false;
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getCompanies',
                method: "GET"
            }).then(function (data) {
                    console.log(data);
                    $scope.companies = data.data;
                },
                function (response) { // optional
                    $scope.status = "Error get Companies!"
                });
        }
        var companyId;
        $scope.checkCompany = function (id) {
            console.log(id);
            companyId = id;
            $scope.chooseCompanyModal = true;
            $('#update').modal('show');
            $scope.status = "Password";
            //remove the v check mark from other buttons
            logo = $(this).find("img").prevObject[0].logo;
            $.each($(".companies label"), function () {
                $(this).removeClass('active');
            });
        }
        $scope.sendPassword = function () {
            var pass = $scope.passForCompany;
            console.log("companyId: " + companyId);
            console.log("user_id: " + $.cookie('user_id'));
            console.log("passForCompany: " + pass);
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/addToExistingCompany',
                method: "POST",
                data: {
                    "user_id": $.cookie('user_id'),
                    "company_id": companyId,
                    "password": pass
                }
            }).then(function (data) {
                    console.log(data);


                },
                function (response) { // optional
                    $scope.status = "Error  sendPassword!"
                });
        }
        $scope.closeModal = function () {
            $scope.chooseCompanyModal = false;
            $timeout(function () {
                if (tabType == 'company')
                    window.location.href = '#/myjobs';
            }, 500);
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
        $scope.Hired = function () {
            angular.element(".fa-pulse").show();
            $scope.hiredCandidates = '';
            console.log($scope.jobId);
            console.log($.cookie('user_id'));
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getHiredCvs',
                method: "POST",
                data: {
                    "user_id": $.cookie('user_id'),
                    "job_id": $scope.jobId
                }
            })
                .then(function (data) {
                        console.log(data.data);
                        $scope.hiredCandidates = data.data;
                        angular.element(".fa-pulse").hide();
                    },
                    function (response) { // optional
                        console.log("Hired AJAX failed!");
                    });
        }


        $scope.sort = function (sort) {
            $scope.sortby = sort;
        }

        $scope.addCandidateToLike = function (candidate) {
            console.log(candidate);
            if (angular.element("#candidateLike-" + candidate).hasClass(
                    "like")) {
                angular.element("#candidateLike-" + candidate).removeClass(
                    "like").addClass("unlike");
                $scope.userId = candidate;
                $(".leftModal").click();
                var candidatesArr = $scope.likeCandidates;
                candidatesArr = candidatesArr.filter(function (obj) {
                    return obj._id !== candidate;
                });
                $scope.likeCandidates = candidatesArr;
            }
            else {
                angular.element("#candidateLike-" + candidate).removeClass(
                    "unlike").addClass("like");
                $scope.userId = candidate;
                console.log(candidate);
                $(".starModal").click();
                console.log($scope.unlikeCandidates);
                var candidatesArr = $scope.unlikeCandidates;
                candidatesArr = candidatesArr.filter(function (obj) {
                    return obj._id !== candidate;
                });
                $scope.unlikeCandidates = candidatesArr;
            }

        }
        var stars = 0;
        $scope.rating = function (rateNumber) {
            stars = rateNumber;
        }

        $scope.hire = function (cvId) {
            console.log(cvId);
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/hireToJob',
                method: "POST",
                data: {
                    "user_id": $.cookie('user_id'),
                    "cv_id": cvId
                }
            })
                .then(function (data) {
                        //remove from list filter
                        var canArr = $rootScope.likeCandidates;
                        canArr = canArr.filter(function (obj) {
                            return obj._id != cvId;
                        });
                        $rootScope.likeCandidates = canArr;

                    },
                    function (response) { // optional
                        console.log("Hired AJAX failed!");
                    });
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
                        var navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/myjobs'>My Jobs</a><span> > </span><a href='#/Candidates/" + $id[3] + "'>Candidates of " + $.cookie('jobTitle') + "</a><span> > </span><a href='#/Unread/" + $id[2] + "/resume/" + id + "'>" + data.data[0].user.first_name + " " + data.data[0].user.last_name + " Resume</a>"
                        $(".navigation")[0].innerHTML = navigation;
                        $scope.user = data.data[0];
                        console.log(data.data[0])
                        angular.element(".fa-pulse").hide();
                        if ($id[1] == "Unread") {
                            $scope.user["stars"] = 0;
                        }


                        if (data.data[0].formula.matching_requirements > 0) {
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
                        }
                        else {
                            $(".resumeSkillsBox > h3").html("There is no Skills for this Candidate!");
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
                $("#candidateUnLike").click();
            });
            // SWIPE RIGHT - USER
            $user.on("swiperight", function (ev) {
                $("#candidateLike").click();
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

var requirements = [];
var nextCombinationKey = 0;
var langId = 0;
var totalPriorotySum = 0;
var newLangClicked = false;
app.controller('jobController', function ($scope, $http, $location, $timeout, $compile, $rootScope) {

        $(".requirementsWrapper").hide();
        $id = $location.path().split('/')[1];
        $("#geocomplete").geocomplete();
        angular.element('.selectpicker').selectpicker();

        $jobId = $location.path().split('/')[2];
        var sumSliders = 0;
        var combinationForJob = [];
        var json = [];
        var languages = [];
        var newLang = [];
        $rootScope.langs = [];
        $rootScope.list1 = [];
        $rootScope.list2 = [];
        $rootScope.list3 = [];

        var combination = [];
        var tempMustLangs = [];
        var tempAdvLangs = [];
        var tempOrLangs = [];
        var combinationsLength = 0;
        var combinationLengthAfterEdit = 0;
        var savedCurrentCombination = false;
        var editJob = false;
        //edit job - get AJAX details
        $scope.getJobJson = function () {
            $(".fa-arrow-right").hide();
            $(".fa-arrow-left").hide();

            if ($id == 'job') {
                requirements = [];
                //url for later to submit!
                url = 'https://cvmatcher.herokuapp.com/updateMatchingObject';
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

                        editJob = true;

                        combinationsLength = data.data[0].requirements.length - 1;
                        combinationLengthAfterEdit = data.data[0].requirements.length;
                        if (combinationsLength > 1)
                            $(".fa-arrow-right").show();
                        var i = 0;

                        totalPriorotySum = 100;
                        if (data.data[0].requirements.length > 0) {
                            $.each(data.data[0].requirements, function (k, v) {
                                i++;
                                var combination = [];
                                $.each(v.combination, function (key, val) {
                                        if (val.mode == 'must') {
                                            tempMustLangs.push({
                                                'langId': langId++,
                                                'name': val.name,
                                                'mode': val.mode,
                                                'years': parseInt(val.years),
                                                'percentage': parseInt(val.percentage),
                                                'drag': true
                                            });

                                            combination.push(tempMustLangs[0]);
                                        }
                                        else if (val.mode == 'adv') {
                                            tempAdvLangs.push({
                                                'langId': langId++,
                                                'name': val.name,
                                                'mode': val.mode,
                                                'years': parseInt(val.years),
                                                'percentage': parseInt(val.percentage),
                                                'drag': true
                                            });
                                            combination.push(tempAdvLangs[0]);
                                        }
                                        else {
                                            tempOrLangs.push({
                                                'langId': langId++,
                                                'name': val.name,
                                                'mode': val.mode,
                                                'years': parseInt(val.years),
                                                'percentage': parseInt(val.percentage),
                                                'drag': true
                                            });
                                            combination.push(tempOrLangs[0]);
                                        }

                                });
                                if (i == 1) {
                                    $rootScope.list1 = tempMustLangs;
                                    $rootScope.list2 = tempAdvLangs;
                                    $rootScope.list3 = tempOrLangs;

                                }

                                tempMustLangs = [];
                                tempAdvLangs = [];
                                tempOrLangs = [];

                                requirements.push({'combination': combination});

                                combination = [];


                            });
                            $scope.parseExperience();
                            console.log("requirements: " , requirements)

                        }
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
                url = 'https://cvmatcher.herokuapp.com/addMatchingObject';
                var navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/myjobs'>My Jobs</a><span> > </span><a href='#/newJob'>New Job</a>"
                $(".navigation")[0].innerHTML = navigation;

                editJob = true;
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

        //click on parse Orange button
        $scope.parseExperience = function () {

            var parseExpereince;
            var parseExpereinceAdv;
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
                        parseExpereinceAdv = {
                            "text": $("#requirementsAdvantage").val(),
                            "words": data.data
                        };
                        angular.element(".fa-spin").show();
                        var tempMust, tempAdv;

                        //Requerments Must
                        if ($id == 'job') {

                            totalPriorotySum = 100;

                            $(".requirementsWrapper").show();
                            angular.element(".fa-spin").hide();
                            angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");
                        }
                        else {
                            $http({
                                url: "https://matcherbuilders.herokuapp.com/findIfKeyWordsExistsJOB",
                                method: "POST",
                                data: parseExpereince
                            })
                                .then(function (data1) {

                                        combination = [];
                                        angular.element(".fa-spin").hide();
                                        $(".requirementsWrapper").show();
                                        angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");
                                        tempMustLangs = [];
                                        $.each(data1.data, function (key, val) {
                                            tempMust = {
                                                'langId': langId++,
                                                'name': val,
                                                'percentage': 0,
                                                'mode': "must",
                                                'years': 0,
                                                'drag': true
                                            }
                                            tempMustLangs.push(tempMust);
                                            combination.push(tempMust);
                                        });
                                        $rootScope.list1 = tempMustLangs;


                                        //adv
                                        $http({
                                            url: "https://matcherbuilders.herokuapp.com/findIfKeyWordsExistsJOB",
                                            method: "POST",
                                            data: parseExpereinceAdv
                                        })
                                            .then(function (data1) {

                                                    angular.element(".fa-spin").hide();
                                                    $(".requirementsWrapper").show();
                                                    angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");
                                                    tempAdvLangs = [];
                                                    $.each(data1.data, function (key, val) {
                                                        tempAdv = {
                                                            'langId': langId++,
                                                            'name': val,
                                                            'percentage': 0,
                                                            'mode': "adv",
                                                            'years': 0,
                                                            'drag': true
                                                        }

                                                        tempAdvLangs.push(tempAdv);
                                                        combination.push(tempAdv);
                                                    });

                                                    $rootScope.list2 = tempAdvLangs;

                                                },
                                                function (response) {
                                                    console.log("findIfKeyWordsExistsJOB AJAX failed!");
                                                });


                                        requirements.push({'combination': combination});
                                        console.log(requirements);


                                    },
                                    function (response) {
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

        //send form
        $scope.submitForm = function () {
            $scope.status = 'Please wait';
            if (sumSliders == 100 && totalPriorotySum == 100) {
                var academy = [];
                //scope_of_position
                $.each($(".academy input:checked"), function () {
                    academy.push($(this).val());
                });
                if (academy.length == 0) {
                    $('#sendJob').modal('show');
                    $scope.status = "Please fill Academy";
                    return;
                }
                var degree_type = [];
                //scope_of_position
                $.each($(".degree_type input:checked"), function () {
                    degree_type.push($(this).val());
                });
                if (degree_type.length == 0) {
                    $('#sendJob').modal('show');
                    $scope.status = "Please fill Degree Type";
                    return;
                }
                var scope_of_position = [];
                //scope_of_position
                $.each($(".scope_of_position input:checked"), function () {
                    scope_of_position.push($(this).val());
                });
                if (scope_of_position.length == 0) {
                    $('#sendJob').modal('show');
                    $scope.status = "Please fill Scope of Position";
                    return;
                }
                var candidate_type = [];
                //scope_of_position
                $.each($(".candidate_type input:checked"), function () {
                    candidate_type.push($(this).val());
                });
                if (candidate_type.length == 0) {
                    $('#sendJob').modal('show');
                    $scope.status = "Please fill Candidate Type";
                    return;
                }

                if ($id == 'job') {
                    var job = {
                        "_id": $jobId,
                        "matching_object_type": "job",
                        "original_text": {
                            "_id": $scope.jobDetails.original_text._id,
                            "title": $(".jobName").val(),
                            "description": $("#description").html(),
                            "requirements": $("#requirementsMust").val() + " ||| " + $("#requirementsAdvantage").val()
                        },
                        "sector": $(".sector :selected").val(),
                        "locations": [$("#geocomplete").val()],
                        "candidate_type": candidate_type,
                        "scope_of_position": scope_of_position,
                        "academy": {
                            "_id": $scope.jobDetails.academy._id,
                            "academy_type": academy,
                            "degree_name": $(".degree_name :selected").val(),
                            "degree_type": degree_type
                        },
                        "formula": {
                            "_id": $scope.jobDetails.formula._id,
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
                }
                else {
                    var job = {
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
                }

                console.log(job);

                $http({
                    url: url,
                    method: "POST",
                    data: job
                })
                    .then(function (data) {
                            if (data != null)
                                $('#sendJob').modal('show');
                            $scope.status = "Job Send Succesfuly";
                        },
                        function (response) { // optional
                            $scope.status = "Job did not send";
                            console.log("addMatchingObject send form AJAX failed!");
                        });
                //$http.post('http://cvmatcher.herokuapp.com/employer/setNewJob', JSON.stringify($scope.form, ,employerId:$id, time:dformat)).success(function(){/*success callback*/});
            }
            if (sumSliders != 100) {

                console.log("b");
                $('#sendJob').modal('show');
                $scope.status = "Please SUM the sliders to 100";
            }
            if (totalPriorotySum != 100) {
                console.log("c");
                $('#sendJob').modal('show');
                $scope.status = "Please SUM Prioroty to 100";
            }
        };


        /***    FROM HERE THE REQUERMENTS   ***/

            //ADD COMBINATION
        $scope.addDynamicCombination = function () {
            combinationLengthAfterEdit++;
            $(".fa-arrow-right").hide();
            if (totalPriorotySum == 100 && $rootScope.list1.length > 0) {
                nextCombinationKey++;
                combinationsLength++;
                $(".fa-arrow-left").show();
                /*if ($rootScope.list1 != 'undefined') {
                 $.each($rootScope.list1, function (key, val) {
                 combination.push(val);
                 });
                 }
                 if ($rootScope.list2 != 'undefined') {
                 $.each($rootScope.list2, function (key, val) {
                 combination.push(val);
                 });
                 }

                 if ($rootScope.list3 != 'undefined') {
                 $.each($rootScope.list3, function (key, val) {
                 combination.push(val);
                 });
                 }*/
                $rootScope.list1 = [];
                $rootScope.list2 = [];
                $rootScope.list3 = [];
                $rootScope.langs = [];
                combination = [];
                requirements.push({'combination': combination});
                //$scope.jobDetails = requirements;
                console.log(requirements);
                totalPriorotySum = 0;
                $scope.addDynamicLang();
            }
            else if ($rootScope.list1.length == 0) {
                $('#sendJob').modal('show');
                $scope.status = "Please add Must Language";
            }
            else if (totalPriorotySum != 100) {
                $('#sendJob').modal('show');
                $scope.status = "Please SUM Prioroty to 100";
            }
        }

        $scope.nextCombination = function (val) {
            console.log(totalPriorotySum);
            if (totalPriorotySum != 100) {
                $('#sendJob').modal('show');
                $scope.status = "Please sum Must Prioroty to 100";
                return;
            }
            if (val == 'right') {
                savedCurrentCombination = true;
                nextCombinationKey++;
                if (nextCombinationKey < combinationsLength && nextCombinationKey != combinationsLength) {
                    $(".fa-arrow-right").show();
                    $(".fa-arrow-left").show();
                }
                else {
                    $(".fa-arrow-right").hide();
                    $(".fa-arrow-left").show();
                }
            }
            else {
                nextCombinationKey--;
                if (nextCombinationKey < combinationsLength && nextCombinationKey != 0) {
                    $(".fa-arrow-right").show();
                    $(".fa-arrow-left").show();


                }
                else {
                    $(".fa-arrow-right").show();
                    $(".fa-arrow-left").hide();
                }
            }

            $rootScope.list1 = [];
            $rootScope.list2 = [];
            $rootScope.list3 = [];
            $rootScope.langs = [];
            tempMustLangs = [];
            tempAdvLangs = [];
            tempOrLangs = [];
            totalPriorotySum = 0;
            console.log(nextCombinationKey);
            console.log(requirements[nextCombinationKey].combination);
            $.each(requirements[nextCombinationKey].combination, function (key, val) {
                if (val.mode == 'must') {
                    totalPriorotySum += parseInt(val.percentage);
                    tempMustLangs.push({
                        'langId': val.langId,
                        'name': val.name,
                        'mode': val.mode,
                        'years': val.years,
                        'percentage': val.percentage,
                        'drag': true
                    });
                }
                else if (val.mode == 'adv') {
                    tempAdvLangs.push({
                        'langId': val.langId,
                        'name': val.name,
                        'mode': val.mode,
                        'years': val.years,
                        'percentage': val.percentage,
                        'drag': true
                    });
                }
                else if (val.mode == 'or') {
                    tempOrLangs.push({
                        'langId': val.langId,
                        'name': val.name,
                        'mode': val.mode,
                        'years': val.years,
                        'percentage': val.percentage,
                        'drag': true
                    });
                }
            });

            $rootScope.list1 = tempMustLangs;
            $rootScope.list2 = tempAdvLangs;
            $rootScope.list3 = tempOrLangs;


            console.log(requirements);
        }
        //ADD LANG
        $scope.addDynamicLang = function () {
            newLang = [];
            newLang.push({
                'langId': langId,
                'name': "Language",
                'percentage': 0,
                'mode': "langs",
                'years': 0,
                'drag': true
            });
            $rootScope.langs = newLang;
            newLangClicked = true;
        }
        //REMOVE LANG
        $scope.removeLang = function (id, sectType) {


            if (sectType == 'must') {
                $rootScope.list1 = $rootScope.list1.filter(function (obj) {
                    if (obj.langId == id) {
                        totalPriorotySum -= parseInt(obj.percentage);
                    }
                    return obj.langId != id;
                });
            }
            if (sectType == 'adv') {
                $rootScope.list2 = $rootScope.list2.filter(function (obj) {
                    return obj.langId != id;
                });
            }
            if (sectType == 'or') {
                $rootScope.list3 = $rootScope.list3.filter(function (obj) {
                    return obj.langId != id;
                });
            }
            /*console.log(requirements);

             $.each(requirements, function (key, val) {
             $.each(val.combination, function (k, v) {
             if (v.langId == id){
             console.log(requirements[key].combination);
             requirements[key].combination.splice(k,1);
             }
             });
             });
             console.log(requirements);*/
        }
        //NAMES
        $scope.changeLangeName = function (id) {
            $.each(requirements, function (key, val) {
                $.each(val.combination, function (k, v) {
                    if (v.langId == id) {
                        v.name = $("input[data-lang-name='" + id + "']").val();
                    }
                });
            });

            if ($rootScope.list1 != 'undefined')
                $.each($rootScope.list1, function (key, val) {
                    if (val.langId == id) {
                        val.name = $("input[data-lang-name='" + id + "']").val();
                    }
                });
            if ($rootScope.list2 != 'undefined')
                $.each($rootScope.list2, function (key, val) {
                    if (val.langId == id) {
                        val.name = $("input[data-lang-name='" + id + "']").val();
                    }
                });

            if ($rootScope.list3 != 'undefined')
                $.each($rootScope.list3, function (key, val) {
                    if (val.langId == id) {
                        val.name = $("input[data-lang-name='" + id + "']").val();
                    }
                });
            if ($rootScope.langs != 'undefined')
                $.each($rootScope.langs, function (key, val) {
                    if (val.langId == id) {
                        val.name = $("input[data-lang-name='" + id + "']").val();
                    }
                });
        }
        //YEARS
        $scope.changeYears = function (id) {

            $.each(requirements, function (key, val) {
                $.each(val.combination, function (k, v) {
                    if (v.langId == id) {
                        v.years = $("select[data-select='" + id + "']").val();
                    }
                });
            });


            $.each($rootScope.list1, function (key, val) {
                if (val.langId == id) {
                    val.years = $("select[data-select='" + id + "']").val();
                }
            });
            $.each($rootScope.list2, function (key, val) {
                if (val.langId == id) {
                    val.years = $("select[data-select='" + id + "']").val();
                }
            });
            $.each($rootScope.list3, function (key, val) {
                if (val.langId == id) {
                    val.years = $("select[data-select='" + id + "']").val();
                }
            });
            if ($rootScope.langs.length > 0)
                $.each($rootScope.langs, function (key, val) {
                    if (val.langId == id) {
                        val.years = $("select[data-select='" + id + "']").val();
                    }
                })
        }
        //PLUS
        $scope.plusButton = function (id) {
            if ($("input[data-pr-num='" + id + "']").val() < 100 && totalPriorotySum < 100) {
                $("input[data-pr-num='" + id + "']").val(parseInt($("input[data-pr-num='" + id + "']").val()) + 10);
                totalPriorotySum += 10;
                $(".minusButton").attr('disabled', false);

                $.each(requirements, function (key, val) {
                    $.each(val.combination, function (k, v) {
                        console.log("v.langId : " + v.langId);
                        if (v.langId == id) {
                            v.percentage = v.percentage + 10;
                        }
                    });
                });
                console.log(requirements);

                /* $.each($rootScope.list1, function (key, val) {
                 if (val.langId == id) {
                 val.percentage = parseInt(val.percentage) + 10;
                 }
                 });*/
            }
        }
        //MINUS
        $scope.minusButton = function (id) {


            if ($("input[data-pr-num='" + id + "']").val() > 0 && totalPriorotySum > 0) {
                $("input[data-pr-num='" + id + "']").val(parseInt($("input[data-pr-num='" + id + "']").val()) - 10);
                totalPriorotySum -= 10;
                $(".plusButton").attr('disabled', false);

                $.each(requirements, function (key, val) {
                    $.each(val.combination, function (k, v) {
                        if (v.langId == id) {
                            v.percentage = v.percentage - 10;
                        }
                    });
                });
                console.log(requirements);


                /* $.each($rootScope.list1, function (key, val) {
                 if (val.langId == id) {
                 val.percentage = parseInt(val.percentage) - 10;
                 }
                 });*/


            }

        }


    }
).directive('droppableMust', function ($rootScope) {
    return {
        scope: {},
        link: function (scope, element, attr) {
            var id = attr.langName;
            totalPriorotySum = 0;


            $.each($rootScope.list1, function (key, val) {
                if (val.langId == id) {
                    val.mode = "must";
                }
            })

            $.each($rootScope.list2, function (key, val) {
                if (val.langId == id) {
                    val.mode = "must";
                }
            })
            $.each($rootScope.list3, function (key, val) {
                if (val.langId == id) {
                    val.mode = "must";
                }
            })


            $.each(requirements, function (key, val) {
                $.each(val.combination, function (k, v) {
                    if (v.langId == id) {
                        v.mode = "must";
                    }
                });
            });

            $.each(requirements[nextCombinationKey].combination, function (key, val) {
                if (val.mode == 'must')
                    totalPriorotySum += parseInt(val.percentage);
            });


            //drag into must from langs
            if (attr.class == 'langsName' && newLangClicked == true) {
                newLangClicked = false;

                requirements[nextCombinationKey].combination.push({
                    'langId': langId++,
                    'name': attr.value,
                    'mode': "must",
                    'years': 0,
                    'percentage': 0,
                    'drag': true
                })
            }
            console.log(totalPriorotySum);


        }
    }
}).directive('droppableAdv', function ($rootScope) {
    return {
        scope: {},
        link: function (scope, element, attr) {

            var id = attr.langName;
            totalPriorotySum = 0;

            $.each($rootScope.list1, function (key, val) {
                if (val.langId == id) {
                    val.mode = "adv";
                    val.percentage = 0;
                }
            })

            $.each($rootScope.list2, function (key, val) {
                if (val.langId == id) {
                    val.mode = "adv";
                    val.percentage = 0;
                }
            })
            $.each($rootScope.list3, function (key, val) {
                if (val.langId == id) {
                    val.mode = "adv";
                    val.percentage = 0;
                }
            })


            $.each(requirements, function (key, val) {
                $.each(val.combination, function (k, v) {
                    if (v.langId == id) {
                        v.mode = "adv";
                        v.percentage = 0;
                    }
                });
            });

            $.each(requirements[nextCombinationKey].combination, function (key, val) {
                if (val.mode == 'must') {
                    totalPriorotySum += parseInt(val.percentage);
                    console.log(val);
                }
            });


            if (attr.class == 'langsName' && newLangClicked == true) {
                newLangClicked = false;
                requirements[nextCombinationKey].combination.push({
                    'langId': langId++,
                    'name': attr.value,
                    'mode': "adv",
                    'years': 0,
                    'percentage': 0,
                    'drag': true
                })
            }
            console.log(totalPriorotySum);
        }
    }
}).directive('droppableOr', function ($rootScope) {
    return {
        scope: {},
        link: function (scope, element, attr) {
            var id = attr.langName;
            totalPriorotySum = 0;


            $.each($rootScope.list1, function (key, val) {
                if (val.langId == id) {
                    val.mode = "or";
                }
            })

            $.each($rootScope.list2, function (key, val) {
                if (val.langId == id) {
                    val.mode = "or";
                    val.percentage = 0;
                }
            })
            $.each($rootScope.list3, function (key, val) {
                if (val.langId == id) {
                    val.mode = "or";
                    val.percentage = 0;
                }
            })


            $.each(requirements, function (key, val) {
                $.each(val.combination, function (k, v) {
                    if (v.langId == id) {
                        v.mode = "or";
                        v.percentage = 0;
                    }
                });
            });
            $.each(requirements[nextCombinationKey].combination, function (key, val) {
                if (val.mode == 'must')
                    totalPriorotySum += parseInt(val.percentage);
            });


            if (attr.class == 'langsName' && newLangClicked == true) {
                newLangClicked = false;
                requirements[nextCombinationKey].combination.push({
                    'langId': langId++,
                    'name': attr.value,
                    'mode': "or",
                    'years': 0,
                    'percentage': 0,
                    'drag': true
                })
            }
        }
    }
})


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

function logout(out) {
    if (out == 'logout') {

        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });

    }
    else {
        helper.disconnect();
    }
    if (window.location.href.indexOf("localhost") > -1)
        window.location.href = '/cvmatcher/';
    else
        window.location.href = 'http://cvmatcher.esy.es';
}

$(document).ready(function () {
    $('html:not(".navbar")').click(function (e) {
        if (e.target.id != 'profileImg') {
            $('[data-popover]').popover('hide');
        }
    });
    $('.navBar').popover({
        selector: '[data-popover]',
        trigger: 'click',
        content: '',
        placement: 'auto',
        delay: {show: 200, hide: 400}
    });
    $("#logo").click(function () {

        if (window.location.href.indexOf("localhost") > -1)
            window.location.href = '/cvmatcher/';
        else
            window.location.href = 'http://cvmatcher.esy.es';
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
var firstTimeLogInJobSeeker = false;
var updateSignIn = function () {
    if (auth2.isSignedIn.get()) {
        if (firstTimeLogIn == true) {
            console.log("first time! so add user!!!");
        }
        else if (firstTimeLogInJobSeeker == true) {
            console.log("first time! so add user!!!");
        }
        else
            console.log("user loggen in before so get user!!!");
    } else {
        firstTimeLogIn = true;
        firstTimeLogInJobSeeker = true;
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