/**
 * Background Service Worker
 * Handles extension lifecycle and background tasks
 */

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Gmail Smart Cleaner installed');
        // Open welcome page if needed
        chrome.tabs.create({ url: 'src/html/popup.html' });
    }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getStats') {
        // Handle stats request
        sendResponse({ success: true });
    }
});

// Keep service worker active
chrome.alarms.create('keepAlive', { periodInMinutes: 0.1 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'keepAlive') {
        // Service worker stays active
    }
});
