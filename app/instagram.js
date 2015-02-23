angular.module('instagramService', []).factory('instagramApi', function($http,instagramCredentials) {

    var instagram = {};

    var endPoint = "";

    instagram.fetchPopular = function(callback){

        endPoint  = instagramCredentials.apiUrl+"media/popular?client_id="+instagramCredentials.clientId+"&callback=JSON_CALLBACK";

        $http.jsonp(endPoint).success(function(response){
            callback(response.data);
        });

    };

    instagram.searchUser = function (username, callback) {

        endPoint = instagramCredentials.apiUrl+"users/search?q="+username+"&client_id="+instagramCredentials.clientId+"&callback=JSON_CALLBACK";

        $http.jsonp(endPoint).success(function(response){
            callback(response.data);
        });

    };

    instagram.getRecentMedia = function(userId, callback) {

        endPoint = instagramCredentials.apiUrl+"users/"+userId+"/media/recent/?client_id="+instagramCredentials.clientId+"&callback=JSON_CALLBACK";

        $http.jsonp(endPoint).success(function(response){
            callback(response);
        });

    };

    instagram.searchTags = function(tag, callback){

        endPoint = instagramCredentials.apiUrl+"tags/search?q="+tag+"&client_id="+instagramCredentials.clientId+"&callback=JSON_CALLBACK";

        $http.jsonp(endPoint).success(function(response){
            callback(response);
        });

    };

    instagram.getTagPictures = function(tagName, callback) {

        endPoint = instagramCredentials.apiUrl+"tags/"+tagName+"/media/recent?client_id="+instagramCredentials.clientId+"&callback=JSON_CALLBACK";

        $http.jsonp(endPoint).success(function(response){
            callback(response.data);
        });

    };


    return instagram;

});