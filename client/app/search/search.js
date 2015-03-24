'use strict';

angular.module('digApp')
.config(function($stateProvider) {
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
        templateUrl: 'app/search/search-results/list/list.partial.html',
        preserveScrollPos: true
    })
    .state('search.results.gallery', {
        url: '^/gallery',
        templateUrl: 'app/search/search-results/gallery/gallery.partial.html',
        controller: 'GalleryCtrl',
        preserveScrollPos: true
    })
    .state('search.results.details', {
        url: '^/details',
        templateUrl: 'app/search/search-results/details/details.html'
    })
    .state('search.error', {
        url: '^/error',
        templateUrl: 'app/search/search-error/search-error.html',
        controller: 'SearchErrorCtrl'
    });
});
