/**
 * Gmail API Utility Module
 * Handles all Gmail API interactions with proper error handling
 */

const GmailAPI = (() => {
    const API_BASE = 'https://www.googleapis.com/gmail/v1';

    /**
     * Get the access token from Chrome storage
     */
    async function getAccessToken() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['accessToken'], (result) => {
                if (result.accessToken) {
                    resolve(result.accessToken);
                } else {
                    reject(new Error('No access token found'));
                }
            });
        });
    }

    /**
     * Make API request to Gmail API
     */
    async function apiRequest(method, path, data = null) {
        try {
            let token = await getAccessToken();
            const url = `${API_BASE}${path}`;
            const options = {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            if (data) {
                options.body = JSON.stringify(data);
            }

            let response = await fetch(url, options);
            
            // If 401, try to refresh token and retry once
            if (response.status === 401) {
                console.warn('[API] Got 401, attempting to refresh token...');
                try {
                    token = await Auth.refreshToken();
                    options.headers['Authorization'] = `Bearer ${token}`;
                    response = await fetch(url, options);
                } catch (refreshError) {
                    console.error('[API] Token refresh failed:', refreshError);
                    // If refresh fails, clear token and reject
                    chrome.storage.local.remove('accessToken');
                    throw new Error('Authentication expired. Please sign in again.');
                }
            }
            
            // Handle 403 - Permission denied (check after retry)
            if (response.status === 403) {
                console.error('[API] Got 403 Forbidden - Insufficient permissions');
                throw new Error('403');
            }
            
            if (!response.ok) {
                console.error(`[API] HTTP ${response.status}: ${response.statusText}`);
                throw new Error(`${response.status}`);
            }

            // Handle 204 No Content and other empty responses
            if (response.status === 204 || response.headers.get('content-length') === '0') {
                console.log('[API] Empty response (204 No Content)');
                return {};
            }

            // Parse JSON only if there's actual content
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return {};
        } catch (error) {
            console.error('Gmail API Error:', error);
            throw error;
        }
    }

    /**
     * Get user's email address
     */
    async function getUserProfile() {
        return apiRequest('GET', '/users/me/profile');
    }

    /**
     * Get labels (categories)
     */
    async function getLabels() {
        const data = await apiRequest('GET', '/users/me/labels');
        return data.labels || [];
    }

    /**
     * Get label statistics (email count)
     */
    async function getLabelStats(labelId) {
        const data = await apiRequest('GET', `/users/me/labels/${labelId}`);
        return {
            id: data.id,
            name: data.name,
            messagesTotal: data.messagesTotal || 0,
            messagesUnread: data.messagesUnread || 0
        };
    }

    /**
     * Get messages for a label
     */
    async function getMessagesByLabel(labelId, maxResults = 10) {
        const path = `/users/me/messages?labelIds=${labelId}&maxResults=${maxResults}`;
        return apiRequest('GET', path);
    }

    /**
     * Get message details
     */
    async function getMessage(messageId) {
        return apiRequest('GET', `/users/me/messages/${messageId}`);
    }

    /**
     * Get thread details (conversation)
     */
    async function getThread(threadId) {
        return apiRequest('GET', `/users/me/threads/${threadId}`);
    }

    /**
     * List messages by query
     */
    async function listMessages(query = '', maxResults = 10) {
        const encodedQuery = encodeURIComponent(query);
        const path = `/users/me/messages?q=${encodedQuery}&maxResults=${maxResults}`;
        return apiRequest('GET', path);
    }

    /**
     * Archive messages (move to archive/all mail)
     */
    async function archiveMessages(messageIds) {
        if (!messageIds || messageIds.length === 0) {
            throw new Error('No messages to archive');
        }
        
        const batchData = {
            ids: messageIds,
            removeLabelIds: ['INBOX']
        };
        return apiRequest('POST', '/users/me/messages/batchModify', batchData);
    }

    /**
     * Delete messages permanently
     */
    async function deleteMessages(messageIds) {
        if (!messageIds || messageIds.length === 0) {
            throw new Error('No messages to delete');
        }
        
        console.log('[API] deleteMessages called with', messageIds.length, 'message IDs');
        const batchData = {
            ids: messageIds
        };
        console.log('[API] batchDelete request data:', JSON.stringify(batchData).substring(0, 100) + '...');
        
        try {
            const result = await apiRequest('POST', '/users/me/messages/batchDelete', batchData);
            console.log('[API] batchDelete success');
            return result;
        } catch (error) {
            console.error('[API] batchDelete failed:', error.message);
            throw error;
        }
    }

    /**
     * Restore messages (add back to INBOX)
     */
    async function restoreMessages(messageIds) {
        const batchData = {
            requests: messageIds.map(id => ({
                addLabelIds: ['INBOX'],
                id: id
            }))
        };
        return apiRequest('POST', '/users/me/messages/batchModify', batchData);
    }

    /**
     * Get top senders
     */
    async function getTopSenders(maxResults = 20) {
        try {
            const response = await listMessages('', maxResults * 5);
            const senders = {};

            if (response.messages) {
                for (const message of response.messages) {
                    const fullMessage = await getMessage(message.id);
                    const headers = fullMessage.payload?.headers || [];
                    const fromHeader = headers.find(h => h.name === 'From');
                    
                    if (fromHeader) {
                        const from = fromHeader.value;
                        senders[from] = (senders[from] || 0) + 1;
                    }
                }
            }

            return Object.entries(senders)
                .map(([sender, count]) => ({ sender, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, maxResults);
        } catch (error) {
            console.error('Error getting top senders:', error);
            return [];
        }
    }

    /**
     * Scan inbox and get statistics
     */
    async function scanInbox() {
        try {
            const profile = await getUserProfile();
            const labels = await getLabels();

            const stats = {
                email: profile.emailAddress,
                totalEmails: profile.messagesTotal || 0,
                unread: profile.messagesUnread || 0,
                categories: {},
                lastScanned: new Date().toISOString()
            };

            // Get stats for important labels
            const labelNames = ['CATEGORY_PROMOTIONS', 'CATEGORY_SOCIAL', 'INBOX'];
            
            for (const labelName of labelNames) {
                const label = labels.find(l => l.id === labelName);
                if (label) {
                    const labelStats = await getLabelStats(labelName);
                    stats.categories[labelName] = labelStats;
                }
            }

            // Get emails older than 1 year
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            const timestamp = Math.floor(oneYearAgo.getTime() / 1000);
            
            const oldEmails = await listMessages(`before:${timestamp}`, 1);
            stats.oldEmails = oldEmails.resultSizeEstimate || 0;

            return stats;
        } catch (error) {
            console.error('Error scanning inbox:', error);
            throw error;
        }
    }

    return {
        getUserProfile,
        getLabels,
        getLabelStats,
        getMessagesByLabel,
        getMessage,
        getThread,
        listMessages,
        archiveMessages,
        deleteMessages,
        restoreMessages,
        getTopSenders,
        scanInbox
    };
})();

// Expose globally and log success
window.GmailAPI = GmailAPI;
console.log('[API] GmailAPI module loaded successfully');
