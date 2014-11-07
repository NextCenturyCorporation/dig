'use strict';

angular.module('digApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('search', {
      	url: '/search',
      	templateUrl: 'app/main/search.html'
      });
  });