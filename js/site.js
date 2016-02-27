/** **********************************ANGULAR*************************************** */

var app = angular.module('cvmatcherApp', [ "ngRoute"  ,'infinite-scroll']);

app.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl : 'myjobs.html',
		controller : 'myjobsController'
	}).when('/readcvs', {
		templateUrl : 'readcvs.html',
		controller : 'readcvsController'
	}).when('/unreadcvs', {
		templateUrl : 'unreadcvs.html',
		controller : 'unreadcvsController'
	}).when('/favorites', {
		templateUrl : 'favorites.html',
		controller : 'favoritesController'
	})
});

/*
 * ********************* myjobs controller ****************
 */

app.controller('myjobsController', function($scope,$http) {
});

/*
 * ********************* readcvs controller ****************
 */
app.controller('readcvsController', function($scope,$http) {
	

});
/*
 * ********************* unreadcvs controller ****************
 */
app.controller('unreadcvsController', function($scope,$http) {
	
});

/*
 * ********************* favorites controller ****************
 */
app.controller('favoritesController', function($scope,$http) {
	$scope.getMainJson = function(){
	$http.get("json/myjobs.json").success( function(response) {
	      $scope.jobs = response; 
	   });
	}

});


/*
 * ********************* DIRECTIVES ****************
 */
app.directive("compileHome", function($compile){
    return{
        link: function(scope, element){
            element.html($compile("<a href='#'>Homepage</a>")(scope));
        }
    }
});
app.directive("compileReadCvs", function($compile){
    return{
        link: function(scope, element){
            element.html($compile("<a href='#'>Homepage</a><span> > </span><a href='#'>ReadCv's</a>' ")(scope));
        }
    }
});
app.directive("compileUnreadCvs", function($compile){
    return{
        link: function(scope, element){
            element.html($compile("<a href='#'>Homepage</a><span> > </span><a href='#'>UnreadCv's</a>' ")(scope));
        }
    }
});
app.directive("compileFavorites", function($compile){
    return{
        link: function(scope, element){
            element.html($compile("<a href='#'>Homepage</a><span> > </span><a href='#'>Favorites</a>' ")(scope));
        }
    }
});



//background: url("../img/ProfileImg.png") no-repeat;
/*app.directive('backImg', function() {
return function(scope, element, attrs) {
attrs.$observe('backImg', function(value) {
element.css({
'background-image' : 'url(uploads/' + $.trim(value) + ')',
'background-size' : 'cover'
});
});
};
});*/

/*$("input").keypress(function(e) {
	if (e.which == 13 && $(this).hasClass('input') ) {
		$scope.loginSystem();
		return false;
	}
});	*/
