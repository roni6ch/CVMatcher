/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* Candidates controller ****************
 */
app.controller('candidatesController',
    function ($scope, $http, $location, $sce, $rootScope) {

        //noinspection JSValidateTypes
        angular.element("#profileImg").parent().attr("href", '#/companyProfile');
        if (localStorage.getItem("userSignInType"))
            $rootScope.userSignInType = localStorage.getItem("userSignInType");
        $id = $location.path().split('/');
        $scope.jobId = $id[2];
        $scope.unreadCvs = function () {

            angular.element(".fa-pulse").show();
            $scope.candidates = '';
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getUnreadCvsForJob',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem("user_id"),
                    "job_id": $scope.jobId
                }
            })
                .then(function (data) {
                        $(".navigation")[0].innerHTML = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/myjobs'>My Jobs</a><span> > </span><a href='#/Candidates/" + $id[2] + "'>Candidates of " + localStorage.getItem("jobTitle") + "</a>";
                        $scope.candidates = data.data;
                        $rootScope.unreadCandidates = data.data;
                        console.log(data.data);

                        angular.element(".fa-pulse").hide();
                    },
                    function (response) { // optional
                        console.log("unreadCvs AJAX failed!");
                        console.log(response);
                    });
        };
        $scope.likedCvs = function () {
            $scope.likeCandidates = '';

            angular.element(".fa-pulse").show();
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getRateCvsForJob',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem("user_id"),
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
                        console.log(response);

                    });
        };
        $scope.unlikeCvs = function () {
            angular.element(".fa-pulse").show();
            $scope.unlikeCandidates = '';
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getRateCvsForJob',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem("user_id") ,
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
                        console.log(response);
                    });
        };
        $scope.Hired = function () {
            angular.element(".fa-pulse").show();
            $scope.hiredCandidates = '';
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getHiredCvs',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem("user_id"),
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
                        console.log(response);
                    });
        };


        $scope.sort = function (sort) {
            $scope.sortby = sort;
        };

        $scope.addCandidateToLike = function (candidate, user_id) {

            $scope.user_id = user_id;
            if (angular.element("#candidateLike-" + candidate).hasClass(
                    "like")) {
                angular.element("#candidateLike-" + candidate).removeClass(
                    "like").addClass("unlike");
                $scope.userId = candidate;
                $(".leftModal").click();
                //noinspection JSDuplicatedDeclaration
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
                $(".starModal").click();
                //noinspection JSDuplicatedDeclaration
                var candidatesArr = $scope.unlikeCandidates;
                candidatesArr = candidatesArr.filter(function (obj) {
                    return obj._id !== candidate;
                });
                $scope.unlikeCandidates = candidatesArr;

            }
        };
        var stars = 0;
        $scope.rating = function (rateNumber) {
            stars = rateNumber;
            //  sendNotification('like', $scope.user_id, $scope.jobId, stars, localStorage.getItem("jobTitle")));

        };

        $scope.hire = function (cvId) {
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/hireToJob',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem("user_id"),
                    "cv_id": cvId
                }
            })
                .then(function () {
                        //remove from list filter
                        // sendNotification('hire', userId, $scope.jobId, null, localStorage.getItem("jobTitle"));
                        var canArr = $rootScope.likeCandidates;
                        canArr = canArr.filter(function (obj) {
                            return obj._id !== cvId;
                        });
                        $rootScope.likeCandidates = canArr;
                        $scope.likeCandidates = canArr;

                    },
                    function (response) { // optional
                        console.log("Hired AJAX failed!");
                        console.log(response);
                    });
        };

        $scope.bringNextCandidate = function (type, description, id) {
            if (type == 'unliked')
            //  sendNotification('unlike', $scope.user_id, $scope.jobId, description, localStorage.getItem("jobTitle"));
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
                        },
                        "user_id":  localStorage.getItem("user_id")

                    }

                }).then(function (data) {
                        console.log("updateRateCV: ", data);
                    },
                    function (response) { // optional
                        console.log("updateRateCV AJAX failed!");
                        console.log(response);
                    });

        }

    });