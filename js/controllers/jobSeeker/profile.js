/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* Job Seeker Profile Page Controller ****************
 */
app
    .controller(
        'seekerProfileControler',
        function ($scope, $http, $compile, $rootScope, $timeout) {
            //noinspection JSValidateTypes
            angular.element("#profileImg").parent().attr("href", '#/Profile');

            if (localStorage.getItem("userSignInType"))
                $rootScope.userSignInType = localStorage.getItem("userSignInType");

            $rootScope.userSignInType = "jobSeeker";
            $("#geocomplete").geocomplete();
            $("[rel='popover']").popover({trigger: "hover", container: "body"});

            var cvJson = false;
            var closeModal = false;

            var myKeyWords = [];
            var indx = 2;
            $scope.getMainJson = function () {
                //job seeker Details
                $http({
                    url: 'https://cvmatcher.herokuapp.com/getUser',
                    method: "POST",
                    data: {
                        "user_id": $rootScope.user_id
                    }
                })
                    .then(function (data) {
                            //navigation in site
                            $(".navigation")[0].innerHTML = "<a href='#/usersLogin'>Homepage</a><span> > </span><a href='#/Profile'>Profile</a>";

                            $scope.jobSeeker = data.data[0];
                            console.log(data.data[0]);
                            if (typeof data.data[0].current_cv !== 'undefined' && data.data[0].current_cv != null) {
                                var currentId = data.data[0].current_cv;
                                localStorage.setItem("current_cv",currentId);
                                $http({
                                    url: 'https://cvmatcher.herokuapp.com/getMatchingObject',
                                    method: "POST",
                                    data: {
                                        "matching_object_id": currentId,
                                        "matching_object_type": "cv"
                                    }
                                })
                                    .then(function (data) {
                                            angular.element(".fa-pulse").hide();
                                            console.log(data);
                                            myKeyWords = [];
                                            $scope.jobSeekerCV = data.data[0];
                                            cvJson = true;
                                            if ($scope.jobSeekerCV.original_text.history_timeline.length == 0) {
                                                $scope.addEducation('education');
                                                $scope.addEducation('employment');
                                            }
                                            if (cvJson) {
                                                if ($scope.jobSeekerCV.requirements[0].combination.length > 0)
                                                    angular.forEach($scope.jobSeekerCV.requirements[0].combination, function (value) {

                                                        myKeyWords.push({
                                                            "name": value.name,
                                                            "years": value.years
                                                        });

                                                        indx = $(".timeline li").length + 1;
                                                        var yearsExperience = '<label class="parserExperienceYearsLabel">Years<input type="text" class="form-control" class="parserExperienceYears" name="experience_years" value="' + value.years + '"></label>';
                                                        angular.element(".parseExperience").append('<div class="parser"><label class="parserExperienceLanguage">Language<input type="text" required class="form-control " id="experience" name="experience"' +
                                                            ' value="' + value.name + '"  /></label>' + yearsExperience) + '</div>';
                                                    });
                                                angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");
                                            }
                                        },
                                        function (response) { // optional
                                            angular.element(".fa-pulse").hide();
                                            console.log("jobSeekerCv AJAX failed!");
                                            console.log(response);

                                        }
                                    );
                            } else {
                                $scope.addEducation('education');
                                $scope.addEducation('employment');

                                angular.element(".fa-pulse").hide();

                            }
                            //userId = data.data[0]._id;
                            angular.element(".fa-pulse").hide();
                        },
                        function (response) { // optional
                            angular.element(".fa-pulse").hide();
                            console.log("jobSeekerJobs AJAX failed!");
                            console.log(response);

                        });
            };

            $scope.removeContentCV = function (index) {
                $scope.changeContent();
                indx++;
                angular.element("#submitAfterParse").addClass("disabled").css("pointer-events", "none");
                $("#cvLi" + index).remove();
            };
            $scope.changeContent = function () {

                angular.element("#submitAfterParse").addClass("disabled").css("pointer-events", "none");
                angular
                    .element(".parseExperienceButton").show();
                angular
                    .element(".parseExperiencePlusButton").addClass("hidden");

            };
            $scope.selectFromYear = function (selected) {
                $scope.selectFrom = selected;
            };

            var parseExpereince = {
                "expereince": []
            };

            history_timeline = [];
            $scope.parseMyExperience = function () {
                parseExpereince = {
                    "expereince": []
                };
                if (cvJson) {
                    $(".parseExperience").html("");
                }
                angular.element(".fa-spin").show();
                /*
                 $.each($(".timeline .timeline-inverted"), function (key, val) {
                 var text = $(this).find('.timeline-body textarea').val();
                 var startdate = $(this).find('.timeline-heading label:nth-child(2) select').val();
                 var enddate = $(this).find('.timeline-heading label:nth-child(3) select').val();

                 if (startdate > enddate) {
                 $scope.status = 'Please fix years - "From" is bigger then "TO"';
                 $('#myModal').modal('show');
                 return;
                 }

                 parseExpereince.expereince.push({
                 "text": text,
                 "startdate": startdate,
                 "enddate": enddate
                 });
                 });*/

                var type;
                history_timeline = [];

                $.each($(".timeline .timeline-inverted"), function () {
                    var text = $(this).find('.timeline-body textarea').val();
                    var startdate = $(this).find('.timeline-heading label:nth-child(2) select').val();
                    var enddate = $(this).find('.timeline-heading label:nth-child(3) select').val();

                    if (startdate > enddate) {
                        $scope.status = 'Please fix years - "From" is bigger then "TO"';
                        $('#myModal').modal('show');
                        return;
                    }


                    if ($(this).hasClass("timeline-inverted"))
                        type = 'experience';
                    else
                        type = 'education';
                    history_timeline.push({
                        "text": text,
                        "start_year": parseInt(startdate),
                        "end_year": parseInt(enddate),
                        "type": type
                    });

                    parseExpereince.expereince.push({
                        "text": text,
                        "startdate": startdate,
                        "enddate": enddate
                    });
                });

                $http({
                    url: "https://cvmatcher.herokuapp.com/getKeyWordsBySector",
                    method: "POST",
                    data: {"sector": "software engineering"}
                })
                    .then(function (data) {
                            parseExpereince.words = data.data;
                            myKeyWords = [];
                            $http({
                                url: "https://matcherbuilders.herokuapp.com/findIfKeyWordsExistsCV",
                                method: "POST",
                                data: parseExpereince
                            })
                                .then(function (data) {
                                        console.log(data);
                                        angular.element(".parseExperience").html('');
                                        angular.forEach(data.data, function (value) {


                                            myKeyWords.push({
                                                "name": value.name,
                                                "years": value.years
                                            });


                                            var yearsExperience = '<label class="parserExperienceYearsLabel">Years<input type="text" class="form-control" class="parserExperienceYears" name="experience_years" value="' + value.years + '"></label>';
                                            angular.element(".parseExperience").append('<div class="parser"><label class="parserExperienceLanguage">Language<input type="text" required class="form-control " id="experience" name="experience"' +
                                                ' value="' + value.name + '"  /></label>' + yearsExperience) + '</div>';
                                        });
                                        angular.element(".fa-spin").hide();
                                        angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");

                                    },
                                    function (response) { // optional
                                        console.log("findIfKeyWordsExistsCV AJAX failed!");
                                        console.log(response);
                                    });
                        },
                        function (response) { // optional
                            console.log("getKeyWordsBySector AJAX failed!");
                            console.log(response);
                        });

                angular
                    .element(".parseExperienceButton").hide();
                angular
                    .element(".parseExperiencePlusButton").removeClass("hidden");

            };
            $scope.addMoreExperience = function () {
                var yearsExperience = '<label class="parserExperienceYearsLabelAdded">Years<input type="text" class="form-control" class="parserExperienceYears" name="experience_years" value=""></label>';
                angular
                    .element(".parseExperience")
                    .append('<div class="parser"><label class="parserExperienceLanguageAdded">Language<input type="text" required class="form-control " id="experience" name="experience"' +
                        ' value=""  /></label>' + yearsExperience + '</div>');
            };

            $scope.addEducation = function (type) {
                var fromExperience = '<label>From<select  ng-model="selectedFrom' + indx + '"  ng-change="selectFromYear(selectedFrom' + indx + ')"  id="experience_years" name="experience_years" class="form-control" id="sel1"><option value="2004">2004</option><option value="2005">2005</option><option value="2006">2006</option><option value="2007">2007</option><option value="2008">2008</option><option value="2009">2009</option><option value="2010">2010</option><option value="2011">2011</option><option value="2012">2012</option><option value="2013">2013</option><option value="2014">2014</option><option value="2015">2015</option><option value="2016">2016</option></select></label>';
                var toExperience = '<label>To<select  ng-model="selectedTo' + indx + '"   id="experience_years" name="experience_years"class="form-control" id="sel1"><option value="2004"  ng-show="selectFrom == 2004">2004</option><option value="2005" ng-show="selectFrom <= 2005">2005</option><option value="2006" ng-show="selectFrom <= 2006">2006</option><option value="2007" ng-show="selectFrom <= 2007">2007</option><option value="2008" ng-show="selectFrom <= 2008">2008</option><option value="2009" ng-show="selectFrom <= 2009">2009</option><option value="2010" ng-show="selectFrom <= 2010">2010</option><option value="2011" ng-show="selectFrom <= 2011">2011</option><option value="2012" ng-show="selectFrom <= 2012">2012</option><option value="2013" ng-show="selectFrom <= 2013">2013</option><option value="2014" ng-show="selectFrom <= 2014">2014</option><option value="2015" ng-show="selectFrom <= 2015">2015</option><option value="2016" ng-show="selectFrom <= 2016">2016</option></select></label>';

                indx++;
                if (type == 'education') {
                    var divTemplate = '<li id="cvLi' + indx + '"><div class="timeline-badge"  ng-click="addEducation(' + "'education'" + ')"><i class="fa fa-plus"></i></div><div class="timeline-panel"><div class="timeline-heading"> <i class="fa fa-times fa-2x removeContentCV" aria-hidden="true" ng-click="removeContentCV(' + indx + ')"></i>' + fromExperience + toExperience + '</div><div class="timeline-body"><p><div class="form-group"><label for="content">Content:</label><textarea class="form-control" rows="3" name="content"   ng-model="content' + indx + '" ng-change="changeContent(content' + indx + ')" id="content" required></textarea></div></p></div></div></li>';

                }
                else {
                    var divTemplate = '<li class="timeline-inverted" id="cvLi' + indx + '"><div class="timeline-badge" ng-click="addEducation(' + "'employment'" + ')"><i class="fa fa-plus"></i></div><div class="timeline-panel"><div class="timeline-heading"> <i class="fa fa-times fa-2x removeContentCV" aria-hidden="true" ng-click="removeContentCV(' + indx + ')"></i>' + fromExperience + toExperience + '</div><div class="timeline-body"><p><div class="form-group"><label for="content">Content:</label><textarea class="form-control"   ng-model="content' + indx + '"  ng-change="changeContent(content' + indx + ')"  rows="3" name="content" id="content" required></textarea></div></p></div></div></li>';
                }
                var temp = $compile(divTemplate)($scope);
                angular.element(".timeline").append(temp);

                if (cvJson) {
                    angular
                        .element(".parseExperienceButton").show();
                    angular
                        .element(".parseExperiencePlusButton").addClass("hidden");
                }
            };
            $scope.submitUserDetails = function () {

                //add more parameters to json
                //noinspection JSDuplicatedDeclaration
                var key = 'birth_date';
                $scope.jobSeeker[key] = $(".birthDay").val();
                //noinspection JSDuplicatedDeclaration
                var key = 'address';
                $scope.jobSeeker[key] = $("#geocomplete").val();
                //noinspection JSDuplicatedDeclaration
                var key = 'phone_number';
                $scope.jobSeeker[key] = $(".phoneNumber").val();
                //noinspection JSDuplicatedDeclaration
                var key = 'linkedin';
                $scope.jobSeeker[key] = $(".linkedin").val();

                console.log("send form: ", $scope.jobSeeker);
                $http({
                    url: 'https://cvmatcher.herokuapp.com/updateUser',
                    method: "POST",
                    data: $scope.jobSeeker
                })
                    .then(function () {
                            $scope.status = 'Deatils Sent Succesfully';
                            $('#myModal').modal('show');
                            $scope.tab = 1;
                        },
                        function (response) { // optional
                            console.log("jobSeeker send form AJAX failed!");
                            console.log(response);
                        });
            };

            var combination;
            $scope.submitUserCV = function () {
                combination = [];
                $('.parser').each(function () {
                    combination.push({
                        "name": $(this).find('label:nth-child(1) input').val(),
                        "years": parseInt($(this).find('label:nth-child(2) input').val())
                    })
                });


                var jsonForNewKeyWords = [];
                $.map(combination, function (i) {
                    var exist = false;
                    $.each(myKeyWords, function (key, val) {
                        if (i.name == val.name)
                            exist = true;
                    });
                    if (exist == false) {
                        jsonForNewKeyWords.push(i.name);
                    }
                });


                //add new keywords!
                $http({
                    url: "https://cvmatcher.herokuapp.com/addKeyWords",
                    method: "POST",
                    data: {
                        "sector": $('.jobSeekerCVsector').find(":selected").val(),
                        "words_list": jsonForNewKeyWords
                    }
                })
                    .then(function (data) {
                            console.log(data);
                        },
                        function (response) { // optional
                            console.log("addKeyWords send form AJAX failed!");
                            console.log(response);
                        });


                var jobSeekerCVScopeOfPosition = [];
                //scope_of_position

                $.each($(".jobSeekerCVScopeOfPosition input:checked"), function () {
                    jobSeekerCVScopeOfPosition.push($(this).val());
                });
                if (jobSeekerCVScopeOfPosition.length == 0) {
                    $scope.status = 'Please fill the "Scope of Position" section';
                    $('#myModal').modal('show');
                    return;
                }
                /*var key = 'scope_of_position';
                 var val = $('.scope_of_position').find(":selected").val();*/
                var jobSeekerCVAcademy = [];
                $.each($(".jobSeekerCVAcademy input:checked"), function () {
                    jobSeekerCVAcademy.push($(this).val());
                });

                if (jobSeekerCVAcademy.length == 0) {
                    $scope.status = 'Please fill the "Academy" section';
                    $('#myModal').modal('show');
                    return;
                }
                /*

                 var jobSeekerCVHistoryTimeLine = [];
                 //history_timeline
                 $.each($(".timeline-panel textarea"), function () {
                 jobSeekerCVHistoryTimeLine.push($(this).val());
                 });
                 console.log("jobSeekerCVHistoryTimeLine: ",jobSeekerCVHistoryTimeLine);
                 */

                var type;
                history_timeline = [];
                $.each($(".timeline li"), function () {
                    var text = $(this).find('.timeline-body textarea').val();
                    var startdate = $(this).find('.timeline-heading label:nth-child(2) select').val();
                    var enddate = $(this).find('.timeline-heading label:nth-child(3) select').val();

                    if (startdate > enddate) {
                        $scope.status = 'Please fix years - "From" is bigger then "TO"';
                        $('#myModal').modal('show');
                        return;
                    }


                    if ($(this).hasClass("timeline-inverted"))
                        type = 'experience';
                    else
                        type = 'education';
                    history_timeline.push({
                        "text": text,
                        "start_year": parseInt(startdate),
                        "end_year": parseInt(enddate),
                        "type": type
                    });
                });

                if (cvJson) {
                    url = "https://cvmatcher.herokuapp.com/updateMatchingObject";
                    //noinspection JSDuplicatedDeclaration
                    var jobSeekerCV = {
                        "_id": $scope.jobSeekerCV._id,
                        "matching_object_type": "cv",
                        "date": new Date(),
                        "personal_properties": {
                            "_id": $scope.jobSeekerCV.personal_properties._id,
                            "university_degree": $scope.University,
                            "degree_graduation_with_honors": $scope.honors,
                            "above_two_years_experience": $scope.experience,
                            "psychometric_above_680": $scope.score,
                            "multilingual": $scope.foreign,
                            "volunteering": $scope.volunteering,
                            "full_army_service": $scope.military,
                            "officer_in_the_military": $scope.Officer,
                            "high_school_graduation_with_honors": $scope.graduate,
                            "youth_movements": $scope.Youth

                        },
                        "original_text": {
                            "_id": $scope.jobSeekerCV.original_text._id,
                            "history_timeline": history_timeline
                        },
                        "sector": $('.jobSeekerCVsector').find(":selected").val(),
                        "locations": [$('#geocomplete').val()],
                        "candidate_type": [$('.jobSeekerCVCandidateType').find(":selected").val()],
                        "scope_of_position": jobSeekerCVScopeOfPosition,
                        "academy": {
                            "_id": $scope.jobSeekerCV.academy._id,
                            "academy_type": jobSeekerCVAcademy,
                            "degree_name": $.trim($('.degree_name').find(":selected").val()),
                            "degree_type": [$('.degree_type').find(":selected").val()]
                        },
                        "requirements": [{
                            "combination": combination
                        }],
                        "user": $rootScope.user_id
                    }
                }
                else {
                    console.log("first cv");
                    url = "https://cvmatcher.herokuapp.com/addMatchingObject";
                    //noinspection JSDuplicatedDeclaration
                    var jobSeekerCV = {
                        "matching_object_type": "cv",
                        "date": new Date(),
                        "personal_properties": {
                            "university_degree": $scope.University,
                            "degree_graduation_with_honors": $scope.honors,
                            "above_two_years_experience": $scope.experience,
                            "psychometric_above_680": $scope.score,
                            "multilingual": $scope.foreign,
                            "volunteering": $scope.volunteering,
                            "full_army_service": $scope.military,
                            "officer_in_the_military": $scope.Officer,
                            "high_school_graduation_with_honors": $scope.graduate,
                            "youth_movements": $scope.Youth

                        },
                        "original_text": {
                            "history_timeline": history_timeline
                        },
                        "sector": $('.jobSeekerCVsector').find(":selected").val(),
                        "locations": [$('#geocomplete').val()],
                        "candidate_type": [$('.jobSeekerCVCandidateType').find(":selected").val()],
                        "scope_of_position": jobSeekerCVScopeOfPosition,
                        "academy": {
                            "academy_type": jobSeekerCVAcademy,
                            "degree_name": $.trim($('.degree_name').find(":selected").val()),
                            "degree_type": [$('.degree_type').find(":selected").val()]
                        },
                        "requirements": [{
                            "combination": combination
                        }],
                        "user": $rootScope.user_id
                    }
                }


                console.log("send form: ", jobSeekerCV);
                //if i got data then do update, else do add

                $http({
                    url: url,
                    method: "POST",
                    data: jobSeekerCV
                })
                    .then(function (data) {

                            localStorage.setItem("jobSeekerFirstSignIn",true);
                            $scope.status = 'Resume Sent Succesfully';
                            $('#myModal ').modal('show');
                            console.log("data: ", data);
                            closeModal = true;
                            var currentId = data.data.current_cv;
                            localStorage.setItem("current_cv",currentId);
                        },
                        function (response) { // optional
                            console.log("jobSeekerJobs send form AJAX failed!");
                            console.log(response);

                        });


            };
            $scope.exitStatus = function () {
                //if user clickd ok then move to search jobs page - need to wait to close modal
                if (closeModal == true)
                    $timeout(function () {
                        location.replace("#/searchJobs");
                    }, 1000);
            };

            //TODO: OPEN SOCKET!
            /* socket.onmessage = function (msg) {
             var message = JSON.parse(msg.data);
             console.log(message);
             notifyMe(message.notificationType, message.jobName);
             }
             */
        });