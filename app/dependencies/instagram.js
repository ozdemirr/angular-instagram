angular.module('instagramService', []).factory('instagramApi', function ($http) {

    var instagram = {}, clientId, callback, apiUrl, endPoint, callbackString = "&callback=JSON_CALLBACK", auth = "", _access_token;

    instagram.setCredentials = function (instagramApiConfig) {

        apiUrl = instagramApiConfig.apiUrl;
        clientId = instagramApiConfig.clientId;
        callback = instagramApiConfig.callback;

    };

    instagram.setAuth = function (access_token) {
        if (access_token) {
            _access_token = access_token;
            auth = "access_token=" + access_token;
        } else {
            auth = "client_id=" + clientId;
        }
    };

    instagram.getAuth = function () {
        return auth;
    };

    instagram.getAuthLink = function () {
        return "https://instagram.com/oauth/authorize/?client_id=" + clientId + "&redirect_uri=" + callback + "&response_type=token&scope=likes+relationships";
    };


    //user
    instagram.getUser = function (userId, callback) {

        endPoint = apiUrl + "users/" + userId + "/?" + instagram.getAuth() + callbackString;

        $http.jsonp(endPoint).success(function (response) {
            callback(response);
        });

    };

    instagram.getUserSelf = function ( callback) {

        endPoint = apiUrl + "users/self/?"+instagram.getAuth() + callbackString;

        $http.jsonp(endPoint).success(function (response) {
            callback(response);
        });

    };

    instagram.userSelfFeed = function(callback){

        endPoint = apiUrl + "users/self/feed?"+ instagram.getAuth() + callbackString;

        $http.jsonp(endPoint).success(function (response) {
            callback(response);
        });

    };

    instagram.getRecentMedia = function (userId, callback) {

        endPoint = apiUrl + "users/" + userId + "/media/recent/?" + instagram.getAuth() + callbackString;

        $http.jsonp(endPoint).success(function (response) {
            callback(response);
        });

    };

    instagram.searchUser = function (username, callback) {

        endPoint = apiUrl + "users/search?q=" + username + "&" + instagram.getAuth() + callbackString;

        $http.jsonp(endPoint).success(function (response) {
            callback(response);
        });

    };

    instagram.getUserLiked = function(callback){

        endPoint = apiUrl + "users/self/media/liked?" + instagram.getAuth() + callbackString;

        $http.jsonp(endPoint).success(function (response) {
            callback(response);
        });

    };

    //media
    instagram.fetchPopular = function (callback) {

        endPoint = apiUrl + "media/popular?" + instagram.getAuth() + callbackString;

        $http.jsonp(endPoint).success(function (response) {
            callback(response);
        });

    };

    instagram.getMedia = function (mediaId, callback) {

        endPoint = apiUrl + "media/" + mediaId + "?" + instagram.getAuth() + callbackString;

        $http.jsonp(endPoint).success(function (response) {
            callback(response);
        });


    };

    //tags
    instagram.searchTags = function (tag, callback) {

        endPoint = apiUrl + "tags/search?q=" + tag + "&" + instagram.getAuth() + callbackString;

        $http.jsonp(endPoint).success(function (response) {
            callback(response);
        });

    };

    instagram.getTagMedia = function (tagName, callback) {

        endPoint = apiUrl + "tags/" + tagName + "/media/recent?" + instagram.getAuth() + callbackString;

        $http.jsonp(endPoint).success(function (response) {
            callback(response);
        });

    };

    //comments
    instagram.getComments = function(mediaId, callback) {

        endPoint = apiUrl + "media/" + mediaId + "/comments?" + instagram.getAuth() + callbackString;

        $http.jsonp(endPoint).success(function (response) {
            callback(response);
        });

    };

    //likes
    instagram.getLikes = function(mediaId, callback){

        endPoint = apiUrl + "media/" + mediaId + "/likes?" + instagram.getAuth() + callbackString;

        $http.jsonp(endPoint).success(function (response) {
            callback(response);
        });

    };

    instagram.giveLike = function(mediaId, callback){

//        $http.post(apiUrl + "media/" + mediaId + "/likes?callback=JSON_CALLBACK", {access_token:_access_token}).
//            success(function(data, status, headers, config) {
//                callback(data)
//            }).
//            error(function(data, status, headers, config) {
//                callback(data)
//            });

    };

    //errors
    instagram.errorCodes = {
        200: 1,
        400: 2
    };

    return instagram;

});