/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* myjobs controller ****************
 */

app.controller('myjobsController', function ($rootScope, $location, $scope, $http) {

    var archive;
    var jobsArr = [];
    $id = $location.path().split('/');

    //initialize parameters for this controller
    $scope.init = function(){

        $rootScope.userSignInType = 'employer';
        angular.element("#logo").attr("href", '#/login');
        $scope.company = company;

        $('#popoverData').popover();

        if ($id[1] == 'myjobs') {
            localStorage.setItem('archive','false');
            archive = false;
            $scope.jobPage = "myJobs";
            $scope.pageTitle = 'My Jobs';
            $(".navigation")[0].innerHTML = "<a href='#/login'>Homepage</a><span> > </span><a href='#/myjobs'>My Jobs</a>";
        }
        else {
            localStorage.setItem('archive','true');
            archive = true;
            $scope.jobPage = "archive";
            $scope.pageTitle = 'Deleted';
            var navigation = "<a href='#/login'>Homepage</a><span> > </span><a href='#/archive'>Deleted</a>";
            $(".navigation")[0].innerHTML = navigation;
        }


        $http({
            url: 'https://cvmatcher.herokuapp.com/employer/getJobsBySector',
            method: "POST",
            data: {
                "user_id": localStorage.getItem("user_id"),
                "sector": "software engineering",
                "archive": archive
            }
        })
            .then(function (data) {
                    $scope.myjobs = data.data;
                    jobsArr = data.data;
                console.log(jobsArr);
                    angular.element(".fa-pulse").hide();
                    //fix date string
                    angular.forEach(data.data, function (value, key) {
                        data.data[key].date = value.date.split("T")[0] + ' | ' + value.date.split("T")[1].split(".")[0];
                    });


                },
                function (response) { // optional
                    angular.element(".fa-pulse").hide();
                    console.log("myjobsController AJAX failed!");
                    console.log(response);
                });


    }
    //get user and jobs by employer id
    $scope.getMainJson = function () {

        $http({
            url: 'https://cvmatcher.herokuapp.com/getUser',
            method: "POST",
            data: {
                "user_id": localStorage.getItem('user_id')
            }
        }).then(function (data) {
            angular.element("#profileImg").parent().show();
            if (typeof data.data[0].company == 'undefined') {
                $scope.popoverData = 'company-profile';
                $scope.popOverDataContent = 'Please Update Your Profile First!';
                $("#popoverData").css("text-decoration", "line-through");
            }
            else {
                $(".newJob").css("pointer-events", "auto");
                $("#popoverData").css("text-decoration", "none");
                $scope.popoverData = 'new-job';
                $scope.popOverDataContent = 'Add new Job to System';
            }


        });



    };
    //sort by user preference
    $rootScope.sort = function (sort) {
        $scope.sortby = sort;
    };
    //save job title for next pages (ls because refresh wil remove the angular rootScope)
    $scope.saveJobTitle = function (jobTitle) {
        localStorage.setItem("jobTitle", jobTitle);
    };
    //send jobs to deleted page
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
                        return obj._id !== jobId;
                    });
                    $scope.myjobs = jobsArr;
                },
                function (response) { // optional
                    console.log("deleteMatchingObject AJAX failed!");
                    console.log(response);
                });
    };
    //recycle job from trash
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
                        return obj._id !== jobId;
                    });
                    $scope.myjobs = jobsArr;
                },
                function (response) { // optional
                    console.log("deleteMatchingObject AJAX failed!");
                    console.log(response);
                });
    }
});
