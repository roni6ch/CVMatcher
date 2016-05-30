/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* googleSignIn controller ****************
 */

app.controller('googleSignInController', function ($rootScope) {
    $rootScope.userSignInType = '';
});


var helper;
var profile = '';
var updateSignIn = function () {
    auth2.isSignedIn.get();
    helper.onSignInCallback(gapi.auth2.getAuthInstance());
};

/**
 * This method sets up the sign-in listener after the client library loads.
 */
function startApp() {
    gapi.load('auth2', function () {
        gapi.client.load('plus', 'v1').then(function () {
            gapi.signin2.render('signin-button', {
                scope: 'https://www.googleapis.com/auth/userinfo.email',
                fetch_basic_profile: false
            });
            gapi.auth2.init({
                fetch_basic_profile: false,
                scope: 'https://www.googleapis.com/auth/userinfo.email'
            }).then(
                function () {
                    auth2 = gapi.auth2.getAuthInstance();
                    auth2.isSignedIn.listen(updateSignIn);
                    auth2.then(updateSignIn);
                });
        });
    });
}

helper = (function () {
    return {
        onSignInCallback: function (authResult) {

            if (!authResult.isSignedIn.get()) {
                if (authResult['error'] || !(null != authResult.currentUser.get().getAuthResponse())) {
                    console.log('There was an error: ' + authResult['error']);
                }
                $('#authResult').append('Logged out');
                $('#authOps').hide('slow');
                $('#gConnect').show();
            } else {
                $('#authOps').show('slow');
                helper.profile();
            }

        },
        /**
         * Calls the OAuth2 endpoint to disconnect the app for the user.
         */
        disconnect: function () {
            // Revoke the access token.
            auth2.disconnect();
            console.log('User sign out.');
        },

        profile: function () {
            gapi.client.plus.people.get({
                'userId': 'me'
            }).then(function (res) {
                profile = res.result;

                //set coockies of user
                var user = {
                    id: profile.id,
                    name: profile.displayName,
                    image: profile["image"].url,
                    emails: profile.emails[0].value
                };
                localStorage.setItem('user',  JSON.stringify(user));
                $("#profileImg").attr("src", $.parseJSON(localStorage.getItem('user')).image);
                location.replace("#/usersLogin");


            }, function (err) {
                console.log(err);
            });
        }
    };
})();

//google signOut and LogUOut
function logout(out) {
    console.log(out);
    if (out == 'logout') {

        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User logout out.');
        });

    }
    else {
        helper.disconnect();
    }
    /* if (window.location.href.indexOf("localhost") > -1)
     window.location.href = '/cvmatcher';
     else
     window.location.href = 'http://cvmatcher.esy.es';*/
}
