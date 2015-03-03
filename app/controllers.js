var instagramAppControllers = angular.module('instagramApp.controllers', []);

var AppController = instagramAppControllers.controller('AppController', function ($scope, $state, AuthenticationService, instagramApi) {

    $scope.isLoggedIn = function(){

        if(AuthenticationService.isLoggedIn()){

            return true;

        }else{
            return false;
        }

    };

    //common methods
    $scope.giveLike = function(mediaId){

        instagramApi.giveLike(mediaId,function(response){

            console.log(response);

        });

    };

});

var navController = instagramAppControllers.controller('navController', function($scope, AuthenticationService, $location){

    $scope.isLoggedIn = function(){

        if(AuthenticationService.isLoggedIn()){

            $scope.user = AuthenticationService.getCurrentUser();

            return true;

        }else{
            return false;
        }

    };

    $scope.signOut = function(){

        AuthenticationService.ClearCredentials();

        $location.path("/#");

    };

    $scope.refresh = function(){

        AuthenticationService.getUserSelf();

    };

});


var indexController = instagramAppControllers.controller('IndexController', function ($scope, instagramApi) {

    $scope.serviceMeta = {};

    $scope.next_url = "";

    $scope.refreshFeed = function(){

        instagramApi.userSelfFeed(function(response){

            $scope.serviceMeta = response.meta;

            $scope.feed = response.data;

            $scope.next_url = response.next_url;

        });

    };

});

var loginController = instagramAppControllers.controller('loginController', function ($scope, $stateParams, AuthenticationService, instagramApi, $location) {

    $scope.$on('$viewContentLoaded', function () {

        $scope.accessToken = $stateParams.accessToken;

        AuthenticationService.setAuth($scope.accessToken);

        AuthenticationService.getUserSelf(function (response) {

            $scope.serviceMeta = response.meta;

            $location.path("/#");

        });

    });

});


var popularController = instagramAppControllers.controller('popularController', function ($scope, instagramApi) {

    $scope.layout = 'grid';

    $scope.setLayout = function (layout) {
        $scope.layout = layout;
    };

    $scope.isLayout = function (layout) {
        return $scope.layout == layout;
    };

    $scope.popularImages = [];

    $scope.serviceMeta = {};

    $scope.refresh = function () {

        instagramApi.fetchPopular(function (response) {

            $scope.serviceMeta = response.meta;

            $scope.popularImages = response.data;
                console.log($scope.popularImages);
        });
    };

});

var UserSearchController = instagramAppControllers.controller('UserSearchController', function ($scope, instagramApi) {

    $scope.layout = 'grid';

    $scope.setLayout = function (layout) {
        $scope.layout = layout;
    };

    $scope.isLayout = function (layout) {
        return $scope.layout == layout;
    };

    $scope.users = [];

    $scope.serviceMeta = {};

    $scope.search = function () {

        instagramApi.searchUser($scope.username, function (response) {

            $scope.serviceMeta = response.meta;

            $scope.users = response.data;

        });

    }

});

var userController = instagramAppControllers.controller('userController', function ($scope, instagramApi, $stateParams) {

    $scope.userId = $stateParams.userId;

    $scope.images = [];

    $scope.userName = $stateParams.userName;

    $scope.serviceMeta = {};

    $scope.getUserProfile = function () {

        instagramApi.getUser($scope.userId, function (response) {

            $scope.serviceMeta = response.meta;

            if ($scope.serviceMeta.code == 200) {

                $scope.user = response.data;

                $scope.getRecentMedia();

            }

        });

    };

    $scope.getRecentMedia = function () {

        instagramApi.getRecentMedia($scope.userId, function (response) {

            $scope.serviceMeta = response.meta;

            $scope.images = response.data;

        });

    };

});


var mediaController = instagramAppControllers.controller('mediaController', function ($scope, instagramApi, $stateParams) {

    $scope.mediaId = $stateParams.mediaId;

    $scope.mediaType = "";

    $scope.serviceMeta = {};

    $scope.getMedia = function(){

        instagramApi.getMedia($scope.mediaId, function (response) {

            $scope.serviceMeta = response.meta;

            $scope.media = response.data;
                    console.log($scope.media);
            instagramApi.getComments($scope.mediaId, function(response){

                $scope.media.comments.data = response.data;

            });

        });

    };

});


var searchTagController = instagramAppControllers.controller('searchTagController', function ($scope, instagramApi) {

    $scope.tags = [];

    $scope.serviceMeta = {};

    $scope.search = function () {

        instagramApi.searchTags($scope.tag, function (response) {

            $scope.serviceMeta = response.meta;

            $scope.tags = response.data;

        });

    }

});

var tagController = instagramAppControllers.controller('tagController', function ($scope, instagramApi, $stateParams) {

    $scope.images = [];

    $scope.tagName = $stateParams.tagName;

    $scope.serviceMeta = {};

    $scope.getTagMedia = function(){

        instagramApi.getTagMedia($scope.tagName, function (response) {

            $scope.serviceMeta = response.meta;

            $scope.images = response.data;

        });

    };

});