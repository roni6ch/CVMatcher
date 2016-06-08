/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* Candidates controller ****************
 */
app.controller('candidatesController',
    function ($scope, $http, $location, $sce, $rootScope) {
        var stars = 0;
        $id = $location.path().split('/');

        //init function to bring all the unread cv's
        $scope.unreadCvs = function () {
            $scope.jobId = $id[2];
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
        //bring all the like cv's
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
        //bring all the unlike cv's
        $scope.unlikeCvs = function () {
            angular.element(".fa-pulse").show();
            $scope.unlikeCandidates = '';
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getRateCvsForJob',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem("user_id"),
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
        //bring all the hired cv's
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
            }).then(function (data) {
                    console.log(data.data);
                    $scope.hiredCandidates = data.data;
                    angular.element(".fa-pulse").hide();
                },
                function (response) { // optional
                    console.log("Hired AJAX failed!");
                    console.log(response);
                });
        };
        //sort by user type
        $scope.sort = function (sort) {
            $scope.sortby = sort;
        };
        //add candidate to like cv's for specific job
        $scope.addCandidateToLike = function (candidate, user_id) {
            var candidatesArr;
            $scope.user_id = user_id;
            if (angular.element("#candidateLike-" + candidate).hasClass(
                    "like")) {
                angular.element("#candidateLike-" + candidate).removeClass(
                    "like").addClass("unlike");
                $scope.userId = candidate;
                $(".leftModal").click();
                //noinspection JSDuplicatedDeclaration
                 candidatesArr = $scope.likeCandidates;
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
                 candidatesArr = $scope.unlikeCandidates;
                candidatesArr = candidatesArr.filter(function (obj) {
                    return obj._id !== candidate;
                });
                $scope.unlikeCandidates = candidatesArr;

            }
        };
        //rate candidate by stars
        $scope.rating = function (rateNumber) {
            stars = rateNumber;

			
            sendNotification('like', $scope.user_id, $scope.jobId, stars, localStorage.getItem("jobTitle"));
						
			$http({
                url: 'https://cvmatcher.herokuapp.com/sendNotification',
                method: "POST",
                data: {
                    "user_id": $scope.user_id,
                    "message": "The employer like your cv and rated it with a number of " + stars + " stars for job " + localStorage.getItem("jobTitle")
                }
            }).then(function (data) {
                    console.log(data.data);
                },
                function (response) { // optional
                    console.log("like notification AJAX failed!");
                    console.log(response);
                });
			

        };
        //hire candidate to job
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
                        sendNotification('hire', $scope.user_id, $scope.jobId, null, localStorage.getItem("jobTitle"));					
				
						$http({
							url: 'https://cvmatcher.herokuapp.com/sendNotification',
							method: "POST",
							data: {
								"user_id": $scope.user_id,
								"message": "congratulations!! you're hired for job: " + localStorage.getItem("jobTitle")
							}
						}).then(function (data) {
								console.log(data.data);
							},
							function (response) { // optional
								console.log("Hired notification AJAX failed!");
								console.log(response);
							});
						
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
        //bring next candidates by slide right or left - or press hands icon.
        $scope.bringNextCandidate = function (type, description, id) {
            if (type == 'unliked') {
                sendNotification('unlike', $scope.user_id, $scope.jobId, description, localStorage.getItem("jobTitle"));
				$http({
					url: 'https://cvmatcher.herokuapp.com/sendNotification',
					method: "POST",
					data: {
						"user_id": $scope.user_id,
						"message": "The employer unlike your cv and entered the feedback: "
										+ description + "for job " + localStorage.getItem("jobTitle")
					}
				}).then(function (data) {
						console.log(data.data);
					},
					function (response) { // optional
						console.log("unlike notification AJAX failed!");
						console.log(response);
					});
            }
                $("#comment").val("");
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
                    "user_id": localStorage.getItem("user_id")

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
