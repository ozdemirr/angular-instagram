var instagramAppControllers = angular.module('instagramApp.controllers', []);

var AppController = instagramAppControllers.controller('AppController', function ($rootScope, $scope, $state, AuthenticationService, instagramApi,Analytics) {

    $scope.isLoggedIn = function(){

        if(AuthenticationService.isLoggedIn()){

            return true;

        }else{
            return false;
        }

    };

    //common variables
    $rootScope.authLink = AuthenticationService.getAuthLink();

    if($rootScope.globals.currentUser) {

        AuthenticationService.getRequestedBy(function(response){

            $scope.serviceMeta = response.meta;

            $rootScope.userRequests = response.data;

        });

    }

    //common method
    $scope.giveLike = function(mediaId){

        instagramApi.giveLike(mediaId);

    }

    $scope.isOwn = function(userId){

        if( $scope.isLoggedIn() ) {

            if( AuthenticationService.getCurrentUser().userId == userId ) {

                return true;

            }

        }else {

            return false;

        }

    }

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

    $scope.feed = [];

    $scope.refreshFeed = function(nextMaxId){

        instagramApi.userSelfFeed(function(response){

            $scope.serviceMeta = response.meta;

            $scope.feed = $scope.feed.concat(response.data);

            $scope.nextIterator = response.pagination.next_max_id;

        }, nextMaxId);

    };

    $scope.loadMore = function(){

        $scope.refreshFeed($scope.nextIterator);

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

        });
    };

});

var UserSearchController = instagramAppControllers.controller('UserSearchController', function ($scope, instagramApi,Analytics) {

    $scope.users = [];

    $scope.serviceMeta = {};

    $scope.search = function () {

        instagramApi.searchUser($scope.username, function (response) {

            Analytics.trackEvent('UserSearch', $scope.username);

            $scope.serviceMeta = response.meta;

            $scope.users = response.data;

        });

    }

});

var userController = instagramAppControllers.controller('userController', function ($scope, instagramApi, $stateParams) {

    $scope.setLayout = function (layout) {
        $scope.layout = layout;
        $scope.nextIterator = false;
    };

    $scope.isLayout = function (layout) {
        return $scope.layout == layout;
    };

    $scope.userId = $stateParams.userId;

    $scope.userName = $stateParams.userName;

    $scope.images = [];

    $scope.follows = [];

    $scope.followedBy = [];

    $scope.serviceMeta = {};

    $scope.usedNextIterators = [];

    $scope.iterators = [];

    $scope.getUserProfile = function () {

        instagramApi.getUser($scope.userId, function (response) {

            $scope.serviceMeta = response.meta;

            if ($scope.serviceMeta.code == 200) {

                $scope.user = response.data;

                $scope.getRecentMedia();

                if( $scope.isLoggedIn() && !$scope.isOwn() ){

                    instagramApi.relationship($scope.user.id, 'relationship', function(data) {

                        $scope.relationshipData = {};

                        if(data.data.outgoing_status == "follows"){

                            $scope.relationshipData.following = true;

                        }

                    })

                }

            }

        });

    };

    $scope.getRecentMedia = function (nextIterator) {

        //setting layout
        $scope.setLayout('getRecentMedia');

        instagramApi.getRecentMedia($scope.userId, function (response) {

            $scope.serviceMeta = response.meta;

            $scope.images = $scope.images.concat(response.data);

            $scope.nextIterator = response.pagination.next_max_id;

        }, nextIterator);

    };

    $scope.getFollows = function(nextIterator){

        //setting layout
        $scope.setLayout('getFollows');

        instagramApi.getFollows($scope.userId, function(response){

            $scope.serviceMeta = response.meta;

            $scope.follows = $scope.follows.concat(response.data);

            $scope.nextIterator = response.pagination.next_cursor;

        }, nextIterator);

    };

    $scope.getFollowedBy = function(nextIterator){

        //setting layout
        $scope.setLayout('getFollowedBy');

        instagramApi.getFollowedBy($scope.userId, function(response){

            $scope.serviceMeta = response.meta;

            $scope.followedBy = $scope.followedBy.concat(response.data);

            $scope.nextIterator = response.pagination.next_cursor;

        }, nextIterator);

    };

    $scope.relationship = function(userId, action){

        instagramApi.relationship(userId, action);

    };


    $scope.loadMore = function(){

        $scope.usedNextIterators.push($scope.nextIterator);

        eval("$scope."+$scope.layout+"('"+$scope.nextIterator+"')");

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

            if($scope.media.location) {

                $scope.map = {

                center:{latitude: $scope.media.location.latitude, longitude: $scope.media.location.longitude },

                zoom: 19,

                options : {

                        mapTypeId : 'satellite'

                    }

                };

                $scope.marker = {
                    id: 0,
                    coords: {
                        latitude: $scope.media.location.latitude,
                        longitude: $scope.media.location.longitude
                    }
                };

            }

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

            $scope.next_max_id = response.pagination.next_max_id;

        });

    };

});

var searchMapController = instagramAppControllers.controller('searchMapController', function ($scope, instagramApi, $interval, Analytics) {

    $scope.serviceMeta = {};

    $scope.images = [];

    $scope.map = {center: {latitude: 48.85837, longitude: 2.294481 }, zoom: 14 };
    $scope.options = {scrollwheel: true};
    $scope.circle =
        {
            center: {
                latitude: $scope.map.center.latitude,
                longitude: $scope.map.center.longitude
            },
            radius: 500,
            stroke: {
                color: '#08B21F',
                weight: 2,
                opacity: 1
            },
            fill: {
                color: '#08B21F',
                opacity: 0.5
            },
            geodesic: true, // optional: defaults to false
            draggable: true, // optional: defaults to false
            clickable: true, // optional: defaults to true
            editable: true, // optional: defaults to false
            visible: true, // optional: defaults to true
            control: {},
            events: {
            radius_changed: function (circle) {

                $scope.createInterval();

                },

                dragend : function(){

                $scope.clearAll();

                    $scope.createInterval();

                }
            }

        }

    $scope.min_timestamp = "";

    $scope.getMediaByLocation = function(){

        Analytics.trackEvent('Maps', $scope.circle.center.latitude + "," +$scope.circle.center.longitude);

        instagramApi.getMediaByLocation($scope.circle.center.latitude, $scope.circle.center.longitude, $scope.circle.radius, $scope.min_timestamp, function(response){

            $scope.serviceMeta = response.meta;

            $scope.images = $scope.images.concat(response.data);

            if(response.data.length > 0) {
                $scope.min_timestamp = response.data.pop().created_time;
            }

        });

    }

    $scope.clearAll = function(){

        $scope.images = [];

    }

    $scope.layout = "list";

    $scope.isLayout = function (layout) {
        return $scope.layout == layout;
    }

    $scope.setLayout = function(layout){
        $scope.layout = layout;
    }

    $scope.refreshInterval = 10;

    $scope.$watch('refreshInterval', function(newVal,oldVal) {
        if (newVal !== oldVal) {
            if(angular.isNumber($scope.refreshInterval) && $scope.refreshInterval != 0) {
                $scope.createInterval();

            }
        }
    });

    $scope.createInterval = function(){

        $scope.cancelInterval();

        $scope.getMediaByLocation();

        $scope.interval = $interval(function(){

            $scope.createProgressBarInterval();

            $scope.getMediaByLocation();

        }, $scope.refreshInterval * 1000);

        $scope.createProgressBarInterval();

    }

    $scope.cancelInterval = function(){

        $scope.min_timestamp = "";

        $interval.cancel($scope.interval);

        $scope.clearAll();

    }

    $scope.searchbox = { template:'views/templates/mapSearchBox.html', events:{
        places_changed: function (searchBox) {

            var place = searchBox.getPlaces();
            if (!place || place == 'undefined' || place.length == 0) {
                return;
            }

            $scope.map = {
                "center": {
                    "latitude": place[0].geometry.location.lat(),
                    "longitude": place[0].geometry.location.lng()
                }
            };

            $scope.circle.center.latitude = place[0].geometry.location.lat();
            $scope.circle.center.longitude = place[0].geometry.location.lng();

            $scope.createInterval();

        }
    }};

    $scope.progress = 0;

    $scope.progressPiece = 11;

    $scope.createProgressBarInterval = function(){

        $scope.clearProgressBarInterval();

        $scope.progressBarInterval = $interval(function(){

                $scope.progress = $scope.progress + $scope.progressPiece;

        }, $scope.refreshInterval * 100);

    }

    $scope.clearProgressBarInterval = function(){

        $scope.progress = 0;

        $interval.cancel($scope.progressBarInterval);

    }


});