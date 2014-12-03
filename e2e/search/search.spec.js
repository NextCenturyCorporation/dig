'use strict';

describe('Search View', function() {

  var page, filterKey;

  beforeEach(function() {
    browser.get('/');
    page = require('./search.po');
    filterKey = 'ocean'; // should filter results down to two pages
  });

  it('elasticsearch should be up and running', function() {
    httpGet('http://localhost:9200').then(function(result) {
      expect(result.statusCode).toBe(200);
    });
  });

  it('should include pagination with filtered data', function() {
    page.titleInput.sendKeys(filterKey).then(function() {
      // With the selected filter, two pages are expected, so there will be 
      // four pagination elements total -- [Previous, 1, 2, Next]
      expect(element.all(by.css('.pagination-sm li')).count()).toBe(4);
    });
  });

  it('ensure direct page links in pagination work as expected', function() {
    page.titleInput.sendKeys(filterKey).then(function() {
      
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

  it('ensure next button in pagination is enabled and disabled accordingly', function() {
    page.titleInput.sendKeys(filterKey).then(function() {
      
      expect(hasClass(page.nextElem, 'disabled')).toBe(false);

      page.nextLink.click().then(function() {
        expect(hasClass(page.nextElem, 'disabled')).toBe(true);
      });

    });
  });

  it('ensure previous button in pagination is disabled and enabled accordingly', function() {
    page.titleInput.sendKeys(filterKey).then(function() {
      
      expect(hasClass(page.prevElem, 'disabled')).toBe(true);

      page.nextLink.click().then(function() {
        expect(hasClass(page.prevElem, 'disabled')).toBe(false);
      });

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
  }

});
