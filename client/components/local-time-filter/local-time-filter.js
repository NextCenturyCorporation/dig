'use strict';

angular.module('digApp')
.filter('toLocalTime', function() {
    return function(date) {
        var options = {
            hour12: false,
            timeZoneName: 'short'
        };
        return new Date(date).toLocaleString('en-US', options);
    };
});