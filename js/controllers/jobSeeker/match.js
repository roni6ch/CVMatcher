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

            var current_cv;
            $jobId = $location.path().split('/')[2];

            //initialize parameter in the controller
            $scope.init = function(){

                $(".matchResult").hide();
                $http({
                    url: 'https://cvmatcher.herokuapp.com/getUser',
                    method: "POST",
                    data: {
                        "user_id": localStorage.getItem("user_id")
                    }
                })
                    .then(function (data) {
                        if (typeof data.data[0].current_cv !== 'undefined' && data.data[0].current_cv != null) {
                            current_cv = data.data[0].current_cv;
                            console.log("data: " , data.data[0]);
                            console.log("cv: " + current_cv);
                            console.log("job: " + $jobId);
                            localStorage.setItem("current_cv",data.data[0].current_cv);
                            $http({
                                url: 'https://cvmatcher.herokuapp.com/jobSeeker/checkCV',
                                method: "POST",
                                data: {
                                    "cv_id": current_cv,
                                    "job_id": $jobId
                                }
                            })
                                .then(function (data) {
                                        $(".matchResult").show();
                                        //navigation in site
                                        $(".navigation")[0].innerHTML = "<a href='#/login'>Homepage</a><span> > </span><a href='#/search_jobs'>Search Jobs</a><span> > </span><a href='#/search_jobs/" + $jobId + "/matchpage'>" + localStorage.getItem("jobTitle") + " Match Page</a>";

                                        if (data.data.formula !== undefined) {
                                            console.log(data.data);

                                            if (data.data.formula.requirements.grade > 0) {
                                                skills = [];
                                                $(".skillsTitleM").show();
                                                $(".requirements-skills-bar").show();

                                                //$(".bubbleChart").show();

                                                var skillsFromJson = data.data.formula.requirements.details;

                                                $.each(skillsFromJson, function (key, value) {

                                                    $("#requirements-skills-bar").append('<div class="skillbar" data-percent=' + value.grade + ' ><span class="skillbar-title" style="background: #d35400;">' + value.name + '</span><p class="skillbar-bar" style="background: #e67e22;"></p><span class="skill-bar-percent"></span></div>');

                                                });
                                                //bubbels();

                                                skillsBar();
                                            }
                                            else {
                                                $(".skillsTitleM").hide();
                                                $(".requirements-skills-bar").hide();
                                                //$(".bubbleChart").hide();
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
                                                .html(Math.max(parseInt(data.data.total_grade), 1) + "%");
                                            userCircle.animate(data.data.total_grade / 100);
                                            //check if user passed the Match!!!
                                            if (data.data.total_grade < localStorage.getItem("compatibility_level")) {
                                                angular.element(".matchResult > h2").append("Oops");
                                                angular.element(".matchResult > h2 > i").addClass("fa-thumbs-down");
                                                angular.element(".matchResult > h4").html('You did not passed the minimum requirements');
                                                $scope.sendcv = false;
                                            }
                                            else {
                                                angular.element(".matchResult > h2").append("Great!");
                                                angular.element(".matchResult > h2 > i").addClass("fa-thumbs-up");
                                                angular.element(".matchResult > h4").html('Harray!! You Passed The Minimum requirements');
                                                $scope.sendcv = true;
                                            }

                                            $scope.formula = data.data.formula;



                                        }
                                        else {
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

                    });

                //TODO: OPEN SOCKET!
                 socket.onmessage = function (msg) {
                 var message = JSON.parse(msg.data);
                 console.log(message);
                 notifyMe(message.notificationType, message.jobName);
                 }
            };
            //fix cv - go to profile and come back!
            $scope.fixCV = function () {
                localStorage.setItem('fixCV', $jobId);
                $location.path('/profile');
            }
            //send cv to employer
            $scope.sendCV = function () {
                $http({
                    url: 'https://cvmatcher.herokuapp.com/jobSeeker/addCvToJob',
                    method: "POST",
                    data: {
                        "job_id": $jobId,
                        "cv_id": localStorage.getItem("current_cv")
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
            //close modal
            $scope.exitStatus = function () {
                //if user clickd ok then move to search jobs page - need to wait to close modal
                $timeout(function () {
                    location.replace("#/search_jobs");
                }, 1000);
            };
        });