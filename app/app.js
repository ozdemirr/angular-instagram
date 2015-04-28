var app = angular.module('instagramApp', ['instagramApp.controllers', 'instagramService', 'ui.bootstrap', 'ui.router',
    'Authentication', 'directives', 'ngCookies', 'ui.unique', 'uiGmapgoogle-maps']);

app.constant('instagramApiConfig', {
        apiUrl: 'https://api.instagram.com/v1/',
        clientId: '48252118e7924df8be40fb498d0a87c8',
        callback: 'http://ozdemirr.github.io/angular-instagram/callback.html'
    }
);


app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    // Redirect any unresolved url
    $urlRouterProvider.otherwise("/index");

    $stateProvider

        .state('index', {
            url: "/index",
            templateUrl: "views/index.html",
            data: {pageTitle: 'HomePage', pageSubTitle: ''},
            controller: "IndexController"
        })

        .state("user", {
            url: "/user/:userId/:userName",
            templateUrl: "views/user.html",
            data: {pageTitle: 'User', pageSubTitle: ''},
            controller: "userController"
        })

        .state('searchUser', {
            url: "/searchUser",
            templateUrl: "views/searchUser.html",
            data: {pageTitle: 'Search User', pageSubTitle: ''},
            controller: "UserSearchController"
        })

        .state('searchTag', {
            url: "/searchTag",
            templateUrl: "views/searchTag.html",
            data: {pageTitle: 'Search Tag', pageSubTitle: ''},
            controller: "searchTagController"
        })

        .state('searchMap', {
            url: "/searchMap",
            templateUrl: "views/searchMap.html",
            data: {pageTitle: 'Search Map', pageSubTitle: ''},
            controller: "searchMapController"
        })

        .state("tag", {
            url: "/tag/:tagName",
            templateUrl: "views/tag.html",
            data: {pageTitle: 'Tag', pageSubTitle: ''},
            controller: "tagController"
        })

        .state('popular', {
            url: "/popular",
            templateUrl: "views/popular.html",
            data: {pageTitle: 'Popular Images', pageSubTitle: ''},
            controller: "popularController"
        })

        .state("media", {
            url: "/media/:mediaId/:mediaType",
            templateUrl: "views/media.html",
            data: {pageTitle: 'Media', pageSubTitle: ''},
            controller: "mediaController"
        })

        .state("login", {
            url: "/login/:accessToken",
            templateUrl: "views/login.html",
            data: {pageTitle: 'Login', pageSubTitle: ''},
            controller: "loginController"
        })

}]);

app.run(["$rootScope", 'AuthenticationService', 'instagramApi', 'instagramApiConfig', '$state', function ($rootScope, AuthenticationService, instagramApi, instagramApiConfig, $state) {

    instagramApi.setCredentials(instagramApiConfig);

    AuthenticationService.start(instagramApi);

    $rootScope.$state = $state;

    $rootScope.errorCodes = instagramApi.errorCodes;

}]);