'use strict';

angular.module('digApp')

  .config(function ($stateProvider) {

    $stateProvider
      .state('search', {
        url: '/',
        templateUrl: 'app/search/search.html',
        abstract: true,
        controller: 'SearchCtrl'
      })
      .state('search.list', {
        url: '^/list',
        templateUrl: 'app/search/search.list.html'
      })
      .state('search.list.details', {
        url: '^/list/details',
        templateUrl: 'app/search/search.list.details.html'
      });
  });

