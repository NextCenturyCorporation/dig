'use strict';

angular.module('digApp')
  .service('imageSearchService', ['$http', 'simHost', function($http, simHost) {
    var service = {};
    var imageSearchResults = [];
    var activeImageSearch = null;

    service.imageSearch = function(imgUrl) {
        imageSearchResults[imgUrl] = {
            url: imgUrl,
            status: 'searching',
            enabled: false
        };

        // TODO: remove this if we switch to async image searches.
        activeImageSearch = imageSearchResults[imgUrl];

        $http.get(simHost + '/ds/similar/images?uri=' + encodeURIComponent(imgUrl))
        .success(function() {
            imageSearchResults[imgUrl].status = 'success';
            imageSearchResults[imgUrl].enabled = true;
        })
        .error(function(data) {
            imageSearchResults[imgUrl].status = 'error';
            imageSearchResults[imgUrl].error = data;
            activeImageSearch = null;
        });
    };

    service.setImageSearchEnabled = function(imageUrl, enabled) {
        if (imageSearchResults[imageUrl]) {
            imageSearchResults[imageUrl].enabled = enabled;
        }
    };

    service.isImageSearchEnabled = function(imageUrl) {
        return ((imageSearchResults[imageUrl]) ? imageSearchResults[imageUrl].enabled : false);
    };

    service.getActiveImageSearch = function() {
        return activeImageSearch;
    };

    service.clearActiveImageSearch = function() {
        activeImageSearch = null;
    };

    service.getImageSearchStatus = function(imageUrl) {
        return (imageSearchResults[imageUrl] ? imageSearchResults[imageUrl].status : 'no search available');
    };

    service.clearImageSearches = function() {
        activeImageSearch = null;
        imageSearchResults = [];
    };

    return service;
}]);
