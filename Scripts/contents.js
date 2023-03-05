const timeZones = {
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
    "PT" : "PST",
    "CET" : "UTC+1",
    "MSK" : "UTC+3",
    "IST" : "UTC+5:30",
    "JST" : "UTC+9",
    "AEDT" : "UTC+11",
    "NZDT" : "UTC+13",
    "BST" : "UTC+1",
}

let hasEditedPage = false;

const supportedTimezones = ["UTC","GMT","EST","CST","MST","PST","GMT","UTC"];

const timeReplaceStyle = document.createElement('style');
timeReplaceStyle.textContent = `
.time-replace{
    border: 3px solid rgb(76, 91, 224);
    border-radius: 6px;
    padding: 0.3%;
}
    `
window.onload = startup;

function startup(){
    chrome.storage.sync.get('enableState').then((result) => {
        if(result.enableState){
            sundial();
        }
    });
}

//receive message from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("content script: " + request.message + "")
    if(request.message == "Enable" && !hasEditedPage){

        sundial();
    }
    else if(request.message == "Enable"){
        showReplacedTime();
        hideOriginalTime();
    }
    else{
        showOriginalTime();
        hideReplacedTime();
    }
});

//add listener for when current tab is focused (This probably needs to be moved to background.js)

function sundial(){
    document.head.appendChild(timeReplaceStyle)
    hasEditedPage = true;
    // const supportedElements = "p, h1, h2, h3, h4, h5, h6, a, span, b, div p";
    const supportedElements = "*"
    const timeMatchRegExp = /(\d{1,2})(:\d{2})?(:\d{2})?\s?(A.?M.?\s? | P.?M.?\s?)(UTC|GMT|ES?T|CST|MST|PS?T|AKST|HST|AEDT|BST|EASTERN|PACIFIC|CENTRAL|JST|CT|IST|NZDT|MSK|CET|MOUNTAIN|GREENWICH|INDIAN)/gi;
    // let replaced = document.body.innerHTML.replace(timeMatchRegExp, convertTime);
    const elements = document.body.querySelectorAll(supportedElements);
    //console.log(elements)
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
    hideOriginalTime();
}

function timeToDate(timeString){
    timeString = timeString.replace(/\./g, '').toUpperCase();
    let timeArray = timeString.split(/:|[\s]+/);
    let formattedDate = "01 Jan 2023 ";
    //console.log("timeArray: " + timeArray);
    let readAllTimes = false;
    //add hours to the date
    if(timeString.match(/P.?M.?/i)){
        formattedDate += (parseInt(timeArray[0])%12 + 12) + ":";
        //console.log("12 test: " + formattedDate)
    }
    else{
        formattedDate += parseInt(timeArray[0]%12) + ":";
        //console.log("12 test: " + formattedDate)
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
    
    //console.log("formatted date: " + formattedDate);
    let date = new Date(Date.parse(formattedDate));
    return date
}

function convertTime(timeString){
    // let now = new Date();
    let date = timeToDate(timeString);
    console.log(date.toDateString())
    if(date.toDateString() != "Sun Jan 01 2023"){ //This is kinda messy
        return timeString; 
    }
    //console.log(typeof(date))
    //console.log(`${date.toLocaleTimeString()}`)
    let shownDate = date.toLocaleTimeString()
    //console.log("Date: " + date.toDateString());
    shownDate = shownDate.substring(0, shownDate.length - 6) + ' ' + shownDate.substring(shownDate.length - 2, shownDate.length)

    //add hidden element with original time
    // let hiddenTime = document.createElement('span');
    // hiddenTime.style.display = "none";
    // hiddenTime.textContent = timeString;
    // document.body.appendChild(hiddenTime);

    
    return `<span class="original-time">${timeString}</span><span class=\"time-replace\">${shownDate}</span>`;
}

function showOriginalTime(){
    const originalTime = document.querySelectorAll('.original-time');
    for(let time of originalTime){
        time.style.display = "";
    }
}

function hideOriginalTime(){
    const originalTime = document.querySelectorAll('.original-time');
    for(let time of originalTime){
        console.log(time.style.display)
        time.style.display = "none";
    }
}

function showReplacedTime(){
    console.log("showing replaced time")
    const replacedTime = document.querySelectorAll('.time-replace');
    console.log(`found ${replacedTime.length} replaced times`)
    for(let time of replacedTime){
        time.style.display = "";
    }
}

function hideReplacedTime(){
    console.log("hiding replaced time")
    const replacedTime = document.querySelectorAll('.time-replace');
    for(let time of replacedTime){
        time.style.display = "none";
    }
}
