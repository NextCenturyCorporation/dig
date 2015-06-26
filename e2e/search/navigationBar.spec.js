'use strict';

describe('Top Bar', function() 
{
	var searchPage = require('./search.po'), savedQueriesPage = require('./savedQueries.po'), 
    util = require('./dig.util'), navBar = require('./navigationBar.po');

    beforeEach(function() 
    {
        searchPage.get();
    });

    it('should have a functional home button and saved queries button', function ()
    {
        expect(browser.getCurrentUrl()).toContain('/list');
        navBar.goToSavedQueriesPage().then(function ()
        {
            expect(browser.getCurrentUrl()).toContain('/queries');
        }).then(navBar.goToHomepage)
        .then(function ()
        {
            expect(browser.getCurrentUrl()).toContain('/list');
        });
    });

    it('should have a settings menu that opens and closes', function ()
    {
        expect(navBar.isSettingsMenuOpen()).toBeFalsy();
        navBar.toggleSettingsMenu().then(function ()
        {
            expect(navBar.isSettingsMenuOpen()).toBeTruthy();
        }).then(navBar.toggleSettingsMenu)
        .then(function ()
        {
            expect(navBar.isSettingsMenuOpen()).toBeFalsy();
        }).then(navBar.toggleSettingsMenu)
        .then(function ()
        {
            expect(navBar.isSettingsMenuOpen()).toBeTruthy();
        })
        .then(function ()
        {
            //Click anywhere to close the menu
            return browser.actions().mouseMove({x: 50, y: 50}).doubleClick().perform();
        }).then(function ()
        {
            expect(navBar.isSettingsMenuOpen()).toBeFalsy();
        });
    });

    it('should have an functional about button and about dialog', function ()
    {
        expect(navBar.isAboutDialogOpen()).toBeFalsy();
        navBar.openAboutDialog().then(function ()
        {
            expect(navBar.isAboutDialogOpen()).toBeTruthy();
        }).then(function ()
        {
            return navBar.closeAboutDialog();
        })
        .then(function ()
        {
            expect(navBar.isAboutDialogOpen()).toBeFalsy();
        }).then(function ()
        {
            return navBar.openAboutDialog();
        })
        .then(function ()
        {
            expect(navBar.isAboutDialogOpen()).toBeTruthy();
        }).then(function ()
        {   
            return browser.actions().mouseMove({x: 50, y: 50}).doubleClick().perform();
        }).then(function ()
        {
            browser.sleep(2000);
            expect(navBar.isAboutDialogOpen()).toBeFalsy();
        });
    });

    //Checking all results on page caused a timeout so only a fraction are checked.
    //Since all images are uniform this should be sufficient. This test is dependent
    //on the images starting blurred which is the default but can be changed. If this
    //test is failing, simply direct to dig and enable image blurring before running
    //the test.
    it('should allow the toggling of image blur', function ()
    {
        searchPage.search()
        .then(searchPage.getResultsOnPage)
        .then(function (count)
        {
            for(var i = 0; i < (count/util.reductionDivisor) + 1; i++)
            {
                expect(searchPage.isThumbnailImageBlurred(i)).toBeTruthy();
            }
            return count;
        }).then(function (count)
        {
            for(var i = 0; i < (count/util.reductionDivisor) + 1; i++)
            {
                searchPage.toggleResult(i);
                //sleep was used instead of wait because of closure issues
                browser.sleep(750);
            }
            return count;
        }).then(function (count)
        {
            for(var i = 0; i < (count/util.reductionDivisor) + 1; i++)
            {
                expect(searchPage.isExpandedImageBlurred(i)).toBeTruthy();
            }
        }).then(searchPage.switchToGridView)
        .then(searchPage.getResultsOnPage)
        .then(function (count)
        {
            for(var i = 0; i < (count/util.reductionDivisor) + 1; i++)
            {
                expect(searchPage.isGridImageBlurred(i)).toBeTruthy();
            }
        }).then(function ()
        {
            return navBar.toggleImageBlur();
        })
        .then(searchPage.getResultsOnPage)
        .then(function (count)
        {
            for(var i = 0; i < (count/util.reductionDivisor) + 1; i++)
            {
                expect(searchPage.isGridImageBlurred(i)).toBeFalsy();
            }
        }).then(searchPage.switchToListView)
        .then(searchPage.getResultsOnPage)
        .then(function (count)
        {
            for(var i = 0; i < (count/util.reductionDivisor) + 1; i++)
            {
                expect(searchPage.isThumbnailImageBlurred(i)).toBeFalsy();
                expect(searchPage.isExpandedImageBlurred(i)).toBeFalsy();
            }
        })
        .then(function ()
        {
            return navBar.toggleImageBlur();
        })
        .then(searchPage.getResultsOnPage)
        .then(function (count)
        {
            for(var i = 0; i < (count/util.reductionDivisor) + 1; i++)
            {
                expect(searchPage.isThumbnailImageBlurred(i)).toBeTruthy();
                expect(searchPage.isExpandedImageBlurred(i)).toBeTruthy();
            }
        }).then(searchPage.switchToGridView)
        .then(searchPage.getResultsOnPage)
        .then(function (count)
        {
            for(var i = 0; i < (count/util.reductionDivisor) + 1; i++)
            {
                expect(searchPage.isGridImageBlurred(i)).toBeTruthy();
            }
        })
    });

    //Todo: move image blurring here and try to test notifications

});