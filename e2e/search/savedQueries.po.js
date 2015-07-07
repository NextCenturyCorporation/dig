/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

 'use strict';

var SavedQueriesPage = function () 
{

	var savedQueryList = element.all(by.repeater('query in queryResults track by $index'));

	this.get = function ()
	{
		browser.get('/queries');
	};

	//Returns the number of saved queries
	this.getSavedQueryCount = function ()
	{
		return savedQueryList.count();
	};

	//Returns the numerical value of the saved query count label displayed at the top of the page
	this.getSavedQueryCountLabel = function ()
	{
		return element.all(by.tagName('h4')).first().getText().then(function (text)
		{
			return parseInt(text.substring(0, text.indexOf(' ')));
		});
	};

	//Returns the name of the query with index 'number'
	this.getQueryName = function (number)
	{
		return savedQueryList.get(number).getText().then(function (text)
		{
			return text.substring(0, text.indexOf('\n'));
		});
	};

	//Returns the query terms (what was searched for) of the query with index 'number'
	this.getQueryTerms = function (number)
	{
		return savedQueryList.get(number).all(by.tagName('span')).get(1).getText().then(function (text)
		{
			return text.substring(text.indexOf('Search Terms: ') + 'Search Terms: '.length);
		});
	};	

	//Returns the date created of the saved query with index 'number'
	this.getQueryDateCreated = function (number)
	{
		return savedQueryList.get(number).all(by.tagName('span')).get(2).getText().then(function (text)
		{
			return text.substring(text.indexOf('Created: ') + 'Created: '.length);
		});
	};

	//Returns the query frequency for this query as a string
	this.getQueryFrequency = function (number)
	{
		var self = this;
		return this.isQueryFrequencyDirty(number)
		.then(function (dirty)
		{
			if(dirty)
				return self.get();
		}).then(function ()
		{
			return self.isQueryExpanded(number);
		}).then(function (expanded)
		{
			if(!expanded)
				return self.toggleQuery(number);
		}).then(function ()
		{
			browser.sleep(1000);
			return savedQueryList.get(number).element(by.model('query.frequency'))
			.element(by.css('option[selected]')).getText();
		});
	};

	//Returns true if the query at index 'number' is expanded and false if it is collapsed
	this.isQueryExpanded = function (number)
	{	
		return element.all(by.css('[collapse="!isListItemOpened(query.id)"]')).get(number)
		.getAttribute('style').then(function (style)
		{
			return style !== 'height: 0px;';
		});
	};

	//Returns whether or not the frequency is dirty and will change in CSS on page refresh
	this.isQueryFrequencyDirty = function (number)
	{
		return savedQueryList.get(number).element(by.model('query.frequency'))
		.getAttribute('class').then(function (classText)
		{
			return classText.split(' ')[0] !== 'ng-pristine';
		});
	};

	//Toggles the query (either expands or collapses it) at index 'number'
	this.toggleQuery = function (number)
	{
		return savedQueryList.get(number).element(by.css('.query-result.list-group-item-heading.collapsed'))
		.click();
	};

	//Deletes the saved query at index 'number'
	this.deleteSavedSearch = function (number)
	{
		return savedQueryList.get(number).all(by.tagName('ul')).first()
	 	.all(by.tagName('button')).last().click();
	};

	//Deletes all saved searches
	this.clearSavedSearches = function ()
	{
		var numQueries = undefined;
		return this.getSavedQueryCount().then(function (count)
		{
			numQueries = count;
		}).then(function ()
		{
			for(var i = 0; i < numQueries; i++)
			{
				savedQueryList.get(0).all(by.tagName('ul')).first()
				.all(by.tagName('button')).last().click();
			}
		});
	};

	//Runs the saved search
	this.runQuery = function (number)
	{
		return savedQueryList.get(number).all(by.tagName('ul')).first()
	 	.all(by.tagName('button')).first().click();
	};

	//Sets the query freqency to 'frequencyIndex' of the query at index 'queryNumber'
	this.setQueryFrequency = function (queryNumber, frequencyIndex)
	{
		var self = this;
		return this.isQueryExpanded(queryNumber)
		.then(function (expanded)
		{
			if(!expanded)
			{
				return self.toggleQuery(queryNumber)
				.then(function ()
				{
					browser.sleep(500);
				});
			}
		}).then(function ()
		{
			return savedQueryList.get(queryNumber).element(by.model('query.frequency'))
			.all(by.tagName('option')).get(frequencyIndex).click();
		});
	};
};

 module.exports = new SavedQueriesPage();
 module.exports.FREQUENCY_NEVER = 0;
 module.exports.FREQUENCY_HOURLY = 1;
 module.exports.FREQUENCY_DAILY = 2;
 module.exports.FREQUENCY_WEEKLY = 3;