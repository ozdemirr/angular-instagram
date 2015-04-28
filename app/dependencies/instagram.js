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

    instagram.getUserSelf = function (callback) {

        endPoint = apiUrl + "users/self/?"+instagram.getAuth() + callbackString;

        $http.jsonp(endPoint).success(function (response) {
            callback(response);
        });

    };

    instagram.userSelfFeed = function(callback, nextMaxId){

        endPoint = apiUrl + "users/self/feed?"+ instagram.getAuth() + callbackString;

        if(nextMaxId != null) {
            endPoint = apiUrl + "users/self/feed?" + instagram.getAuth() + "&max_id=" + nextMaxId + callbackString;
        }

        $http.jsonp(endPoint).success(function (response) {
            callback(response);
        });

    };

    instagram.getRecentMedia = function (userId, callback, nextIterator) {

        endPoint = apiUrl + "users/" + userId + "/media/recent/?" + instagram.getAuth() + callbackString;

        if(nextIterator != null) {
            endPoint = apiUrl + "users/" + userId + "/media/recent/?" + instagram.getAuth() + "&max_id=" + nextIterator + callbackString;
        }

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

    instagram.checkCredentials = function(callback){

        instagram.getUserSelf(function(response){

            if(response.meta.code == 400) {

                callback(false);

            }else{

                callback(true);

            }

        });

    };

    //relationships
    instagram.getFollows = function(userId, callback, nextIterator){

        if(userId == null) {userId = "self";}

        endPoint = apiUrl + "users/" + userId + "/follows?" + instagram.getAuth() + callbackString;

        if(nextIterator != null) {
            endPoint = apiUrl + "users/" + userId + "/follows?" + instagram.getAuth() + "&cursor="+ nextIterator + callbackString;
        }

        $http.jsonp(endPoint).success(function (response) {
            callback(response);
        });

    };

    instagram.getFollowedBy = function(userId, callback, nextIterator){

        if(userId == null) {userId = "self";}

        endPoint = apiUrl + "users/" + userId + "/followed-by?" + instagram.getAuth() + callbackString;

        if(nextIterator != null) {
            endPoint = apiUrl + "users/" + userId + "/followed-by?" + instagram.getAuth() + "&cursor="+ nextIterator + callbackString;
        }

        $http.jsonp(endPoint).success(function (response) {
            callback(response);
        });

    };

    instagram.getRequestedBy = function(callback){

        endPoint = apiUrl + "users/self/requested-by?" + instagram.getAuth() + callbackString;

        $http.jsonp(endPoint).success(function (response) {
            callback(response);
        });

    };

    instagram.relationship = function(userId, action, callback){

        if(action == "relationship"){

            endPoint = apiUrl + "users/" + userId + "/relationship?" + instagram.getAuth() + callbackString;

            $http.jsonp(endPoint).success(function (response) {
                callback(response);
            });

        }else{

            $http({
                method: 'POST',
                url: apiUrl + "users/" + userId + "/relationship?" + instagram.getAuth(),
                data: instagram.transform({access_token:_access_token, action:action}),
                withCredentials: true,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

        }

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

    instagram.giveLike = function(mediaId){

        $http({
            method: 'POST',
            url: apiUrl + "media/" + mediaId + "/likes",
            data: instagram.transform({access_token:_access_token}),
            withCredentials: true,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

    };

    //locations

    instagram.getMediaByLocation = function(lat, lng, radius, minTimestamp, callback){

        endPoint = apiUrl + "media/search?lat=" + lat + "&lng=" + lng + "&distance=" + radius + "&min_timestamp=" + minTimestamp + "&" + instagram.getAuth() + callbackString;

        $http.jsonp(endPoint).success(function (response) {
            callback(response);
        });

    }


    instagram.transform = function(obj){
        var str = [];
        for (var key in obj) {
            if (obj[key] instanceof Array) {
                for(var idx in obj[key]){
                    var subObj = obj[key][idx];
                    for(var subKey in subObj){
                        str.push(encodeURIComponent(key) + "[" + idx + "][" + encodeURIComponent(subKey) + "]=" + encodeURIComponent(subObj[subKey]));
                    }
                }
            }
            else {
                str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
            }
        }
        return str.join("&");
    };

    //errors
    instagram.errorCodes = {
        200: 1,
        400: 2
    };

    return instagram;

});