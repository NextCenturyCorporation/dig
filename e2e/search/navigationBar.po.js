/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

 'use strict';

var NavigationBar = function () 
{
	var navBar = element(by.id('navbar-main'));
    var homeButton = navBar.all(by.repeater('item in menu')).first();
    var savedQueriesButton = navBar.all(by.repeater('item in menu')).last();
    var settingsMenu = element.all(by.css('[role="settingsMenu"]'));

    //Returns true if the settings menu dropdown is open
    this.isSettingsMenuOpen = function ()
    {
    	return navBar.element(by.css('.open')).isPresent();
    };

    //Returns true if the about dialog is open
    this.isAboutDialogOpen = function ()
    {
    	return element(by.css('.modal-dialog.modal-sm')).isPresent();
    };

    //Will expand or collapse the settings menu
	this.toggleSettingsMenu = function ()
	{
		return element(by.id('settingsMenu')).click();
	};

	//Opens the about dialog
	this.openAboutDialog = function ()
	{
		return this.toggleSettingsMenu().then(function ()
		{	
			return settingsMenu.all(by.tagName('li')).last().click();
		});
	};

	//Closes the about dialog using the ok button
	this.closeAboutDialog = function ()
	{
		return this.isAboutDialogOpen().then(function (open)
		{
			if(open)
			{
				return element(by.css('.modal-footer.ng-scope')).element(by.css('.btn.btn-primary')).click();
			}
			else
			{
				return console.error('Cannot close about dialog as it is not open');
			}
		});
	};

	//Toggles the image blur checkbox
	this.toggleImageBlur = function ()
	{
		return this.toggleSettingsMenu().then(function () 
		{
			return element.all(by.tagName('input')).first().click();
		});
		
	};

	//Goes to the homepage by pressing the home button
	this.goToHomepage = function ()
	{
		return homeButton.click();
	};

	//Goes to the saved queries page by pressing the saved queries button
	this.goToSavedQueriesPage = function ()
	{
		return savedQueriesButton.click();
	};
};

 module.exports = new NavigationBar();