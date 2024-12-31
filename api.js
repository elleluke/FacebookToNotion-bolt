async function loadApiKeys() {
      try {
        const response = await fetch(chrome.runtime.getURL('apiKeys.json'));
        if (!response.ok) {
          throw new Error(`Failed to load apiKeys.json: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Error loading API keys:', error);
        return null;
      }
    }

    async function saveToNotion(data, tags, vertical) {
      const apiKeys = await loadApiKeys();
      if (!apiKeys) {
        console.error('API keys not loaded.');
        return false;
      }
      const notionApiKey = apiKeys.notion;
      const notionDatabaseId = 'YOUR_NOTION_DATABASE_ID';

      const notionData = {
        parent: { database_id: notionDatabaseId },
        properties: {
          'Ad Name': { title: [{ text: { content: data.adName } }] },
          'Creative Type': { select: { name: data.creativeType } },
          'Creative Link': { url: data.creativeSrc },
          'Ad Text': { rich_text: [{ text: { content: data.adText } }] },
          'CTA Button': { rich_text: [{ text: { content: data.ctaButton } }] },
          'Profile Link': { url: data.profileLink },
          'Pre-Landing Link': { url: data.preLandingLink },
          'Landing Link': { url: data.landingLink },
          'Tags': { rich_text: [{ text: { content: tags } }] },
          'Vertical': { rich_text: [{ text: { content: vertical } }] }
        }
      };

      try {
        const response = await fetch('https://api.notion.com/v1/pages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${notionApiKey}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
          },
          body: JSON.stringify(notionData)
        });

        if (!response.ok) {
          console.error('Error saving to Notion:', response.status, await response.text());
          return false;
        }
        return true;
      } catch (error) {
        console.error('Error saving to Notion:', error);
        return false;
      }
    }

    async function saveToGoogleDrive(creativeSrc, creativeType) {
      const apiKeys = await loadApiKeys();
      if (!apiKeys) {
        console.error('API keys not loaded.');
        return null;
      }
      const googleDriveApiKey = apiKeys.googleDrive;
      if (!creativeSrc) {
        console.log('No creative source to save.');
        return null;
      }

      try {
        const response = await fetch(creativeSrc);
        if (!response.ok) {
          console.error('Error fetching creative:', response.status, await response.text());
          return null;
        }
        const blob = await response.blob();
        const formData = new FormData();
        formData.append('file', blob, `creative.${creativeType === 'image' ? 'jpg' : 'mp4'}`);

        const driveResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${googleDriveApiKey}`
          },
          body: formData
        });

        if (!driveResponse.ok) {
          console.error('Error saving to Google Drive:', driveResponse.status, await driveResponse.text());
          return null;
        }
        const driveData = await driveResponse.json();
        return `https://drive.google.com/file/d/${driveData.id}`;
      } catch (error) {
        console.error('Error saving to Google Drive:', error);
        return null;
      }
    }

    export { saveToNotion, saveToGoogleDrive };
