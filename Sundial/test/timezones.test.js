const assert = require('chai').assert;
const timezones = require('../scripts/timezones.js');


//!This test only works if you are in Pacific Time
describe('getUserTimezone', function() {
    it('should return the string PDT or PST', function() {
        assert.equal(timezones.getUserTimezone(), "PDT" || "PST");
    });
})

//!This test only works if you are in Pacific Time and Daylight Savings Time
describe('timeToDate', function() { 
    it('should return the direct conversion if both times are daylight savings', function(){
        assert.equal(timezones.timeToDate("10:00 PM PDT").toLocaleTimeString(), "10:00:00 PM");
    })
    it('Should show the time in the page\'s timezone if the option is toggled on and the page is on the opposite side of DST', function(){
        assert.equal(timezones.timeToDate("10:00 PM PST", true).toLocaleTimeString(), "10:00:00 PM");
        assert.equal(timezones.timeToDate("10:00 PM EST", true).toLocaleTimeString(), "7:00:00 PM");
    })
    it('Should show the time in your timezone if the option is not toggled even if the page\'s timezone is on the opposite side of DST', function(){
        assert.equal(timezones.timeToDate("10:00 PM PST", false).toLocaleTimeString(), "11:00:00 PM");
        assert.equal(timezones.timeToDate("10:00 PM EST", false).toLocaleTimeString(), "7:00:00 PM");
    })
})


