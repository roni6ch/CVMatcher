/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* Match Page Controller ****************
 */
app
    .controller(
        'matchpageController',
        function ($scope, $http, $location, $rootScope, $timeout) {
            //noinspection JSValidateTypes
            angular.element("#profileImg").parent().attr("href", '#/Profile');

            if (localStorage.getItem("userSignInType"))
                $rootScope.userSignInType = localStorage.getItem("userSignInType");
            $jobId = $location.path().split('/')[2];

            console.log("cv: " + localStorage.getItem("current_cv"));
            console.log("job: " + $jobId);
            $scope.checkMyCV = function () {
                $http({
                    url: 'https://cvmatcher.herokuapp.com/jobSeeker/checkCV',
                    method: "POST",
                    data: {
                        "cv_id": localStorage.getItem("current_cv"),
                        "job_id": $jobId
                    }
                })
                    .then(function (data) {
                            //navigation in site
                            $(".navigation")[0].innerHTML = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/searchJobs'>Search Jobs</a><span> > </span><a href='#/searchJobs/" + $jobId + "/matchpage'>" + localStorage.getItem("jobTitle") + " Match Page</a>";

                            if (data.data.formula !== undefined) {
                                console.log(data.data);

                                if (data.data.formula.requirements.grade > 0) {
                                    skills = [];

                                    var skillsFromJson = data.data.formula.requirements.details;

                                    $.each(skillsFromJson, function (k, v) {
                                        skills.push({
                                            text: v.name,
                                            count: v.grade
                                        });
                                    });
                                    bubbels();
                                }
                                else {
                                    $("#circle-container1").find("> h2").html("");
                                    //$scope.status = 'the languges';
                                    // $('#sendCVstatus').modal('show');
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
                                if (data.data.total_grade < localStorage.getItem("compatibility_level")) {
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

                                $scope.formula = data.data.formula;
                                angular.element('[data-toggle="tooltip"]').tooltip();
                                $scope.tootipInfo = {
                                    "requirements": "infoooooooooooooo",
                                    "candidate_type": "infoooooooooooooo",
                                    "locations": "infoooooooooooooo",
                                    "scope_of_position": "infoooooooooooooo",
                                    "academy": "infoooooooooooooo"

                                }

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

            };


            $scope.sendCV = function () {
                $http({
                    url: 'https://cvmatcher.herokuapp.com/jobSeeker/addCvToJob',
                    method: "POST",
                    data: {
                        "job_id": $jobId,
                        "cv_id": localStorage.getItem("'current_cv'")
                    }
                }).then(function (data) {
                    console.log(data);
                    if (data != null) {
                        $('#sendCVstatus').modal('show');
                        $scope.status = "your Resume Send!"
                    }
                    else {
                        $scope.status = "Problem send resume";
                    }
                },
                function (response) { // optional
                    console.log(response);
                    console.log("addCvToJob AJAX failed!");
                });
            };

            $scope.exitStatus = function () {
                //if user clickd ok then move to search jobs page - need to wait to close modal
                $timeout(function () {
                    location.replace("#/searchJobs");
                }, 1000);
            };
            //TODO: OPEN SOCKET!
            /*socket.onmessage = function (msg) {
             var message = JSON.parse(msg.data);
             console.log(message);
             notifyMe(message.notificationType, message.jobName);
             }*/

        });