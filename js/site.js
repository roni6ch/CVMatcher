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
                    resolvedVal: function ($location,$rootScope) {
                        $rootScope.userSignInType = '';
                        $(".navBarImg").css("display",'none');
                        if (localStorage.getItem("user_id") !== null) {
                            $location.path('/usersLogin');
                        }
                    }
                }
            }).when('/usersLogin', {
            templateUrl: 'usersLogin.html',
            controller: 'usersLoginController',
            resolve: {
                resolvedVal: function ($rootScope) {
                    $(".navBarImg").css("display",'block');
                    $rootScope.userSignInType = '';
                }
            }
        }).when('/myjobs', {
            templateUrl: 'employer/myjobs.html',
            controller: 'myjobsController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/companyProfile',"employer");
                }
            }
        }).when('/Candidates/:_id', {
            templateUrl: 'employer/candidates.html',
            controller: 'candidatesController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/companyProfile',"employer");
                }
            }
        }).when('/Archive/Candidates/:_id', {
            templateUrl: 'employer/candidates.html',
            controller: 'candidatesController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/companyProfile',"employer");
                }
            }
        }).when('/Like/Candidates/:id/resume/:_id', {
            templateUrl: 'employer/resume.html',
            controller: 'resumeController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/companyProfile',"employer");
                }
            }
        }).when('/UnLike/Candidates/:id/resume/:_id', {
            templateUrl: 'employer/resume.html',
            controller: 'resumeController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/companyProfile',"employer");
                }
            }
        }).when('/Unread/:id/resume/:_id', {
            templateUrl: 'employer/resume.html',
            controller: 'resumeController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/companyProfile',"employer");
                }
            }
        }).when('/Archive', {
            templateUrl: 'employer/archive.html',
            controller: 'myjobsController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/companyProfile',"employer");
                }
            }
        }).when('/job/:_id', {
            templateUrl: 'employer/job.html',
            controller: 'jobController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/companyProfile',"employer");
                }
            }
        }).when('/companyProfile', {
            templateUrl: 'employer/companyProfile.html',
            controller: 'companyProfileController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/companyProfile',"employer");
                }
            }
        }).when('/newJob', {
                templateUrl: 'employer/job.html',
                controller: 'jobController',
                resolve: {
                    resolvedVal: function ($location) {
                        return changeLocation($location, '#/companyProfile',"employer");
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
                        return changeLocation($location, '#/Profile','jobSeeker');
                    }
                }
            }).when('/yourjobs', {
            templateUrl: 'job_seeker/yourjobs.html',
            controller: 'yourjobSeekerController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/Profile','jobSeeker');
                }
            }
        }).when('/deleted', {
            templateUrl: 'job_seeker/yourjobs.html',
            controller: 'yourjobSeekerController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/Profile','jobSeeker');
                }
            }
        }).when('/searchJobs/:_id/matchpage', {
            templateUrl: 'job_seeker/matchpage.html',
            controller: 'matchpageController',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/Profile','jobSeeker');
                }
            }
        }).when('/Profile', {
            templateUrl: 'job_seeker/profile.html',
            controller: 'seekerProfileControler',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, '#/Profile','jobSeeker');
                }
            }
        }).when('/Favorites', {
                templateUrl: 'job_seeker/yourjobs.html',
                controller: 'yourjobSeekerController',
                resolve: {
                    resolvedVal: function ($location) {
                        return changeLocation($location, '#/Profile','jobSeeker');
                    }
                }
            })


            // Other
            .when('/About', {
                templateUrl: 'about.html',
                resolve: {
                    resolvedVal: function ($location) {
                        return changeLocation($location, null,null);
                    }
                }
            }).when('/Contact', {
            templateUrl: 'contact.html',
            resolve: {
                resolvedVal: function ($location) {
                    return changeLocation($location, null,null);
                }
            }
        })
    })
    .run(function ($rootScope) {

        if (localStorage.getItem("userSignInType"))
            $rootScope.userSignInType = localStorage.getItem("userSignInType");
        else{
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

$(document).ready(function () {

    //click event outside profile picture.
    $('html:not(".navbar")').click(function (e) {
        if (e.target.id != 'profileImg') {
            $('[data-popover]').popover('hide');
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

//resolve function to make initializion before controllers
function changeLocation(location, profilePath,userSignInType) {
    console.log(userSignInType);

    localStorage.setItem("userSignInType",userSignInType);
    //noinspection JSValidateTypes
    angular.element("#profileImg").parent().attr("href", profilePath);
    //noinspection JSValidateTypes
    angular.element("#profileImg").parent().show();
    if (localStorage.getItem("user_id") === null) {
        console.log("no user id - changeLocation function at site.js");
        location.path('/');
    }
}

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
    socket = new ReconnectingWebSocket(url, null, {debug: false, reconnectInterval: 3000});
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
            window.open("#/searchJobs");
        };

    } else Notification.requestPermission();

}

// D3 bubbels in match and resume page
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