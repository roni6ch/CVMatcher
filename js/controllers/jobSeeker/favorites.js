/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* Favorites Controller ****************
 */
app
    .controller(
        'favoritesController',
        function ($scope, $http, $rootScope) {
            angular.element(".fa-pulse").hide();
            //noinspection JSValidateTypes
            angular.element("#profileImg").parent().attr("href", '#/profile');
            if (localStorage.getItem("userSignInType"))
                $rootScope.userSignInType = localStorage.getItem("userSignInType");

            $(".navigation")[0].innerHTML = "<a href='#/login'>Homepage</a><span> > </span><a href='#/favorites'>Favorites Jobs</a>";

            $http({
                url: 'https://cvmatcher.herokuapp.com/jobSeeker/getFavoritesJobs',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem("user_id")
                }
            })
                .then(function (data) {
                        $scope.jobSeekerJobs = data.data;
                        console.log(data.data);
                        angular.element(".fa-pulse").hide();
                        //fix date string
                        angular.forEach(data.data, function (value, key) {
                            data.data[key].date = value.date.split("T")[0];
                        })
                    },
                    function (response) { // optional
                        console.log("myjobsController AJAX failed!");
                        console.log(response);
                    });
            //TODO: OPEN SOCKET!
            /* socket.onmessage = function (msg) {
             var message = JSON.parse(msg.data);
             console.log(message);
             notifyMe(message.notificationType, message.jobName);
             }*/

        });
