'use strict';

//isHiding and isVisible checks might be race conditions in their current form if they do not use promise structure

describe('Search View', function() 
{

    var page = require('./search.po'), savedQueriesPage = require('./savedQueries.po');

    beforeEach(function() 
    {
        page.get();
    });

    it('should show results only after searching', function()
    {
        expect(page.isHidingResults()).toBeTruthy();
        page.search()
        .then(function ()
        {
             expect(page.isHidingResults()).toBeFalsy();
        });

    });

    it('should handle user input in the search bar', function()
    {
        page.setQuery('test').then(function ()
            {
                page.getCurrentQuery(function (ret)
                {
                    expect(ret).toEqual('test');
                });
            }).then(page.clearQuery).then(function ()
            {
                page.getCurrentQuery(function (ret)
                {
                    expect(ret).toEqual('');
                });
            });
    });

    //This test depends on data sets in English. All data sets in english should
    //function properly as the most common words in the english language are used
    //("the" and "be").
    it('should list the number results found on a search', function()
    {
        //Intiially query for all results
        page.search();
        var resultCount = undefined;
        page.getResultCount(function (ret)
        {
            resultCount = ret;
            expect(resultCount).toBeGreaterThan(0);
        });

        //Add a query string to cut down results
        page.searchFor('the');
        page.getResultCount(function (ret)
        {
            expect(ret).toBeLessThan(resultCount);
            resultCount = ret;
        });

        //The intersection of results should be smaller in size
        page.searchFor('+the +be');
        page.getResultCount(function (ret)
        {
            expect(ret).toBeLessThan(resultCount);
        });

        //The union of the results should be greater in size
        page.searchFor('the be');
        page.getResultCount(function (ret)
        {
            expect(ret).toBeGreaterThan(resultCount);
        });
    });

    it('should be able to clear a search', function ()
    {
        page.searchFor('test');
        expect(page.isHidingResults()).toBeFalsy();
        page.clearSearch();
        expect(page.isHidingResults()).toBeTruthy();
    });

    it('should only show a save button when there is an active search', function ()
    {
        page.isSaveButtonVisible()
        .then(expectFalse)
        .then(page.search)
        .then(page.isSaveButtonVisible)
        .then(expectTrue);
    });

    it('should show a save search Dialog', function ()
    {
        expect(page.isSaveDialogVisible()).toBeFalsy();
        page.searchAndOpenSave('');
        expect(page.isSaveDialogVisible()).toBeTruthy();
    });

    //ToDo: Fix this, race condition encountered on last check
    // iit('should have a save Dialog that can be dismissed', function ()
    // {
        // page.searchAndOpenSave('')
        // .then(page.isSaveDialogVisible)
        // .then(function (visible)
        // {
        //     expect(visible).toBeTruthy();
        // }).then(page.cancelSave)
        // .then(page.isSaveDialogVisible)
        // .then(function (visible)
        // {
        //     expect(visible).toBeFalsy();
        // });

        //older attempt
        // page.searchAndOpenSave('').then(function ()
        // {
        //     expect(page.isSaveDialogVisible()).toBeTruthy();
        // }).then(page.cancelSave).then(function ()
        // {
        //     browser.sleep(1000);
        //     expect(page.isSaveDialogVisible()).toBeFalsy();
        // });
    // });

    it('should only be able to saved named searches', function ()
    {
        page.searchAndOpenSave('');
        expect(page.isSaveButtonEnabled()).toBeFalsy();
        page.setQueryName('example');
        expect(page.isSaveButtonEnabled()).toBeTruthy();
    });

    //Todo: more saved query work here 

    // it('should be able to save a new search', function ()
    // {
        // savedQueriesPage.get();
        // savedQueriesPage.reset()
        // .then(savedQueriesPage.getSavedQueryCount(expect3));

        // page.get();
        // page.saveSearchFor('test', 'example'); 
        // savedQueriesPage.get();
        // savedQueriesPage.getSavedQueryCount(function (count)
        // {
        //     expect(count).toEqual(4);
        // });

    // });
    
    it('should allow users to expand and close results', function ()
    {
        page.searchFor('')
        .then(function ()
        {
            return page.toggleResult(0);
        }).then(function ()
        {
            expect(page.isResultExpanded(0)).toBeTruthy();
        }).then(function ()
        {
            return page.toggleResult(1);
        }).then(function ()
        {
            //Check that two can be expanded simultaneously
            expect(page.isResultExpanded(0)).toBeTruthy();
            expect(page.isResultExpanded(1)).toBeTruthy();
        }).then(function ()
        {
            return page.toggleResult(0);
        }).then(function ()
        {
            //Check that just the first result collapsed
            expect(page.isResultExpanded(0)).toBeFalsy();
            expect(page.isResultExpanded(1)).toBeTruthy();
        }).then(function ()
        {
            return page.toggleResult(1);
        }).then(function ()
        {
            //Check that both results have been collapsed
            expect(page.isResultExpanded(0)).toBeFalsy();
            expect(page.isResultExpanded(1)).toBeFalsy();
        });

    });
    
    iit('should be able to sort based on different parameters', function ()
    {
        
    });

    // Helper functions

    function expectTrue (bool)
    {
        expect(bool).toBeTruthy();
    }

    function expectFalse (bool)
    {
        expect(bool).toBeFalsy();
    }

    // var hasClass = function (element, cls) 
    // {
    //     return element.getAttribute('class').then(function (classes) 
    //     {
    //         return classes.split(' ').indexOf(cls) !== -1;
    //     });
    // };

    // var httpGet = function (siteUrl) 
    // {
    //     var http = require('http');
    //     var defer = protractor.promise.defer();

    //     http.get(siteUrl, function(response) 
    //     {
    //         var bodyString = '';

    //         response.setEncoding('utf8');

    //         response.on("data", function(chunk) 
    //         {
    //             bodyString += chunk;
    //         });

    //         response.on('end', function() 
    //         {
    //             defer.fulfill({
    //                 statusCode: response.statusCode,
    //                 bodyString: bodyString
    //             });
    //         });

    //     }).on('error', function(e) 
    //     {
    //         defer.reject("Got http.get error when connecting to " + siteUrl + ": " + e.message);
    //     });

    //     return defer.promise;
    // };    

    //old tests

    // it('should default to list view', function() 
    // {
    //     browser.getLocationAbsUrl().then(function(result) 
    //     {
    //         expect(result).toBe('/list');
    //     });
    // });

    // it('elasticsearch should be up and running', function() 
    // {
    //     httpGet('http://vinisvr:9200').then(function(result) 
    //     {
    //         expect(result.statusCode).toBe(200);
    //     });
    // });


    // it('should not have first accordion visible initially', function() {
    //     expect(page.firstAccordionCollapseDiv.isDisplayed()).toBeFalsy();
    //     expect(page.firstDetailsBtn.isDisplayed()).toBeFalsy();
    // });


    // it('should open accordion and make appropriate elements visible', function() {
    //     page.firstAccordionLink.click().then(function() {
    //         browser.wait(function() {
    //             return page.firstDetailsBtn.isDisplayed();
    //         }, 1000);

    //         expect(page.firstDetailsBtn.isDisplayed()).toBeTruthy();
    //         expect(page.firstAccordionCollapseDiv.isDisplayed()).toBeTruthy();
    //         expect(hasClass(page.firstAccordionCollapseDiv, 'in')).toBeTruthy();
    //     });
    // });

    // it('should open accordion and go to details view', function() {
    //     page.firstAccordionLink.click();

    //     browser.wait(function() {
    //         return page.firstDetailsBtn.isDisplayed();
    //     }, 1000);

    //     page.firstDetailsBtn.click();

    //     browser.wait(function() {
    //         return element(by.buttonText('Back To List')).isPresent();
    //     }, 1000);

    //     expect(browser.getLocationAbsUrl()).toBe('/list/details');
    // });

    // it('should return to list view from details page', function() {
    //     page.firstAccordionLink.click();

    //     browser.wait(function() {
    //         return page.firstDetailsBtn.isDisplayed();
    //     }, 1000);

    //     page.firstDetailsBtn.click();

    //     browser.wait(function() {
    //         return element(by.buttonText('Back To List')).isPresent();
    //     }, 1000);

    //     element(by.buttonText('Back To List')).click();

    //     browser.wait(function() {
    //         return page.titleInput.isDisplayed();
    //     }, 1000);

    //     expect(browser.getLocationAbsUrl()).toBe('/list');
    // });

    // it('should include pagination with filtered data', function() {
    //     page.titleInput.sendKeys(filterKey).then(function() {
    //         // With the selected filter, two pages are expected, so there will be 
    //         // four pagination elements total -- [Previous, 1, 2, Next]
    //         expect(element.all(by.css('.pagination-sm li')).count()).toBe(4);
    //     });
    // });

    // it('ensure direct page links in pagination work as expected', function() {
    //     page.titleInput.sendKeys(filterKey);
    //     page.submitButton.click().then(function() {

    //         expect(hasClass(page.pgOneElem, 'active')).toBeTruthy();
    //         expect(hasClass(page.pgTwoElem, 'active')).toBeFalsy();

    //         page.pgTwoLink.click().then(function() {
    //             expect(hasClass(page.pgOneElem, 'active')).toBeFalsy();
    //             expect(hasClass(page.pgTwoElem, 'active')).toBeTruthy();
    //         });

    //         page.pgOneLink.click().then(function() {
    //             expect(hasClass(page.pgOneElem, 'active')).toBeTruthy();
    //             expect(hasClass(page.pgTwoElem, 'active')).toBeFalsy();
    //         });

    //     });
    // });

    // it('next button in pagination should be disabled', function() {
    //     page.titleInput.sendKeys('1395');
    //     page.submitButton.click().then(function() {

    //         page.nextLink.click().then(function() {
    //             expect(hasClass(page.nextElem, 'disabled')).toBeTruthy();
    //         });

    //     });
    // });

    // it('next button in pagination should be enabled', function() {
    //     page.titleInput.sendKeys(filterKey);
    //     page.submitButton.click().then(function() {
    //         expect(hasClass(page.nextElem, 'disabled')).toBeFalsy();
    //     });
    // });

    // it('previous button in pagination should be disabled', function() {
    //     page.titleInput.sendKeys(filterKey);
    //     page.submitButton.click().then(function() {

    //         expect(hasClass(page.prevElem, 'disabled')).toBeTruthy();
    //     });
    // });

    // it('previous button in pagination should be enabled', function() {
    //     page.titleInput.sendKeys(filterKey);
    //     page.submitButton.click();
    //     page.prevLink.click().then(function() {
    //         expect(hasClass(page.nextElem, 'disabled')).toBeFalsy();
    //     });
    // });



});
