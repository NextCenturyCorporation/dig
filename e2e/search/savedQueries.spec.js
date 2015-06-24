'use strict';

describe('Saved Queries View', function() 
{

	var queryPage = require('./savedQueries.po'), searchPage = require('./search.po'), util = require('./dig.util');
    var queryOne = ['the', 'queryA'];
    var queryTwo = ['be', 'queryB'];
    var queryThree = ['to', 'queryC'];


    beforeEach(function() 
    {
    	queryPage.get();
    	queryPage.clearSavedSearches();
    	var searchqueryPage = require('./search.po');
    	searchqueryPage.get();
    	searchqueryPage.searchForAndSaveAs(queryOne[0], queryOne[1])
    	.then(function ()
    	{
    		browser.sleep(1000);
	    	searchqueryPage.searchForAndSaveAs(queryTwo[0], queryTwo[1]);
    	}).then(function ()
    	{
    		browser.sleep(1000);
    		searchqueryPage.searchForAndSaveAs(queryThree[0], queryThree[1]);
    	}).then(queryPage.get);
    });

    it('should list queries in the order they were created', function ()
    {
    	var count = undefined;
    	queryPage.getSavedQueryCount()
    	.then(function (qCount)
    	{
    		count = qCount;
    	}).then(function ()
    	{
    		var lastDate = undefined;
    		queryPage.getQueryDateCreated(0).then(function (date)
    		{
    			lastDate = date;
    		}).then(function ()
    		{
    			for(var i = 1; i < count; i++)
	   			{
	   				queryPage.getQueryDateCreated(i).then(function (date)
	   				{
	   					expect(util.compareDates(date, lastDate)).not.toBeLessThan(0);
	   				});
	   			}
    		});
    	});
    });

    it('should allow users to expand and collapse saved queries', function ()
    {
    	var count = undefined;
    	queryPage.getSavedQueryCount()
    	.then(function (qCount)
    	{
    		count = qCount;
    	}).then(function ()
    	{
    		for(var i = 0; i < count; i++)
    		{
    			expect(queryPage.isQueryExpanded(i)).toBeFalsy();
    		}
    	}).then(function ()
    	{
    		for(var i = 0; i < count; i++)
    		{
    			queryPage.toggleQuery(i);
                browser.sleep(750);
    		}
    	}).then(function ()
    	{
    		for(var i = 0; i < count; i++)
    		{
    			expect(queryPage.isQueryExpanded(i)).toBeTruthy();
    		}
    	}).then(function ()
    	{
    		return queryPage.toggleQuery(0);
    	}).then(function ()
    	{
			expect(queryPage.isQueryExpanded(0)).toBeFalsy();
		}).then(function ()
		{
			for(var i = 1; i < count; i++)
			{
				expect(queryPage.isQueryExpanded(i)).toBeTruthy();
			}
		}).then(function ()
		{
			for(var i = 1; i < count; i++)
			{
				queryPage.toggleQuery(i);
                browser.sleep(1000);
			}
		}).then(function ()
		{
			for(var i = 1; i < count; i++)
			{
				expect(queryPage.isQueryExpanded(i)).toBeFalsy();
			}
		});
 
    });

    it('should be able to run saved queries', function ()
    {
        searchPage.get();
        var resultCount, results = [];
        searchPage.searchFor(queryOne[0])
        .then(function ()
        {
            return searchPage.getResultListOnPage();
        })
        .then(function (list)
        {
            results = list;
        }).then(searchPage.getResultCount)
        .then(function (count)
        {   
            resultCount  = count;
        }).then(queryPage.get)

        queryPage.runQuery(0)
        .then(function ()
        {
            return searchPage.getResultListOnPage();
        }).then(function (list)
        {
            expect(list).toEqual(results);
            return searchPage.getResultCount();
        }).then(searchPage.getResultCount)
        .then(function (count)
        {
            expect(count).toEqual(resultCount);
        });
    });

    it('should be able to delete saved queries', function ()
    {
        expect(queryPage.getSavedQueryCount()).toEqual(3);
        expect(queryPage.getQueryName(0)).toEqual(queryOne[1]);
        queryPage.deleteSavedSearch(0).then(function ()
        {
            expect(queryPage.getSavedQueryCount()).toEqual(2);
            expect(queryPage.getQueryName(0)).toEqual(queryTwo[1]);
            expect(queryPage.getQueryName(1)).toEqual(queryThree[1]);
        }).then(function ()
        {
            return queryPage.deleteSavedSearch(1);
        }).then(function ()
        {
            expect(queryPage.getSavedQueryCount()).toEqual(1);
            expect(queryPage.getQueryName(0)).toEqual(queryTwo[1]);
        }).then(function ()
        {
            return queryPage.deleteSavedSearch(0);
        }).then(function ()
        {
            expect(queryPage.getSavedQueryCount()).toEqual(0);
        });
    });

    it('should display the number of saved queries', function ()
    {
        expect(queryPage.getSavedQueryCountLabel()).toEqual(3);
        queryPage.deleteSavedSearch(0).then(function ()
        {
            expect(queryPage.getSavedQueryCountLabel()).toEqual(2);
        }).then(function ()
        {
            return queryPage.deleteSavedSearch(0);
        }).then(function ()
        {
            expect(queryPage.getSavedQueryCountLabel()).toEqual(1);
        }).then(function ()
        {
            return queryPage.deleteSavedSearch(0);
        }).then(function ()
        {
            expect(queryPage.getSavedQueryCountLabel()).toEqual(0);
        });
    });


    //Todo: this test
    // it('should allow users to change the frequency of execution on a saved query', function ()
    // {

    // });

});