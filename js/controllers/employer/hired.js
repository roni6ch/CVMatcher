/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* hired controller ****************
 */

app.controller('hiredController', function ($rootScope, $location, $scope, $http) {

    $scope.init = function () {
        angular.element(".fa-pulse").show();
        $http({
            url: 'https://cvmatcher.herokuapp.com/employer/getUnreadCvsForJob',
            method: "POST",
            data: {
                "user_id": localStorage.getItem("user_id"),
                "job_id": "5760a5d33017810300e03567"
            }
        })
            .then(function (data) {
                    console.log(data.data);
                    $(".navigation")[0].innerHTML = "<a href='#/login'>Homepage</a><span> > </span><a href='#/hired'>Hired</a>";
                    $scope.candidates = data.data;
                    angular.element(".fa-pulse").hide();

                },
                function (response) { // optional
                    console.log("unreadCvs AJAX failed!");
                    console.log(response);
                });
    }
});
