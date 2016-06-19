/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* hired controller ****************
 */

app.controller('hiredController', function ($rootScope, $location, $scope, $http) {

    $scope.init = function () {
        $(".navigation")[0].innerHTML = "<a href='#/login'>Homepage</a><span> > </span><a href='#/hired'>Hired</a>";
        angular.element(".fa-pulse").show();
        $http({
            url: 'https://cvmatcher.herokuapp.com/employer/getEmployees',
            method: "POST",
            data: {
                "user_id": localStorage.getItem("user_id")
            }
        })
            .then(function (data) {
                    console.log(data.data);
                    $scope.hireCandidates = data.data;
                    angular.element(".fa-pulse").hide();
                },
                function (response) { // optional
                    console.log("getEmployees AJAX failed!");
                    console.log(response);
                });
    }
});
