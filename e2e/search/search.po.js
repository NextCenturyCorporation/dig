/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

 'use strict';

//Having both from and to calendar elements may be superflous. Might be worth revisiting later.
var SearchPage = function () 
{
	var util = require('./dig.util');

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
	var attributeFilterList = element.all(by.repeater('filter in facets.aggFilters'));
	//Breadcrumbs are in lists and each of the breadcrumb lists are part of a larger list based off of attributes
	var attributeBreadcrumbListList = element.all(by.repeater('aggFilter in facets.aggFilters'));
	var dateBreadcrumbList = element(by.repeater('(dateFilter, values) in filterStates.dateFilters'))
							 .all(by.repeater('(filterKey, date) in values'));

	//Date filter elements
	var fromDate = leftColumn.element(by.css('.col-xs-12')).all(by.css('.input-group')).first();
	var toDate = leftColumn.element(by.css('.col-xs-12')).all(by.css('.input-group')).last();
	var fromDateButton = fromDate.all(by.css('.btn.btn-default')).last();
	var toDateButton = toDate.all(by.css('.btn.btn-default')).last();
	var fromDateCalendar = fromDate.element(by.model('date'));
	var toDateCalendar = toDate.element(by.model('date'));
	var fromCalendarHeader = fromDateCalendar.element(by.tagName('thead'));
	var toCalendarHeader = toDateCalendar.element(by.tagName('thead'));
	var fromCalendarTitle = fromCalendarHeader.all(by.tagName('th')).get(1);
	var toCalendarTitle = toCalendarHeader.all(by.tagName('th')).get(1);
	var fromCalendarLeftArrow = fromCalendarHeader.all(by.tagName('th')).get(0).element(by.tagName('button'));
	var toCalendarLeftArrow = fromCalendarHeader.all(by.tagName('th')).get(0).element(by.tagName('button'));
	var fromCalendarRightArrow = fromCalendarHeader.all(by.tagName('th')).get(2).element(by.tagName('button'));
	var toCalendarRightArrow = fromCalendarHeader.all(by.tagName('th')).get(2).element(by.tagName('button'));

	//Result elements, use list only when in list view and grid in grid view
	var resultList = element(by.id('results')).all(by.repeater('doc in indexVM.results.hits.hits track by $index'));
	var resultGrid = element(by.tagName('image-gallery')).all(by.repeater('doc in gallery.rawData track by $index'));

	/*
	Save dialog components
	*/
	var saveDialog = element(by.css('.modal-content'));
	var inDialogSaveButton = saveDialog.element(by.buttonText('Save'));
	var inDialogCancelButton = saveDialog.all(by.buttonText('Cancel'));
	var queryName = saveDialog.element(by.model('query.name'));
	var previousQueriesList = saveDialog.element(by.model('existingQuery')).all(by.tagName('option'));
	var frequencyDropdown = saveDialog.element(by.model('query.frequency'));

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
		return rightColumn.element(by.css('.column-header')).element(by.tagName('h4')).getText().then(function (text)
		{
			return parseInt(text.substring(0, text.indexOf(' ')).replace(',', ''));
		});
	};

	//Returns the titles of all results displayed on the page
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

	//Gets the date the result was created
	this.getDateCreated = function (number)
	{
		return resultList.get(number).element(by.css('.date')).getText()
		.then(function (text)
		{
				return new Date(text);
		});
	};

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

	//Returns the number of types (visibly) available to filter by under the specified attribute filter
	this.getTypeCountOfAttributeFilter = function (attributeNumber)
	{
		return attributeFilterList.get(attributeNumber).all(by.css('.ng-scope.ng-binding'))
		.count();
	};

	//Returns the number of results that match the type specified
	this.getResultCountMatchingFilter = function (attributeNumber, typeNumber)
	{
		return attributeFilterList.get(attributeNumber).all(by.repeater('bucket in displayBuckets'))
		.get(typeNumber).element(by.css('.badge.pull-right.ng-binding')).getText()
		.then(function (text)
		{
			return parseInt(text);
		});
	};

	//Returns the number of available attribute filters
	this.getAttributeFilterCount = function ()
	{
		return attributeFilterList.count();
	};	

	//Gets the page element of the attribute breadcrumb with index crumbNumber from the 
	//list of breadcrumbs associated with the attribute at the index attributeNumber
	this.getAttributeBreadcrumb = function (attributeNumber, crumbNumber)
	{
		return attributeBreadcrumbListList.get(attributeNumber)
		.all(by.repeater('(filterKey, selected) in filterStates.aggFilters[aggFilter.field]'))
		.get(crumbNumber);
	};

	//Note that the crumbNumber might (and likely will) not equal the type number used 
	//in getAttributeFilterType. Gets the text from the attribute breadcrumb specified
	this.getAttributeBreadcrumbText = function (attributeNumber, crumbNumber)
	{
		return this.getAttributeBreadcrumb(attributeNumber, crumbNumber).getText();
	};

	//Note that date breadcrumbs work differently than attribute ones
	//to breadcrumb will always be at index 1 even if no from breadcrumb exists
	//Gets the page element of the date breadcrumb with index crumbnumber
	this.getDateBreadcrumb = function (crumbNumber)
	{
		return dateBreadcrumbList.get(crumbNumber);
	};

	//Gets the text from the date breadcrumb specified
	this.getDateBreadcrumbText = function (crumbNumber)
	{
		return this.getDateBreadcrumb(crumbNumber).getText();
	};

	//Returns the number of results displaying on the page
	this.getResultsOnPage = function ()
	{
		return resultList.count();
	};

	//Returns the number of the page currently displaying
	this.getCurrentPageNumber = function ()
	{
		return pageLabel.getText().then(function (text)
		{
			return parseInt(text.substring(text.indexOf('page ') + 'page '.length, text.indexOf(' of')));
		});
	};

	//Returns the total number of pages of results
	this.getTotalPageCount = function ()
	{
		return pageLabel.getText().then(function (text)
		{
			return parseInt(text.substring(text.indexOf('of ') + 'of '.length));
		});
	};

	//Gets the image source of an image on a grid which can be used to check if two images are the same
	this.getGridImageSrc = function (number)
	{
		return resultGrid.get(number).element(by.tagName('img')).getAttribute('src');
	};

	//Returns the page number of the last page displayed that the user can switch to
	this.getLastSwitchablePage = function ()
	{
		return pageList.last().element(by.tagName('a')).getText();
	};

	//Returns the page number of the first page displayed that the user can switch to
	this.getFirstSwitchablePage = function ()
	{
		return pageList.first().element(by.tagName('a')).getText();
	};

	//Gets the date of the earliest result in the data set. It is dependent on the sort
	//by date created being the third option in the sorts. This approach was taken instead
	//of doing a text match since on different data sets there may not be a field strictly
	//labelled 'date created'.
	this.getEarliestCreatedDate = function ()
	{
		var self = this;
		return this.search().then(function ()
		{	
			return self.sortBy(2);
		}).then(function ()
		{
			return self.getDateCreated(0);
		});
	};

	//Does the same as the above method but finds the latest date instead.
	this.getLatestCreatedDate = function ()
	{
		var self = this;
		return this.search().then(function ()
		{	
			return self.sortBy(1);
		}).then(function ()
		{
			return self.getDateCreated(0);
		});
	};


	//Returns the state of the calendar as a promise containing either 'day', 'month', or 'year'
	this.getFromCalendarState = function ()
	{
		var state = undefined, self = this;
		return this.isFromCalendarOpen()
		.then(function (open)
		{
			if(!open)
			{
				return self.toggleFromCalendar();
			}
		}).then(function ()
		{
			return fromDateCalendar.element(by.tagName('table')).getAttribute('ng-switch-when')
			.then(function (type)
			{
				return type;
			});
		});
	};

	//Gets the state of the to calendar
	this.getToCalendarState = function ()
	{
		var state = undefined, self = this;
		return this.isToCalendarOpen()
		.then(function (open)
		{
			if(!open)
			{
				self.toggleToCalendar();
			}
		}).then(function ()
		{
			return toDateCalendar.element(by.tagName('table')).getAttribute('ng-switch-when')
			.then(function (type)
			{
				return type;
			});
		});
	};

	//Gets the currently selected option in the from calendar
	this.getSelectedOptionInFromCalendar = function ()
	{
		return fromDateCalendar.element(by.tagName('table')).getAttribute('aria-activedescendant')
		.then(function (selectedString)
		{
			return parseInt(selectedString.split('-')[3]);
		});
	};

	//Same as above but for to calendar
	this.getSelectedOptionInToCalendar = function ()
	{
		return toDateCalendar.element(by.tagName('table')).getAttribute('aria-activedescendant')
		.then(function (selectedString)
		{
			return parseInt(selectedString.split('-')[3]);
		});
	};

	//Gets the text value of the currently selected option in the from calendar
	this.getSelectedOptionTextInFromCalendar = function ()
	{
		return this.getSelectedOptionInFromCalendar()
		.then(function (index)
		{
			return fromDateCalendar.all(by.repeater('dt in row track by dt.date')).get(index).getText();
		});
	};

	//Same as above but for to calendar
	this.getSelectedOptionTextInToCalendar = function ()
	{
		return this.getSelectedOptionInToCalendar()
		.then(function (index)
		{
			return toDateCalendar.all(by.repeater('dt in row track by dt.date')).get(index).getText();
		});
	};

	//Gets the option text of the option at index 'number' in the from calendar
	this.getOptionTextInFromCalendar = function (number)
	{
		return fromDateCalendar.all(by.repeater('dt in row track by dt.date')).get(number).getText();
	};

	//Same as above but for to calendar
	this.getOptionTextInToCalendar = function (number)
	{
		return toDateCalendar.all(by.repeater('dt in row track by dt.date')).get(number).getText();
	};

	//Gets the title of the calendar in the from calendar
	this.getFromCalendarTitle = function ()
	{
		return fromCalendarTitle.getText();
	};

	//Same as above but for to calendar
	this.getToCalendarTitle = function ()
	{
		return toCalendarTitle.getText();
	};

	//Returns a Javascript date object representing the currently selected date
	//in the from calendar
	this.getSelectedDateInFromCalendar = function ()
	{
		var self = this, month = undefined, year = undefined;
		return this.getFromCalendarState()
		.then(function (state)
		{
			if(state === 'day')
			{
				return self.getFromCalendarTitle().then(function (title)
				{
					month = title.split(' ')[0];
					year = title.split(' ')[1];
				}).then(function ()
				{
					return self.getSelectedOptionTextInFromCalendar()
				}).then(function (day)
				{
					return new Date(month + ' ' + day + ", " + year);
				});
			}
			else
			{	
				return self.getSelectedOptionInFromCalendar()
				.then(function (index)
				{
					return self.selectOptionInFromCalendar(index)
					.then(function ()
					{
						return self.getSelectedDateInFromCalendar();
					});
				});
			}	
		});
	};

	//Same as above but for to calendar	
	this.getSelectedDateInToCalendar = function ()
	{
		var self = this, month = undefined, year = undefined;
		return this.getToCalendarState()
		.then(function (state)
		{
			if(state === 'day')
			{
				return self.getToCalendarTitle().then(function (title)
				{
					month = title.split(' ')[0];
					year = title.split(' ')[1];
				}).then(function ()
				{
					return self.getSelectedOptionTextInToCalendar()
				}).then(function (day)
				{
					return new Date(month + ' ' + day + ", " + year);
				});
			}
			else
			{	
				return self.getSelectedOptionInToCalendar()
				.then(function (index)
				{
					return self.selectOptionInToCalendar(index)
					.then(function ()
					{
						return self.getSelectedDateInToCalendar();
					});
				});
			}	
		});
	};

	//Gets the date being displayed under the from label (should be
	//the date being filtered from).
	this.getFilteredFromDate = function ()
	{
		return element(by.model('beginDate')).getAttribute('value')
		.then(function (value)
		{
			return value;
		});
	};

	//Gets the date being displayed under the to label (should be
	//the date being filtered to).
	this.getFilteredToDate = function ()
	{
		return element(by.model('endDate')).getAttribute('value')
		.then(function (value)
		{
			return value;
		});
	};

	//Returns true if the '+' button under the specified attribute filter
	//is clickable
	this.isShowMoreTypesButtonEnabled = function (attributeNumber)
	{
		return attributeFilterList.get(attributeNumber)
		.all(by.tagName('a')).first().getAttribute('class')
		.then(function (classText)
		{
			return classText !== 'disabled';
		});
	};

	//Retiurns true if the '-' button under the specified attribute filter
	//is clickable
	this.isShowFewerTypesButtonEnabled = function (attributeNumber)
	{
		return attributeFilterList.get(attributeNumber)
		.all(by.tagName('a')).last().getAttribute('class')
		.then(function (classText)
		{
			return classText !== 'disabled';
		});
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

	//Returns true if the filter is expanded and false if it is collapsed
	this.isFilterExpanded = function (number)
	{
		return attributeFilterList.get(number)
		.all(by.tagName('div')).get(2)
		.getAttribute('style').then(function (style)
		{
			return style !== 'height: 0px;';
		});
	};

	//This is a helper method which given the style string on an image, will return true if it is blurred
	this.isImageBlurred = function (style)
	{
		if(style === '')
			return false;
		var tmp = style.substring(style.indexOf('blur'));
		var blur = tmp.substring(tmp.indexOf('(')+ 1, tmp.indexOf(')'));
		return blur !== '0px'
	};

	//Returns true if the thumbnail image of the result at index 'number' is blurred
	this.isThumbnailImageBlurred = function (number)
	{
		var self = this;
		return this.isInListView().then(function (inListView)
		{
			if(inListView)
			{
				return resultList.get(number).element(by.css('.image-thumb.center-block'))
				.getAttribute('style').then(function (style)
				{
					return self.isImageBlurred(style);
				});
			}
			else
			{
				return console.error('Cannot check image blur unless result list is visible.');
			}
		});
	};

	//Returns true if the expanded image of the result at index 'number' is blurred
	this.isExpandedImageBlurred = function (number)
	{
		var self = this;
		return this.isResultExpanded(number).then(function (expanded)
		{
			if(expanded)
			{
				return resultList.get(number).element(by.css('.image-expanded.center-block'))
				.getAttribute('style').then(function (style)
				{
					return self.isImageBlurred(style);
				});
			}	
			else
			{
				return console.error('Cannot check image blur unless result is expanded.');
			}
		});
	};

	//Returns true if the grid image of the result at index 'number' is blurred
	this.isGridImageBlurred = function (number)
	{
		var self = this;
		return this.isInGridView().then(function (inGridView)
		{
			if(inGridView)
			{
				return resultGrid.get(number).element(by.css('.image-gallery-img.center-block'))
				.getAttribute('style').then(function (style)
				{
					return self.isImageBlurred(style);
				});
			}
			else
			{
				return console.error('Cannot check image blur unless in grid view.');
			}
		});
	};

	//Returns true if the save button in the save query dialog is clickable
	this.isSaveButtonEnabled = function ()
	{
		return inDialogSaveButton.isEnabled();
	};


	//Returns true if the from calendar is open
	this.isFromCalendarOpen = function ()
	{
		return fromDateCalendar.getAttribute('style')
		.then(function (style)
		{
			return style.substring(0, style.indexOf(';')) !== 'display: none';
		});
	};

	//Same as above but for to calendar	
	this.isToCalendarOpen = function ()
	{
		return toDateCalendar.getAttribute('style')
		.then(function (style)
		{
			return style.substring(0, style.indexOf(';')) !== 'display: none';
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

	//Sets the name of the query in the save query dialog
	this.setQueryName = function (name)
	{
		return queryName.sendKeys(name);
	};

	//Clicks the save button in the save search dialog.
	this.saveSearch = function ()
	{
		return inDialogSaveButton.click();
	};

	//Searches for 'query', saves it as 'name', and optionally sets the frequency of execution to frequencyIndex
	this.searchForAndSaveAs = function (query, name, frequencyIndex)
	{
		return this.searchAndOpenSave(query)
		.then(function ()
		{
			browser.sleep(1000);
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

	//Clicks the cancel button in the save search dialog
	this.cancelSave = function ()
	{
		return inDialogCancelButton.click();
	};

	//Searches for 'query' and overwrites the query at index 'number'
	this.searchForAndSaveAsQueryNumber = function (query, number)
	{
		return this.searchAndOpenSave(query)
		.then(function ()
		{
			browser.sleep(1000);
			return previousQueriesList.get(number + 1).click();
		}).then(this.saveSearch);
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
	this.filterFromDate = function (date)
	{
		var self = this;
		return this.isFromCalendarOpen()
		.then(function (open)
		{
			if(!open)
			{
				return self.toggleFromCalendar()
			}
		//Go to the top level, even if we are not at the bottom clicking the title does no harm
		}).then(function ()
		{
			return self.goUpInFromCalendar();
		}).then(function ()
		{
			return self.goUpInFromCalendar();
		}).then(function ()
		{
			return self.getFromCalendarTitle();
		}).then(function (title)
		{
			var yearStart = parseInt(title.split('-')[0]);
			var cmp = util.getRangeDifference(date, yearStart, parseInt(title.split('-')[1]));
			for(var i = 0; i != cmp;)
			{
				if(i < cmp)
				{
					self.goToPreviousInFromCalendar()
					.then(function ()
					{
						i--;
					});
				}
				else
				{
					self.goToNextInFromCalendar()
					.then(function ()
					{
						i++;
					});
				}
			}
			return self.selectOptionInFromCalendar(date.getFullYear() - yearStart);
		}).then(function ()
		{
			return self.selectOptionInFromCalendar(date.getMonth());
		}).then(function ()
		{
			return self.selectOptionByTextInFromCalendar(('0' + date.getDate()).slice(-2));
		});
	};

	//Filters results to the date specified.
	this.filterToDate = function (date)
	{
		var self = this;
		return this.isToCalendarOpen()
		.then(function (open)
		{
			if(!open)
			{
				return self.toggleToCalendar()
			}
		//Go to the top level, even if we are not at the bottom clicking the title does no harm
		}).then(function ()
		{
			return self.goUpInToCalendar();
		}).then(function ()
		{
			return self.goUpInToCalendar();
		}).then(function ()
		{
			return self.getToCalendarTitle();
		}).then(function (title)
		{
			var yearStart = parseInt(title.split('-')[0]);
			var cmp = util.getRangeDifference(date, yearStart, parseInt(title.split('-')[1]));
			for(var i = 0; i != cmp;)
			{
				if(i < cmp)
				{
					self.goToPreviousInToCalendar()
					.then(function ()
					{
						i--;
					});
				}
				else
				{
					self.goToNextInToCalendar()
					.then(function ()
					{
						i++;
					});
				}
			}
			return self.selectOptionInToCalendar(date.getFullYear() - yearStart);
		}).then(function ()
		{
			return self.selectOptionInToCalendar(date.getMonth());
		}).then(function ()
		{
			return self.selectOptionByTextInToCalendar(('0' + date.getDate()).slice(-2));
		});
	};

	//Either opens or collapses the from calendar
	this.toggleFromCalendar = function ()
	{
		return fromDateButton.click();
	};

	//Same as above but for to calendar	
	this.toggleToCalendar = function ()
	{
		return toDateButton.click();
	};

	//This will bring the calendar up a state if possible. If it is in 
	//day state it will go to month and month will go to year. If it is in
	//year state nothing will happen.
	this.goUpInFromCalendar = function ()
	{
		return this.isFromCalendarOpen()
		.then(function (open)
		{
			if(open)
			{
				return fromCalendarTitle.click();
			}
			else
			{
				return console.error('Cannot operate on from calendar when it is not open.');
			}
		});
	};

	//Same as above but for to calendar
	this.goUpInToCalendar = function ()
	{
		return this.isToCalendarOpen()
		.then(function (open)
		{
			if(open)
			{
				return toCalendarTitle.click();
			}
			else
			{
				return console.error('Cannot operate on to calendar when it is not open.');
			}
		});
	};

	//Uses the previous arrow in the from calendar
	this.goToPreviousInFromCalendar = function ()
	{
		return this.isFromCalendarOpen()
		.then(function (open)
		{
			if(open)
			{
				return fromCalendarLeftArrow.click();
			}
			else
			{
				return console.error('Cannot operate on from calendar when it is not open.');
			}
		});
	};

	//Same as above but for to calendar	
	this.goToPreviousInToCalendar = function ()
	{
		return this.isToCalendarOpen()
		.then(function (open)
		{
			if(open)
			{
				return toCalendarLeftArrow.click();
			}
			else
			{
				return console.error('Cannot operate on to calendar when it is not open.');
			}
		});
	};

	//Uses the next arrow in the from calendar
	this.goToNextInFromCalendar = function ()
	{
		return this.isFromCalendarOpen()
		.then(function (open)
		{
			if(open)
			{
				return fromCalendarRightArrow.click();
			}
			else
			{
				return console.error('Cannot operate on from calendar when it is not open.');
			}
		});
	};

	//Same as above but for to calendar
	this.goToNextInToCalendar = function ()
	{
		return this.isToCalendarOpen()
		.then(function (open)
		{
			if(open)
			{
				return toCalendarRightArrow.click();
			}
			else
			{
				return console.error('Cannot operate on to calendar when it is not open.');
			}
		});
	};

	//Selects the option at index 'number' in the from calendar	
	this.selectOptionInFromCalendar = function (number)
	{
		return this.isFromCalendarOpen()
		.then(function (open)
		{
			if(open)
			{
				return fromDateCalendar.all(by.repeater('dt in row track by dt.date')).get(number).click();
			}
			else
			{
				return console.error('Cannot operate on from calendar when it is not open.');
			}
		});
	};

	//Same as above but for to calendar
	this.selectOptionInToCalendar = function (number)
	{
		return this.isToCalendarOpen()
		.then(function (open)
		{
			if(open)
			{
				return toDateCalendar.all(by.repeater('dt in row track by dt.date')).get(number).click();
			}
			else
			{
				return console.error('Cannot operate on to calendar when it is not open.');
			}
		});
	};

	//Selects the option by its text value in the from calendar
	//If in day state, will select the text day from the current month.
	this.selectOptionByTextInFromCalendar = function (text)
	{
		return this.isFromCalendarOpen()
		.then(function (open)
		{
			if(open)
			{
				return fromDateCalendar.all(by.buttonText(text))
				.filter(function (elem, index)
				{
					return elem.element(by.tagName('span')).getAttribute('class')
					.then(function (classText)
					{
						//In case of days, elements from later or previous months
						//will have 'ng-binding text-muted'
						return classText === 'ng-binding';
					});
				}).first().click();
			}
			else
			{
				return console.error('Cannot operate on from calendar when it is not open.');
			}
		});
	}

	//Same as above but for to calendar
	this.selectOptionByTextInToCalendar = function (text)
	{
		return this.isToCalendarOpen()
		.then(function (open)
		{
			if(open)
			{
				return toDateCalendar.all(by.buttonText(text))
				.filter(function (elem, index)
				{
					return elem.element(by.tagName('span')).getAttribute('class')
					.then(function (classText)
					{
						return classText === 'ng-binding';
					});
				}).first().click();
			}
			else
			{
				return console.error('Cannot operate on To calendar when it is not open.');
			}
		});
	}


	//Will toggle the filter by the attribute with the index attributeNumber and type at index optionNumber
	this.toggleFilterByAttribute = function (attributeNumber, optionNumber)
	{
		return attributeFilterList.get(attributeNumber).all(by.model('filterStates[aggregationName][bucket.key]'))
		.get(optionNumber).click();
	};

	//Will remove the specified filter by clicking the 'x' icon on the breadcrumb
	this.removeAttributeBreadcrumb = function (attributeNumber, crumbNumber)
	{
		return this.getAttributeBreadcrumb(attributeNumber, crumbNumber)
		.element(by.css('.fa.fa-times-circle'))
		.click();
	};

	//Will remove the specified date filter by clicking the 'x' icon on the breadcrumb
	this.removeDateBreadcrumb = function (crumbNumber)
	{
		return this.getDateBreadcrumb(crumbNumber)		
		.element(by.css('.fa.fa-times-circle'))
		.click();
	};

	//Will either expand or collapse the specified filter
	this.toggleAttributeFilter = function (number)
	{
		return attributeFilterList.get(number).click();
	};

	//Will press the '+' button under the specified attribute filter to display
	//more types to filter by.
	this.showMoreTypesUnderAttributeFilter = function (number)
	{
		return attributeFilterList.get(number).element(by.css('.pull-right.more-less-buttons'))
		.all(by.tagName('i')).first().isEnabled().then(function (enabled)
		{
			if(enabled)
			{
				return attributeFilterList.get(number).element(by.css('.pull-right.more-less-buttons'))
				.all(by.tagName('i')).first().click();
			}
			else
			{
				return console.error('Cannot show any more types under attribute number ' + number);
			}
		});
	};

	//Will press the '-' button under the specified attribute filter to display
	//less types to filter by.
	this.showFewerTypesUnderAttributeFilter = function (number)
	{
		return attributeFilterList.get(number).element(by.css('.pull-right.more-less-buttons'))
		.all(by.tagName('i')).last().isEnabled().then(function (enabled)
		{
			if(enabled)
			{
				return attributeFilterList.get(number).element(by.css('.pull-right.more-less-buttons'))
				.all(by.tagName('i')).last().click();
			}
			else
			{
				return console.error('Cannot show any fewer types under attribute number ' + number);
			}
		});
	};
	
	//Number - 1 is used because it is presumed the user will want consistency using this
	//and getCurrentPageNumber.
	this.goToPage = function (number)
	{
		return element(by.model('indexVM.page')).all(by.repeater('page in pages track by $index'))
		.get(number - 1).element(by.tagName('a')).click();
	};

	//This will go to the previous page of results using the previous button
	this.goToPreviousPage = function ()
	{
		return element(by.model('indexVM.page')).all(by.tagName('li'))
		.first().element(by.tagName('a')).click();
	};

	//This will go to the next page of results using the next button
	this.goToNextPage = function ()
	{
		return element(by.model('indexVM.page')).all(by.tagName('li'))
		.last().element(by.tagName('a')).click();
	};

};

 module.exports = new SearchPage();