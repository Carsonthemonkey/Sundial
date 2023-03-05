chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
      text: "ON",
    });

    chrome.storage.sync.set({enableState: true});
  });

//add listener for messages from content script
// chrome.runtime.onMessage.addListener(handleMessage);
chrome.action.onClicked.addListener(toggleExtension);
/*
async function toggleExtension(tab){
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  const nextState = prevState === 'ON' ? 'OFF' : 'ON';
  if(nextState === 'ON'){
    chrome.tabs.sendMessage(tab.id, {message: "Enable"});
  }
  else if (nextState === 'OFF'){
    chrome.tabs.sendMessage(tab.id, {message: "Disable"});
  }

  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  })
} */

function toggleExtension(){
  chrome.storage.sync.get(['enableState']).then((result) => {
    let prevState = result.enableState;
    console.log("prevState: " + prevState);
    let newState = !prevState;
    console.log(newState);
    chrome.action.setBadgeText({
      text: newState ? 'ON' : 'OFF',
    });
    chrome.storage.sync.set({enableState: newState});
  });
}
// async function handleMessage(request, sender, sendResponse){
//     const enableState = await chrome.action.getBadgeText({ tabId: tab.id });
//     sendResponse({enableState: enableState == 'ON'})
// }