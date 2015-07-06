'use strict';

//Given the year at index 'number' from the range, find the year value
function getYearFromRange(range, number)
{
    var firstYear = parseInt(range.split('-')[0]);
    return firstYear + number;
}

//Takes the month name and returns its numerical representation
function getMonthNumber (month)
{
    switch(month)
    {
        case 'January': return '01';
        case 'February': return '02';
        case 'March': return '03';
        case 'April': return '04';
        case 'May': return '05';
        case 'June': return '06';
        case 'July': return '07';
        case 'August': return '08';
        case 'September': return '09';
        case 'October': return '10';
        case 'November': return '11';
        case 'December': return '12';
    }
}

//Takes the number representing the month and returns its name
function getMonthName(number)
{
    switch(number)
    {
        case 0: return 'January';
        case 1: return 'February';
        case 2: return 'March';
        case 3: return 'April';
        case 4: return 'May';
        case 5: return 'June';
        case 6: return 'July';
        case 7: return 'August';
        case 8: return 'September';
        case 9: return 'October';
        case 10: return 'November';
        case 11: return 'December';
    }
}

//Given 20 year ranges, how far away the target date is
//from the current range.
function getRangeDifference(date, yearStart, yearEnd)
{
    var targetYear = date.getFullYear();
    if(targetYear < yearStart || targetYear > yearEnd)
    {
        return Math.ceil((targetYear - yearStart)/20);
    }
    else
    {
        return 0;
    }
}

/*
This is used to cut down on time costs for tests. The higher the value, the shorter the tests run.
Many tests checking the results of a search will loop through a number of the results.
The number of results looked at will be the number of results per page (likely 25) divided
by this number. The minimum value is 1, meaning there will be no decrease in test time.
*/
var reductionDivisor = 5;

//The sleep interval used in tests. Certain require more time than other and will do some multiple of this.
//The number can be increased on slower systems or connections.
var minimumSleepInterval = 250;

module.exports.reductionDivisor = reductionDivisor;
module.exports.minimumSleepInterval = minimumSleepInterval;
module.exports.getMonthNumber = getMonthNumber;
module.exports.getMonthName = getMonthName;
module.exports.getYearFromRange = getYearFromRange;
module.exports.getRangeDifference = getRangeDifference;