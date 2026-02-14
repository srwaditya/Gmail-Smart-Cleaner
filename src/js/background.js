/**
 * Background Service Worker
 * Handles extension lifecycle and background tasks
 */

console.log('[BG] Background service worker loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('[BG] Gmail Smart Cleaner installed');
    }
});

// Open medium popup app when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
    console.log('[BG] Extension icon clicked, opening medium popup window');
    
    chrome.windows.create({
        url: chrome.runtime.getURL('src/html/fullscreen.html'),
        type: 'popup',
        width: 600,
        height: 700,
        focused: true
    }, (window) => {
        if (chrome.runtime.lastError) {
            console.error('[BG] Error creating window:', chrome.runtime.lastError);
        } else {
            console.log('[BG] Medium popup window opened successfully, ID:', window.id);
        }
    });
});

// Listen for messages from popup/fullscreen
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[BG] Message received:', request.action);
    
    if (request.action === 'getStats') {
        // Handle stats request
        sendResponse({ success: true });
    }
    return true;
});

