'use strict';

//This method should compare two dates assuming they are formatted correctly. Dig uses two representations:
//MM/DD//YY hh:mm:ss OR MM/DD/YYYY hh:mm:ss and both are supported.
function compareDates (one, two)
{
    var oneDate = one.split('/');
    var twoDate = two.split('/');
    var oneYearTime = oneDate[2].split(' ');
    var twoYearTime = twoDate[2].split(' ');

    var yearComparison = oneYearTime[0] - twoYearTime[0];
    if(yearComparison === 0)
    {
        var monthComparison = oneDate[0] - twoDate[0];
        if(monthComparison === 0)
        {
            var dayComparison = oneDate[1] - twoDate[1];
            if(dayComparison === 0)
            {
                return getTimeOfDay(oneYearTime[1]) - getTimeOfDay(twoYearTime[1]);
            }
            else
            {
                return dayComparison;
            }
        }
        else
        {
            return monthComparison;
        }
    }
    else
    {
        return yearComparison;
    }
}

//In total seconds
function getTimeOfDay (time)
{
    var timeSplit = time.split(":");
    var hour = timeSplit[0];
    var minute = timeSplit[1];
    var second = timeSplit[2];
    return (3600 * parseInt(hour)) + (60 * parseInt(minute)) + parseInt(second);
}

/*
This is used to cut down on time costs for tests. The higher the value, the shorter the tests run.
Many tests checking the results of a search will loop through a number of the results.
The number of results looked at will be the number of results per page (likely 25) divided
by this number. 
*/
var reductionDivisor = 5;

module.exports.compareDates = compareDates;
module.exports.reductionDivisor = reductionDivisor;