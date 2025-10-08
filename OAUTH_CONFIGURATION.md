# OAuth Configuration Guide

## Current Status: MVP Testing Mode ✅

### Firebase Authentication Setup

**Project:** glance-mvp
**Authentication Provider:** Google Sign-In
**Status:** ✅ Enabled

### Google Cloud API Key Configuration

**API Key:** `AIzaSyB1StvuF1cQaPQ8sArSZNUCKc9VyZwVUuU`

**Current Configuration (Development):**

- Application Restrictions: **None** (unrestricted for local development)
- API Restrictions: 24 APIs enabled

### OAuth Scopes - Current Implementation

**Active Scopes (Basic - No verification required):**

- ✅ `openid` - Standard OAuth identity
- ✅ `email` - User email address
- ✅ `profile` - User name and photo

**Disabled Scopes (Require Google OAuth Verification):**

- ⏸️ `https://www.googleapis.com/auth/gmail.readonly` - Gmail read access
- ⏸️ `https://www.googleapis.com/auth/calendar.readonly` - Calendar read access

**Location:** `src/hooks/useAuth.ts` lines 63-66

### Authorized Domains (Firebase)

**Console:** https://console.firebase.google.com/project/glance-mvp/authentication/settings

**Current Domains:**

- ✅ `localhost`
- ✅ `glance-mvp.firebaseapp.com`
- ✅ `glance-mvp.web.app`
- ✅ `glance-ruby.vercel.app`

### Environment Variables

**File:** `.env` (not committed to git)

```bash
VITE_FIREBASE_API_KEY=AIzaSyB1StvuF1cQaPQ8sArSZNUCKc9VyZwVUuU
VITE_FIREBASE_AUTH_DOMAIN=glance-mvp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=glance-mvp
VITE_FIREBASE_STORAGE_BUCKET=glance-mvp.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=722310039541
VITE_FIREBASE_APP_ID=1:722310039541:web:409742271c4dc3c84682bc
VITE_GOOGLE_CLIENT_ID=722310039541-jq3t8t78ieoj4qobnflo484vhcbl73q4.apps.googleusercontent.com
```

**⚠️ Important:** These same variables must be configured in Vercel:

- Vercel Dashboard → Settings → Environment Variables

---

## Production Deployment Checklist

### Before Going to Production:

#### 1. Re-enable API Key Restrictions

**Google Cloud Console:** https://console.cloud.google.com/apis/credentials?project=glance-mvp

**Recommended Website Restrictions:**

```
http://localhost/*
http://localhost:5173/*
https://glance-mvp.firebaseapp.com/*
https://glance-mvp.web.app/*
https://*.vercel.app/*
https://yourdomain.com/*
```

**Steps:**

1. Go to API Key settings
2. Select "HTTP referrers (web sites)"
3. Add all production domains
4. Click "Save"

#### 2. Submit for Google OAuth Verification

**When:** Before enabling Gmail and Calendar scopes

**Why:** Sensitive scopes require app verification

**Process:**

1. Go to Google Cloud Console → OAuth consent screen
2. Change from "Testing" to "In production"
3. Submit for verification
4. Provide:
   - Privacy Policy URL
   - Terms of Service URL
   - App homepage
   - Justification for each sensitive scope
   - YouTube demo video (optional but recommended)

**Timeline:** 4-6 weeks for approval

**Documentation:** https://support.google.com/cloud/answer/9110914

#### 3. Re-enable Sensitive Scopes

**File:** `src/hooks/useAuth.ts`

**Uncomment lines 65-66:**

```typescript
provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
```

**Also uncomment line 71:**

```typescript
access_type: 'offline', // Request refresh token
```

#### 4. Update Vercel Environment Variables

Ensure all `.env` variables are configured in Vercel:

- Dashboard → Your Project → Settings → Environment Variables
- Add each variable from `.env`
- Apply to: Production, Preview, Development

#### 5. Test OAuth Flow

**Test Scenarios:**

- ✅ Login from localhost
- ✅ Login from Vercel preview deployment
- ✅ Login from production domain
- ✅ Logout functionality
- ✅ Token refresh (if using offline access)
- ✅ Permission screen shows all scopes
- ✅ Error handling (popup closed, network error)

---

## Troubleshooting

### Error: "Requests from referer are blocked"

**Cause:** API Key restrictions are blocking the domain

**Solution:**

1. Check API Key restrictions in Google Cloud Console
2. Add missing domain to Website Restrictions
3. Wait 1-2 minutes for propagation
4. Clear browser cache and retry

### Error: "The requested action is invalid"

**Cause:** Mismatch between Client ID in code vs Firebase

**Solution:**

1. Verify Client ID in Firebase Console matches `.env`
2. Ensure Firebase Authentication → Google is enabled
3. Check that domain is in Authorized domains list

### Error: "This app isn't verified"

**Cause:** Using sensitive scopes without verification

**Solution:**

- For development: Click "Advanced" → "Go to Glance (unsafe)"
- For production: Submit app for verification (see section above)

### Error: "Popup blocked"

**Cause:** Browser popup blocker

**Solution:**

- User must allow popups for the site
- Show clear error message with instructions
- Already handled in `src/lib/auth/errors.ts`

---

## Next Steps (Post-MVP)

### 1. OAuth Verification Timeline

**Week 1-2:**

- [ ] Prepare verification materials
- [ ] Create privacy policy page
- [ ] Create terms of service page
- [ ] Record demo video

**Week 3:**

- [ ] Submit verification request
- [ ] Respond to any Google questions

**Week 4-8:**

- [ ] Wait for approval
- [ ] Address any feedback from Google

### 2. Enhanced Security

**Once verified:**

- [ ] Re-enable API Key restrictions
- [ ] Implement refresh token rotation
- [ ] Add token expiration monitoring
- [ ] Implement logout across all devices

### 3. User Experience Improvements

**Future enhancements:**

- [ ] Add "Remember me" checkbox
- [ ] Add session timeout warnings
- [ ] Add logout confirmation dialog
- [ ] Show user profile picture in header
- [ ] Add account switching support

---

## References

- [Firebase Google Sign-In Docs](https://firebase.google.com/docs/auth/web/google-signin)
- [Google OAuth 2.0 Verification](https://support.google.com/cloud/answer/9110914)
- [OAuth 2.0 Scopes](https://developers.google.com/identity/protocols/oauth2/scopes)
- [Firebase Auth Error Codes](https://firebase.google.com/docs/reference/js/auth#autherrorcodes)

---

**Last Updated:** 2025-10-08
**Configuration Status:** ✅ Development Mode Working
**Production Ready:** ⚠️ Pending OAuth Verification
