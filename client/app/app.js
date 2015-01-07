'use strict';

var digApp = angular.module('digApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'btford.socket-io',
    'ui.router',
    'ui.bootstrap',
    'elasticui'
])
.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
        .otherwise('/');

    $locationProvider.html5Mode(true);
});

angular.element(document).ready(function() {
    var $http = angular.injector(['ng']).get('$http');

    $http.get('/config')
    .success(function(config) {
        var euiHost = (config.euiHost || 'localhost') + ':' + (config.euiPort || 9200);
        digApp.constant('euiHost', euiHost);
        angular.bootstrap(document, ['digApp']);
    })
    .error(function() {
        digApp.constant('euiHost', 'http://localhost:9200');
    });
});
