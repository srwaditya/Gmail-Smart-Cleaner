/**
 * Authentication Module
 * Handles Google OAuth2 sign-in and token management
 */

const Auth = (() => {
    const CLIENT_ID = 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com';
    const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];

    /**
     * Check if user is already logged in
     */
    async function isLoggedIn() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['accessToken', 'user'], (result) => {
                resolve(!!(result.accessToken && result.user));
            });
        });
    }

    /**
     * Get stored user info
     */
    async function getUser() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['user'], (result) => {
                resolve(result.user || null);
            });
        });
    }

    /**
     * Initiate Google OAuth2 sign-in
     */
    async function signIn() {
        return new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }

                if (token) {
                    // Store token and get user info
                    chrome.storage.local.set({ accessToken: token });
                    
                    // Get user profile
                    fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
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
                        console.error('Error fetching user info:', error);
                        reject(error);
                    });
                } else {
                    reject(new Error('Failed to get auth token'));
                }
            });
        });
    }

    /**
     * Sign out user
     */
    async function signOut() {
        return new Promise((resolve) => {
            const token = localStorage.getItem('accessToken');
            
            if (token) {
                // Revoke token
                chrome.identity.removeCachedAuthToken({ token }, () => {
                    // Clear storage
                    chrome.storage.local.clear(() => {
                        resolve();
                    });
                });
            } else {
                chrome.storage.local.clear(() => {
                    resolve();
                });
            }
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
            chrome.identity.getAuthToken({ interactive: false }, (token) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }

                if (token) {
                    chrome.storage.local.set({ accessToken: token });
                    resolve(token);
                } else {
                    reject(new Error('Failed to refresh token'));
                }
            });
        });
    }

    return {
        isLoggedIn,
        getUser,
        signIn,
        signOut,
        getToken,
        refreshToken
    };
})();
