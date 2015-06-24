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

	//Miscellaneous page elements
	var searchBar = element(by.model('queryString.live'));
	var leftColumn = element(by.css('.left-column.hidden-xs.col-sm-3.col-lg-2'));
	var rightColumn = element(by.css('.right-column.col-sm-9'));
	var pageLabel = element.all(by.css('.text-center')).last().element(by.css('.list-unstyled')).all(by.tagName('li')).last();
	var pageList = element(by.model('indexVM.page')).all(by.repeater('page in pages track by $index'));

	//Search Buttons
	var searchButton = element(by.buttonText('Search'));
	var clearQueryButton = element(by.css('.glyphicon.glyphicon-remove.clear-search-icon'));
	var clearSearchButton = element(by.css('.btn.btn-danger.clear-all-btn'));
	var saveSearchButton = element(by.buttonText('Save'));

	//Filter and sorting options
	var sortMenu = element(by.id('sortMenu'));
	var sortList = element.all(by.repeater('option in sortOptions track by $index'));
	var resultHeader = element(by.css('.results-header-div.row'));
	var fromDateButton = leftColumn.all(by.css('input-group-btn')).first();
	var toDateButton = leftColumn.all(by.css('input-group-btn')).last();
	var attributeFilterList = element.all(by.repeater('filter in facets.aggFilters'));
	//Breadcrumbs are in lists and each of the breadcrumb lists are part of a larger list based off of attributes
	var breadcrumbListList = element.all(by.repeater('aggFilter in facets.aggFilters'));

	//Result elements, use list only when in list view and grid in grid view
	var resultList = element(by.id('results')).all(by.repeater('doc in indexVM.results.hits.hits track by $index'));
	var resultGrid = element(by.tagName('image-gallery')).all(by.repeater('doc in gallery.rawData track by $index'));

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
	this.getResultCount = function ()
	{
		// rightColumn.element(by.css('.column-header')).
		// element(by.tagName('h4')).getText().then(function (resultString)
		// {
		// 	var count = parseInt(resultString.substring(0, resultString.indexOf(' ')).replace(',', ''));
		// 	callback(count);
		// });
		return rightColumn.element(by.css('.column-header')).element(by.tagName('h4')).getText().then(function (text)
		{
			return parseInt(text.substring(0, text.indexOf(' ')).replace(',', ''));
		});
	};

	this.getResultListOnPage = function ()
	{
		var titles = [];
		var self = this;

		return resultList.count().then(function (count)
		{
			for(var i = 0; i < count; i++)
			{
				self.getTitle(i).then(function (title)
				{
					titles.push(title);
				});
			}
		}).then(function ()
		{
			return titles;
		});
	};

	//Returns the title of the result
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

	// this.getLocation = function (number)
	// {
	// 	return resultList.get(number).element(by.css('location')).getText();
	// };

	// this.getAge = function (number)
	// {
	// 	return resultList.get(number).element(by.css('age')).getText();
	// };

	//end data dependent getters

	//Returns the text of the attribute with the index of number in the filter list
	this.getAttributeFilter = function (number)
	{
		return attributeFilterList.get(number).element(by.tagName('h5')).getText();
	};

	//Returns the type of index typeNumber of the attribute with the index of attributeNumber in the filter list
	this.getAttributeFilterType = function (attributeNumber, typeNumber)
	{
		return attributeFilterList.get(attributeNumber).all(by.css('.ng-scope.ng-binding'))
		.get(typeNumber).getText();
	};

	//Gets the page element of the breadcrumb with index crumbNumber from the list of breadcrumbs associated
	//with the attribute at the index attributeNumber
	this.getBreadcrumb = function (attributeNumber, crumbNumber)
	{
		return breadcrumbListList.get(attributeNumber)
		.all(by.repeater('(filterKey, selected) in filterStates.aggFilters[aggFilter.field]'))
		.get(crumbNumber);
	};

	//Note that the crumbNumber might (and likely will) not equal the type number used in getAttributeFilterType
	//Gets the text from the breadcrumb specified
	this.getBreadcrumbText = function (attributeNumber, crumbNumber)
	{
		return this.getBreadcrumb(attributeNumber, crumbNumber).getText();
	};

	this.getResultsOnPage = function ()
	{
		return resultList.count();
	};

	this.getCurrentPageNumber = function ()
	{
		return pageLabel.getText().then(function (text)
		{
			return parseInt(text.substring(text.indexOf('page ') + 'page '.length, text.indexOf(' of')));
		});
	};

	this.getTotalPageCount = function ()
	{
		return pageLabel.getText().then(function (text)
		{
			return parseInt(text.substring(text.indexOf('of ') + 'of '.length));
		});
	};

	this.getGridImageSrc = function (number)
	{
		return resultGrid.get(number).element(by.tagName('img')).getAttribute('src');
	};

	this.getLastSwitchablePage = function ()
	{
		return pageList.last().element(by.tagName('a')).getText();
	};

	this.getFirstSwitchablePage = function ()
	{
		return pageList.first().element(by.tagName('a')).getText();
	};

	//Returns whether or not the save button is visible
	this.isSaveButtonVisible = function ()
	{
		return saveSearchButton.isDisplayed();
	};

	//Returns whether or not the results are displaying as a grid
	this.isInGridView = function ()
	{
		return element(by.tagName('image-gallery')).isPresent();
	};

	//Returns whether or not the results are displaying as a list
	this.isInListView = function ()
	{
		return resultList.count().then(function (count)
		{
			return count !== 0;
		});
	};

	//Returns true if the save query popup is visible, false otherwise
	this.isSaveDialogVisible = function ()
	{
		return element(by.tagName('body')).getAttribute('class').then(function (name)
		{
			return name === 'modal-open';
		});
	};

	//Returns whether a particular result is expanded
	this.isResultExpanded = function (number)
	{
		return browser.wait(element(by.id('results')).isPresent()).then(function ()
		{
			return resultList.get(number)
			.element(by.css('.list-group-item-text'))
			.getAttribute('style').then(function (height)
			{
				return height !== 'height: 0px;';
			});
		});
	};

	this.isFilterExpanded = function (number)
	{
		return attributeFilterList.get(number)
		.all(by.tagName('div')).get(2)
		.getAttribute('style').then(function (style)
		{
			return style !== 'height: 0px;';
		});
	};

	//This is unused because of a (scoping?) issue using it in the following 3 methods.
	// this.isImageBlurred = function (style)
	// {
	// 	if(style === '')
	// 		return false;
	// 	var tmp = style.substring(style.indexOf('blur'));
	// 	var blur = tmp.substring(tmp.indexOf('(')+ 1, tmp.indexOf(')'));
	// 	return blur !== '0px'
	// };

	this.isThumbnailImageBlurred = function (number)
	{
		return this.isInListView().then(function (inListView)
		{
			if(inListView)
			{
				return resultList.get(number).element(by.css('.image-thumb.center-block'))
				.getAttribute('style').then(function (style)
				{
					if(style === '')
						return false;
					var tmp = style.substring(style.indexOf('blur'));
					var blur = tmp.substring(tmp.indexOf('(')+ 1, tmp.indexOf(')'));
					return blur !== '0px'
				});
			}
			else
			{
				return console.error('Cannot check image blur unless result list is visible.');
			}
		});
	};

	this.isExpandedImageBlurred = function (number)
	{
		return this.isResultExpanded(number).then(function (expanded)
		{
			if(expanded)
			{
				return resultList.get(number).element(by.css('.image-expanded.center-block'))
				.getAttribute('style').then(function (style)
				{
					if(style === '')
						return false;
					var tmp = style.substring(style.indexOf('blur'));
					var blur = tmp.substring(tmp.indexOf('(')+ 1, tmp.indexOf(')'));
					return blur !== '0px'
				});
			}	
			else
			{
				return console.error('Cannot check image blur unless result is expanded.');
			}
		});
	};

	this.isGridImageBlurred = function (number)
	{
		return this.isInGridView().then(function (inGridView)
		{
			if(inGridView)
			{
				return resultGrid.get(number).element(by.css('.image-gallery-img.center-block'))
				.getAttribute('style').then(function (style)
				{
					if(style === '')
						return false;
					var tmp = style.substring(style.indexOf('blur'));
					var blur = tmp.substring(tmp.indexOf('(')+ 1, tmp.indexOf(')'));
					return blur !== '0px'
				});
			}
			else
			{
				return console.error('Cannot check image blur unless in grid view.');
			}
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

	//Will flip the state of a result (from collapsed to expanded or vice versa)
	this.toggleResult = function (number)
	{
		return resultList.get(number).element(by.css('.list-group-item-heading.collapsed')).click();
	};

	//Sorts the results by type at the given index in the sort menu
	this.sortBy = function (index)
	{
		return this.isInListView()
		.then(function (resultsDisplayed)
		{
			if(resultsDisplayed)
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

	//Switches the result display to its list view
	this.switchToListView = function ()
	{
		return resultHeader.all(by.css('.btn.btn-default')).first().click();
	};

	//Switches the result display to its grid view
	this.switchToGridView = function ()
	{
		return resultHeader.all(by.css('.btn.btn-default')).get(1).click();
	};

	//Filters results from the date specified.
	//date should be in a tuple with fields day,month,year
	// this.filterFromDate = function (date)
	// {
	// 	return fromDateButton.click().then(function ()
	// 	{

	// 	});
	// };

	//Will toggle the filter by the attribute with the index attributeNumber and type at index optionNumber
	this.toggleFilterByAttribute = function (attributeNumber, optionNumber)
	{
		return attributeFilterList.get(attributeNumber).all(by.model('filterStates[aggregationName][bucket.key]'))
		.get(optionNumber).click();
	};

	//Will remove the specified filter by clicking the 'x' icon on the breadcrumb
	this.removeBreadcrumb = function (attributeNumber, crumbNumber)
	{
		return this.getBreadcrumb(attributeNumber, crumbNumber)
		.element(by.css('.fa.fa-times-circle'))
		.click();
	};

	//Will either expand or collapse the specified filter
	this.toggleAttributeFilter = function (number)
	{
		return attributeFilterList.get(number).click();
	};

	//Will expand or collapse the settings menu
	this.toggleSettingsMenu = function ()
	{
		return element(by.id('settingsMenu')).click();
	};

	this.toggleImageBlur = function ()
	{
		return this.toggleSettingsMenu().then(function () 
		{
			return element.all(by.tagName('input')).first().click();
		});
		
	};
	
	//Number - 1 is used because it is presumed the user will want consistency using this
	//and getCurrentPageNumber.
	this.goToPage = function (number)
	{
		return element(by.model('indexVM.page')).all(by.repeater('page in pages track by $index'))
		.get(number - 1).element(by.tagName('a')).click();
	};

	this.goToPreviousPage = function ()
	{
		return element(by.model('indexVM.page')).all(by.tagName('li'))
		.first().element(by.tagName('a')).click();
	};

	this.goToNextPage = function ()
	{
		return element(by.model('indexVM.page')).all(by.tagName('li'))
		.last().element(by.tagName('a')).click();
	};

	/*
	Save dialog components, might be worth wrapping up somehow to be more intuitive and to reduce boilerplate
	*/
	var saveDialog = element(by.css('.modal-content'));
	var inDialogSaveButton = saveDialog.element(by.buttonText('Save'));
	var inDialogCancelButton = saveDialog.all(by.buttonText('Cancel'));
	var queryName = saveDialog.element(by.model('query.name'));
	var previousQueriesList = saveDialog.element(by.model('existingQuery')).all(by.tagName('option'));
	var frequencyDropdown = saveDialog.element(by.model('query.frequency'));

	this.isSaveButtonEnabled = function ()
	{
		return inDialogSaveButton.isEnabled();
	};

	this.setQueryName = function (name)
	{
		return queryName.sendKeys(name);
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

	this.searchForAndSaveAs = function (query, name, frequencyIndex)
	{
		return this.searchAndOpenSave(query)
		.then(function ()
		{
			browser.sleep(500);
			return queryName.sendKeys(name);
		}).then(function ()
		{
			if(frequencyIndex !== undefined && frequencyIndex > 0 && frequencyIndex < 4)
			{
				return frequencyDropdown.click().then(function ()
				{
					return frequencyDropdown.all(by.tagName('option')).get(frequencyIndex).click();
				});
			}
		})
		.then(this.saveSearch);
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

	this.searchForAndSaveAsQueryNumber = function (query, number)
	{
		return this.searchAndOpenSave(query)
		.then(function ()
		{
			browser.sleep(500);
			return previousQueriesList.get(number + 1).click();
		}).then(this.saveSearch);
	};

};

 module.exports = new SearchPage();

