# Gmail Smart Cleaner – Chrome Extension

A safe, user-friendly Gmail inbox cleaner built with Manifest V3.

## 🎯 Features

✅ **Safe Inbox Cleanup**
- Preview before every action
- Archive (default) or delete emails
- Undo within 30 seconds

✅ **Smart Organization**
- Clean promotions, social, old emails
- Remove emails by sender
- View inbox statistics

✅ **Privacy First**
- Official Gmail API
- No email storage
- Minimal permissions

## 📁 Project Structure

```
gmail-smart-cleaner/
├── manifest.json          # Chrome extension config
├── src/
│   ├── css/
│   │   └── styles.css     # Global styling (Gmail-like UI)
│   ├── js/
│   │   ├── api.js         # Gmail API wrapper
│   │   ├── auth.js        # OAuth2 authentication
│   │   ├── ui.js          # UI rendering & logic
│   │   ├── popup.js       # Entry point
│   │   └── background.js  # Service worker
│   └── html/
│       └── popup.html     # Main popup template
├── assets/                # Icons & images
└── README.md
```

## 🚀 Setup Instructions

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Gmail API**
4. Create **OAuth 2.0 Desktop Application** credentials
5. Copy the **Client ID**
6. Update `manifest.json`:
   ```json
   "oauth2": {
     "client_id": "YOUR_CLIENT_ID_HERE.apps.googleusercontent.com"
   }
   ```

### 2. Add OAuth Redirect URI

In Google Cloud Console, add this redirect URI:
```
https://{EXTENSION_ID}.chromiumapp.org/
```

You'll get the extension ID after loading it in Chrome.

### 3. Load Extension in Chrome

1. Open `chrome://extensions/`
2. Enable **Developer mode** (top-right)
3. Click **Load unpacked**
4. Select the `gmail-smart-cleaner` folder
5. Copy the **Extension ID**
6. Update the redirect URI in Google Cloud Console with this ID

### 4. Set Permissions

In Google Cloud Console:
- Add **Chrome Extension** as authorized application
- Scopes: `https://www.googleapis.com/auth/gmail.modify`

## 🎨 UI Screens

### 1. Login Screen
- Google sign-in button
- Trust messaging
- No permissions asked yet

### 2. Inbox Dashboard
- Email statistics
- Quick clean buttons (Promotions, Social, Old)
- Top senders view
- Scan again button

### 3. Preview Modal
- Shows email count
- Recent examples
- Action choice (Archive/Delete)
- Confirm/Cancel buttons

### 4. Top Senders
- List of top email senders
- Email count per sender
- Clean button per sender

### 5. Settings
- Safety mode toggle
- Logout button
- Account info

### 6. Success Toast
- Confirmation message
- Undo button (30 seconds)

## 🔑 Key Features Explained

### Preview Before Action
Users always see what they're deleting before confirming.

### Archive by Default
First action is archive (safe), delete is optional.

### Undo Support
30-second undo window to restore archived/deleted emails.

### Top Senders
Shows most prolific senders for easy cleanup.

## 📦 API Integrations

### Gmail API
- Read emails & labels
- Get message statistics
- Archive/delete emails
- Restore emails (undo)

### Chrome Identity API
- OAuth2 authentication
- Token management

### Chrome Storage API
- Store access token
- Store user info
- Store undo data

## 🔒 Permissions Used

```json
{
  "permissions": [
    "identity",
    "identity.email",
    "storage"
  ],
  "host_permissions": [
    "https://www.googleapis.com/gmail/v1/*"
  ]
}
```

## 🛠️ Development

### File Sizes & Performance
- popup.html: < 1KB
- styles.css: < 15KB
- api.js: ~ 8KB
- ui.js: ~ 20KB
- Total: < 50KB (excluding assets)

### Browser Compatibility
- Chrome 88+
- Edge 88+

## 📝 Privacy Policy

[Include privacy policy URL]

The extension:
- Uses official Gmail API
- Never stores emails locally
- Only accesses what user allows
- No analytics or tracking

## 🚀 Publishing to Chrome Web Store

1. Prepare **extension package**
2. Create developer account
3. Submit listing with screenshots
4. Add privacy policy URL
5. Wait for review (~2-4 days)

## 📄 License

MIT License

## 👤 Author

Created with ❤️ for Gmail users

---

**Need Help?**
- Check Chrome extension logs: `chrome://extensions/`
- Enable Developer Mode to see errors
- Review Gmail API quota limits

