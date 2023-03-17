const ZONESREGEX = /(UTC|GMT|ES?T|CST|MST|PS?T|AKST|HST|AEDT|BST|EASTERN|PACIFIC|CENTRAL|JST|CT|IST|NZDT|MSK|CET|MOUNTAIN|GREENWICH|INDIAN|HAWAII|ALASKA|HAWAII)/gi;
const AMPMREGEX = /((P\.?M\.?\s?)|(A\.?M\.?\s?))[\s,()]*/gi
const TIMEREGEX = /(\d{1,2})(:\d{2})?(:\d{2})?[\s,.]*/gi
const SUPPORTEDTIMEZONES = ["UTC","GMT","EST","CST","MST","PST","GMT","UTC"];
const SAVINGSTIMEZONES = ["PDT","PST","EDT","EST","CST", "CDT", "MST", "MDT", "AKST", "AKDT",];
const TIMEZONES = {
    "MOUNTAIN" : "MST",
    "GREENWICH" : "GMT",
    "INDIAN" : "UTC+5:30",
    "CENTRAL" : "CST",
    "CT" : "CST",
    "AKST" : "UTC-9",
    "HST" : "UTC-10",
    "ET" : "EST",
    "EASTERN" : "EST",
    "PACIFIC" : "PST",
    "PDT" : "UTC-7",
    "EDT" : "UTC-4",
    "PT" : "PST",
    "CET" : "UTC+1",
    "MSK" : "UTC+3",
    "IST" : "UTC+5:30",
    "JST" : "UTC+9",
    "AEDT" : "UTC+11",
    "NZDT" : "UTC+13",
    "BST" : "UTC+1",
    "HAWAII" : "UTC-10",
    "ALASKA" : "UTC-9"
}

/**
 * Returns the timezone of the user in the form PT, PST, etc.
 * @returns {string} The timezone of the user
 */
function getUserTimezone(){
    let now = new Date();
    const timeZoneAbbreviation = now.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ');
    return timeZoneAbbreviation[timeZoneAbbreviation.length - 1];
}

/**
 * Take in a timezone code that respects daylight savings time and finds whether it is daylight or standard time
 * @param {string} timezone - the timezone code to check
 * @returns {boolean} true if it is daylight time, false if it is standard time
 */
function isDaylightTime(timeZoneString){
    return timeZoneString.contains("S") //this may not work for all cases
}

/**
* Converts a string representation of time to a date object
* @param {string} timeString - the time string to be converted
* @returns {Date} the date object
*/
function timeToDate(timeString, observesDaylightSavings){
    timeString = timeString.replace(/\./g, '').toUpperCase();
    let timeMatch = timeString.match(new RegExp(TIMEREGEX.source), "i")[0];
    let zoneMatch = timeString.match(new RegExp(ZONESREGEX.source), "i")[0];
    let timeArray = timeMatch.split(/:|[\s]+/);
    let formattedDate = "01 Jan 2023 ";
    //add hours to the date
    if(timeString.match(/P.?M.?/i)){
        formattedDate += (parseInt(timeArray[0])%12 + 12) + ":";
    }
    else{
        formattedDate += parseInt(timeArray[0]%12) + ":";
    }

    //add minutes
    if(timeArray.length > 1){
        formattedDate += timeArray[1] + ":"
    }
    else{
        formattedDate += "00:"
    }

    //add seconds
    if(timeArray.length > 3){
        formattedDate += timeArray[2] + ":"
    }
    else{
        formattedDate += "00 "
    }
    
    //* Timezone logic
    //* if timezone respects daylight savings time:
    //*      check if user is in the same daylights saving zone (daylight ore standard)
    //*         if yes, convert directly as normal
    //*         if no, convert to users timezone but in the other daylight saving zone
    //* if timezone does not respect daylight savings time:
    //*      if in supported timezone, convert directly as normal
    //*      if not in supported timezone, convert via the TIMEZONES object and then convert directly

    let tz = zoneMatch.toUpperCase().trim();

    if (SAVINGSTIMEZONES.includes(tz)){
        let userTz = getUserTimezone();
        if(isDaylightSavingTime(userTz) && isDaylightSavingTime(tz)){
        }
    }
    if(!SUPPORTEDTIMEZONES.includes(tz)){
        formattedDate += TIMEZONES[tz];
    }
    else{
        formattedDate += tz;
    }   
    
    let date = new Date(Date.parse(formattedDate));
    return date
}

//define a function that tells if a timezone respects daylight savings time
function isDaylightSavingTime(timezone){
    return timezone === "PDT" || timezone === "PST" || timezone === "EDT" || timezone === "EST";
}

//export modules (This causes an error in chrome, but it doesn't seem to break anything)
