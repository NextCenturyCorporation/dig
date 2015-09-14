'use strict';

describe('Directive: sparkline', function () {

    // load the necessary modules
    beforeEach(module('digApp'));

    var scope, element;

    // Initialize the mock scope
    beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope.$new();
        scope.label = 'Cities';
        scope.idPath = 'id';
        scope.aggName = 'testAgg';
        scope.doc = {id: 1, name: 'test'};
        scope.countField = 'count';
        scope.subquery = {'query': {'match_all': {}}};

    }));

    it('should initialize all fields in element tag to the appropriate values', function () {
        inject(function ($compile) {
            element = angular.element('<sparkline doc="doc" label="label" ' + 
                'doc-id-path="idPath" query="subquery" aggregation-name="aggName" ' + 
                'count-field="countField" graph-type="line"></sparkline>');

            $compile(element)(scope);
            element.scope().$digest();
        });

        expect(element.isolateScope().doc).toEqual(scope.doc);
        expect(element.isolateScope().label).toEqual(scope.label);
        expect(element.isolateScope().docIdPath).toEqual(scope.idPath);
        expect(element.isolateScope().query).toBe(scope.subquery);
        expect(element.isolateScope().countField).toBe(scope.countField);
        expect(element.isolateScope().aggregationName).toBe(scope.aggName);
        expect(element.isolateScope().graphType).toBe('line');

    });

    it('should call renderSparkline() if doc changes', function () {
        inject(function ($compile) {
            element = angular.element('<sparkline doc="doc" label="label" ' + 
                'doc-id-path="idPath" query="subquery" aggregation-name="aggName" ' + 
                'count-field="countField" graph-type="line"></sparkline>');

            $compile(element)(scope);
            element.scope().$digest();
        });

        spyOn(element.isolateScope(), 'renderSparkline');
        expect(element.isolateScope().doc).toEqual(scope.doc);

        scope.doc = {id: 2, name: 'test2'};
        element.scope().$digest();
        expect(element.isolateScope().doc).toEqual(scope.doc);
        expect(element.isolateScope().renderSparkline).toHaveBeenCalled();
    }); 

});