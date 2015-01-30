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
      .state('search.results', {
        abstract: true,
        templateUrl: 'app/search/search-results/search-results.partial.html',
        controller: 'SearchResultsCtrl'
      })
      .state('search.results.list', {
        url: '^/list',
        templateUrl: 'app/search/search-results/list/list.partial.html'
      })
      .state('search.results.gallery', {
        url: '^/gallery',
        templateUrl: 'app/search/search-results/gallery/gallery.partial.html',
        controller: 'GalleryCtrl'
      })
      .state('search.details', {
        url: '^/details',
        templateUrl: 'app/search/details/details.html'
      });
  });
