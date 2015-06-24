/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

 'use strict';

var SavedQueriesPage = function () 
{

	var savedQueryList = element.all(by.css('.col-xs-9.col-sm-10.col-lg-11.ng-binding'));

	this.get = function ()
	{
		browser.get('/queries');
	};

	this.getSavedQueryCount = function ()
	{
		return savedQueryList.count();
	};

	this.getSavedQueryCountLabel = function ()
	{
		return element.all(by.tagName('h4')).first().getText().then(function (text)
		{
			return parseInt(text.substring(0, text.indexOf(' ')));
		});
	};

	this.getQueryName = function (number)
	{
		return savedQueryList.get(number).getText().then(function (text)
		{
			return text.substring(0, text.indexOf('\n'));
		})
	};

	this.getQueryTerms = function (number)
	{
		return savedQueryList.get(number).all(by.tagName('span')).get(1).getText().then(function (text)
		{
			return text.substring(text.indexOf('Search Terms: ') + 'Search Terms: '.length);
		});
	};

	this.getQueryDateCreated = function (number)
	{
		return savedQueryList.get(number).all(by.tagName('span')).get(2).getText().then(function (text)
		{
			return text.substring(text.indexOf('Created: ') + 'Created: '.length);
		});
	};

	this.isQueryExpanded = function (number)
	{	
		return element.all(by.css('[collapse="!isListItemOpened(query.id)"]')).get(number).getAttribute('style').then(function (style)
		{
			return style !== 'height: 0px;';
		});
	};

	//Todo: find out how to get displayed value of a dropdown
	// this.getQueryFrequency = function (number)
	// {
	// 	return savedQueryList.get(number).click().then(function ()
	// 	{
	// 		return element.all(by.model('query.frequency')).$('option:checked').getText();
	// 	});
	// };

	this.toggleQuery = function (number)
	{
		return savedQueryList.get(number).click();
	};

	this.deleteSavedSearch = function (number)
	{
		return savedQueryList.get(number).element(by.css('.list-unstyled.query-options.horizontal-list'))
	 	.all(by.tagName('button')).last().click();
	};

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
				savedQueryList.get(0).element(by.css('.list-unstyled.query-options.horizontal-list'))
				.all(by.tagName('button')).last().click();
			}
		});
	};

	this.runQuery = function (number)
	{
		return savedQueryList.get(number).element(by.css('.list-unstyled.query-options.horizontal-list'))
	 	.all(by.tagName('button')).first().click();
	};
};

 module.exports = new SavedQueriesPage();