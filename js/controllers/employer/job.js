/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* Job controller ****************
 */

var requirements = [];
var nextCombinationKey = 0;
var langId = 0;
var totalPriorotySum = 0;
var newLangClicked = false;
var combinationDeleted = false;
app.controller('jobController', function ($scope, $http, $location, $timeout, $compile, $rootScope) {
        totalPriorotySum = 0;

        //noinspection JSValidateTypes,JSValidateTypes
        angular.element("#profileImg").parent().attr("href", '#/companyProfile');
        if (localStorage.getItem("userSignInType"))
            $rootScope.userSignInType = localStorage.getItem("userSignInType");

        nextCombinationKey = 0;
        langId = 0;
        newLangClicked = false;
        requirements = [];
        $(".requirementsWrapper").hide();
        $(".experienceBeforeParse").hide();
        $id = $location.path().split('/')[1];
        $("#geocomplete").geocomplete();
        angular.element('.selectpicker').selectpicker();

        $jobId = $location.path().split('/')[2];
        var sumSliders = 0;
        var languages = [];
        var newLang = [];
        $rootScope.langs = [];
        $rootScope.list1 = [];
        $rootScope.list2 = [];
        $rootScope.list3 = [];

        var combination = [];
        var tempMustLangs = [];
        var tempAdvLangs = [];
        var tempOrLangs = [];
        var combinationsLength = 0;
        var combinationLengthAfterEdit = 0;
        var savedCurrentCombination = false;
        var editJob = false;
        var sendForm = false;
        var languagesAfterParseForKeyWords = [];

        angular.element(".removeCombination").hide();
        angular.element(".buttonsAfterParse").hide();
        //edit job - get AJAX details
        $scope.getJobJson = function () {
            $(".fa-arrow-right").hide();
            $(".fa-arrow-left").hide();

            if ($id == 'job') {
                requirements = [];
                //url for later to submit!
                url = 'https://cvmatcher.herokuapp.com/updateMatchingObject';
                $http({
                    url: 'https://cvmatcher.herokuapp.com/getMatchingObject',
                    method: "POST",
                    data: {
                        "matching_object_id": $jobId,
                        "matching_object_type": "job"
                    }
                })
                    .then(function (data) {
                        $(".navigation")[0].innerHTML = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/myjobs'>My Jobs</a><span> > </span><a href='#/job/" + $jobId + "'>Edit Job - " + data.data[0].original_text.title + "</a>";

                        $scope.jobDetails = data.data[0];
                        $scope.mustReqiurment = data.data[0].original_text['requirements'].split('|||')[0];

                        editJob = true;

                        combinationsLength = data.data[0].requirements.length - 1;
                        combinationLengthAfterEdit = data.data[0].requirements.length;
                        if (combinationsLength > 1)
                            $(".fa-arrow-right").show();
                        var i = 0;

                        totalPriorotySum = 100;

                        if (data.data[0].requirements.length > 1) {
                            $(".fa-arrow-right").show();
                        }
                        console.log(data.data);
                        if (data.data[0].requirements.length > 0) {
                            $.each(data.data[0].requirements, function (k, v) {
                                i++;
                                var combination = [];
                                $.each(v.combination, function (key, val) {
                                    if (val.mode == 'must') {
                                        tempMustLangs.push({
                                            'langId': langId++,
                                            'name': val.name,
                                            'mode': val.mode,
                                            'years': parseInt(val.years),
                                            'percentage': parseInt(val.percentage),
                                            'drag': true
                                        });
                                        languagesAfterParseForKeyWords.push(val.name);
                                        combination.push(tempMustLangs[tempMustLangs.length - 1]);
                                    }
                                    else if (val.mode == 'adv') {
                                        tempAdvLangs.push({
                                            'langId': langId++,
                                            'name': val.name,
                                            'mode': val.mode,
                                            'years': parseInt(val.years),
                                            'percentage': parseInt(val.percentage),
                                            'drag': true
                                        });
                                        languagesAfterParseForKeyWords.push(val.name);
                                        combination.push(tempAdvLangs[tempAdvLangs.length - 1]);
                                    }
                                    else {
                                        tempOrLangs.push({
                                            'langId': langId++,
                                            'name': val.name,
                                            'mode': val.mode,
                                            'years': parseInt(val.years),
                                            'percentage': parseInt(val.percentage),
                                            'drag': true
                                        });
                                        languagesAfterParseForKeyWords.push(val.name);
                                        combination.push(tempOrLangs[tempOrLangs.length - 1]);
                                    }

                                });
                                if (i == 1) {
                                    $rootScope.list1 = tempMustLangs;
                                    $rootScope.list2 = tempAdvLangs;
                                    $rootScope.list3 = tempOrLangs;

                                }

                                tempMustLangs = [];
                                tempAdvLangs = [];
                                tempOrLangs = [];

                                requirements.push({'combination': combination});
                                combination = [];


                            });
                            $scope.parseExperience();

                        }
                        angular.element(".fa-pulse").hide();


                        //SLIDERS
                        var sliders = $("#sliders").find(".slider");
                        var formulaJson = ["academy", "candidate_type", "locations", "requirements", "scope_of_position"];
                        //noinspection JSDuplicatedDeclaration
                        var i = 0;
                        $scope.formula = data.data[0].formula;
                        var j = 0;
                        var tmpNum = 0;
                        sliders.each(function () {
                            tmpNum += Number(data.data[0].formula[formulaJson[j++]]);
                        });
                        $scope.totalSum = tmpNum;
                        sumSliders = 100;
                        sliders.each(function () {
                            var availableTotal = 100;
                            $(this).empty().slider({
                                value: data.data[0].formula[formulaJson[i++]],
                                min: 0,
                                max: data.data[0].formula[formulaJson[i]],
                                range: "min",
                                step: 10,
                                slide: function (event, ui) {
                                    // Update display to current value
                                    $(this).siblings().text(ui.value);
                                    var total = 0;

                                    sliders.not(this).each(function () {
                                        total += Number($(this).slider("option", "value"));
                                    });

                                    // Need to do this because apparently jQ UI
                                    // does not update value until this event completes
                                    total += ui.value;
                                    sumSliders = total;
                                    if (total <= 100) {
                                        var max = availableTotal - total;

                                        // Update each slider
                                        sliders.not(this).each(function () {
                                            var t = $(this),
                                                value = t.slider("option", "value");

                                            var sum = +Number(+max + +value);
                                            t.slider("option", "max", sum)
                                                .siblings().text(value + '/' + sum + ' Left');
                                            t.slider('value', value);
                                        });
                                    }
                                }
                            });
                        });

                        var slider = $(".academySlider");
                    });
            }
            //im in newJob - init parameters
            else {
                url = 'https://cvmatcher.herokuapp.com/addMatchingObject';
                $(".navigation")[0].innerHTML = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/myjobs'>My Jobs</a><span> > </span><a href='#/newJob'>New Job</a>";

                editJob = true;
                angular.element(".fa-pulse").hide();

                //setTimeout  because there is a problem loading js after angular
                $timeout(function () {

                    angular.element(".fa-spinner").hide();
                    var sliders = $("#sliders").find(".slider");
                    console.log("Df");
                    sliders.each(function () {
                        var availableTotal = 100;
                        $(this).slider({
                            value: 0,
                            min: 0,
                            max: 100,
                            range: "min",
                            step: 10,
                            slide: function (event, ui) {
                                // Update display to current value
                                $(this).siblings().text(ui.value);
                                var total = 0;

                                sliders.not(this).each(function () {
                                    total += Number($(this).slider("option", "value"));
                                });

                                // Need to do this because apparently jQ UI
                                // does not update value until this event completes
                                total += ui.value;
                                sumSliders = total;
                                if (total <= 100) {
                                    var max = availableTotal - total;

                                    // Update each slider
                                    sliders.not(this).each(function () {
                                        var t = $(this),
                                            value = t.slider("option", "value");
                                        var sum = +Number(+max + +value);

                                        t.slider("option", "max", sum)
                                            .siblings().text(value + '/' + sum);
                                        t.slider('value', value);
                                    });
                                }
                            }
                        })
                    })
                });
            }
        };


        $scope.changeContent = function () {

            angular.element(".experienceBeforeParse").show();

        };

        // Limit items to be dropped in list1
        $scope.optionsList3 = {
            accept: function () {
                return $scope.list3.length < 2;
            }
        };

        $scope.exitStatus = function () {
            //if user clickd ok then move to search jobs page - need to wait to close modal
            if (sumSliders == 100 && sendForm == true) {
                $timeout(function () {
                    location.replace("#/myjobs");
                }, 1000);
            }
            else {
                $scope.status = "";
            }
        };

        //click on parse Orange button
        $scope.parseExperience = function () {

            angular.element(".fa-spin").show();
            var parseExpereince;
            var parseExpereinceAdv;
            $http({
                url: "https://cvmatcher.herokuapp.com/getKeyWordsBySector",
                method: "POST",
                data: {"sector": "software engineering"}
            })
                .then(function (data) {
                        parseExpereince = {
                            "text": $("#requirementsMust").val(),
                            "words": data.data
                        };
                        parseExpereinceAdv = {
                            "text": $("#requirementsAdvantage").val(),
                            "words": data.data
                        };
                        var tempMust, tempAdv;

                        //Requerments Must
                        if ($id == 'job') {
                            totalPriorotySum = 100;

                            angular.element(".removeCombination").show();
                            angular.element(".buttonsAfterParse").show();
                            $(".requirementsWrapper").show();
                            angular.element(".fa-spin").hide();
                            angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");
                        }
                        else {
                            $http({
                                url: "https://matcherbuilders.herokuapp.com/findIfKeyWordsExistsJOB",
                                method: "POST",
                                data: parseExpereince
                            })
                                .then(function (data1) {

                                        combination = [];
                                        angular.element(".removeCombination").show();
                                        angular.element(".fa-spin").hide();
                                        $(".requirementsWrapper").show();
                                        angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");
                                        tempMustLangs = [];
                                        $.each(data1.data, function (key, val) {
                                            tempMust = {
                                                'langId': langId++,
                                                'name': val,
                                                'percentage': 0,
                                                'mode': "must",
                                                'years': 0,
                                                'drag': true
                                            };
                                            tempMustLangs.push(tempMust);
                                            combination.push(tempMust);
                                        });
                                        $rootScope.list1 = tempMustLangs;


                                        //adv
                                        $http({
                                            url: "https://matcherbuilders.herokuapp.com/findIfKeyWordsExistsJOB",
                                            method: "POST",
                                            data: parseExpereinceAdv
                                        })
                                            .then(function (data1) {

                                                    angular.element(".buttonsAfterParse").show();
                                                    angular.element(".fa-spin").hide();
                                                    $(".requirementsWrapper").show();
                                                    angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");
                                                    tempAdvLangs = [];
                                                    $.each(data1.data, function (key, val) {
                                                        tempAdv = {
                                                            'langId': langId++,
                                                            'name': val,
                                                            'percentage': 0,
                                                            'mode': "adv",
                                                            'years': 0,
                                                            'drag': true
                                                        };

                                                        tempAdvLangs.push(tempAdv);
                                                        combination.push(tempAdv);
                                                    });

                                                    $rootScope.list2 = tempAdvLangs;

                                                },
                                                function (response) {
                                                    console.log("findIfKeyWordsExistsJOB AJAX failed!");
                                                    console.log(response);
                                                });


                                        requirements.push({'combination': combination});
                                        console.log(requirements);


                                    },
                                    function (response) {
                                        angular.element(".fa-spin").hide();
                                        console.log("findIfKeyWordsExistsJOB AJAX failed!");
                                        console.log(response);
                                    });


                        }

                    },
                    function (response) { // optional
                        console.log("getKeyWordsBySector AJAX failed!");
                        console.log(response);

                    });


            angular.element(".operators").removeClass("hidden");
            angular.element(".experienceBeforeParse").addClass(
                "hidden");

        };

        //send form
        $scope.submitForm = function () {


            //find duplicated languages
            var repeatedLangs = [];
            var languagesNames = [];
            $.each(requirements, function (key, value) {
                $.each(value, function (ke, va) {
                    repeatedLangs = [];
                    $.each(va, function (k, v) {
                        languagesNames.push(v.name);
                        if ($.inArray(v.name, repeatedLangs) == -1)
                            repeatedLangs.push(v.name);
                        else {
                            $scope.status = 'Please Remove duplicated languages!';
                            $('#sendJob').modal('show');
                            return;
                        }
                    })
                })
            });

            //newKeyWords
            var difference = [];

            jQuery.grep(languagesNames, function (el) {
                if (jQuery.inArray(el, languagesAfterParseForKeyWords) == -1) difference.push(el);
            });

            console.log(difference);
            $http({
                url: "https://cvmatcher.herokuapp.com/addKeyWords",
                method: "POST",
                data: {
                    "sector": $(".sector :selected").val(),
                    "words_list": difference
                }
            })
                .then(function (data) {
                        console.log(data);
                    },
                    function (response) { // optional
                        console.log("addKeyWords send form AJAX failed!");
                        console.log(response);
                    });


            $scope.status = 'Please wait';
            if (sumSliders == 100 && totalPriorotySum == 100) {
                var academy = [];
                //scope_of_position
                $.each($(".academy input:checked"), function () {
                    academy.push($(this).val());
                });
                if (academy.length == 0) {
                    $('#sendJob').modal('show');
                    $scope.status = "Please fill Academy";
                    return;
                }
                var degree_type = [];
                //scope_of_position
                $.each($(".degree_type input:checked"), function () {
                    degree_type.push($(this).val());
                });
                if (degree_type.length == 0) {
                    $('#sendJob').modal('show');
                    $scope.status = "Please fill Degree Type";
                    return;
                }
                var scope_of_position = [];
                //scope_of_position
                $.each($(".scope_of_position input:checked"), function () {
                    scope_of_position.push($(this).val());
                });
                if (scope_of_position.length == 0) {
                    $('#sendJob').modal('show');
                    $scope.status = "Please fill Scope of Position";
                    return;
                }
                var candidate_type = [];
                //scope_of_position
                $.each($(".candidate_type input:checked"), function () {
                    candidate_type.push($(this).val());
                });
                if (candidate_type.length == 0) {
                    $('#sendJob').modal('show');
                    $scope.status = "Please fill Candidate Type";
                    return;
                }

                var job;
                if ($id == 'job') {
                    //noinspection JSDuplicatedDeclaration
                     job = {
                        "_id": $jobId,
                        "matching_object_type": "job",
                        "original_text": {
                            "_id": $scope.jobDetails.original_text._id,
                            "title": $(".jobName").val(),
                            "description": $("#description").html(),
                            "requirements": $("#requirementsMust").val() + " ||| " + $("#requirementsAdvantage").val()
                        },
                        "sector": $(".sector :selected").val(),
                        "locations": [$("#geocomplete").val()],
                        "candidate_type": candidate_type,
                        "scope_of_position": scope_of_position,
                        "academy": {
                            "_id": $scope.jobDetails.academy._id,
                            "academy_type": academy,
                            "degree_name": $(".degree_name :selected").val(),
                            "degree_type": degree_type
                        },
                        "formula": {
                            "_id": $scope.jobDetails.formula._id,
                            "locations": parseInt($(".locationsSlider").text().split("/")[0]),
                            "candidate_type": parseInt($(".candidate_typeSlider").text().split("/")[0]),
                            "scope_of_position": parseInt($(".scope_of_positionSlider").text().split("/")[0]),
                            "academy": parseInt($(".academySlider").text().split("/")[0]),
                            "requirements": parseInt($(".requirementsSlider").text().split("/")[0])
                        },
                        "requirements": requirements,
                        "compatibility_level": $scope.compability,
                        "user": localStorage.getItem("user_id")

                    }
                }
                else {
                    //noinspection JSDuplicatedDeclaration
                     job = {
                        "matching_object_type": "job",
                        "date": new Date(),
                        "original_text": {
                            "title": $(".jobName").val(),
                            "description": $("#description").html(),
                            "requirements": $("#requirementsMust").val() + " ||| " + $("#requirementsAdvantage").val()
                        },
                        "sector": $(".sector :selected").val(),
                        "locations": [$("#geocomplete").val()],
                        "candidate_type": candidate_type,
                        "scope_of_position": scope_of_position,
                        "academy": {
                            "academy_type": academy,
                            "degree_name": $(".degree_name :selected").val(),
                            "degree_type": degree_type
                        },
                        "formula": {
                            "locations": parseInt($(".locationsSlider").text().split("/")[0]),
                            "candidate_type": parseInt($(".candidate_typeSlider").text().split("/")[0]),
                            "scope_of_position": parseInt($(".scope_of_positionSlider").text().split("/")[0]),
                            "academy": parseInt($(".academySlider").text().split("/")[0]),
                            "requirements": parseInt($(".requirementsSlider").text().split("/")[0])
                        },
                        "requirements": requirements,
                        "compatibility_level": $scope.compability,
                        "user": localStorage.getItem("user_id")

                    }
                }


                $http({
                    url: url,
                    method: "POST",
                    data: job
                })
                    .then(function (data) {
                            if (data != null)
                                $('#sendJob').modal('show');
                            $scope.status = "Job Send Succesfuly";
                            sendForm = true;
                        },
                        function (response) { // optional
                            $scope.status = "Job did not send";
                            console.log("addMatchingObject send form AJAX failed!");
                            console.log(response);
                        });
            }
            if (sumSliders != 100) {

                $('#sendJob').modal('show');
                $scope.status = "Please SUM the sliders to 100";
            }
            if (totalPriorotySum != 100) {
                $('#sendJob').modal('show');
                $scope.status = "Please SUM Prioroty to 100";
            }
        };

        /***    FROM HERE THE REQUERMENTS   ***/

            //ADD COMBINATION
        $scope.addDynamicCombination = function () {
            combinationLengthAfterEdit++;
            $(".fa-arrow-right").hide();
            if (totalPriorotySum == 100 && $rootScope.list1.length > 0) {
                nextCombinationKey++;
                combinationsLength++;
                $(".fa-arrow-left").show();
                /*if ($rootScope.list1 != 'undefined') {
                 $.each($rootScope.list1, function (key, val) {
                 combination.push(val);
                 });
                 }
                 if ($rootScope.list2 != 'undefined') {
                 $.each($rootScope.list2, function (key, val) {
                 combination.push(val);
                 });
                 }

                 if ($rootScope.list3 != 'undefined') {
                 $.each($rootScope.list3, function (key, val) {
                 combination.push(val);
                 });
                 }*/
                $rootScope.list1 = [];
                $rootScope.list2 = [];
                $rootScope.list3 = [];
                $rootScope.langs = [];
                combination = [];
                requirements.push({'combination': combination});
                //$scope.jobDetails = requirements;
                totalPriorotySum = 0;
                $scope.addDynamicLang();
            }
            else if ($rootScope.list1.length == 0) {
                $('#sendJob').modal('show');
                $scope.status = "Please add Must Language";
            }
            else if (totalPriorotySum != 100) {
                $('#sendJob').modal('show');
                $scope.status = "Please SUM Prioroty to 100";
            }
        };

        $scope.nextCombination = function (val) {
            if (totalPriorotySum != 100) {
                $('#sendJob').modal('show');
                $scope.status = "Please sum Must Prioroty to 100";
                return;
            }
            if (val == 'right') {
                savedCurrentCombination = true;
                nextCombinationKey++;
                if (nextCombinationKey < combinationsLength && nextCombinationKey != combinationsLength) {
                    $(".fa-arrow-right").show();
                    $(".fa-arrow-left").show();
                }
                else {
                    $(".fa-arrow-right").hide();
                    $(".fa-arrow-left").show();
                }
            }
            else {
                nextCombinationKey--;
                if (nextCombinationKey < combinationsLength && nextCombinationKey != 0) {
                    $(".fa-arrow-right").show();
                    $(".fa-arrow-left").show();


                }
                else {
                    $(".fa-arrow-right").show();
                    $(".fa-arrow-left").hide();
                }
            }

            $rootScope.list1 = [];
            $rootScope.list2 = [];
            $rootScope.list3 = [];
            $rootScope.langs = [];
            tempMustLangs = [];
            tempAdvLangs = [];
            tempOrLangs = [];
            totalPriorotySum = 0;
            $.each(requirements[nextCombinationKey].combination, function (key, val) {
                if (val.mode == 'must') {
                    totalPriorotySum += parseInt(val.percentage);
                    tempMustLangs.push({
                        'langId': val.langId,
                        'name': val.name,
                        'mode': val.mode,
                        'years': val.years,
                        'percentage': val.percentage,
                        'drag': true
                    });
                }
                else if (val.mode == 'adv') {
                    tempAdvLangs.push({
                        'langId': val.langId,
                        'name': val.name,
                        'mode': val.mode,
                        'years': val.years,
                        'percentage': val.percentage,
                        'drag': true
                    });
                }
                else if (val.mode == 'or') {
                    tempOrLangs.push({
                        'langId': val.langId,
                        'name': val.name,
                        'mode': val.mode,
                        'years': val.years,
                        'percentage': val.percentage,
                        'drag': true
                    });
                }
            });

            $rootScope.list1 = tempMustLangs;
            $rootScope.list2 = tempAdvLangs;
            $rootScope.list3 = tempOrLangs;


        };
        //ADD LANG
        $scope.addDynamicLang = function () {
            newLang = [];
            newLang.push({
                'langId': langId,
                'name': "Language",
                'percentage': 0,
                'mode': "langs",
                'years': 0,
                'drag': true
            });
            $rootScope.langs = newLang;
            newLangClicked = true;
        };
        //REMOVE LANG
        $scope.removeLang = function (id, sectType) {

            if (sectType == 'must') {
                $rootScope.list1 = $rootScope.list1.filter(function (obj) {
                    return obj.langId != id;
                });
            }
            if (sectType == 'adv') {
                $rootScope.list2 = $rootScope.list2.filter(function (obj) {
                    return obj.langId != id;
                });
            }
            if (sectType == 'or') {
                $rootScope.list3 = $rootScope.list3.filter(function (obj) {
                    return obj.langId != id;
                });
            }
            $.each(requirements, function (key, val) {
                $.each(val.combination, function (k, v) {
                    if (v.langId == id) {
                        totalPriorotySum -= parseInt(v.percentage);
                        val.combination.splice(k, 1);
                        return false;
                    }

                });
                /*
                 if (val.combination.length == 0){
                 combinationDeleted = true;
                 requirements.splice(key, 1);
                 console.log(requirements);
                 return false;

                 }*/

            });
            console.log("totalPriorotySum: " + totalPriorotySum);
        };

        $scope.removeCombination = function () {
            $.each(requirements, function (key) {
                if (nextCombinationKey == key) {
                    requirements.splice(key, 1);
                    combinationDeleted = true;
                    combinationsLength--;
                    return false;
                }
            });

            if (combinationDeleted == true) {
                combinationDeleted = false;
                $rootScope.list1 = [];
                $rootScope.list2 = [];
                $rootScope.list3 = [];
                $rootScope.langs = [];
                tempMustLangs = [];
                tempAdvLangs = [];
                tempOrLangs = [];
                totalPriorotySum = 0;
                if (combinationsLength == 0) {
                    $(".fa-arrow-right").hide();
                    $(".fa-arrow-left").hide();
                }
                if (combinationsLength > 0) {
                    $(".fa-arrow-left").show();
                    $(".fa-arrow-right").hide();
                }
                if (combinationsLength >= 0) {
                    nextCombinationKey = combinationsLength;
                    $.each(requirements[nextCombinationKey].combination, function (key, val) {
                        if (val.mode == 'must') {
                            totalPriorotySum += parseInt(val.percentage);
                            tempMustLangs.push({
                                'langId': val.langId,
                                'name': val.name,
                                'mode': val.mode,
                                'years': val.years,
                                'percentage': val.percentage,
                                'drag': true
                            });
                        }
                        else if (val.mode == 'adv') {
                            tempAdvLangs.push({
                                'langId': val.langId,
                                'name': val.name,
                                'mode': val.mode,
                                'years': val.years,
                                'percentage': val.percentage,
                                'drag': true
                            });
                        }
                        else if (val.mode == 'or') {
                            tempOrLangs.push({
                                'langId': val.langId,
                                'name': val.name,
                                'mode': val.mode,
                                'years': val.years,
                                'percentage': val.percentage,
                                'drag': true
                            });
                        }
                    });

                    $rootScope.list1 = tempMustLangs;
                    $rootScope.list2 = tempAdvLangs;
                    $rootScope.list3 = tempOrLangs;
                }
            }
        };
        //NAMES
        $scope.changeLangeName = function (id) {
            $.each(requirements, function (key, val) {
                $.each(val.combination, function (k, v) {
                    if (v.langId == id) {
                        v.name = $("input[data-lang-name='" + id + "']").val();
                    }
                });
            });

            if ($rootScope.list1 != 'undefined')
                $.each($rootScope.list1, function (key, val) {
                    if (val.langId == id) {
                        val.name = $("input[data-lang-name='" + id + "']").val();
                    }
                });
            if ($rootScope.list2 != 'undefined')
                $.each($rootScope.list2, function (key, val) {
                    if (val.langId == id) {
                        val.name = $("input[data-lang-name='" + id + "']").val();
                    }
                });

            if ($rootScope.list3 != 'undefined')
                $.each($rootScope.list3, function (key, val) {
                    if (val.langId == id) {
                        val.name = $("input[data-lang-name='" + id + "']").val();
                    }
                });
            if ($rootScope.langs != 'undefined')
                $.each($rootScope.langs, function (key, val) {
                    if (val.langId == id) {
                        val.name = $("input[data-lang-name='" + id + "']").val();
                    }
                });
        };
        //YEARS
        $scope.changeYears = function (id) {

            $.each(requirements, function (key, val) {
                $.each(val.combination, function (k, v) {
                    if (v.langId == id) {
                        v.years = parseInt($("select[data-select='" + id + "']").val());
                    }
                });
            });


            $.each($rootScope.list1, function (key, val) {
                if (val.langId == id) {
                    val.years = $("select[data-select='" + id + "']").val();
                }
            });
            $.each($rootScope.list2, function (key, val) {
                if (val.langId == id) {
                    val.years = $("select[data-select='" + id + "']").val();
                }
            });
            $.each($rootScope.list3, function (key, val) {
                if (val.langId == id) {
                    val.years = $("select[data-select='" + id + "']").val();
                }
            });
            if ($rootScope.langs.length > 0)
                $.each($rootScope.langs, function (key, val) {
                    if (val.langId == id) {
                        val.years = $("select[data-select='" + id + "']").val();
                    }
                })
        };
        //PLUS
        $scope.plusButton = function (id) {
            if ($("input[data-pr-num='" + id + "']").val() < 100 && totalPriorotySum < 100) {
                $("input[data-pr-num='" + id + "']").val(parseInt($("input[data-pr-num='" + id + "']").val()) + 10);
                totalPriorotySum += 10;
                $(".minusButton").attr('disabled', false);

                $.each(requirements, function (key, val) {
                    $.each(val.combination, function (k, v) {
                        if (v.langId == id) {
                            v.percentage = v.percentage + 10;
                        }
                    });
                });

                /* $.each($rootScope.list1, function (key, val) {
                 if (val.langId == id) {
                 val.percentage = parseInt(val.percentage) + 10;
                 }
                 });*/
            }
        };
        //MINUS
        $scope.minusButton = function (id) {


            if ($("input[data-pr-num='" + id + "']").val() > 0 && totalPriorotySum > 0) {
                $("input[data-pr-num='" + id + "']").val(parseInt($("input[data-pr-num='" + id + "']").val()) - 10);
                totalPriorotySum -= 10;
                $(".plusButton").attr('disabled', false);

                $.each(requirements, function (key, val) {
                    $.each(val.combination, function (k, v) {
                        if (v.langId == id) {
                            v.percentage = v.percentage - 10;
                        }
                    });
                });


                /* $.each($rootScope.list1, function (key, val) {
                 if (val.langId == id) {
                 val.percentage = parseInt(val.percentage) - 10;
                 }
                 });*/


            }

        };
    }
);