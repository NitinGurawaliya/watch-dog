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
  
  // Session management to prevent duplicate tracking
  const sessionKey = `wvm_session_${siteId}`;
  const lastTrackKey = `wvm_last_track_${siteId}`;
  
  // Check if we should track this visit
  function shouldTrack() {
    const now = Date.now();
    const lastTrack = localStorage.getItem(lastTrackKey);
    const sessionId = localStorage.getItem(sessionKey);
    
    // If no session exists, create one
    if (!sessionId) {
      const newSessionId = `${siteId}_${now}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(sessionKey, newSessionId);
      localStorage.setItem(lastTrackKey, now.toString());
      return true;
    }
    
    // If last track was more than 30 minutes ago, treat as new session
    if (lastTrack && (now - parseInt(lastTrack)) > 30 * 60 * 1000) {
      const newSessionId = `${siteId}_${now}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(sessionKey, newSessionId);
      localStorage.setItem(lastTrackKey, now.toString());
      return true;
    }
    
    // If we tracked in the last 5 minutes, don't track again
    if (lastTrack && (now - parseInt(lastTrack)) < 5 * 60 * 1000) {
      return false;
    }
    
    // Update last track time
    localStorage.setItem(lastTrackKey, now.toString());
    return true;
  }
  
  // Get visitor information
  function getVisitorInfo() {
    const sessionId = localStorage.getItem(sessionKey);
    return {
      projectId: siteId,
      pageUrl: window.location.href,
      referrer: document.referrer || '',
      userAgent: navigator.userAgent,
      sessionId: sessionId || '',
      ip: '', // Will be detected server-side
      country: 'Unknown', // Will be detected server-side
      city: 'Unknown' // Will be detected server-side
    };
  }
  
  // Send tracking data
  function track() {
    // Only track if we should
    if (!shouldTrack()) {
      return;
    }
    
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
  
  // Track on page load only
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', track);
  } else {
    track();
  }
  
  // Track on page visibility change only if it's been more than 5 minutes
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      const now = Date.now();
      const lastTrack = localStorage.getItem(lastTrackKey);
      
      // Only track if it's been more than 5 minutes since last track
      if (!lastTrack || (now - parseInt(lastTrack)) > 5 * 60 * 1000) {
        track();
      }
    }
  });
  
  // Don't track on beforeunload as it's unreliable and creates duplicates
  
})(); 