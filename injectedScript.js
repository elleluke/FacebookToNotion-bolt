function addButtonToAds() {
      const ads = document.querySelectorAll('div[role="article"]');
      ads.forEach(ad => {
        if (ad.querySelector('.custom-button')) return;

        const button = document.createElement('button');
        button.textContent = 'Extract Data';
        button.className = 'custom-button';
        button.style.cssText = 'margin-left: 10px; padding: 5px 10px; cursor: pointer;';

        button.addEventListener('click', function() {
          const adData = extractAdData(ad);
          chrome.runtime.sendMessage({
            action: 'dataExtracted',
            data: adData
          });
        });

        const actionsDiv = ad.querySelector('div[aria-label="Actions"]');
        if (actionsDiv) {
          actionsDiv.insertBefore(button, actionsDiv.firstChild);
        }
      });
    }

    function extractAdData(ad) {
      const creativeElement = ad.querySelector('img, video');
      const creativeType = creativeElement ? (creativeElement.tagName === 'IMG' ? 'image' : 'video') : 'none';
      const creativeSrc = creativeElement ? creativeElement.src || creativeElement.getAttribute('src') : null;
      const adText = ad.querySelector('div[dir="auto"] span')?.textContent || 'No description';
      const ctaButton = ad.querySelector('a[role="button"]')?.textContent || 'No CTA';
      const profileLink = ad.querySelector('a[role="link"]')?.href || 'No profile link';
      const preLandingLink = ad.querySelector('a[role="link"][target="_blank"]')?.href || 'No pre-landing link';
      const landingLink = ad.querySelector('a[role="link"][target="_blank"]')?.href || 'No landing link';
      const adName = ad.querySelector('div[dir="auto"]')?.textContent || 'No ad name';

      return {
        creativeType: creativeType,
        creativeSrc: creativeSrc,
        adText: adText,
        ctaButton: ctaButton,
        profileLink: profileLink,
        preLandingLink: preLandingLink,
        landingLink: landingLink,
        adName: adName
      };
    }

    function handleMessage(request) {
      if (request.action === 'sendDataToInjectedScript') {
        window.tags = request.tags;
        window.vertical = request.vertical;
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage);

    const observer = new MutationObserver(mutations => {
      addButtonToAds();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    addButtonToAds();
