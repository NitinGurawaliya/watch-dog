(function() {
  'use strict';
  
  // Get the script tag to determine site ID and the API base URL
  const script = document.currentScript || document.querySelector('script[data-site]');
  if (!script) {
    console.warn("Who's Viewing Me: Tracking script not found.");
    return;
  }
  
  const siteId = script.getAttribute('data-site');
  if (!siteId) {
    console.warn("Who's Viewing Me: No 'data-site' attribute provided.");
    return;
  }
  
  // Determine the base URL from the script's own src to ensure correct API endpoint
  const scriptSrc = new URL(script.src);
  const baseUrl = scriptSrc.origin;
  const apiUrl = `${baseUrl}/api/track`;
  
  // Get visitor information
  function getVisitorInfo() {
    return {
      projectId: siteId,
      pageUrl: window.location.href,
      referrer: document.referrer || '',
      userAgent: navigator.userAgent,
      ip: '', // Will be detected server-side
      country: 'Unknown', // Will be detected server-side
      city: 'Unknown' // Will be detected server-side
    };
  }
  
  // Send tracking data
  function track() {
    const data = getVisitorInfo();
    
    // Send to our absolute tracking endpoint
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).catch(error => {
      // Silently fail to not affect user experience
      console.debug('Who\'s Viewing Me: Tracking failed', error);
    });
  }
  
  // Track on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', track);
  } else {
    track();
  }
  
  // Track on page visibility change (when user returns to tab)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      track();
    }
  });
  
  // Track on page unload (optional, may not always fire)
  window.addEventListener('beforeunload', track);
  
})(); 