import { Temporal } from '@js-temporal/polyfill';
import moment from 'moment-timezone';

//CONSTANTS
const ZONESREGEX = /(UTC|GMT|ES?T|CST|MST|PS?T|AKST|HST|AEDT|BST|EASTERN|PACIFIC|CENTRAL|JST|CT|IST|NZDT|MSK|CET|MOUNTAIN|GREENWICH|INDIAN|HAWAII|ALASKA|HAWAII)/gi;
const AMPMREGEX = /((P\.?M\.?\s?)|(A\.?M\.?\s?))[\s,()]*/gi
const TIMEREGEX = /(\d{1,2})(:\d{2})?(:\d{2})?[\s,.]*/gi



/**
 * Gets the UTC offset string for the user's timezone
 * @returns {string} the offset string for the user's timezone
 */
export function getUserTimezone() {
    //return the offset string for the user's timezone
    return Temporal.Now.timeZone().getOffsetStringFor(Temporal.Now.instant());
}

/**
 * @param {string} timeString The string representation of the time we want to convert
 * @param {boolean} keepInDaylightZone Whether or not we will keep the time in the same daylight zone
 * @return {Date} The date object representing the time in the user's timezone
 */ 
export function convertToUserTime(timeString, keepInDaylightZone){
    timeString = timeString.replace(/\./g, '').toUpperCase();
    let timeMatch = timeString.match(new RegExp(TIMEREGEX.source), "i")[0];
    let zoneMatch = timeString.match(new RegExp(ZONESREGEX.source), "i")[0];
    let timeArray = timeMatch.split(/:|[\s]+/);
    let now = Temporal.Now.plainDate('iso8601');
    let pageTz = Temporal.TimeZone.from(zoneMatch);
    let originalTime = {
        hour: timeArray[0]%12,
        minute: 0,
        second: 0,
        millisecond: 0,
        microsecond: 0,
        nanosecond: 0
    };
    //assign values from the time array to the object
    let keys = Object.keys(originalTime);
    for (let i = 1; i < timeArray.length-1; i++) {
        originalTime[keys[i]] = parseInt(timeArray[i]);
    }

    //if the time is in the afternoon, add 12 to the hour
    if(timeString.match(/P\.?M\.?/i)){
        originalTime.hour += 12;
    }
    // console.log(originalTime);
    
    //create a plaindate object for the pages timezone
    let pageTime = Temporal.PlainDateTime.from({
        year: now.year,
        month: now.month,
        day: now.day,
        hour: originalTime.hour,
        minute: originalTime.minute,
        second: originalTime.second,
        millisecond: originalTime.millisecond,
        microsecond: originalTime.microsecond,
        nanosecond: originalTime.nanosecond
    })

    //create a zoneddatetime object for the pages timezone
    let pageZonedTime = pageTime.toZonedDateTime(pageTz);
    //convert the zoneddatetime object to the user's timezone
    let userZonedTime = pageZonedTime.withTimeZone(Temporal.Now.timeZone());
    return userZonedTime
}

console.log(convertToUserTime("8:12:34 pm EST", true).toString());
// console.log( Temporal.Now.plainDate('iso8601').toString() );
//create temporal timezone object
/*try{
    let timeZone = Temporal.TimeZone.from('EDT');
    console.log(timeZone.toString());
}catch(e){console.error('EDT is not a supported timezone')}*/