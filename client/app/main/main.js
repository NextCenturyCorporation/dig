'use strict';

angular.module('digApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('search', {
        url: '/',
        templateUrl: 'app/main/search.html',
        controller: 'SearchCtrl'
      });
  });