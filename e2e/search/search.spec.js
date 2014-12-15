'use strict';

describe('Search View', function() {

    var page, filterKey, singleResult;

    beforeEach(function() {
        browser.get('/');
        page = require('./search.po');
        filterKey = 'ocean'; // should filter results down to two pages
        singleResult = 'collge'; //should give single result
    });

    it('elasticsearch should be up and running', function() {
        httpGet('http://vinisvr:9200').then(function(result) {
            expect(result.statusCode).toBe(200);
        });
    });

    it('should default to list view', function() {
        browser.getLocationAbsUrl().then(function(result) {
            expect(result).toBe('/list');
        });
    });

    it('should not have first accordion visible initially', function() {
        expect(page.firstAccordionCollapseDiv.isDisplayed()).toBe(false);
        expect(page.firstDetailsBtn.isDisplayed()).toBe(false);
    });


    it('should open accordion and make appropriate elements visible', function() {
        page.firstAccordionLink.click().then(function() {
            browser.wait(function() {
                return page.firstDetailsBtn.isDisplayed();
            }, 1000);

            expect(page.firstDetailsBtn.isDisplayed()).toBe(true);
            expect(page.firstAccordionCollapseDiv.isDisplayed()).toBe(true);
            expect(hasClass(page.firstAccordionCollapseDiv, 'in')).toBe(true);
        });
    });

    it('should open accordion and go to details view', function() {
        page.firstAccordionLink.click();

        browser.wait(function() {
            return page.firstDetailsBtn.isDisplayed();
        }, 1000);

        page.firstDetailsBtn.click();

        browser.wait(function() {
            return element(by.buttonText('Back To List')).isPresent();
        }, 1000);

        expect(browser.getLocationAbsUrl()).toBe('/list/details');
    });

    it('should return to list view from details page', function() {
        page.firstAccordionLink.click();

        browser.wait(function() {
            return page.firstDetailsBtn.isDisplayed();
        }, 1000);

        page.firstDetailsBtn.click();

        browser.wait(function() {
            return element(by.buttonText('Back To List')).isPresent();
        }, 1000);

        element(by.buttonText('Back To List')).click();

        browser.wait(function() {
            return page.titleInput.isDisplayed();
        }, 1000);

        expect(browser.getLocationAbsUrl()).toBe('/list');
    });

    it('should include pagination with filtered data', function() {
        page.titleInput.sendKeys(filterKey).then(function() {
            // With the selected filter, two pages are expected, so there will be 
            // four pagination elements total -- [Previous, 1, 2, Next]
            expect(element.all(by.css('.pagination-sm li')).count()).toBe(4);
        });
    });

    it('ensure direct page links in pagination work as expected', function() {
        page.titleInput.sendKeys(filterKey);
        page.submitButton.click().then(function() {

            expect(hasClass(page.pgOneElem, 'active')).toBe(true);
            expect(hasClass(page.pgTwoElem, 'active')).toBe(false);

            page.pgTwoLink.click().then(function() {
                expect(hasClass(page.pgOneElem, 'active')).toBe(false);
                expect(hasClass(page.pgTwoElem, 'active')).toBe(true);
            });

            page.pgOneLink.click().then(function() {
                expect(hasClass(page.pgOneElem, 'active')).toBe(true);
                expect(hasClass(page.pgTwoElem, 'active')).toBe(false);
            });

        });
    });

    it('next button in pagination should be disabled', function() {
        page.titleInput.sendKeys('1395');
        page.submitButton.click().then(function() {

            page.nextLink.click().then(function() {
                expect(hasClass(page.nextElem, 'disabled')).toBe(true);
            });

        });
    });

    it('next button in pagination should be enabled', function() {
        page.titleInput.sendKeys(filterKey);
        page.submitButton.click().then(function() {
            expect(hasClass(page.nextElem, 'disabled')).toBe(false);
        });
    });

    it('previous button in pagination should be disabled', function() {
        page.titleInput.sendKeys(filterKey);
        page.submitButton.click().then(function() {

            expect(hasClass(page.prevElem, 'disabled')).toBe(true);
        });
    });

    it('previous button in pagination should be enabled', function() {
        page.titleInput.sendKeys(filterKey);
        page.submitButton.click();
        page.prevLink.click().then(function() {
            expect(hasClass(page.nextElem, 'disabled')).toBe(false);
        });
    });

    // Helper functions
    var hasClass = function (element, cls) {
        return element.getAttribute('class').then(function (classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    };

    var httpGet = function (siteUrl) {
        var http = require('http');
        var defer = protractor.promise.defer();

        http.get(siteUrl, function(response) {
            var bodyString = '';

            response.setEncoding('utf8');

            response.on("data", function(chunk) {
                bodyString += chunk;
            });

            response.on('end', function() {
                defer.fulfill({
                    statusCode: response.statusCode,
                    bodyString: bodyString
                });
            });

        }).on('error', function(e) {
            defer.reject("Got http.get error when connecting to " + siteUrl + ": " + e.message);
        });

        return defer.promise;
    };

});
