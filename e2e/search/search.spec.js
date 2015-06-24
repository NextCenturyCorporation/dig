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
        expect(page.isInListView()).toBeFalsy();
        page.search()
        .then(function ()
        {
             expect(page.isInListView()).toBeTruthy();
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
         var resultCount = undefined;
        page.search().then(page.getResultCount).then(function (count)
        {
            //Results should be greater than 0
            resultCount = count;
            expect(resultCount).toBeGreaterThan(0);
        }).then(function ()
        {
            return page.searchFor('the');
        }).then(page.getResultCount).then(function (count)
        {
            //Searching for 'the' should cut down on results
            expect(count).toBeLessThan(resultCount);
            resultCount = count;
        }).then(function ()
        {
            return page.searchFor('+the +be');
        }).then(page.getResultCount).then(function (count)
        {
            //The intersection of 'the' and 'be' should be less than simply 'the'
            expect(count).toBeLessThan(resultCount);
        }).then(function ()
        {
            return page.searchFor('the be');
        }).then(page.getResultCount).then(function (count)
        {
            //The union of 'the' and 'be' should be greater than just 'the'
            expect(count).toBeGreaterThan(resultCount);
        });
    });

    it('should be able to clear a search', function ()
    {
        page.searchFor('test');
        expect(page.isInListView()).toBeTruthy();
        page.clearSearch();
        expect(page.isInListView()).toBeFalsy();
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

    //A sleep was used to prevent the test from getting ahead of the browser
    it('should have a save Dialog that can be dismissed', function ()
    {
        page.searchAndOpenSave('')
        .then(page.isSaveDialogVisible)
        .then(function (visible)
        {
            browser.sleep(500);
            expect(visible).toBeTruthy();
        }).then(page.cancelSave)
        .then(page.isSaveDialogVisible)
        .then(function (visible)
        {
            expect(visible).toBeFalsy();
        });
    });

    it('should only be able to saved named searches', function ()
    {
        page.searchAndOpenSave('');
        expect(page.isSaveButtonEnabled()).toBeFalsy();
        page.setQueryName('example');
        expect(page.isSaveButtonEnabled()).toBeTruthy();
    });

    it('should be able to save a new search', function ()
    {
        savedQueriesPage.get();
        savedQueriesPage.clearSavedSearches()
        .then(page.get)
        .then(function ()
        {
            return page.searchForAndSaveAs('test', 'query1');
        }).then(savedQueriesPage.get)
        .then(function ()
        {
            expect(savedQueriesPage.getSavedQueryCount()).toEqual(1);
            expect(savedQueriesPage.getQueryName(0)).toEqual('query1');
            expect(savedQueriesPage.getQueryTerms(0)).toEqual('test');
        })
    });

    //Like some other tests, a sleep had to be added to prevent the tests from
    //getting ahead of the browser.
    it('should be able to overwrite a previous search', function ()
    {
        savedQueriesPage.get();
        savedQueriesPage.clearSavedSearches()
        .then(page.get)
        .then(function ()
        {
            return page.searchForAndSaveAs('test1', 'query1');
        })
        .then(function ()
        {
            browser.sleep(1000);
            return page.searchForAndSaveAs('test2', 'query1');
        }).then(function ()
        {
            browser.sleep(1000);
            return browser.switchTo().alert().accept();
        }).then(savedQueriesPage.get)
        .then(function ()
        {
            expect(savedQueriesPage.getSavedQueryCount()).toEqual(1);
            expect(savedQueriesPage.getQueryName(0)).toEqual('query1');
            expect(savedQueriesPage.getQueryTerms(0)).toEqual('test2');
        });
    });

    it('should allow the user to cancel a save if it will overwrite an old one', function ()
    { 
        savedQueriesPage.get();
        savedQueriesPage.clearSavedSearches()
        .then(page.get)
        .then(function ()
        {
            return page.searchForAndSaveAs('test1', 'query1');
        })
        .then(function ()
        {
            browser.sleep(1000);
            return page.searchForAndSaveAs('test2', 'query1');
        }).then(function ()
        {
            browser.sleep(1000);
            return browser.switchTo().alert().dismiss();
        }).then(savedQueriesPage.get)
        .then(function ()
        {
            expect(savedQueriesPage.getSavedQueryCount()).toEqual(1);
            expect(savedQueriesPage.getQueryName(0)).toEqual('query1');
            expect(savedQueriesPage.getQueryTerms(0)).toEqual('test1');
        });
    });

    it('should let users select a previous query and overwrite it', function ()
    {
        savedQueriesPage.get();
        savedQueriesPage.clearSavedSearches()
        .then(page.get)
        .then(function ()
        {
            return page.searchForAndSaveAs('test1', 'query1');
        })
        .then(function ()
        {
            browser.sleep(1000);
            return page.searchForAndSaveAsQueryNumber('test2', 0);
        }).then(function ()
        {
            browser.sleep(1000);
            return browser.switchTo().alert().accept();
        }).then(savedQueriesPage.get)
        .then(function ()
        {
            expect(savedQueriesPage.getSavedQueryCount()).toEqual(1);
            expect(savedQueriesPage.getQueryName(0)).toEqual('query1');
            expect(savedQueriesPage.getQueryTerms(0)).toEqual('test2');
        });
    });

    //Todo: find out how to get displayed value of a dropdown
    // iit('should allow users to set a frequency of execution for a search', function ()
    // {
    //     savedQueriesPage.get();
    //     savedQueriesPage.clearSavedSearches()
    //     .then(page.get)
    //     .then(function ()
    //     {
    //         return page.searchForAndSaveAs('test', 'query1', 1);
    //     }).then(savedQueriesPage.get)
    //     .then(function ()
    //     {
    //         expect(savedQueriesPage.getSavedQueryCount()).toEqual(1);
    //         expect(savedQueriesPage.getQueryName(0)).toEqual('query1');
    //         expect(savedQueriesPage.getQueryTerms(0)).toEqual('test');
    //         expect(savedQueriesPage.getQueryFrequency(0)).toEqual('hourly')
    //     })
    // });
    
    //Sometimes (1/10 times roughly) the second result would not expand or collapse 
    //in time to pass the test. The sleeps were added to mitigate this but should
    //this test continue to fail sporadically, increasing the sleep time should
    //further reduce or completely stop the failures. 
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
            browser.sleep(500);
            //Check that two can be expanded simultaneously
            expect(page.isResultExpanded(0)).toBeTruthy();
            expect(page.isResultExpanded(1)).toBeTruthy();
        }).then(function ()
        {
            return page.toggleResult(0);
        }).then(function ()
        {
            browser.sleep(500);
            //Check that just the first result collapsed
            expect(page.isResultExpanded(0)).toBeFalsy();
            expect(page.isResultExpanded(1)).toBeTruthy();
        }).then(function ()
        {
            return page.toggleResult(1);
        }).then(function ()
        {
            browser.sleep(500);
            //Check that both results have been collapsed
            expect(page.isResultExpanded(0)).toBeFalsy();
            expect(page.isResultExpanded(1)).toBeFalsy();
        });

    });
    
    it('should be able to sort based on different parameters', function ()
    {   
        var firstResult = undefined;
        var firstDate = undefined, secondDate = undefined;
        page.search().then(function ()
        {
            return page.getTitle(0);
        }).then(function (title)
        {
            firstResult = title;
        }).then(function ()
        {
            //Date created newest first
            page.sortBy(1);
        }).then(function ()
        {
            //Although it is possible they are the same, it is extremely unlikely
            expect(page.getTitle(0)).not.toEqual(firstResult);
            page.getDateCreated(0).then(function (date)
            {
                firstDate = date;
            });
            page.getDateCreated(1).then(function (date)
            {
                secondDate = date;
            }).then(function ()
            {
                expect(compareDates(firstDate, secondDate)).not.toBeLessThan(0);
            });
        }).then(function ()
        {
            //Date created oldest first
            page.sortBy(2);
        }).then(function ()
        {
            expect(page.getTitle(0)).not.toEqual(firstResult);
            page.getDateCreated(0).then(function (date)
            {
                firstDate = date;
            });
            page.getDateCreated(1).then(function (date)
            {
                secondDate = date;
            }).then(function ()
            {
                expect(compareDates(firstDate, secondDate)).not.toBeGreaterThan(0);
            });
        });
    });

    it('should sort in a repeatable nature', function ()
    {
        var firstResult = undefined;
        page.searchFor('').then(function ()
        {
            return page.getTitle(0);
        }).then(function (title)
        {
            firstResult = title;
        }).then(function ()
        {
            page.sortBy(3);
        }).then(function ()
        {
            page.sortBy(0);
        }).then(function ()
        {
            return page.getTitle(0);
        }).then(function (title)
        {
            expect(title).toEqual(firstResult);
        });
    });

    it('should be able to display results grid and list views', function ()
    {
        page.search().then(function ()
        {
            expect(page.isInListView()).toBeTruthy();
            expect(page.isInGridView()).toBeFalsy();
        })
        .then(page.switchToGridView)
        .then(function ()
        {
            expect(page.isInListView()).toBeFalsy();
            expect(page.isInGridView()).toBeTruthy();
        }).then(page.switchToListView)
        .then(function ()
        {
            expect(page.isInListView()).toBeTruthy();
            expect(page.isInGridView()).toBeFalsy(); 
        });
    });

    // it('should allow filtering based on date created', function ()
    // {

    // });
    
    //This test does not actually test if the results after filtering all meet filter criteria.
    //It merely checks to see if filters predictably reduce/increase result counts as they are applied.
    //Adding a test to check if the filter is working correctly directly would cause it to be reliant on the
    //specific data set since filters are based off of the underlying data fields. Since this would cause the 
    //test to be nonfunctional for different data sets, direct testing of filters was omitted.
    it('should allow filtering based on result attributes', function ()
    {
        var counts = [undefined, undefined, undefined, undefined];
        page.search().then(page.getResultCount)
        .then(function (count)
        {
            //counts[0] is the total number of results
            counts[0] = count;
        })
        .then(function ()
        {
            return page.toggleFilterByAttribute(0, 0);
        }).then(page.getResultCount).then(function (count)
        {
            //counts[1] is the number of results after filtering by the first type of the first attribute
            counts[1] = count;
            //There should be less since a filter was applied
            expect(count).toBeLessThan(counts[0]);
        }).then(function ()
        {
            return page.toggleFilterByAttribute(0, 1);
        }).then(page.getResultCount).then(function (count)
        {
            //counts[2] is the number of results after filtering by the first or second type of the first attribute
            counts[2] = count;
            //Since results can be either type 1 or type 2, should be greater than counts[1]
            expect(count).toBeGreaterThan(counts[1]);
            //Since results are being filtered, should be less than counts[0]
            expect(count).toBeLessThan(counts[0])
        }).then(function ()
        {
            return page.toggleFilterByAttribute(1, 0);
        }).then(page.getResultCount).then(function (count)
        {
            //counts[3] is the number of results after filtering by the first or second type of the first attribute
            //and the first type of the second attribute
            counts[3] = count;
            //Should be less than counts[2] since an additional filter was applied
            expect(count).toBeLessThan(counts[2]);
        }).then(function ()
        {
            return page.toggleFilterByAttribute(1, 0);
        }).then(page.getResultCount).then(function (count)
        {
            expect(count).toEqual(counts[2]);
        }).then(function ()
        {
            return page.toggleFilterByAttribute(0, 1);
        }).then(page.getResultCount).then(function (count)
        {
            expect(count).toEqual(counts[1]);
        }).then(function ()
        {
            return page.toggleFilterByAttribute(0, 0);
        }).then(page.getResultCount).then(function (count)
        {
            expect(count).toEqual(counts[0]);
        });
    });
    
    //Todo: add removal of from/to date breadcrumbs when the from/to date filter tests have been added
    it('should display search filters and allow their removal with breadcrumbs', function ()
    {
       var counts = [undefined, undefined, undefined, undefined];
        page.search().then(page.getResultCount)
        .then(function (count)
        {
            //counts[0] is the total number of results
            counts[0] = count;
        })
        .then(function ()
        {
            return page.toggleFilterByAttribute(0, 0);
        }).then(page.getResultCount).then(function (count)
        {
            //counts[1] is the number of results after filtering by the first type of the first attribute
            counts[1] = count;
            
            var filterAttribute = undefined, filterType = undefined, 
            filter = undefined, breadCrumbText = undefined;

            //The filter text should match the breadcrumb text
            page.getAttributeFilter(0).then(function (name)
            {
                filterAttribute = name.toLowerCase();
            });
            page.getAttributeFilterType(0,0).then(function (name)
            {
                filterType = name.toLowerCase();
            }).then(function ()
            {
                filter = filterAttribute + ": " + filterType;
            }).then(function ()
            {
                page.getBreadcrumbText(0,0).then(function (text)
                {
                    breadCrumbText = text.toLowerCase();
                });
            }).then(function ()
            {
                expect(breadCrumbText).toEqual(filter);
            });
        }).then(function ()
        {
            return page.toggleFilterByAttribute(0, 1);
        }).then(page.getResultCount).then(function (count)
        {
            //counts[2] is the number of results after filtering by the first or second type of the first attribute
            counts[2] = count;
            
            var filterAttribute = undefined, filterType = undefined, 
            filter = undefined, breadCrumbText = undefined;
            
            //The second breadcrumb text should match the new filter
            var filterAttribute = undefined, filterType = undefined, 
            filter = undefined, breadCrumbText = undefined;
            
            page.getAttributeFilter(0).then(function (name)
            {
                filterAttribute = name.toLowerCase();
            });
            page.getAttributeFilterType(0,1).then(function (name)
            {
                filterType = name.toLowerCase();
            }).then(function ()
            {
                filter = filterAttribute + ": " + filterType;
            }).then(function ()
            {
                page.getBreadcrumbText(0,1).then(function (text)
                {
                    breadCrumbText = text.toLowerCase();
                });
            }).then(function ()
            {
                expect(breadCrumbText).toEqual(filter);
            });
        }).then(function ()
        {
            return page.toggleFilterByAttribute(1, 0);
        }).then(page.getResultCount).then(function (count)
        {
            //counts[3] is the number of results after filtering by the first or second type of the first attribute
            //and the first type of the second attribute
            counts[3] = count;
            
            var filterAttribute = undefined, filterType = undefined, 
            filter = undefined, breadCrumbText = undefined;
            
            //The third breadcrumb text should match the new filter, this one is from a different attribute group
            page.getAttributeFilter(1).then(function (name)
            {
                filterAttribute = name.toLowerCase();
            });
            page.getAttributeFilterType(1,0).then(function (name)
            {
                filterType = name.toLowerCase();
            }).then(function ()
            {
                filter = filterAttribute + ": " + filterType;
            }).then(function ()
            {
                page.getBreadcrumbText(1,0).then(function (text)
                {
                    breadCrumbText = text.toLowerCase();
                });
            }).then(function ()
            {
                expect(breadCrumbText).toEqual(filter);
            });
        //Check to see that removing filters using breadcrumbs works as expected
        }).then(function ()
        {
            return page.removeBreadcrumb(1, 0);
        }).then(page.getResultCount).then(function (count)
        {
            expect(count).toEqual(counts[2]);
        }).then(function ()
        {
            return page.removeBreadcrumb(0, 1);
        }).then(page.getResultCount).then(function (count)
        {
            expect(count).toEqual(counts[1]);
        }).then(function ()
        {
            return page.removeBreadcrumb(0, 0);
        }).then(page.getResultCount).then(function (count)
        {
            expect(count).toEqual(counts[0]);
        });
    });
    
    //Sleeps were added because the expansions/collapses of filters were occurring
    //slower than the tests. The time can be increased if the test sporadically fails
    it('should allow the collapsing and expanding of attribute filters', function ()
    {
        page.search().then(function ()
        {
            expect(page.isFilterExpanded(0)).toBeTruthy();
            expect(page.isFilterExpanded(1)).toBeTruthy();
        }).then(function ()
        {
            return page.toggleAttributeFilter(0);
        }).then(function ()
        {
            browser.sleep(500);
            expect(page.isFilterExpanded(0)).toBeFalsy();
            expect(page.isFilterExpanded(1)).toBeTruthy();
        }).then(function ()
        {
            return page.toggleAttributeFilter(1);
        }).then(function ()
        {
            browser.sleep(500);
            expect(page.isFilterExpanded(0)).toBeFalsy();
            expect(page.isFilterExpanded(1)).toBeFalsy();
        }).then(function ()
        {
            return page.toggleAttributeFilter(1);
        }).then(function ()
        {
            browser.sleep(500);
            expect(page.isFilterExpanded(0)).toBeFalsy();
            expect(page.isFilterExpanded(1)).toBeTruthy();
        }).then(function ()
        {
            return page.toggleAttributeFilter(0);
        }).then(function ()
        {
            browser.sleep(500);
            expect(page.isFilterExpanded(0)).toBeTruthy();
            expect(page.isFilterExpanded(1)).toBeTruthy();
        });
    });
    
    //Checking all results on page caused a timeout so only a fraction are checked.
    //Since all images are uniform this should be sufficient. This test is dependent
    //on the images starting blurred which is the default but can be changed. If this
    //test is failing, simply direct to dig and enable image blurring before running
    //the test.
    it('should allow the toggling of image blur', function ()
    {
        page.search()
        .then(page.getResultsOnPage)
        .then(function (count)
        {
            for(var i = 0; i < (count/5) + 1; i++)
            {
                expect(page.isThumbnailImageBlurred(i)).toBeTruthy();
            }
            return count;
        }).then(function (count)
        {
            for(var i = 0; i < (count/5) + 1; i++)
            {
                page.toggleResult(i);
                //sleep was used instead of wait because of closure issues
                browser.sleep(500);
            }
            return count;
        }).then(function (count)
        {
            for(var i = 0; i < (count/5) + 1; i++)
            {
                expect(page.isExpandedImageBlurred(i)).toBeTruthy();
            }
        }).then(page.switchToGridView)
        .then(page.getResultsOnPage)
        .then(function (count)
        {
            for(var i = 0; i < (count/5) + 1; i++)
            {
                expect(page.isGridImageBlurred(i)).toBeTruthy();
            }
        }).then(function ()
        {
            return page.toggleImageBlur();
        })
        .then(page.getResultsOnPage)
        .then(function (count)
        {
            for(var i = 0; i < (count/5) + 1; i++)
            {
                expect(page.isGridImageBlurred(i)).toBeFalsy();
            }
        }).then(page.switchToListView)
        .then(page.getResultsOnPage)
        .then(function (count)
        {
            for(var i = 0; i < (count/5) + 1; i++)
            {
                expect(page.isThumbnailImageBlurred(i)).toBeFalsy();
                expect(page.isExpandedImageBlurred(i)).toBeFalsy();
            }
        })
        .then(function ()
        {
            return page.toggleImageBlur();
        })
        .then(page.getResultsOnPage)
        .then(function (count)
        {
            for(var i = 0; i < (count/5) + 1; i++)
            {
                expect(page.isThumbnailImageBlurred(i)).toBeTruthy();
                expect(page.isExpandedImageBlurred(i)).toBeTruthy();
            }
        }).then(page.switchToGridView)
        .then(page.getResultsOnPage)
        .then(function (count)
        {
            for(var i = 0; i < (count/5) + 1; i++)
            {
                expect(page.isGridImageBlurred(i)).toBeTruthy();
            }
        })
    });

    it('should present result list in pages and allow users to switch pages', function ()
    {
        var totalPages = undefined;
        var firstResult = undefined;
        var secondResult = undefined;
        page.search().then(function ()
        {
            //We should start on page 1
            expect(page.getCurrentPageNumber()).toEqual(1);
        }).then(page.getResultCount)
        .then(function (count)
        {
            totalPages = Math.trunc(count / 25) + 1
        }).then(function ()
        {
            //The total pages should be the formula above as there are 25 results a page
            expect(page.getTotalPageCount()).toEqual(totalPages);
        }).then(function ()
        {
            return page.getTitle(0);
        }).then(function (title)
        {
            firstResult = title;
        }).then(function ()
        {
            return page.goToPage(2);
        }).then(function ()
        {
            //Should be on page 2 now
            expect(page.getCurrentPageNumber()).toEqual(2);
        }).then(function ()
        {
            return page.getTitle(0);
        }).then(function (title)
        {
            //The first result should not be the same since we are on a new page
            secondResult = title;
            expect(title).not.toEqual(firstResult);
        }).then(function ()
        {
            return page.goToPage(1);
        }).then(function ()
        {
            return page.getTitle(0);
        }).then(function (title)
        {
            //The first result should be what it was as we went back to page 1
            expect(title).toEqual(firstResult);
        }).then(page.goToNextPage)
        .then(function ()
        {
            return page.getTitle(0);
        }).then(function (title)
        {
            //Using the next page button, we should be on the second page
            expect(title).toEqual(secondResult);
            expect(page.getCurrentPageNumber()).toEqual(2);
        }).then(page.goToPreviousPage)
        .then(function ()
        {
            return page.getTitle(0);
        }).then(function (title)
        {
            //Then using the previous button, we should be on the first page
            expect(title).toEqual(firstResult);
            expect(page.getCurrentPageNumber()).toEqual(1);
        });
    });
    
    //Basic page testing like checking page count / expansion of page switching options left
    //out as they are the same in the grid and the list.
    it('should present grid of images in pages and allow users to switch pages', function ()
    {
        var firstResult = undefined;
        page.search()
        .then(page.switchToGridView)
        .then(function ()
        {
            expect(page.getCurrentPageNumber()).toEqual(1);
        }).then(function ()
        {
            return page.getGridImageSrc(0);
        }).then(function (src)
        {
            firstResult = src;
        }).then(function ()
        {
            return page.goToPage(2);
        }).then(function ()
        {
            expect(page.getCurrentPageNumber()).toEqual(2);
        }).then(function ()
        {
            return page.getGridImageSrc(0);
        }).then(function (src)
        {
            expect(src).not.toEqual(firstResult);
        }).then(function ()
        {
            return page.goToPage(1);
        }).then(function ()
        {
            return page.getGridImageSrc(0);
        }).then(function (src)
        {
            expect(src).toEqual(firstResult);
        });
    });
    
    //This test is dependent on at least 626 results (25 * 25 + 1) so it can be disabled on smaller data sets
    it('should adjust the pages available to switch to based on the displayed page', function ()
    {
        page.search()
        .then(page.getFirstSwitchablePage)
        .then(function (first)
        {
            //Originally, the first switchable page is 1
            expect(first).toEqual('1');
        }).then(page.getLastSwitchablePage)
        .then(function (last)
        {
            //Originally, the last switchable page is 25
            expect(last).toEqual('25');
        }).then(function ()
        {
            //Since 13 is the midpoint of 1 and 25, going to 14 should change the page switch options
            return page.goToPage(14);
        }).then(page.getFirstSwitchablePage)
        .then(function (first)
        {
            //Now the first page should be 2
            expect(first).toEqual('2');
        }).then(page.getLastSwitchablePage)
        .then(function (last)
        {
            //Now the last page should be 26
            expect(last).toEqual('26');
        });
    })


    // Helper functions

    function expectTrue (bool)
    {
        expect(bool).toBeTruthy();
    }

    function expectFalse (bool)
    {
        expect(bool).toBeFalsy();
    }

    function compareDates (one, two)
    {
        if(getYear(one) === getYear(two))
        {
            if(getMonth(one) === getMonth(two))
            {
                if(getDay(one) === getDay(two))
                {
                    return getTimeOfDay(one) - getTimeOfDay(two);
                }
                else
                {
                    return getDay(one) - getDay(two);
                }
            }
            else
            {
                return getMonth(one) - getMonth(two);
            }
        }
        else
        {
            return getYear(one) - getYear(two);
        }
    }

    //Commented out the correct way to do these, ran into a bug.
    function getYear (date)
    {
        return parseInt(date.substring(6,11));
        //return parseInt(date.substring(date.indexOf('/', date.indexOf('/')) + 1, date.indexOf(' ')));
    }

    function getMonth (date)
    {
        return parseInt(date.substring(0, 2));
        //return parseInt(date.substring(0, date.indexOf('/')));
    }

    function getDay (date)
    {
        return parseInt(date.substring(3, 5));
        //return parseInt(date.substring(date.indexOf('/') + 1, date.indexOf('/', date.indexOf('/'))));
    }

    //In total seconds
    function getTimeOfDay (date)
    {
        var time = date.substring(12, 20);
        var hour = time.substring(0, 2);
        var minute = time.substring(3, 5);
        var second = time.substring(6,8);
        // var time = date.substring(date.indexOf(' ') + 1, date.indexOf(' ', date.indexOf(' ')));
        // var hour = time.substring(0, time.indexOf(':'));
        // var minute = time.substring(time.indexOf(':') + 1, time.indexOf(':', time.indexOf(':')));
        // var second = time.substring(time.indexOf(':', time.indexOf(':')) + 1)

        return (3600 * parseInt(hour)) + (60 * parseInt(minute)) + parseInt(second);
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
