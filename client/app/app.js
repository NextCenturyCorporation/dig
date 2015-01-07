'use strict';

angular.module('digApp', [
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
      .otherwise('/list');

    $locationProvider.html5Mode(true);
  })

  // TODO: find a nice way to collect constants for different environments
  .constant('euiHost', 'http://localhost:9200');
