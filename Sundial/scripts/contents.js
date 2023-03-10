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
    "PDT" : "UTC-7",
    "EDT" : "UTC-4",
    "PT" : "PST",
    "CET" : "UTC+1",
    "MSK" : "UTC+3",
    "IST" : "UTC+5:30",
    "JST" : "UTC+9",
    "AEDT" : "UTC+11",
    "NZDT" : "UTC+13",
    "BST" : "UTC+1",
    "HAWAII" : "UTC-10",
    "ALASKA" : "UTC-9"
}

const css = `

.info-box{
    visibility: hidden;
    opacity: 0;
    font-style: italic;
    font-size: .98em;
    white-space: nowrap;
    font-weight: bold;
    font-family: 'Montserrat', sans-serif;
    padding: 12%;
    z-index: 9999;
    text-decoration: underline;
    text-underline-position: under;
    text-decoration-color: rgb(156, 156, 156);
    text-decoration-thickness: 2px;
    border: 3px solid rgb(219, 219, 219);
    background-color: rgb(238, 238, 238);
    background-color: rgb(#ff0000);
    color: rgb(9, 9, 9);
    border-radius: 0.5em;
    transition: all 0.2s ease-out;

    display: flex;
    justify-content: space-between;
    text-align: center;
    position: absolute;
    top: 0%;
    left: 50%;
    transform: translate(-50%, -100%);
}

.time-replace{
    border: 3px solid rgb(76, 91, 224);
    border-radius: 6px;
    padding: 0.3%;
    position: relative;
}

.time-replace:hover .info-box{
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, -115%);
}
`

let hasEditedPage = false;

const supportedTimezones = ["UTC","GMT","EST","CST","MST","PST","GMT","UTC"];

const timeReplaceStyle = document.createElement('style');
timeReplaceStyle.textContent = css;
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
    const supportedElements = "*"
    const timeMatchRegExp = /(\d{1,2})(:\d{2})?(:\d{2})?\s?(A.?M.?\s? | P.?M.?\s?)(UTC|GMT|ES?T|CST|MST|PS?T|AKST|HST|AEDT|BST|EASTERN|PACIFIC|CENTRAL|JST|CT|IST|NZDT|MSK|CET|MOUNTAIN|GREENWICH|INDIAN|HAWAII)/gi;
    // let replaced = document.body.innerHTML.replace(timeMatchRegExp, convertTime);
    const elements = document.body.querySelectorAll(supportedElements);
    //console.log(elements)
    for(let element of elements){
        for(let child of element.childNodes){
            if(child.nodeType === 3){
                const text = child.nodeValue;
                const replaced = text.replace(timeMatchRegExp, convertTime);
                if(replaced !== text){
                    const span = document.createElement("span");
                    span.innerHTML = replaced;
                    child.replaceWith(span);
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
    let readAllTimes = false;
    //add hours to the date
    if(timeString.match(/P.?M.?/i)){
        formattedDate += (parseInt(timeArray[0])%12 + 12) + ":";
    }
    else{
        formattedDate += parseInt(timeArray[0]%12) + ":";
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
    
    let date = new Date(Date.parse(formattedDate));
    return date
}

function convertTime(timeString){
    console.log(timeString)// Check for specific oscars cas for tracking down a bug
    
    let date = timeToDate(timeString);
    if(date.toDateString() != "Sun Jan 01 2023"){
        return timeString; 
    }
    let shownDate = date.toLocaleTimeString()
    shownDate = shownDate.substring(0, shownDate.length - 6) + ' ' + shownDate.substring(shownDate.length - 2, shownDate.length)
    return `<span class="original-time">${timeString}</span><span class=\"time-replace\">${shownDate}<span class="info-box">"${timeString}"</span></span>`;
    //<span></span>
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
