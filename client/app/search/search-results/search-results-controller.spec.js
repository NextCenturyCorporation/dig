'use strict';

describe('Controller: SearchResultsCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    var SearchResultsCtrl, scope, state;

    // Initialize the controller and a mock scope
    beforeEach(function() {
        var simHost = 'http://localhost';
        var $httpBackend;

        module(function($provide) {
            $provide.constant('simHost', simHost);
            $provide.constant('euiSearchIndex', 'dig');
        });

        inject(function ($controller, $rootScope, $state, _$httpBackend_) {
            scope = $rootScope.$new();
            state = $state;
            state.current.name = 'search.results.list';
            spyOn(state, 'go');

            $httpBackend = _$httpBackend_;
            $httpBackend.when('GET', new RegExp('app/search/search.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/list/list.partial.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/gallery/gallery.partial.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/details/details.html'))
                .respond(200, 'some text');

            scope.indexVM = {
                filters: {
                    ejsFilters: []
                },
                loading: true,
                page: 1,
                query: 'someValue',
                pageSize: 10
            };

            scope.euiConfigs = {
                sort: {
                    field: 'dateCreated',
                    defaultOption: {order: 'rank', title: 'Best Match'}, 
                    options: [
                        {order: 'rank', title: 'Best Match'},
                        {order: 'desc', title: 'Newest First'},
                        {order: 'asc', title: 'Oldest First'}
                    ]
                }
            };

            SearchResultsCtrl = $controller('SearchResultsCtrl', {
                $scope: scope,
                $state: state
            });

            scope.$digest();
        });
    });

    it('should not have scope.doc', function () {
        expect(scope.doc).toBe(undefined);
    });
   
    it('should initialize opened to be an empty array', function () {
        expect(scope.opened.length).toBe(0);
    });

    it('should initialize displayMode.mode to \'list\'', function () {
        expect(scope.displayMode.mode).toBe('list');
    });

    it('should initialize indexVM.pageSize to 25', function () {
        expect(scope.indexVM.pageSize).toBe(25);
    });

    it('should have selectedImage default to 0', function () {
        expect(scope.selectedImage).toBe(0);
    });

    it('should have galleryItem default to empty object', function () {
        expect(scope.galleryItem).toEqual({});
    });

    it('should initialize sort variables based on euiConfigs.sort values if present', function () {
        expect(scope.sortOptions).toEqual(scope.euiConfigs.sort.options);
        expect(scope.selectedSort).toEqual(scope.euiConfigs.sort.defaultOption);
        expect(scope.euiSortOrder).toEqual('desc');
    });

    it('should initialize sort variables to appropriate values if config not present', function () {
        inject(function ($controller) {

            scope.euiConfigs = {};

            SearchResultsCtrl = $controller('SearchResultsCtrl', {
                $scope: scope,
                $state: state
            });

            scope.$digest();
        });

        expect(scope.sortOptions).toEqual([]);
        expect(scope.selectedSort).toEqual({});
        expect(scope.euiSortOrder).toEqual('desc');
    });

    it('should initialize euiSortOrder to match default option if it is a valid sort order', function () {
        inject(function ($controller) {

            scope.euiConfigs.sort.defaultOption = {order: 'asc', title: 'Oldest First'};

            SearchResultsCtrl = $controller('SearchResultsCtrl', {
                $scope: scope,
                $state: state
            });

            scope.$digest();
        });

        expect(scope.euiSortOrder).toEqual('asc');
    });

    it('should not have scope.previousState', function () {
        expect(scope.previousState).toBe(undefined);
    });

    it('should update selectedImage', function () {
        scope.selectImage(2);

        expect(scope.selectedImage).toBe(2);
    });

    it('should strip out appropriate html tags', function () {
        var validTags = scope.stripHtml('<mark>highlighted text</mark>');
        var invalidTags = scope.stripHtml('<b>no tags</b><br/>should be present <img src="test.jpg">');

        expect(validTags.$$unwrapTrustedValue()).toBe('<mark>highlighted text</mark>');
        expect(invalidTags.$$unwrapTrustedValue()).toBe('no tagsshould be present ');
    });

    it('should update state to details view and add passed in doc and state to scope', function () {
        var testDoc = {name: 'TestDoc'};

        scope.viewDetails(testDoc, 'list');

        expect(scope.doc).not.toBeNull();
        expect(scope.previousState).toBe('list');
        expect(state.go).toHaveBeenCalledWith('search.results.details');
    });

    it('should update state from details to list view and null out scope.doc if scope.doc is set and previousState is not set', function () {
        scope.doc = {name: 'TestDoc'};
        spyOn(scope, 'viewList');

        scope.backToPreviousState();

        expect(scope.doc).toBeNull();
        expect(scope.viewList).toHaveBeenCalled();
    });

    it('should not null out scope.doc if it does not exist', function () {
        spyOn(scope, 'viewList');

        scope.backToPreviousState();

        expect(scope.doc).toBe(undefined);
        expect(scope.viewList).toHaveBeenCalled();
    });

    it('should update state from details to previous view and null out scope.doc if scope.doc is set and previousState is set', function () {
        scope.doc = {name: 'TestDoc'};
        scope.previousState = 'gallery';
        spyOn(scope, 'viewGallery');

        scope.backToPreviousState();

        expect(scope.doc).toBeNull();
        expect(scope.viewGallery).toHaveBeenCalled();
    });

    it('should set displayMode.mode to \'gallery\' and make appropriate state call', function () {
        scope.viewGallery();

        expect(scope.displayMode.mode).toBe('gallery');
        expect(state.go).toHaveBeenCalledWith('search.results.gallery');
    });

    it('should set displayMode.mode to \'list\' and make appropriate state call', function () {
        scope.viewList();

        expect(scope.displayMode.mode).toBe('list');
        expect(state.go).toHaveBeenCalledWith('search.results.list');
    });

    it('should return whether or not a list item is opened by id', function() {
        expect(scope.isListItemOpened('foo')).toBe(false);

        scope.toggleListItemOpened('foo');
        expect(scope.isListItemOpened('foo')).toBe(true);

        scope.toggleListItemOpened('foo');
        expect(scope.isListItemOpened('foo')).toBe(false);
    });


    it('should return whether or not a gallery item is opened by id', function() {
        expect(scope.isGalleryItemPopulated()).toBe(false);
        expect(scope.isGalleryItemOpened('foo')).toBe(false);

        scope.toggleGalleryItemOpened('foo', 1);
        expect(scope.isGalleryItemPopulated()).toBe(true);
        expect(scope.isGalleryItemOpened('blah')).toBe(false);
        expect(scope.isGalleryItemOpened('foo')).toBe(true);

        scope.clearGalleryItem();
        expect(scope.isGalleryItemPopulated()).toBe(false);
        expect(scope.isGalleryItemOpened('foo')).toBe(false);
    });

    it('should switch to list view', function () {
        spyOn(scope, 'viewList');
        scope.switchView('list');

        expect(scope.viewList).toHaveBeenCalled();
    });

    it('should switch to gallery view', function () {
        spyOn(scope, 'viewGallery');
        scope.switchView('gallery');

        expect(scope.viewGallery).toHaveBeenCalled();
    });

    it('should not switch view', function () {
        spyOn(scope, 'viewList');
        spyOn(scope, 'viewGallery');
        scope.switchView('notAView');

        expect(scope.viewList).not.toHaveBeenCalled();
        expect(scope.viewGallery).not.toHaveBeenCalled();
    });

    it('should switch selectedSort and euiSortOrder to new value', function() {
        scope.switchSort(2);

        expect(scope.selectedSort).toEqual(scope.sortOptions[2]);
        expect(scope.euiSortOrder).toEqual(scope.sortOptions[2].order);
    });

    it('should switch selectedSort but not euiSortOrder to new value', function() {
        scope.switchSort(0);

        expect(scope.selectedSort).toEqual(scope.sortOptions[0]);
        expect(scope.euiSortOrder).toNotEqual(scope.sortOptions[0].order);
    });

    it('should check for valid sort orders', function() {
        expect(scope.validSortOrder('asc')).toBe(true);
        expect(scope.validSortOrder('desc')).toBe(true);
        expect(scope.validSortOrder('invalid')).toBe(false);
        expect(scope.validSortOrder('rank')).toBe(false);
    });

    it('should clear the opened items list on a query change and reset page to 1', function() {
        expect(scope.opened.length).toBe(0);

        scope.toggleListItemOpened('foo');
        scope.indexVM.query = 'some new query';
        scope.$digest();
        expect(scope.opened.length).toBe(0);
        expect(scope.isListItemOpened('foo')).toBe(false);
        expect(scope.isGalleryItemPopulated()).toBe(false);
        expect(scope.indexVM.page).toBe(1);
    });

});
