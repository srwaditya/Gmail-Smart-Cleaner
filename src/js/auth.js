/**
 * Authentication Module
 * Handles Google OAuth2 sign-in and token management
 */

const Auth = (() => {
    const CLIENT_ID = '300402790441-p4ln082frlp5dbp9rls3ks1eine48suf.apps.googleusercontent.com';
    // Scopes must match what's declared in manifest.json oauth2.scopes
    const SCOPES = ['https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];

    /**
     * Check if user is already logged in
     */
    async function isLoggedIn() {
        return new Promise((resolve) => {
            // Add timeout to prevent infinite loading
            const timeout = setTimeout(() => {
                console.warn('[AUTH] isLoggedIn() timeout, assuming not logged in');
                resolve(false);
            }, 2000);
            
            try {
                chrome.storage.local.get(['accessToken', 'user'], (result) => {
                    clearTimeout(timeout);
                    if (chrome.runtime.lastError) {
                        console.error('[AUTH] Storage error:', chrome.runtime.lastError);
                        resolve(false);
                    } else {
                        resolve(!!(result && result.accessToken && result.user));
                    }
                });
            } catch (error) {
                clearTimeout(timeout);
                console.error('[AUTH] isLoggedIn error:', error);
                resolve(false);
            }
        });
    }

    /**
     * Get stored user info
     */
    async function getUser() {
        return new Promise((resolve) => {
            // Add timeout to prevent infinite loading
            const timeout = setTimeout(() => {
                console.warn('[AUTH] getUser() timeout, returning null');
                resolve(null);
            }, 2000);
            
            try {
                chrome.storage.local.get(['user'], (result) => {
                    clearTimeout(timeout);
                    if (chrome.runtime.lastError) {
                        console.error('[AUTH] Storage error:', chrome.runtime.lastError);
                        resolve(null);
                    } else {
                        resolve((result && result.user) || null);
                    }
                });
            } catch (error) {
                clearTimeout(timeout);
                console.error('[AUTH] getUser error:', error);
                resolve(null);
            }
        });
    }

    /**
     * Initiate Google OAuth2 sign-in
     */
    async function signIn() {
        return new Promise((resolve, reject) => {
            // Force re-authentication to get fresh token
            // Scopes come from manifest.json oauth2.scopes section
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                if (chrome.runtime.lastError) {
                    console.error('[AUTH] Sign-in error:', chrome.runtime.lastError.message);
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }

                if (token) {
                    console.log('[AUTH] Got auth token:', token.substring(0, 20) + '...');
                    // Store token and get user info
                    chrome.storage.local.set({ accessToken: token });
                    
                    // Get user profile
                    fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('[AUTH] User info fetched:', data.email);
                        chrome.storage.local.set({
                            user: {
                                email: data.email,
                                name: data.name,
                                picture: data.picture
                            }
                        });
                        resolve(data);
                    })
                    .catch(error => {
                        console.error('[AUTH] Error fetching user info:', error);
                        // Still resolve with basic user data even if profile fetch fails
                        resolve({ email: 'user@gmail.com', name: 'User' });
                    });
                } else {
                    reject(new Error('Failed to get auth token'));
                }
            });
        });
    }

    /**
     * Sign out user and clear all cached tokens
     */
    async function signOut() {
        return new Promise((resolve) => {
            // Get all stored tokens
            chrome.storage.local.get(null, (items) => {
                const token = items.accessToken;
                
                if (token) {
                    // Revoke token from all cached sessions
                    chrome.identity.removeCachedAuthToken({ token }, () => {
                        // Clear ALL storage including old credentials
                        chrome.storage.local.clear(() => {
                            // Also clear session storage
                            sessionStorage.clear();
                            localStorage.clear();
                            resolve();
                        });
                    });
                } else {
                    // Clear all storage even if no token found
                    chrome.storage.local.clear(() => {
                        sessionStorage.clear();
                        localStorage.clear();
                        resolve();
                    });
                }
            });
        });
    }

    /**
     * Clear all cached credentials and force re-auth
     * Use this to fix persistent old Client ID issues
     */
    async function clearAllCache() {
        return new Promise((resolve) => {
            // Get all tokens and revoke them
            chrome.identity.getAuthToken({ interactive: false }, (token) => {
                if (token) {
                    chrome.identity.removeCachedAuthToken({ token }, () => {
                        // Clear all storage
                        chrome.storage.local.clear(() => {
                            chrome.storage.session?.clear?.();
                            sessionStorage.clear();
                            localStorage.clear();
                            
                            // Reload extension
                            chrome.runtime.reload();
                            resolve();
                        });
                    });
                } else {
                    chrome.storage.local.clear(() => {
                        chrome.storage.session?.clear?.();
                        sessionStorage.clear();
                        localStorage.clear();
                        chrome.runtime.reload();
                        resolve();
                    });
                }
            });
        });
    }

    /**
     * Get current auth token
     */
    async function getToken() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['accessToken'], (result) => {
                resolve(result.accessToken || null);
            });
        });
    }

    /**
     * Refresh auth token if needed
     */
    async function refreshToken() {
        return new Promise((resolve, reject) => {
            // First try non-interactive refresh
            chrome.identity.getAuthToken({ interactive: false }, (token) => {
                if (chrome.runtime.lastError) {
                    console.warn('[AUTH] Non-interactive token refresh failed, trying interactive...');
                    
                    // If non-interactive fails, try interactive (requires user interaction)
                    chrome.identity.getAuthToken({ interactive: true }, (interactiveToken) => {
                        if (chrome.runtime.lastError) {
                            console.error('[AUTH] Interactive token refresh also failed:', chrome.runtime.lastError.message);
                            reject(new Error('Token refresh failed: ' + chrome.runtime.lastError.message));
                            return;
                        }

                        if (interactiveToken) {
                            chrome.storage.local.set({ accessToken: interactiveToken });
                            console.log('[AUTH] Token refreshed successfully (interactive)');
                            resolve(interactiveToken);
                        } else {
                            reject(new Error('Failed to refresh token (interactive)'));
                        }
                    });
                    return;
                }

                if (token) {
                    chrome.storage.local.set({ accessToken: token });
                    console.log('[AUTH] Token refreshed successfully (non-interactive)');
                    resolve(token);
                } else {
                    reject(new Error('Failed to refresh token'));
                }
            });
        });
    }

    /**
     * Debug OAuth configuration
     * Logs information helpful for troubleshooting
     */
    function debugInfo() {
        console.log('=== GMAIL SMART CLEANER - OAUTH DEBUG INFO ===');
        console.log('Client ID:', CLIENT_ID);
        console.log('Scopes:', SCOPES);
        
        // Get extension info
        chrome.runtime.getManifest && chrome.runtime.getManifest();
        const manifest = chrome.runtime.getManifest();
        console.log('Extension ID:', chrome.runtime.id);
        console.log('Manifest OAuth2 Client ID:', manifest.oauth2?.client_id);
        console.log('Match:', CLIENT_ID === manifest.oauth2?.client_id);
        
        console.log('=== NEXT STEPS ===');
        console.log('1. Check chrome://extensions/ for Extension ID');
        console.log('2. Verify in Google Cloud Console:');
        console.log('   - Go to APIs & Services → Credentials');
        console.log('   - Find your credential');
        console.log('   - Verify it is "Chrome App" type');
        console.log('   - Extension ID must match chrome://extensions/');
        console.log('3. See: CHROME_APP_OAUTH_FIX.txt for full setup');
    }

    return {
        isLoggedIn,
        getUser,
        signIn,
        signOut,
        getToken,
        refreshToken,
        debugInfo,
        clearAllCache
    };
})();

// Expose globally and log success
window.Auth = Auth;
console.log('[AUTH] Auth module loaded successfully');
