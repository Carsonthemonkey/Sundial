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
    console.log(now.day);
}

convertToUserTime("8 pm EST", true);