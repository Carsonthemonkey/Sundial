import { assert } from 'chai';
import * as timeFunctions from '../scripts/timeFunctions.js';
import { Temporal } from '@js-temporal/polyfill';

describe('getUserTimezone', function() { //!Note that this test assumes you are in Pacific daylight time
    it('should return the string -07:00', function() {
        assert.equal(timeFunctions.getUserTimezone(), "-07:00");
    });
})

describe('convertToUserTime', function() {
    // it('should convert an easy timezone', function(){
    //     let time = timeFunctions.convertToUserTime("8 pm EST", true);
    //     assert.equal(time.toString(), 
    // })
    it('should return a ZonedDateTime object representing 12:00 PM in the user\'s timezone', function() { //!Note that this test assumes you are in Pacific daylight time
        let sameTimeStrings = ["12 p.m. pdt", "12:00 p.m. pdt", "12:00:00 p.m. PDT", "12:00:00 p.m. pacific", "12:00:00 p.m. pacific daylight time", "12:00:00 p.m. pacific daylight"];
        let now = Temporal.Now.plainDate('iso8601');
        //create a ZonedDateTime object representing 12:00 PM in the PDT timezone
        let time = Temporal.ZonedDateTime.from({timeZone: 'America/Los_Angeles', year: now.year, month: now.month, day: now.day, hour: 12, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0});
        console.log(time.toString());
        assert.equal(timeFunctions.convertToUserTime("12 p.m. PST", false).toString(), time.toString());
        // for (let t of sameTimeStrings) {
            // assert.equal(timeFunctions.convertToUserTime(t, false), time);
        // }
    });
    it('should convet to the standard time when keepInDaylightZone is true' , function() { //!Note that this test assumes you are in Pacific daylight time
        let timeString = "8 pm EST";
        let time = Temporal.ZonedDateTime.from({timeZone: 'America/Los_Angeles', year: 2023, month: 1, day: 1, hour: 17, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0});
        assert.equal(timeFunctions.convertToUserTime(timeString, true), time);
    });
});

