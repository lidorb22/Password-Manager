/*Background service worker*/

/*ביצוע הפניה ומילוי אוטומטי*/
async function redirectAndAutofill(link, username, password) {
  try {
   
    const tab = await chrome.tabs.create({ url: link, active: true });
    await waitForTabToLoad(tab.id);
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: "autofill",
      username,
      password,
    });

    return response;
  } catch (error) {
    console.error("Autofill error:", error);
    return {
      success: false,
      error: error.message || "Failed to autofill credentials",
    };
  }
}

/*המתנה לטעינה מלאה של החלון*/
function waitForTabToLoad(tabId) {
  return new Promise((resolve) => {
    const listener = (updatedTabId, changeInfo) => {
      if (updatedTabId === tabId && changeInfo.status === "complete") {
        chrome.tabs.onUpdated.removeListener(listener);
        setTimeout(resolve, 1000);
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "redirectAndAutofill") {
    // הפעלת הפונקציה הראשית
    redirectAndAutofill(
      message.link,
      message.username,
      message.password
    ).then((result) => {
      sendResponse(result);
    });

    return true;
  }
});