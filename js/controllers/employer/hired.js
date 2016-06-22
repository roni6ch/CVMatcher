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
var names =[];
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
                    angular.forEach(data.data, function (value, key) {
                        names.push(value.user.first_name);
                    });
                console.log(names);
                $scope.names = names;
                /*
                    $("#searchHire").autocomplete({source:names});*/
                },
                function (response) { // optional
                    console.log("getEmployees AJAX failed!");
                    console.log(response);
                });
    }


    $scope.fired = function (indx, id) {
        $("#indx-" + indx + ">.fired").css("background", "url('images/fired1.png')");
        $("#indx-" + indx + ">.hiredImg").css("background", "url('images/hired2.png')");
        this.hireCandidate.personal_properties['decision'] = false;
        $http({
            url: 'https://cvmatcher.herokuapp.com/employer/setDecision',
            method: "POST",
            data: {
                "personal_properties_id": id,
                "decision": false
            }
        }).then(function (data) {
            console.log(data.data._id);
            /*
             $scope = $('#hire-cand'+data.data._id).scope();
             $scope.personal_properties['decision'] = false;*/

        });
    }
    $scope.hired = function (indx, id) {
        $("#indx-" + indx + ">.hiredImg").css("background", "url('images/hired1.png')");
        $("#indx-" + indx + ">.fired").css("background", "url('images/fired2.png')");

        this.hireCandidate.personal_properties['decision'] = true;
        $http({
            url: 'https://cvmatcher.herokuapp.com/employer/setDecision',
            method: "POST",
            data: {
                "personal_properties_id": id,
                "decision": true
            }
        }).then(function (data) {

            console.log(data.data._id);
            /*
             $scope = $('#hire-cand'+data.data._id).scope();
             console.log($scope);
             $scope.hireCandidate.personal_properties['decision'] = true;*/
        });
    }
});
