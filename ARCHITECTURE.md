# GMAIL SMART CLEANER – ARCHITECTURE

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CHROME EXTENSION                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐                                        │
│  │   popup.html     │  ← Main UI entry point                │
│  │   (Main UI)      │     Width: 450px, Height: 600px       │
│  └────────┬─────────┘                                        │
│           │                                                  │
│           ├─────────────────────┬─────────────────────┐     │
│           │                     │                     │     │
│      ┌────▼──────┐      ┌───────▼────────┐   ┌──────▼──┐  │
│      │  api.js   │      │   auth.js      │   │  ui.js   │  │
│      │ (Gmail    │      │ (OAuth2 Sign   │   │ (Screen  │  │
│      │  API)     │      │  In/Out)       │   │  Render) │  │
│      └────┬──────┘      └────┬───────────┘   └──────┬───┘  │
│           │                  │                      │      │
│    ┌──────▼──────────────────▼──────────────────────▼──┐   │
│    │        Chrome Storage API                        │   │
│    │ (Access Token, User Info, Undo Data)            │   │
│    └──────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────┐                   │
│  │     background.js (Service Worker)  │ ← Keeps alive    │
│  │     (Manifest V3 required)          │                  │
│  └─────────────────────────────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS/OAuth2
                           │
        ┌──────────────────▼──────────────────┐
        │   Google Gmail API                   │
        ├──────────────────────────────────────┤
        │  • /users/me/profile                 │
        │  • /users/me/labels                  │
        │  • /users/me/messages                │
        │  • /users/me/messages/batchModify    │
        │  • /users/me/messages/batchDelete    │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │   User's Gmail Inbox                 │
        │  (23,482 emails)                     │
        └──────────────────────────────────────┘
```

---

## Data Flow Diagram

### Sign-In Flow
```
┌─────────────────┐
│  Click "Sign In"│
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ auth.js calls:          │
│ chrome.identity         │
│ .getAuthToken()         │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Google OAuth Dialog     │
│ User clicks "Allow"     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Token returned          │
│ Stored in Chrome        │
│ Storage (encrypted)     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ api.js gets profile     │
│ Stores user info        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ ui.js shows Dashboard   │
│ Ready to clean!         │
└─────────────────────────┘
```

### Cleanup Flow
```
┌──────────────────────┐
│ User clicks "Clean"  │
│ (Promotions)         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ ui.js shows          │
│ Preview Modal        │
│                      │
│ Shows:               │
│ • Count: 9,842       │
│ • Examples           │
│ • Action choice      │
└──────────┬───────────┘
           │
    ┌──────┴──────┐
    │             │
  Cancel        Confirm
    │             │
    │             ▼
    │    ┌────────────────────┐
    │    │ api.js:            │
    │    │ archiveMessages()  │
    │    │ or deleteMessages()│
    │    └────────┬───────────┘
    │             │
    │             ▼
    │    ┌────────────────────┐
    │    │ Gmail API call     │
    │    │ /batchModify or    │
    │    │ /batchDelete       │
    │    └────────┬───────────┘
    │             │
    │             ▼
    │    ┌────────────────────┐
    │    │ ui.js shows        │
    │    │ Success Toast      │
    │    │                    │
    │    │ ✅ 9,842 archived  │
    │    │ [Undo] (30 sec)    │
    │    └────────┬───────────┘
    │             │
    │    ┌────────┴────────┐
    │    │                 │
    │  Timeout          User clicks
    │    │             Undo
    │    │                 │
    │    ▼                 ▼
    │  Closes         api.js:
    │  Toast      restoreMessages()
    │             │
    └─────────────▼
            Done
```

---

## Module Responsibilities

### popup.html
- Single HTML template
- Div container for dynamic content
- Loads all JS modules
- 450x600px viewport

### styles.css
- Gmail-like white UI
- All component styling
- Colors, fonts, spacing
- Responsive design
- ~15KB file size

### api.js (Gmail API Wrapper)
```
Exports:
├── getUserProfile()      → Get user email
├── getLabels()          → Get categories
├── getLabelStats()      → Get email counts
├── getMessagesByLabel() → Get emails in category
├── listMessages()       → Search emails
├── archiveMessages()    → Move to All Mail
├── deleteMessages()     → Permanently delete
├── restoreMessages()    → Add back to Inbox
├── getTopSenders()      → Get sender list
└── scanInbox()          → Full inbox scan
```

### auth.js (OAuth2 Authentication)
```
Exports:
├── isLoggedIn()         → Check if user signed in
├── getUser()            → Get stored user info
├── signIn()             → Initiate Google sign-in
├── signOut()            → Logout (revoke token)
├── getToken()           → Get current token
└── refreshToken()       → Refresh if expired
```

### ui.js (Screen Rendering)
```
Screen Logic:
├── showLogin()          → Login screen
├── showDashboard()      → Dashboard with stats
├── showQuickClean()     → Quick clean buttons
├── showPreview()        → Modal (CRITICAL)
├── showTopSenders()     → Sender list
├── showSenderPreview()  → Sender preview
├── showSettings()       → Settings page
├── closePreview()       → Close modal
├── showSuccess()        → Toast notification
├── handleUndo()         → Restore emails
└── handleLogout()       → Logout handler
```

### popup.js
```
Simple entry point:
- Listen for DOMContentLoaded
- Call UI.init()
- That's it!
```

### background.js (Service Worker)
```
Manifest V3 required:
- Keep service worker alive
- Handle chrome.alarms
- Listen for messages
- Minimal code (can be enhanced)
```

---

## State Management

### App State (in UI.js)
```javascript
appState = {
  user: {
    email: "user@gmail.com",
    name: "John Doe",
    picture: "url..."
  },
  stats: {
    totalEmails: 23482,
    unread: 6120,
    categories: {...},
    oldEmails: 12890
  },
  selectedAction: {
    labelId: "CATEGORY_PROMOTIONS",
    category: "promotions",
    emailCount: 9842,
    type: "label"
  },
  undoData: {
    messageIds: [...],
    actionType: "archive",
    timestamp: 1707...
  }
}
```

### Chrome Storage
```javascript
chrome.storage.local = {
  accessToken: "ya29.a0...",        // OAuth token
  user: {                           // User info
    email: "user@gmail.com",
    name: "John",
    picture: "url"
  },
  // Undo data stored temporarily (cleared after 30 sec)
}
```

---

## API Request Flow

### Typical API Call Pattern
```
1. UI Layer (ui.js)
   └─> User clicks "Clean Promotions"

2. Call GmailAPI (api.js)
   └─> GmailAPI.archiveMessages(messageIds)

3. Get Auth Token (api.js)
   └─> chrome.storage.local.get('accessToken')

4. Make HTTPS Request (api.js)
   └─> fetch('https://www.googleapis.com/gmail/v1/...')
       Header: 'Authorization: Bearer {token}'

5. Handle Response (api.js)
   └─> return json() or throw error

6. Update UI (ui.js)
   └─> showSuccess() or alert error

7. Store Undo Data (ui.js)
   └─> appState.undoData = {...}
```

---

## Permissions Hierarchy

```
manifest.json
├── permissions (no dangerous ones)
│   ├── "identity"           ← OAuth sign-in only
│   ├── "identity.email"     ← Get email for display
│   └── "storage"            ← Store token locally
│
├── host_permissions (only Gmail API)
│   └── "https://www.googleapis.com/gmail/v1/*"
│
├── oauth2
│   ├── client_id            ← From Google Cloud
│   └── scopes
│       └── gmail.modify      ← Only scope needed
│
└── background
    └── service_worker       ← Manifest V3
```

---

## Security & Data Flow

```
┌─────────────────────────────────────────────────┐
│            User's Browser (Client)              │
│  ┌──────────────────────────────────────────┐  │
│  │  Gmail Smart Cleaner Extension           │  │
│  │  • popup.html (450px UI)                 │  │
│  │  • api.js (API calls)                    │  │
│  │  • auth.js (OAuth handling)              │  │
│  │  • ui.js (Screen rendering)              │  │
│  │  • background.js (Service worker)        │  │
│  └──────────────────────────────────────────┘  │
│              │                                   │
│              │ Encrypted by Chrome              │
│              ▼                                   │
│  ┌──────────────────────────────────────────┐  │
│  │  Chrome Storage (Local)                  │  │
│  │  • accessToken (encrypted)               │  │
│  │  • user (encrypted)                      │  │
│  │  • undo data (temporary)                 │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
              │
              │ HTTPS OAuth2 Token
              │
       ┌──────▼──────┐
       │ Google API  │
       │ oauth2/v2   │
       └──────┬──────┘
              │
       ┌──────▼──────────┐
       │ Gmail API       │
       │ /messages/*     │
       └──────┬──────────┘
              │
       ┌──────▼──────────┐
       │ User's Gmail    │
       │ (on Google      │
       │  servers)       │
       └─────────────────┘

KEY SECURITY POINTS:
✓ All communication HTTPS
✓ Token stored locally (encrypted by Chrome)
✓ No email content stored
✓ No password transmitted
✓ OAuth2 standard authentication
✓ Minimal permissions requested
```

---

## Performance Metrics

```
Operation              Expected Time
─────────────────────────────────────
1. Popup Open          < 1 second
2. OAuth Sign-In       ~2-3 seconds
3. Dashboard Load      < 2 seconds
4. Preview Modal       Instant (< 100ms)
5. Archive 10k Emails  ~5-10 seconds
6. Delete 10k Emails   ~5-10 seconds
7. Get Top Senders     ~10-15 seconds
8. Undo Action         < 5 seconds

API Calls per Operation:
─────────────────────────────────────
Dashboard Load         ~5 API calls
Quick Clean            ~1-2 API calls
Top Senders            ~20-50 API calls
Undo                   ~1 API call
```

---

## Error Handling Flow

```
Try API Call
    │
    ├─► Success
    │   └─► Update UI
    │       └─► Done
    │
    └─► Error
        ├─► Auth Error?
        │   └─► Refresh token or re-login
        │
        ├─► Network Error?
        │   └─► Show "Check connection"
        │
        ├─► API Error (429)?
        │   └─► Rate limit exceeded, retry later
        │
        └─► Unknown Error?
            └─► Show generic error message
```

---

## Chrome Store Submission Flow

```
┌──────────────────────────────────┐
│ Developer Submits Extension      │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Chrome Store Automated Check     │
│ • Manifest validation            │
│ • Permissions analysis           │
│ • Code scan for malware          │
└────────┬─────────────────────────┘
         │
         ├─► Issues Found?
         │   └─► Rejection email
         │       └─► Fix & Resubmit
         │
         ▼
┌──────────────────────────────────┐
│ Human Review (24-48 hours)       │
│ • Check for false claims         │
│ • Verify privacy policy          │
│ • Test UI/UX                     │
│ • Check policy compliance        │
└────────┬─────────────────────────┘
         │
         ├─► Policy Violation?
         │   └─► Rejection email
         │       └─► Modify & Resubmit
         │
         ▼
┌──────────────────────────────────┐
│ APPROVED ✅                      │
│ Published to Chrome Web Store    │
│ Public can now install           │
└──────────────────────────────────┘
```

---

This architecture is:
- ✅ Scalable (can add Pro features)
- ✅ Maintainable (clean modular code)
- ✅ Secure (OAuth2, minimal permissions)
- ✅ Performant (optimized API calls)
- ✅ Chrome Store compliant (Manifest V3)
