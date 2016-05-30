/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* DIRECTIVES ****************
 */

// google Button
app.directive("compileGoogle", function ($compile) {
    return {
        link: function (scope, element) {
            element
                .html($compile(
                    '<div id="gConnect"><button id="signin-button" data-scope="email"> </button></div>')(scope));
            $.getScript("https://apis.google.com/js/client:platform.js?onload=startApp");

        }
    }
});

// focus on searchBox
app.directive('focus', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element[0].focus();
        }
    }
});

// compability in myjobs page
app.directive('circle', function ($timeout) {

    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            var circle;
            // COMPABILITY
            $timeout(function () {
                circle = new ProgressBar.Circle("#" + attr.id, {
                    color: '#2196F3',
                    strokeWidth: 10,
                    fill: '#aaa'
                });

                scope.$watch('compability', function (newValue) {
                    if (newValue) {
                        circle.animate(newValue / 100, function () {
                        })
                        angular.element("#circle-container-0 > h5")[0].innerHTML = newValue + "%";
                    }
                }, true);

                circle.animate(attr.compability / 100, function () {
                })
                return circle;
            });
        }
    }
});
// focus on searchBox
app.directive('profileimg', function ($compile, $location, $rootScope) {
    return {
        replace: true,
        restrict: 'E',
        link: function (scope, element, attr) {
            //userProfileImg
            if (localStorage.getItem("user")) {
                var cookieImg = $.parseJSON(localStorage.getItem("user")).image;
                var profile = localStorage.getItem("profile");
                var e = $compile(
                    '<a ng-href="' + profile + '"><img src="' + cookieImg + '" id="profileImg"></a>')(scope);
                $compile(angular.element("#profilePage").replaceWith(e))(scope);
            }
        }
    }
});

//tool tip
app.directive('bsTooltip', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            $(element).hover(function () {
                // on mouseenter
                $(element).tooltip('show');
            }, function () {
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});

//jobPage
app.directive('droppableMust', function ($rootScope) {
    return {
        scope: {},
        link: function (scope, element, attr) {
            var id;
            id = attr.langName;
            totalPriorotySum = 0;


            $.each($rootScope.list1, function (key, val) {
                if (val.langId == id) {
                    val.mode = "must";
                }
            })

            $.each($rootScope.list2, function (key, val) {
                if (val.langId == id) {
                    val.mode = "must";
                }
            })
            $.each($rootScope.list3, function (key, val) {
                if (val.langId == id) {
                    val.mode = "must";
                }
            })


            $.each(requirements, function (key, val) {
                $.each(val.combination, function (k, v) {
                    if (v.langId == id) {
                        v.mode = "must";
                    }
                });
            });

            if (combinationDeleted == false && nextCombinationKey >= 0 && requirements.length > 0) {
                $.each(requirements[nextCombinationKey].combination, function (key, val) {
                    if (val.mode == 'must')
                        totalPriorotySum += parseInt(val.percentage);
                });
            }
            else if (requirements.length == 0) {
                combination = [];
                requirements.push({'combination': combination});
            }

            //requeire if i want to return the 'combinationDeleted' to original position
            combinationDeleted = false;

            //drag into must from langs
            if (attr.class == 'langsName' && newLangClicked == true && requirements.length > 0) {
                newLangClicked = false;

                requirements[nextCombinationKey].combination.push({
                    'langId': langId++,
                    'name': attr.value,
                    'mode': "must",
                    'years': 0,
                    'percentage': 0,
                    'drag': true
                })
            }
            console.log("totalPriorotySum: " + totalPriorotySum);


        }
    }
}).directive('droppableAdv', function ($rootScope) {
    return {
        scope: {},
        link: function (scope, element, attr) {

            var id = attr.langName;
            totalPriorotySum = 0;

            $.each($rootScope.list1, function (key, val) {
                if (val.langId == id) {
                    val.mode = "adv";
                    val.percentage = 0;
                }
            })

            $.each($rootScope.list2, function (key, val) {
                if (val.langId == id) {
                    val.mode = "adv";
                    val.percentage = 0;
                }
            })
            $.each($rootScope.list3, function (key, val) {
                if (val.langId == id) {
                    val.mode = "adv";
                    val.percentage = 0;
                }
            })


            $.each(requirements, function (key, val) {
                $.each(val.combination, function (k, v) {
                    if (v.langId == id) {
                        v.mode = "adv";
                        v.percentage = 0;
                    }
                });
            });
            /*
             $.each(requirements[nextCombinationKey].combination, function (key, val) {
             if (val.mode == 'must') {
             totalPriorotySum += parseInt(val.percentage);
             console.log(val);
             }
             });*/

            if (combinationDeleted == false && nextCombinationKey >= 0 && requirements.length > 0) {
                $.each(requirements[nextCombinationKey].combination, function (key, val) {
                    if (val.mode == 'must')
                        totalPriorotySum += parseInt(val.percentage);
                });
            }
            else if (requirements.length == 0) {
                combination = [];
                requirements.push({'combination': combination});
            }


            if (attr.class == 'langsName' && newLangClicked == true && requirements.length > 0) {
                newLangClicked = false;
                requirements[nextCombinationKey].combination.push({
                    'langId': langId++,
                    'name': attr.value,
                    'mode': "adv",
                    'years': 0,
                    'percentage': 0,
                    'drag': true
                })
            }
            console.log(totalPriorotySum);
        }
    }
}).directive('droppableOr', function ($rootScope) {
    return {
        scope: {},
        link: function (scope, element, attr) {
            var id = attr.langName;
            totalPriorotySum = 0;


            $.each($rootScope.list1, function (key, val) {
                if (val.langId == id) {
                    val.mode = "or";
                }
            })

            $.each($rootScope.list2, function (key, val) {
                if (val.langId == id) {
                    val.mode = "or";
                    val.percentage = 0;
                }
            })
            $.each($rootScope.list3, function (key, val) {
                if (val.langId == id) {
                    val.mode = "or";
                    val.percentage = 0;
                }
            })


            $.each(requirements, function (key, val) {
                $.each(val.combination, function (k, v) {
                    if (v.langId == id) {
                        v.mode = "or";
                        v.percentage = 0;
                    }
                });
            });
            /* $.each(requirements[nextCombinationKey].combination, function (key, val) {
             if (val.mode == 'must')
             totalPriorotySum += parseInt(val.percentage);
             });*/


            if (combinationDeleted == false && nextCombinationKey >= 0 && requirements.length > 0) {
                $.each(requirements[nextCombinationKey].combination, function (key, val) {
                    if (val.mode == 'must')
                        totalPriorotySum += parseInt(val.percentage);
                });
            }
            else if (requirements.length == 0) {
                combination = [];
                requirements.push({'combination': combination});
            }

            if (attr.class == 'langsName' && newLangClicked == true && requirements.length > 0) {
                newLangClicked = false;
                requirements[nextCombinationKey].combination.push({
                    'langId': langId++,
                    'name': attr.value,
                    'mode': "or",
                    'years': 0,
                    'percentage': 0,
                    'drag': true
                })
            }
        }
    }
})
