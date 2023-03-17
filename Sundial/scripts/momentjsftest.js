import moment from 'moment-timezone';
//parse a timezone string into a moment object

const ZONESARRAY = [
    "UTC",
    "GMT",
    "EST",
    "CST",
    "MST",
    "PST",
    "AKST",
    "HST",
    "AEDT",
    "BST",
    "EASTERN",
    "PACIFIC",
    "CENTRAL",
    "JST",
    "CT",
    "IST",
    "NZDT",
    "MSK",
    "CET",
    "MOUNTAIN",
    "GREENWICH",
    "INDIAN",
    "HAWAII",
    "ALASKA",
    "HAWAII"
  ];
  
for (const tz of ZONESARRAY) {
    let a = moment.tz(tz);
    //console log the UTC offset
    console.log(`${tz}: ` + a.format('Z'));
}

