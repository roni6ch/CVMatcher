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
                    resolvedVal: function ($location) {
                        if (localStorage.getItem("user_id") !== null) {
                            $location.path('/usersLogin');
                        }
                    }
                }
            }).when('/usersLogin', {
            templateUrl: 'usersLogin.html',
            controller: 'usersLoginController'
        }).when('/myjobs', {
            templateUrl: 'employer/myjobs.html',
            controller: 'myjobsController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/companyProfile');
                }
            }
        }).when('/Candidates/:_id', {
            templateUrl: 'employer/candidates.html',
            controller: 'candidatesController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location,'#/companyProfile');
                }
            }
        }).when('/Archive/Candidates/:_id', {
            templateUrl: 'employer/candidates.html',
            controller: 'candidatesController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/companyProfile');
                }
            }
        }).when('/Like/Candidates/:id/resume/:_id', {
            templateUrl: 'employer/resume.html',
            controller: 'resumeController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/companyProfile');
                }
            }
        }).when('/UnLike/Candidates/:id/resume/:_id', {
            templateUrl: 'employer/resume.html',
            controller: 'resumeController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/companyProfile');
                }
            }
        }).when('/Unread/:id/resume/:_id', {
            templateUrl: 'employer/resume.html',
            controller: 'resumeController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/companyProfile');
                }
            }
        }).when('/Archive', {
            templateUrl: 'employer/archive.html',
            controller: 'myjobsController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/companyProfile');
                }
            }
        }).when('/job/:_id', {
            templateUrl: 'employer/job.html',
            controller: 'jobController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/companyProfile');
                }
            }
        }).when('/companyProfile', {
            templateUrl: 'employer/companyProfile.html',
            controller: 'companyProfileController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/companyProfile');
                }
            }
        }).when('/newJob', {
                templateUrl: 'employer/job.html',
                controller: 'jobController',
                resolve: {
                    resolvedVal: function ($location) {
                        return changeLocation($location, '#/companyProfile');
                    }
                }
            })
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////// job seeker///////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            .when('/searchJobs', {
                templateUrl: 'job_seeker/searchJobs.html',
                controller: 'jobSeekerSearchJobsController',
                resolve: {
                    resolvedVal: function ($location) {
                        return changeLocation($location);
                    }
                }
            }).when('/yourjobs', {
            templateUrl: 'job_seeker/yourjobs.html',
            controller: 'yourjobSeekerController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/Profile');
                }
            }
        }).when('/deleted', {
            templateUrl: 'job_seeker/yourjobs.html',
            controller: 'yourjobSeekerController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/Profile');
                }
            }
        }).when('/searchJobs/:_id/matchpage', {
            templateUrl: 'job_seeker/matchpage.html',
            controller: 'matchpageController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/Profile');
                }
            }
        }).when('/Profile', {
            templateUrl: 'job_seeker/profile.html',
            controller: 'seekerProfileControler',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/Profile');
                }
            }
        }).when('/Favorites', {
                templateUrl: 'job_seeker/yourjobs.html',
                controller: 'yourjobSeekerController',
                resolve: {
                    resolvedVal: function ($location) {
                        return changeLocation($location, '#/Profile');
                    }
                }
            })


            // Other
            .when('/About', {
                templateUrl: 'about.html',
                resolve: {
                    resolvedVal: function ($location) {
                        if (localStorage.getItem("user_id") !== null) {
                            $location.path('/');
                        }
                    }
                }
            }).when('/Contact', {
            templateUrl: 'contact.html',
            resolve: {
                resolvedVal: function ($location) {
                    if (localStorage.getItem("user_id") !== null) {
                        $location.path('/');
                    }
                }
            }
        })
    })
    .run(function ($rootScope) {


        $rootScope.userSignInType = '';
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
$(document).ready(function () {
    $('.navbar a').on('click', function () {
        $('.btn-navbar').click(); //bootstrap 2.x
        $('.navbar-toggle').click(); //bootstrap 3.x by Richard
    });

    $(".navbar-toggle").on("click", function () {
        $(this).toggleClass("active");
        if ($(this).hasClass('active')) {
            $(".navbar-collapse").fadeIn();
        }
        else {
            $(".navbar-collapse").fadeOut();

        }
    });


    $('html:not(".navbar")').click(function (e) {
        if (e.target.id != 'profileImg') {
            $('[data-popover]').popover('hide');
        }
    });

    $('.navBar').popover({
        selector: '[data-popover]',
        trigger: 'click',
        content: '',
        placement: 'auto',
        delay: {show: 400, hide: 1500}
    });

});

function changeLocation(location, profilePath) {
    //noinspection JSValidateTypes
    angular.element("#profileImg").parent().attr("href", profilePath);
    //noinspection JSValidateTypes
    angular.element("#profileImg").parent().show();
    if (localStorage.getItem("user_id") === null) {
        console.log("no user id");
        location.path('/');
    }

}

//TODO: PW!

window.onload = function () {
    pushwoosh.subscribeAtStart();
};


function sockets() {

    var userId = localStorage.getItem('user_id').toString();
    url = "ws://cvmatcher.herokuapp.com/" + userId;
    //TODO: OPEN SOCKET!
    //connectToChat(url);
}

function connectToChat(url) {
    socket = new ReconnectingWebSocket(url, null, {debug: false, reconnectInterval: 10000});
    console.log(socket);

    socket.onmessage = function (msg) {
        var message = JSON.parse(msg.data);
        console.log(message);

    };
}

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
            window.open("#/searchJobs");
        };

    } else Notification.requestPermission();

}

function bubbels() {
    console.log(skills);
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