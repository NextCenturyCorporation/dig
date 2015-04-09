'use strict';

describe('Directive: sort', function () {

    // load the necessary modules
    beforeEach(module('digApp'));
    beforeEach(module('components/sort/sort.partial.html'));

    var scope, element;

    // Initialize the mock scope
    beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope;

        scope.selectedSort = {};
        scope.filterStates = {
            dateFilters: {}
        };
        scope.indexVM = {};
        scope.ejs = {};
        scope.filters = {};
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
    }));

    it('should initialize all fields to the appropriate values', function () {

        inject(function ($compile) {
            element = angular.element('<sort indexvm="indexVM" ejs="ejs" eui-configs="euiConfigs" ' +
                'title="selectedSort.title" order="selectedSort.order"></sort>');

            $compile(element)(scope);
            element.scope().$digest();
        });
        expect(element.isolateScope().indexVM).toBe(scope.indexVM);
        expect(element.isolateScope().ejs).toBe(scope.ejs);
        expect(element.isolateScope().euiConfigs).toBe(scope.euiConfigs);
        expect(element.isolateScope().title).toBe(scope.euiConfigs.sort.defaultOption.title);
        expect(element.isolateScope().order).toBe(scope.euiConfigs.sort.defaultOption.order);
        expect(element.isolateScope().euiSortOrder).toBe('desc');
        expect(element.isolateScope().sortOptions).toBe(scope.euiConfigs.sort.options);
    });

    it('should initialize title and order if already present', function () {

        scope.selectedSort = {order: 'asc', title: 'Oldest First'};

        inject(function ($compile) {
            element = angular.element('<sort indexvm="indexVM" ejs="ejs" eui-configs="euiConfigs" ' +
                'title="selectedSort.title" order="selectedSort.order"></sort>');

            $compile(element)(scope);
            element.scope().$digest();
        });

        expect(element.isolateScope().title).toBe(scope.selectedSort.title);
        expect(element.isolateScope().order).toBe(scope.selectedSort.order);
        expect(element.isolateScope().euiSortOrder).toEqual('asc');
    });

    it('should initialize sort variables to appropriate values if config not present', function () {
        
        scope.euiConfigs = {};
        
        inject(function ($compile) {

            element = angular.element('<sort indexvm="indexVM" ejs="ejs" eui-configs="euiConfigs" ' +
                'title="selectedSort.title" order="selectedSort.order"></sort>');

            $compile(element)(scope);
            element.scope().$digest();
        });

        expect(element.isolateScope().sortOptions).toEqual([]);
        expect(element.isolateScope().title).toEqual('');
        expect(element.isolateScope().order).toEqual('');
        expect(element.isolateScope().euiSortOrder).toEqual('desc');
    });

    it('should check for valid sort orders', function() {

        inject(function ($compile) {
            element = angular.element('<sort indexvm="indexVM" ejs="ejs" eui-configs="euiConfigs" ' +
                'title="selectedSort.title" order="selectedSort.order"></sort>');

            $compile(element)(scope);
            element.scope().$digest();
        });
        expect(element.isolateScope().validSortOrder('asc')).toBe(true);
        expect(element.isolateScope().validSortOrder('desc')).toBe(true);
        expect(element.isolateScope().validSortOrder('invalid')).toBe(false);
        expect(element.isolateScope().validSortOrder('rank')).toBe(false);
    });


    it('should switch selectedSort and euiSortOrder to new value', function() {

        inject(function ($compile) {
            element = angular.element('<sort indexvm="indexVM" ejs="ejs" eui-configs="euiConfigs" ' +
                'title="selectedSort.title" order="selectedSort.order"></sort>');

            $compile(element)(scope);
            element.scope().$digest();
        });

        element.isolateScope().switchSort(2);
        element.scope().$digest();

        expect(scope.selectedSort).toEqual(scope.euiConfigs.sort.options[2]);
        expect(element.isolateScope().euiSortOrder).toEqual(scope.euiConfigs.sort.options[2].order);
    });

    it('should switch selectedSort but not euiSortOrder to new value', function() {

        inject(function ($compile) {
            element = angular.element('<sort indexvm="indexVM" ejs="ejs" eui-configs="euiConfigs" ' +
                'title="selectedSort.title" order="selectedSort.order"></sort>');

            $compile(element)(scope);
            element.scope().$digest();
        });

        element.isolateScope().switchSort(0);
        element.scope().$digest();

        expect(scope.selectedSort).toEqual(scope.euiConfigs.sort.options[0]);
        expect(element.isolateScope().euiSortOrder).toNotEqual(scope.euiConfigs.sort.options[0].order);
    });

});