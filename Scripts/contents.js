

const style = document.createElement('style');
style.textContent = `
.time-replace{
    display: inline-block;
    border: 3px solid rgb(76, 91, 224);
    border-radius: 6px;
    padding: 0.3%;
}
    `
document.head.appendChild(style)

const timeMatchRegExp = /(\d{1,2})(:\d{2})?(:\d{2})?\s?(A.?M.?\s? | P.?M.?\s?)(UTC|GMT|ES?T|CST|MST|PST|AKST|HST)/gi;
let replaced = document.body.innerHTML.replace(timeMatchRegExp, convertTime);
document.body.innerHTML = replaced;

// for(pg of paragraphs){
//     console.log(pg.innerHTML);
//     pg.innerHTML = pg.innerHTML.replace(timeMatchRegExp, "[THIS IS A TIME]");
// }

function convertTime(timeString){
    let now = new Date();
    // convert string to date
    let timeArray = timeString.split(/:|\s/);
    // console.log(`Hours ${timeArray[0]}`)

    let timeZone = now.toLocaleString("en-US", {timeZone : timeArray[timeArray.length - 1]})
    let convertedTime = new Date();
    console.log("converted time pre-convert: " + convertedTime)

    if(timeString.match(/P.?M.?/i)){
        convertedTime.setHours(timeArray[0] + 12);
    }
    else{
        convertedTime.setHours(timeArray[0]);
    }
    

    // This is a little messy, since it will evaluate these expressions unnecessarily
    // maybe we could do this by mapping the different setMinutes etc. functions to a map, and then using the index
    // to access them that way. that way we can just break out of a loop when one is NaN.
    let index = 1
    console.log("converted time post-hours: " + convertedTime)
    if(!isNaN(parseInt(timeArray[index]))){
        // console.log(`minutes: ${timeArray[1]}`)
        convertedTime.setMinutes(timeArray[index])
        index++;
    }

    if(!isNaN(parseInt(timeArray[index]))){
        convertedTime.setSeconds(timeArray[index])
        index++;
    }
    
    if(!isNaN(parseInt(timeArray[index]))){
        convertedTime.setMilliseconds(timeArray[index])
        index++;
    }

    convertedTime.setUTCHours(0);

    

    // let formattedDate = convertedTime.toLocaleString("en-US", {timeZone : timeArray[index + 1]})
    // convertedTime = new Date(formattedDate);

    console.log("final time: " + convertedTime);

    // console.log(timeString);
    return "<span class=\"time-replace\">[TIME]</span>";
}
