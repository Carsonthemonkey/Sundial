import { Temporal } from '@js-temporal/polyfill';
import moment from 'moment-timezone';

//CONSTANTS
const SUPPORTEDTIMEZONES = ["UTC","GMT","EST","CST","MST","PST","GMT","UTC", "GREENWICH", "HST", "CET", "IST", "JST", "BST"];

const TIMEZONES = {
    "MOUNTAIN" : "MST",
    "INDIAN" : "IST",
    "CENTRAL" : "CST",
    "CT" : "CST",
    "AKST" : "-09:00",
    "ET" : "EST",
    "EASTERN" : "EST",
    "PACIFIC" : "PST",
    "PDT" : "UTC-7",
    "EDT" : "UTC-4",
    "PT" : "PST",
    "MSK" : "+03:00",
    "AEDT" : "+11:00",
    "NZDT" : "+13:00",
    "ALASKA" : "-09:00",
}

const DAYLIGHTTIMEZONES = {
    "PDT" : "-07:00",
    "EDT" : "-04:00",
    "AKDT" : "-08:00",
    "MDT" : "-06:00",
    "EASTERN DAYLIGHT" : "-04:00",
    "PACIFIC DAYLIGHT" : "-07:00",
    "CENTRAL DAYLIGHT" : "-05:00",
    "MOUNTAIN DAYLIGHT" : "-06:00",
    "ALASKA DAYLIGHT" : "-08:00",
}

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
    let pageTz;
    if(SUPPORTEDTIMEZONES.includes(zoneMatch)){
        pageTz = Temporal.TimeZone.from(zoneMatch);
    }
    else{
        // console.log(`transforming ${zoneMatch} to ${TIMEZONES[zoneMatch]}`)
        pageTz = Temporal.TimeZone.from(TIMEZONES[zoneMatch]);
    }
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

//get keys from the TIMEZONES object
const zones = Object.keys(TIMEZONES);
for (const tz of zones) {
    try{
        convertToUserTime("5:20 pm " + tz, true).toString();
        // console.log("success, timezone worked: " + tz)
    }catch(e){
        console.error("error, timezone did not work: " + tz);
    }
}
console.log("now testing the supported timezones");
for (const tz of SUPPORTEDTIMEZONES) {
    try{
        convertToUserTime("5:20 pm " + tz, true).toString();
        // console.log("success, timezone worked: " + tz)
    }catch(e){
        // console.error("error, timezone did not work");
    }
}

console.log(convertToUserTime("11:00 am PST", true).toString());