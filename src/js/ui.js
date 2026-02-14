/**
 * UI Module
 * Handles rendering all screens and components
 */

console.log('[UI] Script file loaded');

const UI = (() => {
    console.log('[UI] IIFE started');
    let currentScreen = null;
    let appState = {
        user: null,
        stats: null,
        selectedAction: null,
        undoData: null,
        undoTimeout: null
    };

    /**
     * Initialize app
     */
    async function init() {
        try {
            console.log('[UI] init() called');
            const container = document.getElementById('app-container');
            
            if (!container) {
                console.error('[UI] app-container element not found!');
                throw new Error('UI container not found in page');
            }
            
            console.log('[UI] Container found, clearing loading state');
            // Clear loading screen
            container.innerHTML = '';
            
            // Check Auth module
            if (typeof Auth === 'undefined' || !Auth) {
                console.error('[UI] Auth module not found!', { window_Auth: typeof window.Auth });
                throw new Error('Auth module not loaded');
            }
            
            // Check GmailAPI module
            if (typeof GmailAPI === 'undefined' || !GmailAPI) {
                console.error('[UI] GmailAPI module not found!', { window_GmailAPI: typeof window.GmailAPI });
                throw new Error('GmailAPI module not loaded');
            }
            
            console.log('[UI] All modules loaded, checking login status...');
            
            // Check login status with shorter timeout (1.5 seconds)
            let loggedIn = false;
            try {
                loggedIn = await Promise.race([
                    Auth.isLoggedIn(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Auth check timeout')), 1500))
                ]);
            } catch (authError) {
                console.warn('[UI] Auth check failed or timed out:', authError.message);
                loggedIn = false;
            }
            
            console.log('[UI] User logged in:', loggedIn);
            
            if (loggedIn) {
                console.log('[UI] Loading user data...');
                try {
                    appState.user = await Promise.race([
                        Auth.getUser(),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('User data timeout')), 1500))
                    ]);
                    console.log('[UI] User data loaded:', appState.user);
                } catch (userError) {
                    console.warn('[UI] Failed to load user data:', userError.message);
                    appState.user = null;
                }
                
                if (appState.user) {
                    console.log('[UI] Showing dashboard...');
                    showDashboard();
                } else {
                    console.log('[UI] User data missing, showing login screen');
                    showLogin();
                }
            } else {
                console.log('[UI] User not logged in, showing login screen');
                showLogin();
            }
        } catch (error) {
            console.error('[UI] Initialization failed:', error);
            console.log('[UI] Stack trace:', error.stack);
            const container = document.getElementById('app-container');
            if (container) {
                container.innerHTML = `
                    <div id="init-error" style="padding: 40px 20px; text-align: center; color: #d33427; font-family: system-ui; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%; background: #fff;">
                        <h3 style="margin-bottom: 16px; font-size: 18px;">⚠️ Initialization Error</h3>
                        <p style="margin-bottom: 12px; color: #666; font-size: 14px;">${error.message}</p>
                        <p style="font-size: 12px; color: #999; margin-bottom: 20px;">Check browser console (F12) for details</p>
                        <button id="init-retry-btn" style="padding: 10px 20px; background: #1f71b8; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;">Retry</button>
                    </div>
                `;
                
                // Add event listener
                const retryBtn = document.getElementById('init-retry-btn');
                if (retryBtn) {
                    retryBtn.addEventListener('click', () => location.reload());
                }
            }
            throw error;
        }
    }

    /**
     * Render login screen
     */
    function showLogin() {
        currentScreen = 'login';
        const container = document.getElementById('app-container');
        
        container.innerHTML = `
            <div class="container">
                <div class="content login-screen">
                    <div class="logo">✉️</div>
                    <h2>Gmail Smart Cleaner</h2>
                    <p>Clean your inbox safely.</p>
                    <p>Preview before every action.</p>
                    
                    <button class="btn btn-primary" id="signin-btn">
                        Sign in with Google
                    </button>
                    
                    <div class="trust-points">
                        <div><span class="checkmark">✓</span> No auto-delete</div>
                        <div><span class="checkmark">✓</span> Undo available</div>
                        <div><span class="checkmark">✓</span> You stay in control</div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('signin-btn').addEventListener('click', handleSignIn);
    }

    /**
     * Handle sign in
     */
    async function handleSignIn() {
        const btn = document.getElementById('signin-btn');
        btn.disabled = true;
        btn.textContent = 'Signing in...';
        
        try {
            const user = await Auth.signIn();
            appState.user = user;
            showDashboard();
        } catch (error) {
            console.error('Sign-in error:', error);
            btn.disabled = false;
            btn.textContent = 'Sign in with Google';
            
            // Enhanced error handling with detailed guidance
            let errorMsg = error.message;
            
            if (errorMsg.includes('bad client id') || errorMsg.includes('{0}')) {
                // OAuth credential not properly configured as Chrome App
                errorMsg = `🔧 Bad Client ID Error\n\n
SOLUTION:\n\n
OPTION 1 - Clear Cache & Try Again:\n
1. Press Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)\n
2. Select "All time" and all checkboxes\n
3. Click "Clear data"\n
4. Reload extension: chrome://extensions/ refresh button (↻)\n
5. Try signing in again\n\n
OPTION 2 - Full Reset:\n
1. Go to: chrome://extensions/\n
2. Remove "Gmail Smart Cleaner"\n
3. Run: Auth.clearAllCache() in browser console\n
4. Reload extension\n\n
OPTION 3 - Verify Client ID Setup:\n
1. Check manifest.json has Client ID:\n
   "client_id": "300402790441-p4ln082frlp5dbp9rls3ks1eine48suf.apps.googleusercontent.com"\n
2. Verify in Google Cloud Console:\n
   • Go to: console.cloud.google.com\n
   • APIs & Services → Credentials\n
   • Check credential type is "Chrome App"\n
   • Extension ID matches chrome://extensions/\n\n
🐛 Debug: Open console (F12), run Auth.debugInfo()\n
📖 Full guide: FIX_BAD_CLIENT_ID.txt`;
            } else if (errorMsg.includes('OAuth2 request failed')) {
                // General OAuth failure
                errorMsg = `⚠️ OAuth Sign-in Failed\n\n
${errorMsg}\n\n
QUICK FIX:\n
1. Clear browser cache:\n
   Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)\n
2. Reload extension:\n
   chrome://extensions/ → refresh (↻)\n
3. Try signing in again\n\n
IF STILL FAILING:\n
• Verify Gmail API is enabled in Google Cloud\n
• Check credential type is "Chrome App"\n
• Run Auth.debugInfo() in console\n\n
📖 See: FIX_BAD_CLIENT_ID.txt`;
            } else if (errorMsg.includes('permission')) {
                errorMsg = '🚫 Permission Denied\n\nGoogle blocked this sign-in.\n\nSOLUTION:\n1. Go to: myaccount.google.com/permissions\n2. Find and remove "Gmail Smart Cleaner"\n3. Clear cache: Cmd+Shift+Delete\n4. Reload extension and try again';
            } else if (errorMsg.includes('Network') || errorMsg.includes('timeout')) {
                errorMsg = '🌐 Network Error\n\nCheck your internet connection and try again.';
            } else if (errorMsg.includes('popup')) {
                errorMsg = '📵 Popup Blocked\n\nYour browser blocked the sign-in popup.\n\nSOLUTION:\n1. Click popup blocker icon in address bar\n2. Allow popups for this extension\n3. Try signing in again';
            }
            
            alert('Sign-in Failed\n\n' + errorMsg);
        }
    }

    /**
     * Render dashboard
     */
    async function showDashboard() {
        currentScreen = 'dashboard';
        const container = document.getElementById('app-container');
        
        container.innerHTML = `
            <div class="container">
                <div class="header">
                    <h1>Hello, ${appState.user?.name?.split(' ')[0]} 👋</h1>
                    <p>Inbox Summary</p>
                </div>
                
                <div class="content">
                    <div id="loading" class="spinner"></div>
                    <div id="stats-container" style="display: none;"></div>
                </div>
                
                <div class="footer">
                    <button class="btn btn-soft" id="scan-btn" style="width: 100%;">Scan Again</button>
                    <button class="btn btn-soft" id="settings-btn" style="width: 100%;">Settings</button>
                </div>
            </div>
        `;
        
        try {
            const stats = await GmailAPI.scanInbox();
            appState.stats = stats;
            renderDashboardStats(stats);
        } catch (error) {
            console.error('Error scanning inbox:', error);
            const loadingDiv = document.getElementById('loading');
            
            // Check if it's an authentication error
            if (error.message.includes('expired') || error.message.includes('Authentication') || error.message.includes('401')) {
                loadingDiv.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <p style="color: #d33427; margin-bottom: 16px;">⚠️ Authentication expired</p>
                        <p style="color: #666; font-size: 14px; margin-bottom: 16px;">Your session has expired. Please sign in again.</p>
                        <button id="re-signin-btn" style="padding: 10px 20px; background: #1f71b8; color: white; border: none; border-radius: 4px; cursor: pointer;">Sign in Again</button>
                    </div>
                `;
                
                const reSignInBtn = document.getElementById('re-signin-btn');
                if (reSignInBtn) {
                    reSignInBtn.addEventListener('click', async () => {
                        try {
                            const user = await Auth.signIn();
                            appState.user = user;
                            showDashboard();
                        } catch (signInError) {
                            console.error('Re-sign in error:', signInError);
                            loadingDiv.innerHTML = '<p style="color: #d33427;">Sign-in failed. Please try again.</p>';
                        }
                    });
                }
            } else {
                loadingDiv.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <p style="color: #d33427; margin-bottom: 16px;">Error loading inbox</p>
                        <p style="color: #666; font-size: 14px; margin-bottom: 16px;">${error.message}</p>
                        <button id="retry-scan-btn" style="padding: 10px 20px; background: #1f71b8; color: white; border: none; border-radius: 4px; cursor: pointer;">Try Again</button>
                    </div>
                `;
                
                const retryScanBtn = document.getElementById('retry-scan-btn');
                if (retryScanBtn) {
                    retryScanBtn.addEventListener('click', showDashboard);
                }
            }
        }
        
        document.getElementById('scan-btn').addEventListener('click', showDashboard);
        document.getElementById('settings-btn').addEventListener('click', showSettings);
    }

    /**
     * Render dashboard statistics
     */
    function renderDashboardStats(stats) {
        const container = document.getElementById('stats-container');
        
        let html = `
            <div class="stat-card">
                <div class="stat-label">📩 Total Emails</div>
                <div class="stat-value">${stats.totalEmails?.toLocaleString()}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-label">🔔 Unread</div>
                <div class="stat-value">${stats.unread?.toLocaleString()}</div>
            </div>
        `;
        
        if (stats.categories['CATEGORY_PROMOTIONS']) {
            html += `
                <div class="stat-card">
                    <div class="stat-label">🟡 Promotions</div>
                    <div class="stat-value">${stats.categories['CATEGORY_PROMOTIONS'].messagesTotal?.toLocaleString()}</div>
                </div>
            `;
        }
        
        if (stats.categories['CATEGORY_SOCIAL']) {
            html += `
                <div class="stat-card">
                    <div class="stat-label">🔵 Social</div>
                    <div class="stat-value">${stats.categories['CATEGORY_SOCIAL'].messagesTotal?.toLocaleString()}</div>
                </div>
            `;
        }
        
        html += `
            <div class="stat-card">
                <div class="stat-label">🕒 Older than 1 year</div>
                <div class="stat-value">${stats.oldEmails?.toLocaleString()}</div>
            </div>
        `;
        
        container.innerHTML = html;
        document.getElementById('loading').style.display = 'none';
        document.getElementById('stats-container').style.display = 'block';
        
        // Show quick clean actions
        showQuickClean();
    }

    /**
     * Show quick clean actions
     */
    function showQuickClean() {
        const container = document.getElementById('stats-container');
        
        const promotionsCount = appState.stats.categories['CATEGORY_PROMOTIONS']?.messagesTotal?.toLocaleString() || 0;
        const socialCount = appState.stats.categories['CATEGORY_SOCIAL']?.messagesTotal?.toLocaleString() || 0;
        const oldEmailsCount = appState.stats.oldEmails?.toLocaleString() || 0;
        
        const quickCleanHtml = `
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #dadce0;">
            
            <h3 style="font-size: 14px; font-weight: 500; margin: 16px 0 12px 0;">Quick Clean Actions</h3>
            
            <div class="action-item" id="promotions-action">
                <div>
                    <span class="action-item-label">📧 Promotional Emails</span>
                    <span class="action-item-count">${promotionsCount} emails</span>
                </div>
                <button class="btn btn-soft clean-btn" data-label="CATEGORY_PROMOTIONS" data-category="promotions">Clean</button>
            </div>
            
            <div class="action-item" id="social-action">
                <div>
                    <span class="action-item-label">👥 Social & Networks</span>
                    <span class="action-item-count">${socialCount} emails</span>
                </div>
                <button class="btn btn-soft clean-btn" data-label="CATEGORY_SOCIAL" data-category="social">Clean</button>
            </div>
            
            <div class="action-item" id="old-emails-action">
                <div>
                    <span class="action-item-label">📅 Old Emails (6+ months)</span>
                    <span class="action-item-count">${oldEmailsCount} emails</span>
                </div>
                <button class="btn btn-soft clean-btn" data-label="old" data-category="old">Clean</button>
            </div>
            
            <div class="action-item" id="transactions-action">
                <div>
                    <span class="action-item-label">💳 Transaction Emails</span>
                    <span class="action-item-count">Auto-detect & manage</span>
                </div>
                <button class="btn btn-soft clean-btn" data-label="transactions" data-category="transactions">Clean</button>
            </div>
            
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #dadce0;">
            
            <h3 style="font-size: 14px; font-weight: 500; margin: 16px 0 12px 0;">Advanced Options</h3>
            <button class="btn btn-soft" id="top-senders-btn" style="width: 100%; margin-bottom: 12px;">View & Clean by Sender</button>
            <button class="btn btn-soft" id="scan-again-btn" style="width: 100%;">Scan Inbox Again</button>
        `;
        
        container.insertAdjacentHTML('beforeend', quickCleanHtml);
        
        // Add event listeners to all clean buttons
        document.querySelectorAll('.clean-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const label = this.getAttribute('data-label');
                const category = this.getAttribute('data-category');
                
                if (category === 'old') {
                    UI.showOldEmailsPreview();
                } else if (category === 'transactions') {
                    UI.showTransactionsPreview();
                } else {
                    UI.showPreview(label, category, appState.stats.categories[label]?.messagesTotal || 0, []);
                }
            });
        });
        
        // Add event listeners for advanced options
        const topSendersBtn = document.getElementById('top-senders-btn');
        if (topSendersBtn) {
            topSendersBtn.addEventListener('click', () => UI.showTopSenders());
        }
        
        const scanAgainBtn = document.getElementById('scan-again-btn');
        if (scanAgainBtn) {
            scanAgainBtn.addEventListener('click', () => UI.showDashboard());
        }
    }

    /**
     * Show preview modal
     */
    function showPreview(labelId, category, emailCount, examples = []) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const actionType = category === 'promotions' ? 'Promotional Emails' : 
                          category === 'social' ? 'Social & Networks' :
                          category === 'old' ? 'Old Emails (6+ months)' :
                          category === 'transactions' ? 'Transaction Emails' :
                          'Emails';
        
        const icon = category === 'promotions' ? '📧' :
                    category === 'social' ? '👥' : 
                    category === 'old' ? '📅' :
                    category === 'transactions' ? '💳' : '📬';
        
        overlay.innerHTML = `
            <div class="modal">
                <h3>You are about to clean:</h3>
                <h3 style="font-size: 18px; margin: 16px 0;">${icon} ${actionType}</h3>
                
                <div class="modal-content">
                    <p style="color: #5f6368; font-size: 13px;">Emails affected: <strong>${emailCount?.toLocaleString()}</strong></p>
                    
                    <p style="font-size: 13px; color: #5f6368; margin-top: 16px;">Recent examples:</p>
                    <div class="preview-list">
                        ${examples.length > 0 
                            ? examples.slice(0, 3).map(ex => `<div class="preview-item"><strong>${ex.subject || 'No subject'}</strong> – ${ex.from}</div>`).join('')
                            : '<div class="preview-item">No examples available</div>'
                        }
                    </div>
                    
                    <p style="font-size: 13px; color: #5f6368; margin-top: 16px;">Action:</p>
                    <div class="action-choice">
                        <label>
                            <input type="radio" name="action" value="archive" checked>
                            Archive
                        </label>
                        <label>
                            <input type="radio" name="action" value="delete">
                            Delete
                        </label>
                    </div>
                </div>
                
                <div class="modal-buttons">
                    <button class="btn btn-secondary" id="cancel-preview-btn">Cancel</button>
                    <button class="btn btn-primary" id="confirm-action-btn">Confirm</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        appState.selectedAction = {
            labelId,
            category,
            emailCount,
            type: 'label'
        };
        
        document.getElementById('confirm-action-btn').addEventListener('click', confirmAction);
        document.getElementById('cancel-preview-btn').addEventListener('click', closePreview);
    }

    /**
     * Show preview for transaction emails
     */
    function showTransactionsPreview() {
        const transactionEmails = appState.stats.categories['CATEGORY_UPDATES']?.messagesTotal || 0;
        showPreview('transactions', 'transactions', transactionEmails, [
            { subject: 'Order Confirmation #12345', from: 'orders@amazon.com' },
            { subject: 'Payment Receipt', from: 'payments@paypal.com' },
            { subject: 'Shipping Update', from: 'shipping@fedex.com' }
        ]);
    }

    /**
     * Show preview for old emails
     */
    async function showOldEmailsPreview() {
        showPreview('old', 'old', appState.stats.oldEmails, [
            { subject: 'Old email 1', from: 'sender@example.com' },
            { subject: 'Old email 2', from: 'another@example.com' }
        ]);
    }

    /**
     * Show top senders
     */
    async function showTopSenders() {
        currentScreen = 'senders';
        const container = document.getElementById('app-container');
        
        container.innerHTML = `
            <div class="container">
                <div class="header">
                    <h1>Top Senders</h1>
                    <p>Clean emails by sender</p>
                </div>
                
                <div class="content">
                    <div id="loading" class="spinner"></div>
                    <div id="senders-list" style="display: none;"></div>
                </div>
                
                <div class="footer">
                    <button class="btn btn-soft" id="back-to-dashboard-btn" style="width: 100%;">Back</button>
                </div>
            </div>
        `;
        
        // Add event listener
        document.getElementById('back-to-dashboard-btn').addEventListener('click', showDashboard);
        
        try {
            const senders = await GmailAPI.getTopSenders(10);
            renderSendersList(senders);
        } catch (error) {
            console.error('Error getting senders:', error);
            document.getElementById('loading').innerHTML = '<p>Error loading senders.</p>';
        }
    }

    /**
     * Render senders list
     */
    function renderSendersList(senders) {
        const container = document.getElementById('senders-list');
        
        let html = '';
        senders.forEach(({ sender, count }, index) => {
            const senderName = sender.split('<')[0].trim() || sender;
            html += `
                <div class="action-item">
                    <div>
                        <span class="action-item-label">${senderName}</span>
                        <span class="action-item-count">${count} emails</span>
                    </div>
                    <button class="btn btn-soft sender-clean-btn" data-sender="${sender}" data-count="${count}">Clean</button>
                </div>
            `;
        });
        
        container.innerHTML = html || '<p style="color: #5f6368;">No senders found</p>';
        
        // Add event listeners
        document.querySelectorAll('.sender-clean-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const sender = this.getAttribute('data-sender');
                const count = parseInt(this.getAttribute('data-count'));
                showSenderPreview(sender, count);
            });
        });
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('senders-list').style.display = 'block';
    }

    /**
     * Show preview for sender
     */
    function showSenderPreview(sender, count) {
        showPreview('sender', 'sender', count, [
            { subject: 'Email from sender', from: sender }
        ]);
        appState.selectedAction.sender = sender;
    }

    /**
     * Confirm action
     */
    async function confirmAction() {
        const actionType = document.querySelector('input[name="action"]:checked').value;
        const confirmBtn = document.getElementById('confirm-action-btn');
        
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Processing...';
        
        try {
            let messageIds = [];
            
            console.log('Selected action:', appState.selectedAction);
            
            if (appState.selectedAction.type === 'label') {
                console.log('Fetching messages for label:', appState.selectedAction.labelId);
                const messages = await GmailAPI.getMessagesByLabel(
                    appState.selectedAction.labelId,
                    Math.min(appState.selectedAction.emailCount, 100)
                );
                messageIds = messages.messages?.map(m => m.id) || [];
                console.log('Got message IDs:', messageIds.length);
                
                if (messageIds.length === 0) {
                    throw new Error('No messages found to ' + actionType);
                }
            } else if (appState.selectedAction.type === 'sender') {
                console.log('Fetching messages from sender:', appState.selectedAction.sender);
                const messages = await GmailAPI.listMessages(`from:"${appState.selectedAction.sender}"`, 100);
                messageIds = messages.messages?.map(m => m.id) || [];
                console.log('Got message IDs:', messageIds.length);
                
                if (messageIds.length === 0) {
                    throw new Error('No messages found from this sender');
                }
            } else if (appState.selectedAction.category === 'old') {
                console.log('Fetching old emails');
                const messages = await GmailAPI.listMessages('before:' + new Date(Date.now() - 180*24*60*60*1000).toISOString().split('T')[0], 100);
                messageIds = messages.messages?.map(m => m.id) || [];
            }
            
            if (messageIds.length === 0) {
                throw new Error('No messages to ' + actionType);
            }
            
            // Execute action
            if (actionType === 'archive') {
                console.log('Archiving messages:', messageIds.length);
                await GmailAPI.archiveMessages(messageIds);
            } else {
                console.log('Deleting messages:', messageIds.length);
                await GmailAPI.deleteMessages(messageIds);
            }
            
            // Save undo data
            appState.undoData = {
                messageIds,
                actionType,
                timestamp: Date.now()
            };
            
            closePreview();
            showSuccess(messageIds.length, messageIds.length);
        } catch (error) {
            console.error('Action error:', error);
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Confirm';
            
            // Handle different error types
            if (error.message.includes('403')) {
                alert('⚠️ Permission Denied\n\nYou need to grant Gmail modification permissions.\n\nPlease sign out and sign in again to grant the required permissions.');
                await Auth.signOut();
                showLogin();
            } else if (error.message.includes('401') || error.message.includes('expired')) {
                alert('⚠️ Authentication Expired\n\nPlease sign in again.');
                await Auth.signOut();
                showLogin();
            } else {
                alert('Error: ' + (error.message || 'Unknown error occurred'));
            }
        }
    }

    /**
     * Close preview
     */
    function closePreview() {
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    /**
     * Show success message
     */
    function showSuccess(count, actualCount) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-message">✅ ${actualCount} emails archived</div>
            <button class="btn btn-undo" id="undo-btn" style="margin: 0;">Undo</button>
        `;
        
        document.body.appendChild(toast);
        
        document.getElementById('undo-btn').addEventListener('click', handleUndo);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            toast.remove();
            appState.undoData = null;
        }, 5000);
    }

    /**
     * Handle undo
     */
    async function handleUndo() {
        if (!appState.undoData) return;
        
        try {
            const { messageIds, actionType } = appState.undoData;
            await GmailAPI.restoreMessages(messageIds);
            
            document.querySelector('.toast').remove();
            appState.undoData = null;
            
            showDashboard();
        } catch (error) {
            console.error('Undo error:', error);
            alert('Undo failed: ' + error.message);
        }
    }

    /**
     * Show settings
     */
    function showSettings() {
        currentScreen = 'settings';
        const container = document.getElementById('app-container');
        
        container.innerHTML = `
            <div class="container">
                <div class="header">
                    <h1>Settings</h1>
                </div>
                
                <div class="content">
                    <div class="settings-group">
                        <h4>Safety</h4>
                        <div class="setting-item">
                            <span class="setting-label">Safety Mode (Always ON)</span>
                            <div class="toggle active">
                                <div class="toggle-knob"></div>
                            </div>
                        </div>
                        <p style="font-size: 12px; color: #5f6368; margin-top: 8px;">Archive by default, preview required</p>
                    </div>
                    
                    <div class="settings-group">
                        <h4>Account</h4>
                        <p style="font-size: 13px; color: #202124; margin-bottom: 12px;">
                            <strong>Email:</strong> ${appState.user?.email}
                        </p>
                    </div>
                    
                    <div class="settings-group">
                        <h4>Actions</h4>
                        <button class="btn btn-secondary" id="logout-btn" style="width: 100%;">Logout</button>
                    </div>
                </div>
                
                <div class="footer">
                    <button class="btn btn-soft" id="back-from-settings-btn" style="width: 100%;">Back</button>
                </div>
            </div>
        `;
        
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
        document.getElementById('back-from-settings-btn').addEventListener('click', showDashboard);
    }

    /**
     * Handle logout
     */
    async function handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            await Auth.signOut();
            showLogin();
        }
    }

    // Expose methods globally
    console.log('[UI] About to create window.UI object');
    console.log('[UI] init function type:', typeof init);
    
    window.UI = {
        init,
        showLogin,
        showDashboard,
        showPreview,
        closePreview,
        showOldEmailsPreview,
        showTopSenders,
        showSenderPreview,
        showSettings,
        showTransactionsPreview
    };

    console.log('[UI] window.UI created successfully:', typeof window.UI);
    console.log('[UI] UI module loaded successfully');

    return window.UI;
})();
