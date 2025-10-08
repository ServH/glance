# Firestore Security Rules Deployment

## Manual Deployment (Firebase Console)

1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select project: **glance-mvp**
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy the content from `firestore.rules` file
5. Paste into the Firebase Console editor
6. Click **"Publish"** button
7. Verify rules are active (status should show "Published")

## Rules Overview

The security rules ensure:

- ✅ **Authentication Required**: Only authenticated users can access data
- ✅ **User Isolation**: Users can only read/write their own data (`/users/{userId}`)
- ✅ **Subcollection Protection**: Settings, emails, and calendar data are user-specific
- ✅ **Default Deny**: All other paths are denied by default

## Testing Rules

After deployment, verify:

```javascript
// In browser console after login:
const userId = auth.currentUser.uid;

// Should succeed: Write to own user document
await setDoc(doc(db, 'users', userId, 'settings', 'theme'), { value: 'dark' });

// Should fail: Write to another user's document
await setDoc(doc(db, 'users', 'other-user-id', 'settings', 'theme'), { value: 'dark' });
// Error: Missing or insufficient permissions
```

## Future Enhancements

- Add field validation (e.g., validate setting keys)
- Add rate limiting rules (Firestore quotas)
- Add data size limits
- Add timestamp validation
