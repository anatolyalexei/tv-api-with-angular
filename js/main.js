var app = angular.module('myApp', ['ngRoute','ngSanitize']);

app.config(function($routeProvider, $locationProvider){

	$routeProvider
		.when('/', {
			templateUrl: 'partials/home.html',
			controller: 'calendarControllerToday'

		})
		.when('/yesterday', {
			templateUrl: 'partials/yesterday.html',
			controller: 'calendarControllerYesterday'
		})
		.when('/tomorrow', {
			templateUrl: 'partials/tomorrow.html',
			controller: 'calendarControllerTomorrow'
		})
		.when('/:id', {
			templateUrl: 'partials/show-id.html',
			controller: 'showIdController'
		});
});

app.filter('to_trusted', ['$sce', function($sce){
	return function(text){
		return $sce.trustAsHtml(text);
	};
}]);

app.controller('homeController', function($scope, $http){
	var get_shows = function(dataShow) {
		$http.get('http://api.tvmaze.com/search/shows?q='+dataShow).
			success(function(data){
				$scope.search = data;
			});
	}
	$scope.dataShow = '';
	$scope.$watch('dataShow', get_shows, true);
});

app.controller('showIdController', function($scope, $http, $routeParams, $sce){
	$http.get('http://api.tvmaze.com/shows/'+ $routeParams.id+"?embed=episodes").
		success(function(data){
			$scope.showDetail = data;
			$scope.showDetailSummary = data.summary;

			$scope.deliberatelyTrustDangerousSnippet = function() {
               return $sce.trustAsHtml($scope.showDetailSummary);
        	};
	});
	$http.get('http://api.tvmaze.com/shows/'+ $routeParams.id +'?embed=nextepisode').
		success(function(data){
			$scope.nextepisode = data._embedded.nextepisode;
	});	
});
function gettodaydate() {
	var d = new Date(); 
	var date=""+d.getFullYear()+"-"+((d.getMonth()+1) >=10 ? (d.getMonth()+1) : "0" + (d.getMonth()+1))+"-"+d.getDate();
	return date;        
}

function gettomorrowdate() {
	var d = new Date(); 
	var date=""+d.getFullYear()+"-"+((d.getMonth()+1) >=10 ? (d.getMonth()+1) : "0" + (d.getMonth()+1))+"-"+ (d.getDate()+1);
	return date;        
}

function getyesterdaydate() {
	var d = new Date(); 
	var date=""+d.getFullYear()+"-"+((d.getMonth()+1) >=10 ? (d.getMonth()+1) : "0" + (d.getMonth()+1))+"-"+(d.getDate()-1);
	return date;        
}
app.controller('calendarControllerToday', function($scope, $http){
	$http.get('http://api.tvmaze.com/schedule?country=US&date='+gettodaydate()).
		success(function(data) {
			$scope.today = data;
		});
})
app.controller('calendarControllerTomorrow', function($scope, $http){
	$http.get('http://api.tvmaze.com/schedule?country=US&date='+gettomorrowdate()).
		success(function(data){
			$scope.tomorrow = data;
		});
})
app.controller('calendarControllerYesterday', function($scope, $http){
	$http.get('http://api.tvmaze.com/schedule?country=US&date='+getyesterdaydate()).
		success(function(data){
			$scope.yesterday = data;
		});
})