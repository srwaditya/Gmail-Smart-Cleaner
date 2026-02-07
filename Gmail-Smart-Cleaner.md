
DATA USAGE DISCLOSURE
Gmail Smart Cleaner Chrome Extension

═══════════════════════════════════════════════════════════════════════════

PRIVACY POLICY - DATA COLLECTION & USAGE

This document outlines what user data Gmail Smart Cleaner collects, uses,
and stores. All disclosures below reflect the most up-to-date content of
our privacy practices.

═══════════════════════════════════════════════════════════════════════════

DATA COLLECTION BY CATEGORY:

1. PERSONALLY IDENTIFIABLE INFORMATION ✓ COLLECTED
   ─────────────────────────────────────────────────────────────────────
   
   WHAT WE COLLECT:
   • User's email address (from Gmail account)
   • User's display name (from Gmail profile)
   
   HOW WE USE IT:
   • Display in extension UI ("Hi user@gmail.com")
   • Confirm correct account is logged in
   • Link with Gmail API requests
   
   WHERE IT'S STORED:
   • Locally in chrome.storage.local
   • NOT transmitted to external servers
   • NOT shared with third parties
   
   HOW LONG:
   • Until user signs out or clears extension data
   • Deleted immediately upon sign out

2. HEALTH INFORMATION ✗ NOT COLLECTED
   ─────────────────────────────────────────────────────────────────────
   Extension does not collect any health, medical, or biological data.

3. FINANCIAL & PAYMENT INFORMATION ✗ NOT COLLECTED
   ─────────────────────────────────────────────────────────────────────
   Extension does not collect credit cards, banking info, or payment data.
   No transactions or financial information accessed.

4. AUTHENTICATION INFORMATION ⚠ PARTIALLY COLLECTED
   ─────────────────────────────────────────────────────────────────────
   
   WHAT WE COLLECT:
   • OAuth 2.0 access tokens (from Google)
   • NOT passwords (OAuth is password-less)
   
   HOW WE USE IT:
   • Authenticate API requests to Gmail
   • Authorize email operations
   • Verify user identity
   
   WHERE IT'S STORED:
   • Locally in chrome.storage.local
   • Encrypted by Chrome OS
   • NOT transmitted to our servers
   • NOT stored on any cloud service
   
   SECURITY:
   • Google controls token generation
   • Tokens expire automatically (1 hour)
   • Users can revoke access anytime
   • Tokens never logged or exposed

5. PERSONAL COMMUNICATIONS ✓ LIMITED ACCESS
   ─────────────────────────────────────────────────────────────────────
   
   WHAT WE ACCESS:
   • Email metadata only (sender, subject, date)
   • NOT email body content
   • NOT email attachments
   • NOT message text
   
   HOW WE USE IT:
   • Display email list for preview before archiving
   • Show email statistics (unread count, large emails)
   • List top senders
   • Allow users to archive selected emails
   
   WHERE IT'S STORED:
   • Only in browser memory during session
   • NOT persisted to storage
   • NOT logged
   • NOT transmitted to external servers
   
   USER CONTROL:
   • Users see preview before any action
   • Users explicitly select which emails to archive
   • Users can undo for 30 seconds

6. LOCATION DATA ✗ NOT COLLECTED
   ─────────────────────────────────────────────────────────────────────
   Extension does not access GPS, IP address, or location information.
   (IP address used only by Google API for standard HTTPS connection)

7. WEB HISTORY ✗ NOT COLLECTED
   ─────────────────────────────────────────────────────────────────────
   Extension does not monitor, log, or store browsing history.
   Extension only runs in the popup window, not on web pages.

8. USER ACTIVITY ✗ NOT COLLECTED
   ─────────────────────────────────────────────────────────────────────
   Extension does NOT collect:
   • Keystroke logging
   • Mouse tracking
   • Screen capture
   • Network monitoring
   • Scroll tracking
   • Click analytics (beyond user interaction within extension)

9. WEBSITE CONTENT ✗ NOT COLLECTED
   ─────────────────────────────────────────────────────────────────────
   Extension does not:
   • Monitor other websites
   • Read website content
   • Inject code into web pages
   • Access page titles or metadata
   • Monitor user's web visits

═══════════════════════════════════════════════════════════════════════════

DATA STORAGE SUMMARY:

✓ LOCALLY STORED (on user's device only):
  • OAuth access token
  • User email address
  • User display name
  • Extension settings/preferences
  • Undo state (30-second timer)
  
  Location: chrome.storage.local
  Encryption: Chrome handles encryption
  Visibility: Only this extension can access

✗ NOT STORED ON SERVERS:
  • No cloud backup
  • No server-side logging
  • No analytics collection
  • No tracking pixels

✗ NOT SHARED WITH THIRD PARTIES:
  • Google gets API requests (standard OAuth flow)
  • No data broker partnerships
  • No ads networks
  • No user profiling companies

═══════════════════════════════════════════════════════════════════════════

DATA ACCESS & PERMISSION LEVELS:

Who can access user data?
  1. Google (via Gmail API for emails)
     - Only what's necessary for API calls
     - Standard OAuth security
     - User can revoke anytime
  
  2. User's own browser/device
     - Local storage only
     - Encrypted by OS/Chrome
  
  3. NO ONE ELSE
     - Not developers
     - Not advertisers
     - Not analytics services

═══════════════════════════════════════════════════════════════════════════

USER CONTROLS & PRIVACY PROTECTIONS:

1. SIGN OUT
   • Immediately deletes all stored data
   • OAuth token revoked from Google
   • Extension cannot access Gmail

2. CLEAR DATA
   • Chrome extensions → Details → Clear all site data
   • Removes all locally stored information

3. REVOKE GOOGLE ACCESS
   • https://myaccount.google.com/permissions
   • Remove "Gmail Smart Cleaner" access anytime
   • Blocks all future API requests

4. UNDO PROTECTION
   • 30-second window to undo any action
   • Prevents accidental data loss
   • User explicitly confirms before archive

5. PRIVACY MODE
   • Extension respects Chrome privacy settings
   • No tracking across sessions
   • No fingerprinting

═══════════════════════════════════════════════════════════════════════════

THIRD-PARTY SERVICES:

Gmail API (Google)
  • Required for core functionality
  • Governed by Google's Privacy Policy
  • User data sent only for API operations
  • Link: https://policies.google.com/privacy

No other third-party services are integrated.

═══════════════════════════════════════════════════════════════════════════

DATA DELETION:

Automatic Deletion:
  • OAuth tokens expire after 1 hour of non-use
  • Session data cleared on browser restart (optional)
  • Undo state deleted after 30 seconds

Manual Deletion:
  • Sign Out: deletes all extension data
  • Clear all site data: removes everything
  • Uninstall extension: removes all traces

Google Data:
  • Email metadata remains in Gmail
  • Archived emails recoverable for 30 days
  • User can restore from "All Mail" folder

═══════════════════════════════════════════════════════════════════════════

FUTURE DATA COLLECTION:

This extension will NOT collect:
  ✗ Analytics or usage metrics
  ✗ Crash reports with data
  ✗ User behavior tracking
  ✗ Advertising data
  ✗ Email content (beyond metadata)
  ✗ Personal information beyond what's listed above

Potential Future Features (if added):
  • Cloud sync (optional, user must opt-in)
  • Backup restoration (optional, user must opt-in)
  • Statistics dashboard (local only)

Any new data collection will:
  1. Require user explicit consent
  2. Be disclosed in updated privacy policy
  3. Follow Chrome Web Store guidelines
  4. Respect minimal data collection principle

═══════════════════════════════════════════════════════════════════════════

COMPLIANCE & STANDARDS:

✓ GDPR Compliant
  • Minimal data collection
  • User controls
  • Data deletion options
  • Transparent practices

✓ Chrome Web Store Requirements
  • Limited permissions
  • Data usage justified
  • No deceptive practices
  • Privacy policy available

✓ Security Best Practices
  • OAuth 2.0 (no password storage)
  • Local-only storage
  • No data transmission to non-Google servers
  • Secure token handling

═══════════════════════════════════════════════════════════════════════════

CONTACT & PRIVACY QUESTIONS:

For privacy concerns or questions:
  • Review this document
  • Check Chrome Web Store listing
  • Check manifest.json permissions
  • Review source code (open source)

═══════════════════════════════════════════════════════════════════════════

SUMMARY TABLE:

Data Type                      | Collected | Stored Locally | Shared | Necessary
─────────────────────────────────────────────────────────────────────────────
Email address                  |    ✓      |       ✓        |   ✗    |    ✓
Display name                   |    ✓      |       ✓        |   ✗    |    ✓
OAuth token                    |    ✓      |       ✓        |   ✗    |    ✓
Email metadata                 |    ✓      |    Memory      |   ✗    |    ✓
Settings/preferences           |    ✓      |       ✓        |   ✗    |    ✗
Undo state                     |    ✓      |       ✓        |   ✗    |    ✓
─────────────────────────────────────────────────────────────────────────────
Health data                    |    ✗      |       -        |   -    |    ✗
Financial data                 |    ✗      |       -        |   -    |    ✗
Location data                  |    ✗      |       -        |   -    |    ✗
Web history                    |    ✗      |       -        |   -    |    ✗
Keystroke logging              |    ✗      |       -        |   -    |    ✗
Analytics                      |    ✗      |       -        |   -    |    ✗

═══════════════════════════════════════════════════════════════════════════

LAST UPDATED: February 7, 2026
VERSION: 1.0.0

This privacy policy may be updated. Users will be notified of significant
changes before implementation.

═══════════════════════════════════════════════════════════════════════════
