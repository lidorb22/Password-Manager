/*
  Background Service Worker
*/


async function redirectAndAutofill(link, username, password) {
  try {
    /* 
      Normalize URL - users may save links without protocol
    */
    let url = link;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    /* Open the target site in a new tab */
    const tab = await chrome.tabs.create({ url, active: true });

    /* Wait until the page finishes loading before injecting credentials */
    await waitForTabToLoad(tab.id);

    /* 
      Send the credentials to the content script running in that tab.
    */
    const response = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(
        tab.id,
        { action: "autofill", username, password },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        }
      );
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

/*
  Wait for a tab to finish loading.
*/
function waitForTabToLoad(tabId) {
  return new Promise((resolve, reject) => {
    /* Timeout - if the page hasn't loaded after 15 seconds, give up */
    const timeout = setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      reject(new Error("Tab load timeout"));
    }, 15000);

    /* Listener - resolves when the tab reports status === "complete" */
    const listener = (updatedTabId, changeInfo) => {
      if (updatedTabId === tabId && changeInfo.status === "complete") {
        clearTimeout(timeout);
        chrome.tabs.onUpdated.removeListener(listener);
        setTimeout(resolve, 1000);
      }
    };

    chrome.tabs.onUpdated.addListener(listener);
  });
}

/*
  Listener - receives messages from the popup and routes them.
*/
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "redirectAndAutofill") {
    redirectAndAutofill(message.link, message.username, message.password).then(
      (result) => {
        sendResponse(result);
      }
    );

    return true;
  }
});