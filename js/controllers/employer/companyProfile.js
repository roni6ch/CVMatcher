/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* company Profile controller ****************
 */
var company = false;
app.controller('companyProfileController',
    function ($scope, $http, $location, $sce, $rootScope, $timeout) {

        //noinspection JSValidateTypes
        angular.element("#profileImg").parent().attr("href", '#/companyProfile');

        $rootScope.userSignInType = "employer";
        //noinspection JSDuplicatedDeclaration
        var companyId;
        var tabType = '';
        $("#geocomplete").geocomplete();
        $("#geocomplete2").geocomplete();
        $scope.chooseCompanyModal = false;
        $scope.passForCompany = '';
        $scope.changePassword = false;
        $scope.password = false;
        //user details
        $http({
            url: 'https://cvmatcher.herokuapp.com/getUser',
            method: "POST",
            data: {
                "user_id": localStorage.getItem("user_id")
            }
        })
            .then(function (data) {
                    if (data) {
                        $(".navigation")[0].innerHTML = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/companyProfile'>Company Profile</a>";
                        $scope.employerProfile = data.data[0];
                        console.log(data.data[0]);
                        if (data.data[0].company) {
                            company = true;
                            companyId = data.data[0].company;
                            if (companyId) {
                                url = 'https://cvmatcher.herokuapp.com/employer/getCompany';
                                $http({
                                    url: url,
                                    method: "POST",
                                    data: {
                                        "company_id": companyId
                                    }
                                })
                                    .then(function (data) {
                                            $scope.companyProfile = data.data[0];
                                            angular.element(".fa-pulse").hide();
                                        },
                                        function (response) { // optional
                                            console.log("companyProfileController AJAX failed!");
                                            console.log(response);

                                        });
                            }

                        }
                        else {

                            $scope.password = true;
                            angular.element(".fa-pulse").hide();
                        }
                    }
                },
                function (response) { // optional
                    angular.element(".fa-pulse").hide();
                    console.log("companyProfileController AJAX failed!");
                });
        //company profile details
        var logo = '';
        $scope.newLogo = function () {
            logo = $(this).find("img").prevObject[0].logo;
            $.each($(".logos label"), function () {
                $(this).removeClass('active');
            });
        };
        $scope.logo = function (word) {
            angular.element(".fa-pulse").show();
            $http({
                url: "https://cvmatcher.herokuapp.com/getLogoImages",
                method: "POST",
                data: {"word": word}
            }).then(function (data) {
                $scope.logos = data.data;
                angular.element(".fa-pulse").hide();
            })
        };


        $scope.submitUserDetails = function () {

            tabType = 'profile';
            var userJson = {
                "_id": localStorage.getItem("user_id"),
                "personal_id": $(".personalId").val(),
                "first_name": $(".firstName").val(),
                "last_name": $(".lastName").val(),
                "birth_date": $(".birthDay").val(),
                "address": $("#geocomplete").val(),
                "email": $(".email").val(),
                "phone_number": $(".phoneNumber").val(),
                "linkedin": $(".linkedin").val()
            };

            $http({
                url: 'https://cvmatcher.herokuapp.com/updateUser',
                method: "POST",
                data: userJson
            })
                .then(function () {
                        $('#update').modal('show');
                        $scope.status = "User Updated Succesfully!";
                        $scope.tab = 1;
                    },
                    function (response) { // optional
                        $scope.status = "Error User Update!";
                        console.log(response);
                    });
        };

        $scope.submitCompanyDetails = function () {
            var companyJson;
            if (logo == '')
                logo = $(".companyLogo > img").attr("src");
            if (logo == undefined)
                logo = 'http://www.megaicons.net/static/img/icons_sizes/53/135/256/default-icon-icon.png';

            $scope.status = '';
            if (!company) {
                //noinspection JSDuplicatedDeclaration
                 companyJson = {
                    "user_id": localStorage.getItem("user_id"),
                    "name": $(".companyName").val(),
                    "logo": logo,
                    "p_c": $(".companyPC").val(),
                    "address": $("#geocomplete2").val(),
                    "password": $(".passwordCompany").val(),
                    "phone_number": $(".companyPhoneNumber").val()
                };

                console.log("send form: ", companyJson);
                $http({
                    url: 'https://cvmatcher.herokuapp.com/employer/addCompany',
                    method: "POST",
                    data: companyJson
                }).then(function () {
                        localStorage.setItem("company", true);
                        localStorage.setItem("employerFirstSignIn", true);
                        $('#update').modal('show');
                        $scope.status = "Company Updated Succesfully!";

                        tabType = 'company';
                    },
                    function (response) { // optional
                        $scope.status = "Error Company Update!";
                        console.log(response);
                    });
            }
            else {
                //push to json new key value
                 companyJson = {
                    "_id": $scope.employerProfile['company'],
                    "name": $(".companyName").val(),
                    "logo": logo,
                    "p_c": $(".companyPC").val(),
                    "address": $("#geocomplete2").val(),
                    "phone_number": $(".companyPhoneNumber").val()
                };

                console.log("send form: ", companyJson);
                $http({
                    url: 'https://cvmatcher.herokuapp.com/employer/updateCompany',
                    method: "POST",
                    data: companyJson
                }).then(function () {
                        localStorage.setItem("company", true);

                        localStorage.setItem("employerFirstSignIn", true);

                        tabType = 'company';
                        $('#update').modal('show');
                        $scope.status = "Company Updated Succesfully!"

                    },
                    function (response) { // optional
                        $scope.status = "Error Company Update!";
                        console.log(response);
                    });

                //send new password
                if ($scope.changePassword == true) {
                    $http({
                        url: 'https://cvmatcher.herokuapp.com/employer/changeCompanyPassword',
                        method: "POST",
                        data: {
                            "company_id": $scope.employerProfile['company'],
                            "old_password": $(".passwordCompany").val(),
                            "new_password": $(".newPasswordCompany").val()
                        }
                    }).then(function () {
                            $('#update').modal('show');
                            $scope.status = "Company Updated Succesfully!"
                        },
                        function (response) { // optional
                            $scope.status = "Wrong Password!";
                            console.log(response);
                        });
                }

            }

        };

        $scope.changePassword = function () {
            $scope.changePassword = true;
        };


        $scope.getCompanies = function () {
            $scope.chooseCompanyModal = false;
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getCompanies',
                method: "GET"
            }).then(function (data) {
                    console.log(data);
                    $scope.companies = data.data;
                },
                function (response) { // optional
                    $scope.status = "Error get Companies!"
                    console.log(response);
                });
        };
        //noinspection JSDuplicatedDeclaration
        var companyId;
        $scope.checkCompany = function (id) {
            companyId = id;
            $scope.chooseCompanyModal = true;
            $('#update').modal('show');
            $scope.status = "Password";
            //remove the v check mark from other buttons
            logo = $(this).find("img").prevObject[0].logo;
            $.each($(".companies label"), function () {
                $(this).removeClass('active');
            });
        };
        $scope.sendPassword = function () {
            var pass = $scope.passForCompany;
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/addToExistingCompany',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem("user_id"),
                    "company_id": companyId,
                    "password": pass
                }
            }).then(function (data) {
                    console.log(data);


                },
                function (response) { // optional
                    $scope.status = "Error  sendPassword!";
                    console.log(response);
                });
        };
        $scope.closeModal = function () {
            $scope.chooseCompanyModal = false;
            $timeout(function () {
                if (tabType == 'company')
                    location.replace("#/myjobs");
            }, 500);
        }
    });