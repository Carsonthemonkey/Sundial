const timeZones = {
    "CENTRAL" : "CST",
    "AKST" : "UTC-9",
    "HST" : "UTC-10",
    "ET" : "EST",
    "EASTERN" : "EST",
    "PACIFIC" : "PST",
    "PT" : "PST",
    "CET" : "UTC+1",
    "MSK" : "UTC+3",
    "IST" : "UTC+5:30",
    "JST" : "UTC+9",
    "AEDT" : "UTC+11",
    "NZDT" : "UTC+13",
    "BST" : "UTC+1",
}


const supportedTimezones = ["UTC","GMT","EST","CST","MST","PST","GMT","UTC"];

const style = document.createElement('style');
style.textContent = `
.time-replace{
    display: inline-block;
    border: 3px solid rgb(76, 91, 224);
    border-radius: 6px;
    padding: 0.3%;
}
    `

window.onload = sundial;

function sundial(){
    console.log("Sundial startup")
    document.head.appendChild(style)
    // const supportedElements = "p, h1, h2, h3, h4, h5, h6, a, span, b, div p";
    const supportedElements = "*"
    const timeMatchRegExp = /(\d{1,2})(:\d{2})?(:\d{2})?\s?(A.?M.?\s? | P.?M.?\s?)(UTC|GMT|ES?T|CST|MST|PST|AKST|HST|AEDT|BST|EASTERN|PACIFIC|CENTRAL)/gi;
    // let replaced = document.body.innerHTML.replace(timeMatchRegExp, convertTime);
    const elements = document.body.querySelectorAll(supportedElements);
    console.log(elements)
    for(let element of elements){
        for(let child of element.childNodes){
            if(child.nodeType === 3){
                const text = child.nodeValue;
                const replaced = text.replace(timeMatchRegExp, convertTime);
                if(replaced !== text){
                    element.innerHTML = replaced;
                    // element.replaceChild(document.createTextNode(replaced), child);
                }
            }
            
        }
    }
}

function timeToDate(timeString){
    timeString = timeString.replace(/\./g, '').toUpperCase();
    let timeArray = timeString.split(/:|[\s]+/);
    let formattedDate = "01 Jan 2023 ";
    console.log("timeArray: " + timeArray);
    let readAllTimes = false;
    //add hours to the date
    if(timeString.match(/P.?M.?/i)){
        formattedDate += (parseInt(timeArray[0])%12 + 12) + ":";
        console.log("12 test: " + formattedDate)
    }
    else{
        formattedDate += parseInt(timeArray[0]%12) + ":";
        console.log("12 test: " + formattedDate)
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
    let tz = timeArray[timeArray.length - 1];
    if(!supportedTimezones.includes(tz)){
        formattedDate += timeZones[tz];
    }
    else{
        formattedDate += tz;
    }
    
    console.log("formatted date: " + formattedDate);
    let date = new Date(Date.parse(formattedDate));
    return date
}

function convertTime(timeString){
    // let now = new Date();
    let date = timeToDate(timeString);
    console.log(typeof(date))
    console.log(`${date.toLocaleTimeString()}`)
    let shownDate = date.toLocaleTimeString()
    shownDate = shownDate.substring(0, shownDate.length - 6) + ' ' + shownDate.substring(shownDate.length - 2, shownDate.length)
    return `<span class=\"time-replace\">${shownDate}</span>`;
}
