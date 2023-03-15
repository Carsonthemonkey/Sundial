// formattedDate = "01 Jan 2023 12:00:00 PT";
// let date = new Date(Date.parse(formattedDate));
// console.log(date.toLocaleTimeString())

let formattedDate2 = "01 Jan 2023 1:00:00 PDT";
let date2 = new Date(Date.parse(formattedDate2));
console.log(date2.toLocaleTimeString())

let now = new Date();
const timeZoneAbbreviation = now.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ');

console.log(timeZoneAbbreviation);
// console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
// console.log(timeZoneAbbreviation);