/** **********************************ANGULAR*************************************** */
//TODO: open all sendNotification functions calls!
var app = angular.module('cvmatcherApp', ["ngRoute", "infinite-scroll", 'ngDragDrop']);
app.config(function ($routeProvider) {
        $routeProvider
        // employer
            .when('/', {
                templateUrl: 'googleSignIn.html',
                controller: 'googleSignInController',
                resolve: {
                    resolvedVal: function ($location, $rootScope) {
                        var checkPopOverOpenOrClose = $('#profilePicture').attr('aria-describedby');
                        if (checkPopOverOpenOrClose)
                            $('#profilePicture').popover('hide');

                        $rootScope.userSignInType = '';
                        if (localStorage.getItem("user_id") !== null) {
                            $location.path('/login');
                        }
                    }
                }
            }).when('/login', {
            templateUrl: 'usersLogin.html',
            controller: 'usersLoginController',
            resolve: {
                resolvedVal: function ($rootScope) {
                    //don't use here in checkProfile function - different Path!
                    if (localStorage.getItem("profile")) {
                        $rootScope.imgProfile = $.parseJSON(localStorage.getItem("user")).image;
                        $rootScope.Profile = localStorage.getItem("profile").split("/")[1];
                        $rootScope.content = "<a href='' onclick=logout('logout')>Log Out</a><a href='' onclick=logout('signout')>Sign Out</a>";
                    }

                    var checkPopOverOpenOrClose = $('#profilePicture').attr('aria-describedby');
                    if (checkPopOverOpenOrClose)
                        $('#profilePicture').popover('hide');

                    $rootScope.userSignInType = '';
                }
            }
        }).when('/myjobs', {
            templateUrl: 'employer/myjobs.html',
            controller: 'myjobsController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company_profile', "employer");
                }
            }
        }).when('/candidates/:_id', {
            templateUrl: 'employer/candidates.html',
            controller: 'candidatesController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company_profile', "employer");
                }
            }
        }).when('/archive/candidates/:_id', {
            templateUrl: 'employer/candidates.html',
            controller: 'candidatesController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company_profile', "employer");
                }
            }
        }).when('/like/candidates/:id/resume/:_id', {
            templateUrl: 'employer/resume.html',
            controller: 'resumeController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company_profile', "employer");
                }
            }
        }).when('/hired/candidates/:id/resume/:_id', {
            templateUrl: 'employer/resume.html',
            controller: 'resumeController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company_profile', "employer");
                }
            }
        }).when('/unlike/candidates/:id/resume/:_id', {
            templateUrl: 'employer/resume.html',
            controller: 'resumeController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company_profile', "employer");
                }
            }
        }).when('/unread/:id/resume/:_id', {
            templateUrl: 'employer/resume.html',
            controller: 'resumeController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company_profile', "employer");
                }
            }
        }).when('/archive', {
            templateUrl: 'employer/myjobs.html',
            controller: 'myjobsController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company_profile', "employer");
                }
            }
        }).when('/job/:_id', {
            templateUrl: 'employer/job.html',
            controller: 'jobController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company_profile', "employer");
                }
            }
        }).when('/company_profile', {
            templateUrl: 'employer/companyProfile.html',
            controller: 'companyProfileController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company_profile', "employer");
                }
            }
        }).when('/new_job', {
                templateUrl: 'employer/job.html',
                controller: 'jobController',
                resolve: {
                    resolvedVal: function ($location, $rootScope) {
                        checkProfile($rootScope, 'Company Profile');
                        return changeLocation($location, '#/company_profile', "employer");
                    }
                }
            })
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////// job seeker///////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            .when('/search_jobs', {
                templateUrl: 'job_seeker/search_jobs.html',
                controller: 'jobSeekerSearchJobsController',
                resolve: {
                    resolvedVal: function ($location, $rootScope) {
                        checkProfile($rootScope, 'Profile');
                        return changeLocation($location, '#/profile', 'jobSeeker');
                    }
                }
            }).when('/yourjobs', {
            templateUrl: 'job_seeker/yourjobs.html',
            controller: 'yourjobSeekerController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    checkProfile($rootScope, 'Profile');
                    return changeLocation($location, '#/profile', 'jobSeeker');
                }
            }
        }).when('/deleted', {
            templateUrl: 'job_seeker/yourjobs.html',
            controller: 'yourjobSeekerController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    checkProfile($rootScope, 'Profile');
                    return changeLocation($location, '#/profile', 'jobSeeker');
                }
            }
        }).when('/search_jobs/:_id/matchpage', {
            templateUrl: 'job_seeker/matchpage.html',
            controller: 'matchpageController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    checkProfile($rootScope, 'Profile');
                    return changeLocation($location, '#/profile', 'jobSeeker');
                }
            }
        }).when('/profile', {
            templateUrl: 'job_seeker/profile.html',
            controller: 'seekerProfileControler',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    checkProfile($rootScope, 'Profile');
                    return changeLocation($location, '#/profile', 'jobSeeker');
                }
            }
        }).when('/favorites', {
                templateUrl: 'job_seeker/yourjobs.html',
                controller: 'yourjobSeekerController',
                resolve: {
                    resolvedVal: function ($location, $rootScope) {

                        checkProfile($rootScope, 'Profile');
                        return changeLocation($location, '#/profile', 'jobSeeker');
                    }
                }
            })


            // Other
            .when('/About', {
                templateUrl: 'about.html',
                resolve: {
                    resolvedVal: function ($location) {
                        return changeLocation($location, null, null);
                    }
                }
            }).when('/Contact', {
            templateUrl: 'contact.html',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, null, null);
                }
            }
        })
    })
    .run(function ($rootScope) {


        if (localStorage.getItem("userSignInType")) {
            $rootScope.userSignInType = localStorage.getItem("userSignInType");
        }
        else {
            $rootScope.userSignInType = '';
        }
        //notification window accept
        document.addEventListener('DOMContentLoaded', function () {
            if (Notification.permission !== "granted")
                Notification.requestPermission();
        });

        if (localStorage.getItem("user_id")) {
            sockets();
            user_id = localStorage.getItem("user_id");
            //set the header navigation
            $rootScope.user_id = user_id;

        }
    })
    .filter('highlight', function ($sce) {
        return function (text, phrase) {
            if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
                '<span class="highlighted">$1</span>');
            //noinspection JSUnresolvedFunction
            return $sce.trustAsHtml(text)
        }
    });

/*
 * ********************* JS Functions ****************
 */

var socket;
var url;
var user_id;


//resolve function to make initializion before controllers
function changeLocation(location, profilePath, userSignInType) {
    $(".navBarImg").removeClass('hidden');
    var checkPopOverOpenOrClose = $('#profilePicture').attr('aria-describedby');
    if (checkPopOverOpenOrClose)
        $('#profilePicture').popover('hide');
    localStorage.setItem("userSignInType", userSignInType);
    //noinspection JSValidateTypes
    angular.element("#profileImg").parent().attr("href", profilePath);
    //noinspection JSValidateTypes
    angular.element("#profileImg").parent().show();
    if (localStorage.getItem("user_id") === null) {
        console.log("no user id - changeLocation function at site.js");
        location.path('/');
    }
}
function checkProfile($rootScope, str) {
    if (localStorage.getItem("profile")) {
        $rootScope.imgProfile = $.parseJSON(localStorage.getItem("user")).image;
        $rootScope.Profile = localStorage.getItem("profile").split("/")[1];
        var location = $rootScope.Profile;
        if ($rootScope.Profile == 'companyProfile')
            location = 'company_profile';
        else
            location = 'profile';
        $rootScope.content = "<a href='#/" + location + "'>" + str + "</a><a href='' onclick=logout('logout')>Log Out</a><a href='' onclick=logout('signout')>Sign Out</a>";
    }
}
// initialize messageResource.js with settings
messageResource.init({
    // path to directory containing message resource files(.properties files),
    // give empty string or discard this configuration if files are in the
    // same directory as that of html file.
    filePath: 'resources/'
});

var resourcesCallback = function () {
    // console.log("resources.properties loaded");
};

messageResource.load('resources', resourcesCallback);

$(document).ready(function () {
    $("[data-toggle = 'popover']").popover();
    //click event outside profile picture.
    $('html:not("#profilePicture")').click(function (e) {
        if (e.target.id != 'profilePicture') {
            $('#profilePicture').popover('hide');
        }
    });

    //popover small modal
    $('.navBar').popover({
        selector: '[data-popover]',
        trigger: 'click',
        content: '',
        placement: 'auto',
        delay: {show: 400, hide: 1500}
    });

});


//push woosh notification!
window.onload = function () {
    pushwoosh.subscribeAtStart();
};

//sockets for live notifications
function sockets() {
    var userId = localStorage.getItem('user_id').toString();
    url = "ws://cvmatcher.herokuapp.com/" + userId;
    //TODO: OPEN SOCKET!
    connectToChat(url);
}

//connection for sockets
function connectToChat(url) {
    socket = new ReconnectingWebSocket(url, null, {debug: false, reconnectInterval: 10000});
    console.log(socket);
    socket.onmessage = function (msg) {
        var message = JSON.parse(msg.data);
        console.log(message);
    };
}

//send notification
function sendNotification(notificationType, userId, jobId, other, jobName) {
    var message = {};
    message.notificationType = notificationType;
    message.user = userId;
    message.jobId = jobId;
    message.jobName = jobName;
    message.other = other;
    socket.send(JSON.stringify(message));
}

//notifications for sockets
function notifyMe(type, jobName) {
    var body;
    body = '';
    if (!Notification) {
        console.log('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }

    if (Notification.permission === "granted") {

        if (type == 'seen') {
            body = jobName + " Watch your CV!";
        }
        else if (type == 'like') {
            body = jobName + " Like your CV!";
        }
        else if (type == 'unlike') {
            body = jobName + " unLike your CV!";

        }
        else if (type == 'hire') {
            body = "Congradulations!!! You have been Hired to: " + jobName;

        }

        var notification = new Notification('CVMatcher Notification!', {
            icon: 'http://cvmatcher.esy.es/images/logo.png',
            body: body
        });

        notification.onclick = function () {
            window.open("#/search_jobs");
        };

    } else Notification.requestPermission();

}

// D3 bubbels in match and resume page
function bubbels() {
    new d3.svg.BubbleChart({
        supportResponsive: true,
        //container: => use @default
        size: 800,
        //viewBoxSize: => use @default
        innerRadius: 600 / 3.5,
        //outerRadius: => use @default
        radiusMin: 20,
        radiusMax: 100,
        //intersectDelta: use @default
        //intersectInc: use @default
        //circleColor: use @default
        data: {
            items: skills,
            eval: function (item) {
                return item.count;
            },
            classed: function (item) {
                return item.text.split(" ").join("");
            }
        },
        plugins: [
            {
                name: "lines",
                options: {
                    format: [
                        {// Line #0
                            textField: "count",
                            classed: {count: true},
                            style: {
                                "font-size": "28px",
                                "font-family": "Source Sans Pro, sans-serif",
                                "text-anchor": "middle",
                                fill: "white"
                            },
                            attr: {
                                dy: "0px",
                                x: function (d) {
                                    return d.cx;
                                },
                                y: function (d) {
                                    return d.cy;
                                }
                            }
                        },
                        {// Line #1
                            textField: "text",
                            classed: {text: true},
                            style: {
                                "font-size": "14px",
                                "font-family": "Source Sans Pro, sans-serif",
                                "text-anchor": "middle",
                                fill: "white"
                            },
                            attr: {
                                dy: "20px",
                                x: function (d) {
                                    return d.cx;
                                },
                                y: function (d) {
                                    return d.cy;
                                }
                            }
                        }
                    ],
                    centralFormat: [
                        {// Line #0
                            style: {"font-size": "50px"},
                            attr: {}
                        },
                        {// Line #1
                            style: {"font-size": "30px"},
                            attr: {dy: "40px"}
                        }
                    ]
                }
            }]
    });
}


