chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
      text: "ON",
    });

    chrome.storage.sync.set({enableState: true});
  });


chrome.action.onClicked.addListener(toggleExtension);

//add listener for when current tab is focused
/*
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log("tab changed");
  chrome.storage.sync.get(['enableState']).then((result) => {
    enableState = result.enableState;
    (async () => {
      const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
      console.log("sending message");
      await chrome.tabs.sendMessage(tab.id, {message: enableState ? "Enable" : "Disable"});
      console.log("sent message");
    })();
  });
});*/

function toggleExtension(){
  chrome.storage.sync.get(['enableState']).then((result) => {
    let prevState = result.enableState;
    //console.log("prevState: " + prevState);
    let newState = !prevState;
    //console.log(newState);
    chrome.action.setBadgeText({
      text: newState ? 'ON' : 'OFF',
    });
    sendMessageToContentScript(newState ? "Enable" : "Disable");
    // (async () => {
    //   const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    //   if(!tab) return;
    //   //console.log(newState);
    //   await sendMessageToContentScript(newState ? "Enable" : "Disable");
    //   //await chrome.tabs.sendMessage(tab.id, {message: newState ? "Enable" : "Disable"});
    // })();

    chrome.storage.sync.set({enableState: newState});
  });
}

async function sendMessageToContentScript(message){
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  if(!tab) return false;
  chrome.tabs.sendMessage(tab.id, {message: message});
}
// async function handleMessage(request, sender, sendResponse){
//     const enableState = await chrome.action.getBadgeText({ tabId: tab.id });
//     sendResponse({enableState: enableState == 'ON'})
// }