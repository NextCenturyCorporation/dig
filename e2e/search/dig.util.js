'use strict';

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

module.exports.compareDates = compareDates;