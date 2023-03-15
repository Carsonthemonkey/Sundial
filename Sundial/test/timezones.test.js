const assert = require('chai').assert;
const timezones = require('../scripts/timezones'); //I should probably move some of these functions to a separate file


//!This test only works if you are in Pacific Time
describe('getUserTimezone', function() {
    it('should return the string PDT or PST', function() {
        assert.equal(timezones.getUserTimezone(), "PDT" || "PST");
    });
})




