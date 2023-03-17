//import temporal module
import { Temporal } from '@js-temporal/polyfill';

function getUserTimezone() {
    return Temporal.Now.timeZone();
}
let now = Temporal.Now.instant();
let tz = Temporal.TimeZone.from('EST');
tz = new Temporal.ZonedDateTime(now, tz);

console.log(tz.format());
// console.log(tz.getOffsetStringFor('UTC'))

