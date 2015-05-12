'use strict';

angular.module('digApp')

  .config(function ($stateProvider) {
    $stateProvider
    .state('main', {
        url: '/',
        templateUrl: 'app/search/main.html',
        abstract: true,
        controller: 'MainCtrl',
        params: {
          query: null
        }
      })
    .state('main.search', {
        abstract: true,
        templateUrl: 'app/search/search.html',
        controller: 'SearchCtrl'
      })
    .state('main.search.results', {
        abstract: true,
        templateUrl: 'app/search/search-results/search-results.partial.html',
        controller: 'SearchResultsCtrl'
    })
    .state('main.search.results.list', {
        url: '^/list',
        templateUrl: 'app/search/search-results/list/list.partial.html',
        preserveScrollPos: true
      })
      .state('main.search.results.gallery', {
        url: '^/gallery',
        templateUrl: 'app/search/search-results/gallery/gallery.partial.html',
        controller: 'GalleryCtrl',
        preserveScrollPos: true
    })
    .state('main.search.results.details', {
        url: '^/details',
        templateUrl: 'app/search/search-results/details/details.html'
    })
    .state('main.search.error', {
        url: '^/error',
        templateUrl: 'app/search/search-error/search-error.html',
        controller: 'SearchErrorCtrl'
    });
});
