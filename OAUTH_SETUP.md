# GOOGLE OAUTH SETUP GUIDE

## Step-by-Step Setup for Gmail Smart Cleaner

### Phase 1: Create Google Cloud Project

#### 1.1 Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account (create if needed)

#### 1.2 Create New Project
1. Click **Select a Project** (top-left)
2. Click **NEW PROJECT**
3. Name: `Gmail Smart Cleaner`
4. Click **CREATE**
5. Wait for project to be created (1-2 minutes)

#### 1.3 Select Your Project
- Once created, click **SELECT PROJECT**
- You're now in the Gmail Smart Cleaner project

---

### Phase 2: Enable Gmail API

#### 2.1 Enable API
1. In left sidebar, go to **APIs & Services**
2. Click **ENABLED APIS & SERVICES**
3. Click **+ ENABLE APIS AND SERVICES** (top)
4. Search for: `Gmail API`
5. Click on **Gmail API**
6. Click **ENABLE**

#### 2.2 Verify Enabled
- You should see "Gmail API" with blue checkmark
- Status shows: "API enabled"

---

### Phase 3: Create OAuth Credentials

#### 3.1 Go to Credentials
1. In left sidebar, click **Credentials**
2. Click **+ CREATE CREDENTIALS** (top)
3. Select **OAuth client ID**

#### 3.2 Configure Consent Screen (First Time)
If prompted to create consent screen:
1. Click **CREATE CONSENT SCREEN**
2. Select **External** (for testing)
3. Click **CREATE**
4. Fill form:
   - **App name**: Gmail Smart Cleaner
   - **User support email**: your-email@gmail.com
   - **Developer contact**: your-email@gmail.com
5. Click **SAVE AND CONTINUE**

#### 3.3 Add Scopes
1. Click **ADD OR REMOVE SCOPES**
2. Search: `gmail.modify`
3. Select: `https://www.googleapis.com/auth/gmail.modify`
4. Click **UPDATE**
5. Click **SAVE AND CONTINUE**

#### 3.4 Add Test Users (Optional)
1. Click **ADD USERS**
2. Add your test email addresses
3. Click **SAVE AND CONTINUE**

#### 3.5 Review & Finish
- Review all settings
- Click **BACK TO DASHBOARD**

---

### Phase 4: Create OAuth Client

#### 4.1 Create Credentials Again
1. In left sidebar, click **Credentials**
2. Click **+ CREATE CREDENTIALS** (top)
3. Select **OAuth client ID**

#### 4.2 Choose Application Type
1. Select **Chrome App** (or **Web application** if Chrome App unavailable)
2. Name: `Gmail Smart Cleaner Extension`
3. Click **CREATE**

#### 4.3 Copy Your Credentials
A modal shows:
- **Client ID** (copy this!)
- **Client Secret** (save securely)

**Example:**
```
Client ID: 123456789-abc123def456.apps.googleusercontent.com
```

#### 4.4 Save Credentials
- Click **DOWNLOAD** to get JSON file
- Save it securely (you'll need the Client ID)

---

### Phase 5: Get Extension ID from Chrome

#### 5.1 Load Extension (Unfinished)
1. Open `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select `gmail-smart-cleaner` folder
5. Extension loads with a temporary ID

#### 5.2 Copy Extension ID
- You'll see Extension ID like: `abcdefghijklmnopqrstuvwxyz123456`
- **Copy this** (you need it for redirect URI)

---

### Phase 6: Configure Redirect URIs

#### 6.1 Add Redirect URI to Google Console
1. Go back to Google Cloud Console
2. Go to **Credentials**
3. Click your OAuth Client (the one you created)
4. Click **Edit** (pencil icon)
5. Under **Authorized redirect URIs**, click **+ ADD URI**
6. Paste:
   ```
   https://{YOUR_EXTENSION_ID}.chromiumapp.org/
   ```
   (Replace {YOUR_EXTENSION_ID} with your actual ID)

**Example:**
```
https://abcdefghijklmnopqrstuvwxyz123456.chromiumapp.org/
```

7. Click **SAVE**

---

### Phase 7: Update manifest.json

#### 7.1 Update Client ID
1. Open `manifest.json` in your extension
2. Find section:
   ```json
   "oauth2": {
     "client_id": "YOUR_CLIENT_ID_HERE.apps.googleusercontent.com"
   }
   ```
3. Replace with your actual Client ID:
   ```json
   "oauth2": {
     "client_id": "123456789-abc123def456.apps.googleusercontent.com"
   }
   ```
4. **Save the file**

---

### Phase 8: Reload Extension in Chrome

#### 8.1 Reload
1. Go to `chrome://extensions/`
2. Find **Gmail Smart Cleaner**
3. Click **Reload** (circular arrow icon)

#### 8.2 Test Sign-In
1. Click extension icon
2. Click **Sign in with Google**
3. Authorize the extension
4. Should show inbox dashboard

---

## Troubleshooting

### "Invalid Redirect URI"
✗ Problem: Redirect URI doesn't match Extension ID
✓ Solution: Verify extension ID matches in Google Console

### "Client ID is invalid"
✗ Problem: Wrong Client ID in manifest.json
✓ Solution: Copy exact Client ID from Google Console

### "Gmail API not enabled"
✗ Problem: API wasn't enabled in Google Cloud
✓ Solution: Go to APIs & Services, enable Gmail API

### "Authorization fails"
✗ Problem: Scopes don't match
✓ Solution: Ensure `gmail.modify` scope is in consent screen

### Extension ID keeps changing
✗ Problem: Loading unpacked changes ID
✓ Solution: Use temporary ID until publish

---

## Publishing to Chrome Web Store

### Final Steps Before Publishing

1. **Update Client ID**
   - Use production Client ID (not test)
   - Update manifest.json

2. **Add Privacy Policy**
   - Host privacy policy online
   - Add URL to manifest.json

3. **Create Screenshots**
   - 5 screenshots (1280x800px)
   - Show key features

4. **Upload to Store**
   - Create developer account ($5 one-time fee)
   - Upload extension package
   - Fill store listing
   - Wait for review (~2-4 days)

---

## Security Best Practices

✓ Never share Client Secret publicly
✓ Use different credentials for dev/prod
✓ Rotate credentials regularly
✓ Monitor API usage in Google Console
✓ Keep extension updated
✓ Review permissions quarterly

---

## Google API Quota Limits

**Free Tier:**
- 10M requests/day
- 1,000 requests/100s per user

**Typical Usage:**
- Scan inbox: 5-10 requests
- Clean emails: 1-2 requests
- Top senders: 20-50 requests

**Conclusion:** Free tier is sufficient for MVP

---

## Next Steps

1. ✅ Complete all 8 phases
2. ✅ Test sign-in & email cleanup
3. ✅ Create Chrome Web Store listing
4. ✅ Submit for review
5. ✅ Publish to public

---

Questions? Check:
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
