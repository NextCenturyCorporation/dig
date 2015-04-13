'use strict';

angular.module('digApp')

  .config(function ($stateProvider) {
    $stateProvider
      .state('queries', {
        url: '/queries',
        templateUrl: 'app/queries/queries.html',
        controller: 'QueriesCtrl'
      });
  });
