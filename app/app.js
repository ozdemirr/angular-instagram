var app = angular.module('exampleApp',['exampleApp.controllers', 'instagramService', 'ui.bootstrap', 'ngRoute']);

app.constant('instagramCredentials',
{
apiUrl:'https://api.instagram.com/v1/',
clientId:'e33dbf0e5d404916b8624295ffd5779f'
}
);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/index', {
                title: 'Home',
                templateUrl: 'views/index.html',
                controller: 'IndexController'
            }).
            when('/user/:id', {
                title: 'User',
                templateUrl: 'views/user.html',
                controller: 'userController'
            }).
            when('/findUser', {
                title: 'Find User',
                templateUrl: 'views/findUser.html',
                controller: 'userFindController'
            }).
            when('/searchTag', {
                title: 'Search Tag',
                templateUrl: 'views/searchTag.html',
                controller: 'searchTagController'
            }).
            when('/tag/:name', {
                title: 'Tag',
                templateUrl: 'views/tag.html',
                controller: 'tagController'
            }).
            when('/popular', {
                title: 'Popular Pictures',
                templateUrl: 'views/popular.html',
                controller: 'popularController'
            }).
            otherwise({
                redirectTo: '/index'
            });
    }]);


//page title change event
app.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);