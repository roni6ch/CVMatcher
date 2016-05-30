/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* usersLogin controller ****************
 */

var user;
app.controller('usersLoginController', function ($scope, $http, $sce, $rootScope) {
    $rootScope.userSignInType = '';
    //noinspection JSValidateTypes
    angular.element("#profileImg").parent().attr("href", '#/');
    //noinspection JSValidateTypes
    angular.element("#profileImg").parent().hide();
    var firstSignIn = true;
    $http({
        url: 'https://cvmatcher.herokuapp.com/getUserId',
        method: "POST",
        data: {
            "google_user_id": $.parseJSON(localStorage.getItem("user")).id
        }
    }).then(function (data) {
            if (data.data) {
                firstSignIn = false;
                //user_id exist - user logged in before.
                if ($.isArray(data.data)) {
                    localStorage.setItem('user_id',  data.data[0]._id);
                    $rootScope.user_id = data.data[0]._id;
                }
                else {
                    localStorage.setItem('user_id',  data.data._id);
                    $rootScope.user_id = data.data._id;
                }
            }
            else if (data.data == false) {
                firstSignIn = true;
                //first sign in
                console.log($.parseJSON(localStorage.getItem("user")));
                var givenName = $.parseJSON(localStorage.getItem("user")).name.split(" ")[0];
                var familyName = $.parseJSON(localStorage.getItem("user")).name.split(" ")[1];
                var id = $.parseJSON(localStorage.getItem("user")).id;
                var emails = $.parseJSON(localStorage.getItem("user")).emails;

                if (givenName == '') {
                    givenName = "Name";
                }
                if (familyName == '') {
                    familyName = "Family";
                }

                //first login!
                $http({
                    url: 'https://cvmatcher.herokuapp.com/addUser',
                    method: "POST",
                    data: {
                        "google_user_id": id,
                        "first_name": givenName,
                        "last_name": familyName,
                        "email": emails
                    }
                }).then(function (data) {
                        console.log("addUser!!!");
                        if ($.isArray(data.data)) {
                            localStorage.setItem('user_id',  data.data[0]._id);
                            $rootScope.user_id = data.data[0]._id;
                        }
                        else {
                            localStorage.setItem('user_id',  data.data._id);
                            $rootScope.user_id = data.data._id;
                        }

                        sockets();
                    },
                    function (response) { // optional
                        console.log("addUser AJAX failed!");
                        console.log(response);
                    });
            }
        },
        function (response) { // optional
            console.log("getUserId AJAX failed!");
            console.log(response);
        });


    $scope.userType = function (type) {
        if (type == 'employer') {
            localStorage.setItem("userSignInType",'employer');
            $http({
                url: 'https://cvmatcher.herokuapp.com/getUser',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem('user_id')
                }
            }).then(function (data) {
                console.log(data.data[0]);
                if (typeof data.data[0].company == 'undefined') {
                    $scope.popoverData = 'companyProfile';
                    $scope.popOverDataContent = 'Please Update Your Profile First!';
                    $("#popoverData").css("text-decoration", "line-through");
                    location.replace("#/companyProfile");
                }
                else {
                    $(".newJob").css("pointer-events", "auto");
                    $("#popoverData").css("text-decoration", "none");
                    $scope.popoverData = 'newJob';
                    $scope.popOverDataContent = 'Add new Job to System';
                    location.replace("#/myjobs");
                }
            });


        }
        else if (type == 'jobSeeker') {
            localStorage.setItem("userSignInType",'jobSeeker');

            $http({
                url: 'https://cvmatcher.herokuapp.com/getUser',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem('user_id')
                }
            }).then(function (data) {
                console.log(data.data[0]);
                if (typeof data.data[0]['current_cv'] == 'undefined') {
                    location.replace("#/Profile");
                }
                else {
                    location.replace("#/searchJobs");
                }
            });


        }
    }
});
