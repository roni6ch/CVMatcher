/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* MY JOBS - Job Seeker Controller ****************
 */

app.controller('yourjobSeekerController', function ($scope, $http, $sce, $location, $rootScope) {
    var url;
    var path = $location.path().split('/')[1];
    var navigation;
    var data;

    //initialize parameter in the controller
    $scope.init = function () {
        localStorage.removeItem('fixCV');
        //TODO: OPEN SOCKET!
        socket.onmessage = function (msg) {
            var message = JSON.parse(msg.data);
            console.log(message);
            var jobId = message.jobId;
            if (path == 'yourjobs') {
                if (message.notificationType == 'seen') {
                    $scope = angular.element('.classForNotifications[value=' + jobId + ']').parent().parent().scope();
                    $scope.$apply(function () {
                        $scope.jobSJ.cv.status.current_status = 'seen';
                    })
                }
                else if (message.notificationType == 'like') {
                    $scope = angular.element('.classForNotifications[value=' + jobId + ']').parent().parent().scope();
                    $scope.$apply(function () {
                        $scope.jobSJ.cv.status.current_status = 'liked';
                        $scope.jobSJ.cv.status.status_id.rate.stars = message.other;
                    })
                }
                else if (message.notificationType == 'unlike') {
                    $scope = angular.element('.classForNotifications[value=' + jobId + ']').parent().parent().scope();
                    $scope.$apply(function () {
                        $scope.jobSJ.cv.status.current_status = 'unliked';
                        $scope.jobSJ.cv.status.status_id.rate.description = message.other;

                    })
                }
            }
            notifyMe(message.notificationType, message.jobName);
        }

    }
    //check what page im located and bring the right json
    $scope.getMainJson = function () {
        if (path == 'favorites') {
            url = 'https://cvmatcher.herokuapp.com/jobSeeker/getFavoritesJobs';
            navigation = "<a href='#/login'>Homepage</a><span> > </span><a href='#/favorites'>Favorite Jobs</a>";
            $scope.title = "Favorite Jobs";
            $scope.page = 'favorites';
            data = {
                "user_id": localStorage.getItem("user_id")
            }

        }
        else if (path == 'yourjobs') {
            url = 'https://cvmatcher.herokuapp.com/jobSeeker/getMyJobs';
            $scope.title = "My Jobs";
            $scope.page = 'myjobs';
            navigation = "<a href='#/login'>Homepage</a><span> > </span><a href='#/yourjobs'>My Jobs</a>";
            data = {
                "user_id": localStorage.getItem("user_id"),
                "active": true
            };
        }
        else if (path == 'deleted') {
            url = 'https://cvmatcher.herokuapp.com/jobSeeker/getMyJobs';
            $scope.title = "Deleted Jobs";
            $scope.page = 'deleted';
            data = {
                "user_id": localStorage.getItem("user_id"),
                "active": false
            };
            navigation = "<a href='#/login'>Homepage</a><span> > </span><a href='#/deleted'>Deleted Jobs</a>";
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


                        //fix date string
                        if (data.data[0].jobs.length > 0) {
                            angular.forEach(data.data[0].jobs, function (value, key) {
                                data.data[0].jobs[key].job.date = value.job.date.split("T")[0] + ' | ' + value.job.date.split("T")[1].split(".")[0];
                            });
                            $scope.jobSeekerJobs = data.data[0].jobs;
                            console.log($scope.jobSeekerJobs);
                        }

                    } else {
                        //no jobs
                        angular.element(".fa-pulse").hide();
                    }
                },
                function (response) { // optional
                    console.log("jobSeekerJobs AJAX failed!");
                    console.log(response);
                });
    };
    //send job to trash
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
    };
    //click on specific job
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
            .then(function () {
                    if (path == 'favorites') {
                        var jobsArr = $scope.jobSeekerJobs;
                        jobsArr = jobsArr.filter(function (obj) {
                            return obj._id !== id;
                        });
                        $scope.jobSeekerJobs = jobsArr;
                    }
                },
                function (response) { // optional
                    console.log("updateFavoriteJob AJAX failed!");
                    console.log(response);
                });


    };
    //sort by user request
    $scope.sort = function (sort) {
        $scope.sortby = sort;
    };
    //show rate stars number from employer
    $scope.rating = function (rateNumber) {
        $scope.user["stars"] = rateNumber;
    };
    //accordion collepse - arrow
    $scope.collepse = function (id) {
        if ($("#collepse-" + id).hasClass("in")) {
            $("#collepse-" + id).parent().find(".arrow-down").show();
            $("#collepse-" + id).parent().find(".arrow-up").hide();
        }
        else {
            $("#collepse-" + id).parent().find(".arrow-up").show();
            $("#collepse-" + id).parent().find(".arrow-down").hide();
        }
    }

});
