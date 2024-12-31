chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === 'extractData') {
        chrome.scripting.executeScript({
          target: { tabId: sender.tab.id },
          files: ['injectedScript.js']
        }, function() {
          chrome.tabs.sendMessage(sender.tab.id, {
            action: 'sendDataToInjectedScript',
            tags: request.tags,
            vertical: request.vertical
          });
        });
      }
    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === 'dataExtracted') {
        chrome.runtime.sendMessage({
          action: 'processData',
          data: request.data
        });
      }
    });
