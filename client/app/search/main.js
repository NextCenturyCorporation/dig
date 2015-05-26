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
    .state('main.folder', {
        abstract: true,
        templateUrl: 'app/search/folder.html',
        controller: 'FolderCtrl'
      })
    .state('main.folder.results', {
        abstract: true,
        templateUrl: 'app/search/results.partial.html',
        controller: 'ResultsCtrl'
      })
    .state('main.folder.results.list', {
        url: '^/folder',
        templateUrl: 'app/search/list/list.partial.html',
        preserveScrollPos: true
      })
    .state('main.folder.results.details', {
        url: '^/details',
        templateUrl: 'app/search/details/details.html'
    })
    .state('main.folder.error', {
        url: '^/error',
        templateUrl: 'app/search/error/error.html',
        controller: 'ErrorCtrl'
    })
    .state('main.search', {
        abstract: true,
        templateUrl: 'app/search/search.html',
        controller: 'SearchCtrl'
      })
    .state('main.search.results', {
        abstract: true,
        templateUrl: 'app/search/results.partial.html',
        controller: 'ResultsCtrl'
    })
    .state('main.search.results.list', {
        url: '^/search',
        templateUrl: 'app/search/list/list.partial.html',
        preserveScrollPos: true
      })
      .state('main.search.results.gallery', {
        url: '^/search',
        templateUrl: 'app/search/gallery/gallery.partial.html',
        controller: 'GalleryCtrl',
        preserveScrollPos: true
    })
    .state('main.search.results.details', {
        url: '^/details',
        templateUrl: 'app/search/details/details.html'
    })
    .state('main.search.error', {
        url: '^/error',
        templateUrl: 'app/search/error/error.html',
        controller: 'ErrorCtrl'
    });
});
