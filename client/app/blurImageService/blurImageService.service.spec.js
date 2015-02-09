'use strict';

describe('Service: blurImageService', function () {
    var blurImagesEnabled = 'blur';
    var blurImagesPercentage = 2.5;
    var pixelateImagesPercentage = 5;

    // load the service's module
    beforeEach(module('digApp'));

    // instantiate service
    var blurConfig, rootScope;

    beforeEach(function() {
        module(function($provide) {
            $provide.constant('blurImagesEnabled', blurImagesEnabled);
            $provide.constant('blurImagesPercentage', blurImagesPercentage);
            $provide.constant('pixelateImagesPercentage', pixelateImagesPercentage);
        });

        inject(function(_blurImageService_, $injector) {
            blurConfig = _blurImageService_;
            rootScope = $injector.get('$rootScope');
            spyOn(rootScope, '$broadcast');
        });
    });

    it('blurImageService should be instantiated', function () {
        expect(blurConfig).toBeDefined();
        expect(blurConfig).toBeTruthy();
    });

    it('should initialize getBlurImagesEnabled() to value of blurImagesEnabled', function() {
        var blurEnabled = blurConfig.getBlurImagesEnabled();
        expect(blurEnabled).toBe(blurImagesEnabled);
    });

    it('should initialize getBlurImagesPercentage() to value of blurImagesPercentage', function() {
        var blurPercent = blurConfig.getBlurImagesPercentage();
        expect(blurPercent).toBe(blurImagesPercentage);
    });

    it('should initialize getPixelateImagesPercentage() to value of pixelateImagesPercentage', function() {
        var pixPercent = blurConfig.getPixelateImagesPercentage();
        expect(pixPercent).toBe(pixelateImagesPercentage);
    });

    it('should set enabled to false and percentages to 0', function() {
        blurConfig.changeBlurImagesEnabled(false);
        
        var blurEnabled = blurConfig.getBlurImagesEnabled();
        var blurPercent = blurConfig.getBlurImagesPercentage();
        var pixPercent = blurConfig.getPixelateImagesPercentage();

        expect(rootScope.$broadcast).toHaveBeenCalledWith('blur-state-change', false);

        expect(blurEnabled).toBe(false);
        expect(blurPercent).toBe(0);
        expect(pixPercent).toBe(0);
    });

    it('should set enabled to false and percentages to 0, then set back to defaults', function() {
        blurConfig.changeBlurImagesEnabled(false);
        blurConfig.changeBlurImagesEnabled(true);
        
        var blurEnabled = blurConfig.getBlurImagesEnabled();
        var blurPercent = blurConfig.getBlurImagesPercentage();
        var pixPercent = blurConfig.getPixelateImagesPercentage();

        expect(rootScope.$broadcast).toHaveBeenCalledWith('blur-state-change', false);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('blur-state-change', true);

        expect(blurEnabled).toBe(blurImagesEnabled);
        expect(blurPercent).toBe(blurImagesPercentage);
        expect(pixPercent).toBe(pixelateImagesPercentage);
    });

});