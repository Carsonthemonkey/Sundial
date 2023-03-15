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
* Converts a string representation of time to a date object
* @param {string} timeString - the time string to be converted
* @returns {Date} the date object
*/
function timeToDate(timeString){
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
    
    let tz = zoneMatch.toUpperCase().trim();
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

//export modules
module.exports = {SUPPORTEDTIMEZONES, TIMEZONES, getUserTimezone, timeToDate};