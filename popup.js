document.addEventListener('DOMContentLoaded', function() {
      const extractButton = document.getElementById('extractButton');
      extractButton.addEventListener('click', function() {
        const tags = document.getElementById('tags').value;
        const vertical = document.getElementById('vertical').value;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'extractData',
            tags: tags,
            vertical: vertical
          });
        });
      });
    });
