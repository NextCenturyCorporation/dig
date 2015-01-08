'use strict';

describe('Controller: SearchCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    var SearchCtrl, scope, state;

    // Initialize the controller and a mock scope
    beforeEach(function() {
        module(function($provide) {
            $provide.constant('simHost', 'http://localhost');
        });

        inject(function ($controller, $rootScope, $state) {
            scope = $rootScope.$new();
            state = $state;
            state.current.name = 'search';
            spyOn(state, 'go');

            SearchCtrl = $controller('SearchCtrl', {
                $scope: scope,
                $state: state
            });

            scope.indexVM = {loading: true};
            scope.$digest();
        });
    });

    it('should initialize showresults to true', function () {
        expect(scope.showresults).toBe(true);
    });

    it('should initialize loading to true', function () {
        expect(scope.loading).toBe(true);
    });

    it('should initialize queryString values to empty strings', function () {
        expect(scope.queryString.live).toBe('');
        expect(scope.queryString.submitted).toBe('');
    });

    it('should set queryString.submitted to user input', function () {
        scope.queryString.live = 'test';
        scope.submit();
        expect(scope.queryString.submitted).toBe('test');
     });

    it('should set showresults to true', function () {
        scope.queryString.submitted = 'test';
        scope.indexVM.loading = false;
        scope.$digest();
        expect(scope.showresults).toBe(true);
    });

    it('should set loading to false', function () {
        scope.indexVM.loading = false;
        scope.$digest();
        expect(scope.loading).toBe(false);
    });

    it('should have currentOpened default to 0', function () {
        expect(scope.currentOpened).toBe(0);
    });

    it('should have selectedImage default to 0', function () {
        expect(scope.selectedImage).toBe(0);
    });

    it('should not have scope.doc', function () {
        expect(scope.doc).toBe(undefined);
    });

    it('should default to list view', function () {
        expect(state.go).toHaveBeenCalledWith('search.list');
    });

    it('should change currentOpened to new index and update old opened value in array', function () {
        var array = [{obj: 1},{obj: 2}];
        var oldValue = scope.currentOpened;

        scope.closeOthers(1, array);

        expect(scope.currentOpened).toBe(1);
        expect(array[oldValue].isOpen).toBe(false);
    });

    it('should update state to details view and add passed in doc to scope', function () {
        var testDoc = {name: 'TestDoc'};

        scope.viewDetails(testDoc);

        expect(scope.doc).not.toBeNull();
        expect(state.go).toHaveBeenCalledWith('search.list.details');
    });

    it('should update state from details to list view and null out scope.doc if scope.doc is set', function () {
        scope.doc = {name: 'TestDoc'};

        scope.viewList();

        expect(scope.doc).toBeNull();
        expect(state.go).toHaveBeenCalledWith('search.list');
    });

    it('should update selectedImage', function () {
        scope.selectImage(2);

        expect(scope.selectedImage).toBe(2);
    });


});
