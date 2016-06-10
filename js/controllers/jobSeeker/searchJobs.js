/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* jobSeeker Search Jobs Controller ****************
 */
app.controller('jobSeekerSearchJobsController', function ($rootScope, $scope, $sce, $http, $location) {

    //initialize parameters for controller
    $scope.init = function () {
        $rootScope.userSignInType = 'jobSeeker';
        angular.element("#logo").attr("href", '#/usersLogin');
        //navigation in site
        $(".navigation")[0].innerHTML = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/searchJobs'>Search Jobs</a>";

        //TODO: OPEN SOCKET!
        socket.onmessage = function (msg) {
         var message = JSON.parse(msg.data);
         console.log(message);
         notifyMe(message.notificationType, message.jobName);
         }
    };
    //get jobs that didnot send cv to them
    $scope.getMainJson = function () {


        $http({
            url: 'https://cvmatcher.herokuapp.com/getUser',
            method: "POST",
            data: {
                "user_id": localStorage.getItem('user_id')
            }
        }).then(function (data) {
            console.log(data.data[0]);
            if (typeof data.data[0].current_cv == 'undefined') {
                $scope.cv_exist = false;
            }
            else {
                $scope.cv_exist = true;
            }

        });


        $http({
            url: 'https://cvmatcher.herokuapp.com/jobSeeker/getJobsBySector',
            method: "POST",
            data: {
                "user_id": localStorage.getItem("user_id"),
                "sector": "software engineering"
            }
        })
            .then(function (data) {
                    $scope.jobSeekerJobs = data.data;
                    console.log(data.data);
                    angular.element(".fa-pulse").hide();

                    angular.forEach(data.data, function (value, key) {
                        data.data[key].date = value.date.split("T")[0] + ' | ' + value.date.split("T")[1].split(".")[0];
                    });

                },
                function (response) { // optional
                    angular.element(".fa-pulse").hide();
                    console.log("resumeController AJAX failed!");
                    console.log(response);

                });
    };
    //sort jobs by user selection
    $scope.sort = function (sort) {
        $scope.sortby = sort;
    };
    //save data - for match page check
    $scope.saveData = function (title, compatibility_level) {
        localStorage.setItem("jobTitle", title);
        localStorage.setItem("compatibility_level", compatibility_level);
    };
    //accordion collepse arrow
    $scope.collepse = function (id) {
        if ($("#collepse-" + id).hasClass("in")) {
            $("#collepse-" + id).parent().find(".arrow-down").fadeIn();
        }
        else {
            $("#collepse-" + id).parent().find(".arrow-down").fadeOut();
        }
    };
});
