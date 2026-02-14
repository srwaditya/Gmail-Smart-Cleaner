/**
 * Popup Script
 * Entry point for the extension popup
 */

console.log('[POPUP] Script loaded');

let retryCount = 0;
const MAX_RETRIES = 200; // 200 * 25ms = 5 seconds max wait

// Show initial loading screen
function showLoadingScreen() {
    const container = document.getElementById('app-container');
    if (container) {
        container.innerHTML = `
            <div id="loading-container" style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%; background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);">
                <div style="width: 48px; height: 48px; border: 4px solid #e8eaed; border-top: 4px solid #1f71b8; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="margin-top: 16px; font-size: 14px; color: #5f6368; font-weight: 500;">Loading...</p>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
    }
}

// Initialize the app
function startApp() {
    console.log('[POPUP] startApp() called, readyState:', document.readyState, 'retries:', retryCount);
    
    const container = document.getElementById('app-container');
    if (!container) {
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            setTimeout(startApp, 25);
            return;
        } else {
            console.error('[POPUP] Container not found after', retryCount, 'retries');
            showError('Container not found. Please reload.');
            return;
        }
    }
    
    // Check all modules loaded
    console.log('[POPUP] Module check:', {
        UI: typeof window.UI,
        Auth: typeof window.Auth,
        GmailAPI: typeof window.GmailAPI
    });
    
    if (!window.UI || typeof window.UI.init !== 'function') {
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log('[POPUP] Modules not ready, retrying... (attempt', retryCount, ')');
            setTimeout(startApp, 25);
            return;
        } else {
            console.error('[POPUP] Modules not loaded after', retryCount, 'retries');
            console.error('[POPUP] Window globals:', { UI: window.UI, Auth: window.Auth, GmailAPI: window.GmailAPI });
            showError('Failed to load extension modules. Check F12 console for errors.');
            return;
        }
    }
    
    console.log('[POPUP] All modules ready, initializing UI...');
    window.UI.init().catch(error => {
        console.error('[POPUP] UI.init() error:', error);
        showError('Error: ' + error.message);
    });
}

function showError(message) {
    const container = document.getElementById('app-container');
    if (container) {
        // Get script load status
        const scripts = document.querySelectorAll('script');
        let scriptInfo = 'Scripts loaded: ';
        scripts.forEach(s => {
            if (s.src) {
                scriptInfo += s.src.split('/').pop() + ' ';
            }
        });
        
        container.innerHTML = `
            <div id="error-container" style="padding: 40px 20px; text-align: center; color: #d33427; font-family: system-ui; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%; background: #fff;">
                <h3 style="margin-bottom: 16px; font-size: 18px;">⚠️ Error</h3>
                <p style="margin-bottom: 12px; color: #666; font-size: 14px;">${message}</p>
                <p style="font-size: 11px; color: #999; margin-bottom: 8px;">${scriptInfo}</p>
                <p style="font-size: 12px; color: #999; margin-bottom: 20px;">Check browser console (F12) for details</p>
                <button id="reload-btn" style="padding: 10px 20px; background: #1f71b8; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;">Reload</button>
            </div>
        `;
        
        // Add event listener to reload button
        const reloadBtn = document.getElementById('reload-btn');
        if (reloadBtn) {
            reloadBtn.addEventListener('click', () => location.reload());
        }
    }
}

// Show loading screen immediately
showLoadingScreen();

// Start when DOM is ready
if (document.readyState === 'loading') {
    console.log('[POPUP] DOM is loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[POPUP] DOMContentLoaded fired');
        setTimeout(startApp, 0);
    });
} else {
    // DOM already loaded
    console.log('[POPUP] DOM already loaded, starting immediately');
    setTimeout(startApp, 0);
}
