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
    	searchPage.get();
    	searchPage.searchForAndSaveAs(queryOne[0], queryOne[1])
    	.then(function ()
    	{
    		browser.sleep(util.minimumSleepInterval * 4);
	    	searchPage.searchForAndSaveAs(queryTwo[0], queryTwo[1]);
    	}).then(function ()
    	{
    		browser.sleep(util.minimumSleepInterval * 4);
    		searchPage.searchForAndSaveAs(queryThree[0], queryThree[1]);
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
    			lastDate = new Date(date);
    		}).then(function ()
    		{
    			for(var i = 1; i < count; i++)
	   			{
	   				queryPage.getQueryDateCreated(i).then(function (date)
	   				{
	   					expect(new Date(date)).not.toBeLessThan(lastDate);
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
                browser.sleep(util.minimumSleepInterval * 3);
    		}
    	}).then(function ()
    	{
    		for(var i = 0; i < count; i++)
    		{
    			expect(queryPage.isQueryExpanded(i)).toBeTruthy();
    		}
    		return queryPage.toggleQuery(0);
    	}).then(function ()
    	{
            browser.sleep(util.minimumSleepInterval * 3);
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
                browser.sleep(util.minimumSleepInterval * 3);
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
        .then(function ()
        {
            return queryPage.runQuery(0)
        }).then(function ()
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
            return queryPage.deleteSavedSearch(0);
        }).then(function ()
        {
            expect(queryPage.getSavedQueryCountLabel()).toEqual(0);
        });
    });

    it('should allow users to change the frequency of execution on a saved query', function ()
    {
        //should initially be never
        expect(queryPage.getQueryFrequency(0)).toEqual('never');
        //Try settings to all options
        queryPage.setQueryFrequency(0, 1)
        .then(function ()
        {
            return queryPage.getQueryFrequency(0);
        }).then(function (frequency)
        {
            expect(queryPage.getQueryFrequency(0)).toEqual('hourly');
            return queryPage.setQueryFrequency(0, 2);
        }).then(function ()
        {
            return queryPage.getQueryFrequency(0);
        }).then(function (frequency)
        {
            expect(queryPage.getQueryFrequency(0)).toEqual('daily');
            return queryPage.setQueryFrequency(0, 3);
        }).then(function ()
        {
            return queryPage.getQueryFrequency(0);
        }).then(function (frequency)
        {
            expect(queryPage.getQueryFrequency(0)).toEqual('weekly');
            return queryPage.setQueryFrequency(0, 0);
        }).then(function ()
        {
            return queryPage.getQueryFrequency(0);
        //Try to set to the current option to ensure it does nothing
        }).then(function (frequency)
        {
            expect(queryPage.getQueryFrequency(0)).toEqual('never');
            return queryPage.setQueryFrequency(0, 0);
        }).then(function ()
        {
            return queryPage.getQueryFrequency(0);
        }).then(function (frequency)
        {
            expect(queryPage.getQueryFrequency(0)).toEqual('never');
            return queryPage.setQueryFrequency(0, 1);
        //Make sure setting frequencies of two different queries works without a page refresh
        }).then(function (){
            return queryPage.setQueryFrequency(1, 2);
        }).then(function ()
        {
            return queryPage.getQueryFrequency(1)
        }).then(function (frequency)
        {   
            expect(queryPage.getQueryFrequency(1)).toEqual('daily');
            return queryPage.getQueryFrequency(0);
        }).then(function (frequency)
        {
            expect(queryPage.getQueryFrequency(0)).toEqual('hourly');
        });
    });

});