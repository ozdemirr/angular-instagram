var exampleAppControllers = angular.module('exampleApp.controllers', []);

var indexController = exampleAppControllers.controller('IndexController',  function ($scope,instagramAPIservice) {

    $scope.message = "Welcome";

});

//var pageController = exampleAppControllers.controller('PageController', function ($scope, $routeParams,$route) {
//
//    $scope.pageId = $routeParams.pageId;
//
//
//});

var popularController = exampleAppControllers.controller('popularController', function($scope,instagramApi){

    $scope.layout = 'grid';

    $scope.setLayout = function(layout){
        $scope.layout = layout;
    };

    $scope.isLayout = function(layout){
        return $scope.layout == layout;
    };

    $scope.popularImages = [];

    $scope.refresh = function(){

        instagramApi.fetchPopular(function(data){

            $scope.popularImages = data;

        });
    };

    $scope.refresh();

});

var userFindController = exampleAppControllers.controller('userFindController', function($scope, instagramApi) {

    $scope.users = [];

    $scope.search = function(){

        instagramApi.searchUser($scope.username, function(data) {

            $scope.users = data;

        });

    }

});

var userController = exampleAppControllers.controller('userController', function($scope, instagramApi, $routeParams) {

    $scope.images = [];

    $scope.userId = $routeParams.id;

    $scope.showAlert = false;

    instagramApi.getRecentMedia($scope.userId, function(response) {

        if(response.meta.code == 200) {

            $scope.images = response.data;

        }else{

            $scope.showAlert = true;

        }

    });

});


var searchTagController = exampleAppControllers.controller('searchTagController', function($scope, instagramApi) {

    $scope.tags = [];

    $scope.showAlert = false;

    $scope.search = function(){

        instagramApi.searchTags($scope.tag, function(response) {

            if(response.data.length != 0) {

                $scope.tags = response.data;

            }else{

                $scope.showAlert = true;

            }

        });

    }

});

var tagController = exampleAppControllers.controller('tagController', function($scope, instagramApi, $routeParams) {

    $scope.images = [];

    instagramApi.getTagPictures($routeParams.name, function(data) {

        $scope.images = data;

    });

});