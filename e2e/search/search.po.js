/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var SearchPage = function($httpBackend) {
 this.prevElem = element.all(by.css('.pagination-sm li')).first();
 this.prevLink = element.all(by.css('.pagination-sm li a')).first();

 this.nextElem = element.all(by.css('.pagination-sm li')).last();
 this.nextLink = element.all(by.css('.pagination-sm li a')).last();

 this.pgOneElem = element.all(by.css('.pagination-sm li')).get(1);
 this.pgOneLink = element.all(by.css('.pagination-sm li a')).get(1);

 this.pgTwoElem = element.all(by.css('.pagination-sm li')).get(2);
 this.pgTwoLink = element.all(by.css('.pagination-sm li a')).get(2);
 
 this.titleInput = element.all(by.css('.form-control')).first();
};

module.exports = new SearchPage();

