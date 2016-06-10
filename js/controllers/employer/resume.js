/**
 * Created by Roni on 30/05/2016.
 */


/*
 * ********************* resume controller ****************
 */
var candidateId;
var skills = [];
app.controller('resumeController',
    function ($scope, $http, $location, $timeout, $rootScope) {

        var candidates;
        var id;
        var users;
        $id = $location.path().split('/');

        $scope.predictTrue = messageResource.get("predict.true", 'resources');
        $scope.predictFalse = messageResource.get("predict.false", 'resources');

        //initialize parameters for this controller
        $scope.init = function () {
            $scope.hiredPage = false;
            $("#predictAppend").hide();
            $("#users").hide();
            // circle animation
            if ($id[5])
                id = $id[5];
            else
                id = $id[4];

            // if i came from Unread page
            if ($id[1] == "Unread") {
                $("#candidateUnLike").show();
                $("#candidateLike").show();
                //noinspection JSDuplicatedDeclaration
                users = document.getElementById('users');
                // create a simple instance
                // by default, it only adds horizontal recognizers
                $user = new Hammer(users);
                // SWIPE LEFT - USER
                $user.on("swipeleft", function () {
                    $("#candidateUnLike").click();
                });
                // SWIPE RIGHT - USER
                $user.on("swiperight", function () {
                    $("#candidateLike").click();
                });
            }
            if ($id[1] == "Candidates") {
                $("#candidateUnLike").show();
                $("#candidateLike").show();
                users = document.getElementById('users');
                // create a simple instance
                // by default, it only adds horizontal recognizers
                $user = new Hammer(users);
                // SWIPE LEFT - USER
                $user.on("swipeleft", function () {
                    $(".bringNextCandidate").click();
                });
                // SWIPE RIGHT - USER
                $user.on("swiperight", function () {
                    $(".bringNextCandidate").click();
                });
            }


            if ($id[1] == "hired") {
                $scope.hiredPage = true;

            }

            angular.element('[data-toggle="tooltip"]').tooltip();


        }
        //get user resume - by id
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
                        $("#users").show();
                        var navigation;
                        if ($id[1] == "hired")
                            navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/Candidates/" + $id[3] + "'>Candidates of " + localStorage.getItem("jobTitle") + "</a><span> > </span><a href='#/Unread/" + $id[2] + "/resume/" + id + "'>Hired " + data.data[0].user.first_name + " " + data.data[0].user.last_name + " Resume</a>"
                        else if ($id[1] == "Unread")
                            navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/myjobs'>My Jobs</a><span> > </span><a href='#/Candidates/" + $id[2] + "'>Candidates of " + localStorage.getItem("jobTitle") + "</a><span> > </span><a href='#/Unread/" + $id[2] + "/resume/" + id + "'>" + data.data[0].user.first_name + " " + data.data[0].user.last_name + " Resume</a>"
                        else
                            navigation = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/myjobs'>My Jobs</a><span> > </span><a href='#/Candidates/" + $id[3] + "'>Candidates of " + localStorage.getItem("jobTitle") + "</a><span> > </span><a href='#/Unread/" + $id[2] + "/resume/" + id + "'>" + data.data[0].user.first_name + " " + data.data[0].user.last_name + " Resume</a>"

                        $(".navigation")[0].innerHTML = navigation;
                        $scope.user = data.data[0];
                        console.log(data.data[0]);
                        $scope.user_id = data.data[0].user._id;
                        angular.element(".fa-pulse").hide();

                        $scope.user["stars"] = 0;
                        if ($id[1] == "Unread") {
                            $scope.user["stars"] = 0;
                            sendNotification('seen', $scope.user.user._id, $id[2], null, localStorage.getItem("jobTitle"));
                            $http({
                                url: 'https://cvmatcher.herokuapp.com/sendNotification',
                                method: "POST",
                                data: {
                                    "user_id": $scope.user_id,
                                    "message": "The employer viewed your cv for job: " + localStorage.getItem("jobTitle")
                                }
                            }).then(function (data) {
                                    console.log(data.data);
                                },
                                function (response) { // optional
                                    console.log("seen notification AJAX failed!");
                                    console.log(response);
                                });
                        }

                        //sliders
                        angular.forEach(data.data[0].formula, function (value, key) {
                            if (key == '__v' || key == '_id')
                                return;
                            if (key == 'matching_requirements' && value.grade > 0) {
                                angular.element("#formulasAppend").append('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: ' +
                                    value.grade + '%">' + key + ' ' + value.grade + '%</div></div>');
                            }
                            else if (value > 0)
                                angular.element("#formulasAppend").append('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: ' +
                                    value + '%">' + key + ' ' + value + '%</div></div>');
                        });

                        if (data.data[0].predict_result !== 'undefined' && data.data[0].predict_result == true || data.data[0].predict_result == false) {
                            $("#predictAppend").show();
                        }
                        else {
                            $(".predictAppend").hide();
                        }

                        //formula bubbels
                        if (data.data[0].formula)
                            if (data.data[0].formula.matching_requirements.grade > 0) {
                                skills = [];

                                var skillsFromJson = data.data[0].formula.matching_requirements.details;

                                $.each(skillsFromJson, function (k, v) {
                                    skills.push({
                                        text: v.name,
                                        count: v.grade
                                    });
                                });
                                $(".resumeSkillsBox").show();
                                bubbels();
                            }
                            else {

                                $(".skillsTitle").hide();
                                $(".bubbleChart").hide();
                                $(".resumeSkillsBox").hide();
                                $(".resumeSkillsBox > h3").html("There is no Skills for this Candidate!");
                            }
                    },
                    function (response) { // optional
                        console.log("resumeController AJAX failed!");
                        console.log(response);
                    });
        };
        //rate user stars
        $scope.rating = function (rateNumber) {
            $scope.user["stars"] = rateNumber;

            if ($id[1] == 'Unread')
                sendNotification('like', $scope.user_id, $id[2], rateNumber, localStorage.getItem("jobTitle"));
            else
                sendNotification('like', $scope.user_id, $id[3], rateNumber, localStorage.getItem("jobTitle"));

            $http({
                url: 'https://cvmatcher.herokuapp.com/sendNotification',
                method: "POST",
                data: {
                    "user_id": $scope.user_id,
                    "message": "The employer like your cv and rated it with a number of "
                    + rateNumber + " stars for job " + localStorage.getItem("jobTitle")
                }
            }).then(function (data) {
                    console.log(data.data);
                },
                function (response) { // optional
                    console.log("like notification AJAX failed!");
                    console.log(response);
                });
        };
        //add candidate to like or unlike
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
        };
        //bring next candidate by swipe left\right or click on hands icon
        $scope.bringNextCandidate = function (type, description) {
            if (type == 'unliked') {
                sendNotification('unlike', $scope.user_id, $id[3], description, localStorage.getItem("jobTitle"));
                $http({
                    url: 'https://cvmatcher.herokuapp.com/sendNotification',
                    method: "POST",
                    data: {
                        "user_id": $scope.user_id,
                        "message": "The employer didn't like your cv and entered the feedback: "
                        + description + " for job " + localStorage.getItem("jobTitle")
                    }
                }).then(function (data) {
                        console.log(data.data);
                    },
                    function (response) { // optional
                        console.log("unlike notification AJAX failed!");
                        console.log(response);
                    });
            }

            var url;
            if ($id[1] == 'Like') {
                candidates = $rootScope.likeCandidates;
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
                    },
                    "user_id": localStorage.getItem("user_id")
                }
            });

            var nextCandidate = null;
            if (candidates.length > 0) {
                angular.forEach(candidates, function (value, key) {
                    if (value._id == candidateId) {
                        candidates = candidates.splice (key, 1);
                    }
                    else {
                        nextCandidate = value._id;
                        return;
                    }
                })
            }

            console.log("nextCandidate: ", nextCandidate);
            //bring next candidate
            if (nextCandidate == null) {
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
        };

    });
