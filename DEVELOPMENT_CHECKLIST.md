# DEVELOPMENT CHECKLIST

## MVP Launch Checklist

Use this checklist to track progress from development to publication.

---

## PHASE 1: SETUP & OAUTH (CRITICAL)

### Google Cloud Setup
- [ ] Create Google Cloud Project
- [ ] Enable Gmail API
- [ ] Create OAuth Client ID (Chrome App)
- [ ] Add Redirect URI with Extension ID
- [ ] Update Client ID in `manifest.json`
- [ ] Test OAuth flow works

### Chrome Extension Setup
- [ ] Load unpacked in Chrome
- [ ] Extension ID visible
- [ ] Popup opens without errors
- [ ] Console shows no critical errors

**Status:** ___________

---

## PHASE 2: CORE FEATURES

### Authentication
- [ ] Google sign-in button works
- [ ] OAuth redirect succeeds
- [ ] User info displayed correctly
- [ ] Token stored securely
- [ ] Logout clears all data

### Dashboard
- [ ] Email stats load (total, unread)
- [ ] Category stats display (Promotions, Social, Old)
- [ ] Numbers update after scan
- [ ] "Scan Again" button refreshes data
- [ ] No API errors in console

### Quick Clean Actions
- [ ] Promotions button visible
- [ ] Social button visible
- [ ] Old emails button visible
- [ ] Each button opens preview modal

### Preview Modal
- [ ] Modal appears on click
- [ ] Shows email count
- [ ] Shows recent examples
- [ ] Archive/Delete radio buttons work
- [ ] Archive is default selected
- [ ] Cancel button closes modal
- [ ] Confirm executes action

### Action Execution
- [ ] Archive action succeeds
- [ ] Delete action succeeds
- [ ] Success toast appears
- [ ] Toast shows correct count
- [ ] No errors in console

### Undo Feature
- [ ] Undo button visible in toast
- [ ] Undo restores emails to inbox
- [ ] 30-second timeout works
- [ ] Toast auto-disappears after timeout
- [ ] Undo button disabled after timeout

### Top Senders
- [ ] Top senders screen loads
- [ ] Shows sender names & counts
- [ ] Sorted by count (highest first)
- [ ] Clean button per sender works
- [ ] Preview modal shows for sender

### Settings
- [ ] Settings page displays
- [ ] Safety Mode toggle shows (always ON)
- [ ] Account email displays
- [ ] Logout button visible
- [ ] Logout clears data & shows login

**Status:** ___________

---

## PHASE 3: POLISH & QUALITY

### UI/UX
- [ ] White background matches Gmail
- [ ] Font sizes readable
- [ ] Buttons have hover states
- [ ] Spacing looks professional
- [ ] No text overflow issues
- [ ] Mobile responsive (if applicable)

### Performance
- [ ] Popup opens in < 1 second
- [ ] Dashboard loads in < 3 seconds
- [ ] No lag when clicking buttons
- [ ] Background service worker stays active

### Error Handling
- [ ] Network errors handled gracefully
- [ ] Auth errors show user message
- [ ] API failures don't crash extension
- [ ] Clear error messages displayed

### Accessibility
- [ ] Buttons are keyboard navigable
- [ ] Color contrast sufficient
- [ ] Form labels present
- [ ] Modal can be closed with Escape key

**Status:** ___________

---

## PHASE 4: DOCUMENTATION

### README
- [ ] Installation instructions clear
- [ ] Features listed
- [ ] Folder structure documented
- [ ] API integrations explained
- [ ] Permissions justified

### OAuth Setup Guide
- [ ] Step-by-step instructions
- [ ] Screenshots/examples provided
- [ ] Troubleshooting section included
- [ ] Common mistakes addressed

### Privacy Policy
- [ ] Clear what data accessed
- [ ] Clear what not accessed
- [ ] Third-party services listed
- [ ] User rights explained
- [ ] Contact information provided

### Chrome Store Listing
- [ ] Extension name finalized
- [ ] Short description (≤132 chars)
- [ ] Long description compelling
- [ ] Keywords relevant
- [ ] Future features mentioned

### Quick Start Guide
- [ ] 5-minute setup process
- [ ] File structure explained
- [ ] Key features described
- [ ] Troubleshooting tips included

**Status:** ___________

---

## PHASE 5: TESTING

### Manual Testing
- [ ] Test fresh install
- [ ] Test sign-in flow
- [ ] Test all buttons work
- [ ] Test preview modal
- [ ] Test actual email cleanup
- [ ] Test undo on real emails
- [ ] Test top senders
- [ ] Test settings & logout

### Edge Cases
- [ ] Test with 0 emails in category
- [ ] Test with 100k+ emails
- [ ] Test API quota limits
- [ ] Test with slow network
- [ ] Test refresh mid-action

### Error Scenarios
- [ ] Network disconnection
- [ ] OAuth token expired
- [ ] Gmail API unavailable
- [ ] Invalid email addresses
- [ ] Undo after email deleted

### Browser Compatibility
- [ ] Chrome 88+
- [ ] Chrome 120+ (latest)
- [ ] Edge 88+
- [ ] Different user profiles

**Status:** ___________

---

## PHASE 6: ASSETS & BRANDING

### Icons
- [ ] 16x16 icon (favicon)
- [ ] 48x48 icon (extensions page)
- [ ] 128x128 icon (webstore)
- [ ] Icons are clear & recognizable

### Screenshots (5 required)
- [ ] Login screen (1280x800)
- [ ] Dashboard (1280x800)
- [ ] Quick clean (1280x800)
- [ ] Preview modal (1280x800)
- [ ] Top senders (1280x800)

### Branding
- [ ] Consistent color scheme
- [ ] Logo/icon visible
- [ ] Copy tone consistent
- [ ] "Gmail Smart Cleaner" branding

**Status:** ___________

---

## PHASE 7: CHROME STORE SUBMISSION

### Pre-Submission
- [ ] Create Chrome Web Store developer account
- [ ] Pay $5 registration fee
- [ ] Verify email address
- [ ] Read Chrome Web Store policies

### Listing Details
- [ ] Extension name finalized
- [ ] Short description completed
- [ ] Long description compelling
- [ ] Category: Productivity
- [ ] Language: English
- [ ] Content rating completed
- [ ] Privacy policy URL provided
- [ ] Support email provided

### Upload & Submission
- [ ] Extension package created (.zip)
- [ ] Package < 100MB
- [ ] All files included
- [ ] manifest.json valid
- [ ] Upload extension successfully
- [ ] Fill all required fields
- [ ] Review all information
- [ ] Submit for review

### Review Process
- [ ] Initial response (24-48 hours)
- [ ] Technical review passed
- [ ] Policy review passed
- [ ] Approval notification received
- [ ] Visible in Chrome Web Store

**Status:** ___________

---

## PHASE 8: LAUNCH & MONITORING

### Post-Launch
- [ ] Verify listing is live
- [ ] Test install from store
- [ ] Monitor user reviews
- [ ] Monitor user ratings
- [ ] Watch download count

### Initial Metrics (First Week)
- [ ] Target: 10+ downloads
- [ ] Target: 4.5+ star rating
- [ ] Target: 0 critical bugs reported

### Support
- [ ] Monitor review responses
- [ ] Respond to user questions
- [ ] Fix bugs quickly
- [ ] Publish updates

**Status:** ___________

---

## COMMON BLOCKERS & SOLUTIONS

### Chrome Store Rejection Reasons

❌ **"Unclear functionality"**
✓ Solution: Make copy crystal clear, add screenshots

❌ **"Privacy policy missing"**
✓ Solution: Host privacy policy, add URL to listing

❌ **"Auto-delete without consent"**
✓ Solution: Always show preview, require confirmation

❌ **"Misleading claims"**
✓ Solution: Test claims, use conservative language

❌ **"Excessive permissions"**
✓ Solution: Request only `gmail.modify`, not `gmail.readonly`

### Common Technical Issues

❌ **OAuth fails**
✓ Solution: Verify Client ID, Redirect URI, Scopes

❌ **API quota exceeded**
✓ Solution: Implement rate limiting, batch requests

❌ **Extension crashes**
✓ Solution: Check Service Worker logs, handle errors

---

## FINAL SIGN-OFF

### Before Launch Checklist

- [ ] All features working
- [ ] All tests passing
- [ ] No console errors
- [ ] Documentation complete
- [ ] Privacy policy finalized
- [ ] Screenshots created
- [ ] Assets optimized
- [ ] Store listing filled
- [ ] Reviewed by cofounder
- [ ] Ready to launch

### Launch Sign-Off

**Developer:** _________________________ **Date:** _________

**Reviewer:** __________________________ **Date:** _________

---

## POST-LAUNCH (OPTIONAL)

### Week 1-2 Monitoring
- [ ] Monitor 1st reviews
- [ ] Fix critical bugs
- [ ] Respond to user feedback
- [ ] Check analytics

### Month 1-3 Updates
- [ ] Add requested features
- [ ] Improve UI based on feedback
- [ ] Optimize API calls
- [ ] Plan paid version

### Long-term (6+ months)
- [ ] Pro plan launch
- [ ] Advanced features
- [ ] Performance improvements
- [ ] Localization

---

**Good luck with your launch! 🚀**
