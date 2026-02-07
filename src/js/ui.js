/**
 * UI Module
 * Handles rendering all screens and components
 */

const UI = (() => {
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
        const container = document.getElementById('app-container');
        const loggedIn = await Auth.isLoggedIn();
        
        if (loggedIn) {
            appState.user = await Auth.getUser();
            showDashboard();
        } else {
            showLogin();
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
            alert('Sign-in failed: ' + error.message);
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
            document.getElementById('loading').innerHTML = '<p>Error loading inbox. Please try again.</p>';
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
        
        const quickCleanHtml = `
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #dadce0;">
            
            <h3 style="font-size: 14px; font-weight: 500; margin: 16px 0 12px 0;">Quick Clean</h3>
            
            <div class="action-item">
                <div>
                    <span class="action-item-label">🟡 Promotions</span>
                    <span class="action-item-count">${appState.stats.categories['CATEGORY_PROMOTIONS']?.messagesTotal?.toLocaleString() || 0} emails</span>
                </div>
                <button class="btn btn-soft" onclick="window.UI.showPreview('CATEGORY_PROMOTIONS', 'promotions')">Clean</button>
            </div>
            
            <div class="action-item">
                <div>
                    <span class="action-item-label">🔵 Social</span>
                    <span class="action-item-count">${appState.stats.categories['CATEGORY_SOCIAL']?.messagesTotal?.toLocaleString() || 0} emails</span>
                </div>
                <button class="btn btn-soft" onclick="window.UI.showPreview('CATEGORY_SOCIAL', 'social')">Clean</button>
            </div>
            
            <div class="action-item">
                <div>
                    <span class="action-item-label">🕒 Old Emails (1yr+)</span>
                    <span class="action-item-count">${appState.stats.oldEmails?.toLocaleString() || 0} emails</span>
                </div>
                <button class="btn btn-soft" onclick="window.UI.showOldEmailsPreview()">Clean</button>
            </div>
            
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #dadce0;">
            
            <h3 style="font-size: 14px; font-weight: 500; margin: 16px 0 12px 0;">Top Senders</h3>
            <button class="btn btn-soft" onclick="window.UI.showTopSenders()" style="width: 100%;">View & Clean by Sender</button>
        `;
        
        container.insertAdjacentHTML('beforeend', quickCleanHtml);
    }

    /**
     * Show preview modal
     */
    function showPreview(labelId, category, emailCount, examples = []) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const actionType = category === 'promotions' ? 'Promotions' : 
                          category === 'social' ? 'Social' :
                          'Old Emails (1yr+)';
        
        const icon = category === 'promotions' ? '🟡' :
                    category === 'social' ? '🔵' : '🕒';
        
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
                    <button class="btn btn-secondary" onclick="window.UI.closePreview()">Cancel</button>
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
                    <button class="btn btn-soft" onclick="window.UI.showDashboard()" style="width: 100%;">Back</button>
                </div>
            </div>
        `;
        
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
        senders.forEach(({ sender, count }) => {
            const senderName = sender.split('<')[0].trim() || sender;
            html += `
                <div class="action-item">
                    <div>
                        <span class="action-item-label">${senderName}</span>
                        <span class="action-item-count">${count} emails</span>
                    </div>
                    <button class="btn btn-soft" onclick="window.UI.showSenderPreview('${sender.replace(/'/g, "\\'")}', ${count})">Clean</button>
                </div>
            `;
        });
        
        container.innerHTML = html || '<p style="color: #5f6368;">No senders found</p>';
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
            
            if (appState.selectedAction.type === 'label') {
                const messages = await GmailAPI.getMessagesByLabel(
                    appState.selectedAction.labelId,
                    appState.selectedAction.emailCount
                );
                messageIds = messages.messages?.map(m => m.id) || [];
            } else if (appState.selectedAction.type === 'sender') {
                const messages = await GmailAPI.listMessages(`from:"${appState.selectedAction.sender}"`, 100);
                messageIds = messages.messages?.map(m => m.id) || [];
            }
            
            if (actionType === 'archive') {
                await GmailAPI.archiveMessages(messageIds);
            } else {
                await GmailAPI.deleteMessages(messageIds);
            }
            
            // Save undo data
            appState.undoData = {
                messageIds,
                actionType,
                timestamp: Date.now()
            };
            
            closePreview();
            showSuccess(appState.selectedAction.emailCount, messageIds.length);
        } catch (error) {
            console.error('Action error:', error);
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Confirm';
            alert('Error: ' + error.message);
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
                    <button class="btn btn-soft" onclick="window.UI.showDashboard()" style="width: 100%;">Back</button>
                </div>
            </div>
        `;
        
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
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
    window.UI = {
        init,
        showLogin,
        showDashboard,
        showPreview,
        closePreview,
        showOldEmailsPreview,
        showTopSenders,
        showSenderPreview,
        showSettings
    };

    return {
        init
    };
})();
