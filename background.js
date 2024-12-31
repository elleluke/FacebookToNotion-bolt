import { saveToNotion, saveToGoogleDrive } from './api.js';

    chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
      if (request.action === 'processData') {
        const adData = request.data;
        const tags = window.tags;
        const vertical = window.vertical;

        console.log('Extracted data:', adData);
        console.log('Tags:', tags);
        console.log('Vertical:', vertical);

        const driveLink = await saveToGoogleDrive(adData.creativeSrc, adData.creativeType);
        if (driveLink) {
          adData.driveLink = driveLink;
        }

        const notionSuccess = await saveToNotion(adData, tags, vertical);
        if (notionSuccess) {
          console.log('Data saved to Notion successfully.');
        } else {
          console.error('Failed to save data to Notion.');
        }
      }
    });
