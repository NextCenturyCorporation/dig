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

	this.getSavedQueryCount = function (callback)
	{
		element(by.css('.column-header')).element(by.tagName('h4')).getText().then(function (resultString)
		{
			var count = parseInt(resultString.substring(0, resultString.indexOf(' ')).replace(',', ''));
			callback(count);
		});
	};

	//Todo: Fix this
	this.reset = function ()
	{
		var defaults = ['query1', 'query2', 'query3'];
	// 	savedQueryList.forEach(function (savedQuery)
	// 	{
	// 		savedQuery.getText().then(function (text)
	// 		{
	// 			for(var i = 0; i < defaults.length; i++)
	// 			{
	// 				if(text === defaults[i])
	// 					return;
	// 			}
	// 			savedQuery.element(by.buttonText('Delete')).click();
	// 		});
	// 	});
	// };
		savedQueryList.filter(function (savedQuery)
		{
			return savedQuery.getText().then(function (text)
			{
				//If I knew how to safely loop I would
				return text !== defaults[0] && text !== defaults[1] && text !== defaults[2] 
			});
		}).each(function (nonDefault)
		{
			return nonDefault.element(by.buttonText('Delete')).click();
		});
	};
};

 module.exports = new SavedQueriesPage();