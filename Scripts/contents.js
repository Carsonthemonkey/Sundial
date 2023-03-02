

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

function timeToDate(timeString){
    let timeArray = timeString.split(/:|\s/)
    let formattedDate = "01 Jan 2023 "
    console.log("timeArray: " + timeArray)
    let readAllTimes = false
    //add hours to the date
    if(timeString.match(/P.?M.?/i)){
        formattedDate += (parseInt(timeArray[0]) + 12) + ":"
    }
    else{
        formattedDate += timeArray[0] + ":"
    }

    //add minutes
    if(!isNaN(timeArray[1]) && !readAllTimes){
        formattedDate += timeArray[1] + ":"
    }
    else{
        formattedDate += "00:"
        readAllTimes = true
    }

    //add seconds
    if(!isNaN(timeArray[2]) && !readAllTimes){
        formattedDate += timeArray[2] + ":"
    }
    else{
        formattedDate += "00 "
        readAllTimes = true
    }

    formattedDate += timeArray[timeArray.length - 1]
    console.log("formatted date: " + formattedDate);
    let date = new Date(Date.parse(formattedDate));
    return date
}

function convertTime(timeString){
    // let now = new Date();
    let date = timeToDate(timeString);
    console.log(typeof(date))
    console.log(`${date.toLocaleTimeString()}`)
    return `<span class=\"time-replace\">${date.toLocaleTimeString()}</span>`;
}
