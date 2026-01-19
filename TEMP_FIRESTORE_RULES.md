# Firestore Rules - Temporary Fix for Migration

## The Problem

Products aren't saving to Firestore due to permission restrictions.

## Temporary Solution

1. Go to: https://console.firebase.google.com/project/martinibynidhi-dc78d/firestore/rules

2. **Replace ALL rules with this:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

4. Come back here and tell me "rules updated"

## What This Does

Temporarily allows anyone to read/write to your database. This is ONLY for testing - I'll add proper security rules after products are migrated.

After migration, I'll update to secure rules.
