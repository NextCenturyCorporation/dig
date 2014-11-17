'use strict';

angular.module('digApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('search', {
        url: '/',
        templateUrl: 'app/search/search.html',
        controller: 'SearchCtrl'
      });
  });