'use strict';

describe('Service: utilService', function () {

    // load the service's module
    beforeEach(module('digApp'));

    // instantiate service
    var utilService;

    beforeEach(function() {

        inject(function(_utilService_) {
            utilService = _utilService_;
        });
    });

    it('utilService should be instantiated', function () {
        expect(utilService).toBeDefined();
        expect(utilService).toBeTruthy();
    });

    it('should perform highlightCheck and return value from array with irrelevant html stripped out', function() {
        var highlightedText = ['not it', '<mark><b>This is the value</b></mark>'];
        var field = '<b>This is the value</b>';
        var expectedValue = '<mark>This is the value</mark>';
        var textToHighlight = utilService.highlightCheck(field, highlightedText);
        
        expect(textToHighlight.$$unwrapTrustedValue()).toBe(expectedValue);

    });

    it('should perform highlightCheck and return field value with irrelevant html stripped out', function() {
        var highlightedText = ['not it', '<mark>Also not it</mark>'];
        var field = '<b>This is the value</b>';
        var expectedValue = 'This is the value';
        var textToHighlight = utilService.highlightCheck(field, highlightedText);
        
        expect(textToHighlight.$$unwrapTrustedValue()).toBe(expectedValue);

    });

    it('should perform highlightCheck and return field value right away if no highlightedText exists', function() {
        var highlightedText = null;
        var field = '<b>This is the value</b>';
        var expectedValue = 'This is the value';
        var textToHighlight = utilService.highlightCheck(field, highlightedText);
        
        expect(textToHighlight.$$unwrapTrustedValue()).toBe(expectedValue);

    });

});
