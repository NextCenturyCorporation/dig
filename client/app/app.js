'use strict';

var digApp = angular.module('digApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'btford.socket-io',
    'ui.router',
    'ui.bootstrap',
    'elasticui',

    'digApp.directives',
    'digApp.services'
])
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/list');

    $locationProvider.html5Mode(true);
});

angular.module('digApp.directives', []);
angular.module('digApp.services', []);

angular.element(document).ready(function() {
    var $http = angular.injector(['ng']).get('$http');

    $http.get('/config')
    .success(function(config) {
        var euiHost = (config.euiHost || 'localhost') + ':' + (config.euiPort || 9200);
        digApp.constant('euiHost', euiHost);

        var euiSearchIndex = (config.euiSearchIndex || 'dig');
        digApp.constant('euiSearchIndex', euiSearchIndex);

        var euiConfigs = (config.euiConfigs || {
            facets: [],
            listFields: [],
            detailFields: []
        });
        digApp.constant('euiConfigs', euiConfigs);

        var simHost = (config.simHost || 'localhost') + ':' + (config.simPort || 3001);
        digApp.constant('simHost', simHost);

        var blurImagesEnabled = (config.blurImagesEnabled !== undefined ? config.blurImagesEnabled : 'blur');
        digApp.constant('blurImagesEnabled', blurImagesEnabled);

        var blurImagesPercentage = config.blurImagesPercentage || 10;
        digApp.constant('blurImagesPercentage', blurImagesPercentage);

        var pixelateImagesPercentage = config.pixelateImagesPercentage || 2.5;
        digApp.constant('pixelateImagesPercentage', pixelateImagesPercentage);

        var appVersion = config.appVersion;
        digApp.constant('appVersion', appVersion);

        angular.bootstrap(document, ['digApp']);
    })
    .error(function() {
        digApp.constant('euiHost', 'http://localhost:9200');
        digApp.constant('euiSearchIndex', 'dig');
        digApp.constant('euiConfigs', {
            facets: [],
            listFields: [],
            detailFields: []
        });
        digApp.constant('simHost', 'http://localhost:3001');
        digApp.constant('blurImagesEnabled', true);
        digApp.constant('blurImagesPercentage', 5);
        digApp.constant('appVersion', '0.0.0');
    });
});
