/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

 'use strict';

var SearchPage = function () 
{
	/*
	Page element variables
	*/

	var searchBar = element(by.model('queryString.live'));

	//Search Buttons
	var searchButton = element(by.buttonText('Search'));
	var clearQueryButton = element(by.css('.glyphicon.glyphicon-remove.clear-search-icon'));
	var clearSearchButton = element(by.css('.btn.btn-danger.clear-all-btn'));
	var saveSearchButton = element(by.buttonText('Save'));

	//Filter and sorting options
	var sortMenu = element(by.id('sortMenu'));
	var sortList = element.all(by.repeater('option in sortOptions track by $index'));

	//Result elements
	var resultList = element(by.id('results')).all(by.css('.list-group-item.ng-scope'));

	/*
	Getters and state checks
	*/

	//Fetches the url (provided in .conf file)
	this.get = function ()
	{
		browser.get('');
	};

	//Returns the user input section of the search bar
	this.getCurrentQuery = function ()
	{
		return searchBar.getText();
	};

	//Returns the number of results found in a search
	this.getResultCount = function (callback)
	{
		element(by.css('.right-column')).element(by.css('.column-header')).
		element(by.tagName('h4')).getText().then(function (resultString)
		{
			var count = parseInt(resultString.substring(0, resultString.indexOf(' ')).replace(',', ''));
			callback(count);
		});
	};

	this.getTitle = function (number)
	{
		return resultList.get(number)
		.element(by.css('.col-xs-7.col-sm-8.col-lg-9'))
		.all(by.tagName('span')).first().getText();
	};

	//The following getters are data dependent but the only(?) way 
	//to check if data specific sorting options are functional.

	this.getDateCreated = function (number)
	{
		return resultList.get(number).element(by.css('.date')).getText();
	};

	this.getLocation = function (number)
	{
		return resultList.get(number).element(by.css('location')).getText();
	};

	this.getAge = function (number)
	{
		return resultList.get(number).element(by.css('age')).getText();
	};

	//Returns true if the results section is hidden, false otherwise
	this.isHidingResults = function ()
	{
		return element(by.css('.ng-scope.ng-isolate-scope.ng-hide')).isPresent();
	};

	this.isSaveButtonVisible = function ()
	{
		return saveSearchButton.isDisplayed();
	};

	//Returns true if the save query popup is visible, false otherwise
	this.isSaveDialogVisible = function ()
	{
		return element(by.tagName('body')).getAttribute('class').then(function (name)
		{
			return name === 'modal-open';
		})
	};

	this.isResultExpanded = function (number)
	{
		return resultList.get(number)
		.element(by.css('.list-group-item-text'))
		.getAttribute('style').then(function (height)
		{
			return height !== 'height: 0px;';
		});
	};

	/*
	Setters and Action methods
	*/

	//Sets the query string within the search bar
	this.setQuery = function(query)
	{
		return searchBar.clear().then(function ()
			{
				return searchBar.sendKeys(query);
			});
	};

	//Presses the search button
	this.search = function ()
	{
		return searchButton.click();
	};

	//Search for a specific query
	this.searchFor = function(query)
	{
		this.setQuery(query);
		return this.search();
	};

	//Clear the query section of the search bar
	this.clearQuery = function ()
	{
		return clearQueryButton.click();
	};

	//Clear the search (press the Clear All button)
	this.clearSearch = function ()
	{
		return clearSearchButton.click();
	};

	//Search for a query and open save dialog, bundled since a save cannot occur without a search
	this.searchAndOpenSave = function (query)
	{
		return this.searchFor(query).then(saveSearchButton.click);
	};

	this.toggleResult = function (number)
	{
		return resultList.get(number).element(by.css('.list-group-item-heading.collapsed')).click();
	};

	this.sortBy = function (index)
	{
		this.isHidingResults()
		.then(function (hidden)
		{
			if(!hidden)
			{
				return sortMenu.click().then(function ()
				{
					return sortList.get(index).click();
				});
			}
			else
			{
				return console.error('Sorting not available. Search before attempting to sort');
			}
		});
	};


	/*
	Save dialog components, might be worth wrapping up somehow to be more intuitive and to reduce boilerplate
	*/
	var saveDialog = element(by.css('.modal-content'));
	var inDialogSaveButton = saveDialog.element(by.buttonText('Save'));
	var inDialogCancelButton = saveDialog.all(by.buttonText('Cancel'));
	var queryName = saveDialog.element(by.model('query.name'));

	this.isSaveButtonEnabled = function ()
	{
		return inDialogSaveButton.isEnabled();
	};

	this.setQueryName = function (name)
	{
		queryName.sendKeys(name);
	};

	//If check was here initially but taken out for complexity reasons
	this.saveSearch = function ()
	{
		// this.isSaveDialogVisible().then(function (visible)
		// {
		// 	if(visible)
		// 	{
		return inDialogSaveButton.click();
		// 	}
		// 	else
		// 	{
		// 		return console.error('Save dialog not open. Open the save dialog and try again');
		// 	}

		// });
	};

	this.saveSearchAs = function (name)
	{
		queryName.sendKeys(name);
		this.saveSearch();
	};

	//If check was here initially but taken out for complexity reasons
	this.cancelSave = function ()
	{
		// this.isSaveDialogVisible().then(function (visible)
		// {
		// 	if(visible)
		// 	{
		return inDialogCancelButton.click();
		// }
		// else
		// {
		// 	return new Promise(function (){},function ()
		// 	{
		// 		return 'Save dialog not open. Open the save dialog and try again';
		// 	}).reject();
		// }

	};

	this.saveSearchFor = function (query, name)
	{
		this.searchAndOpenSave(query);
		this.saveSearchAs(name);
	};



};

 module.exports = new SearchPage();

