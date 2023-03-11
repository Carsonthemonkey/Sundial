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
.info-box {
    font-style: italic;
    font-size: 0.98em;
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
    color: rgb(9, 9, 9);
    border-radius: 0.5em;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s linear 0.2s, opacity 0.2s;
  }

.time-replace{
    border: 3px solid rgb(76, 91, 224);
    border-radius: 6px;
    padding: 0.3%;
    position: relative;
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
    // add popup element to document head
    const infoBox = document.createElement("span")
    infoBox.classList.add("info-box")
    infoBox.innerHTML = "ORIGINAL TIME"
    document.body.appendChild(infoBox)


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

    const timeReplaceElements = document.querySelectorAll(".time-replace");
    const originalTimeElements = document.querySelectorAll(".original-time");
    for(let timeReplaceElement of timeReplaceElements){
        timeReplaceElement.addEventListener("mouseover", (event) => {
            console.log("hovering over time replace element")
            let originalTime = "ORIGINAL TIME SET (ERROR)"
            //set info box text to original time
            infoBox.innerText = originalTime;
            //show info box
            infoBox.style.visibility = "visible";
            infoBox.style.opacity = "1";
            //place info box in the absolute center of the screen
            // infoBox.style.top = "50%";
            // infoBox.style.left = "50%";
            // infoBox.style.transform = "translate(-50%, -50%)";
            

            //get position of time replace element
            const timeReplaceElementPosition = event.target.getBoundingClientRect();
            // //get position of info box
            const infoBoxPosition = infoBox.getBoundingClientRect();
            // //set info box position to be above time replace element
            infoBox.style.top = (timeReplaceElementPosition.top - infoBoxPosition.height) + "px";
            // //set info box position to be centered with time replace element
            infoBox.style.left = (timeReplaceElementPosition.left + (timeReplaceElementPosition.width/2) - (infoBoxPosition.width/2)) + "px";
        })
    }
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
    return `<span class="original-time">${timeString}</span><span class=\"time-replace\">${shownDate}</span>`;
    // <span class="info-box">"${timeString}"</span></span>
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
