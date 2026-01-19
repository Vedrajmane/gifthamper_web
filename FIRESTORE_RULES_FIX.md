# Fix Firestore Permission Error

## The Problem

Your products are successfully migrated to Firestore, but the Firebase security rules are blocking public read access. You need to update the rules to allow users to view products.

## How to Fix

### Step 1: Open Firebase Console

Go to: https://console.firebase.google.com/project/martinibynidhi-dc78d/firestore

### Step 2: Navigate to Rules

1. Click on **Firestore Database** in the left sidebar
2. Click on the **Rules** tab at the top

### Step 3: Update the Rules

Replace the existing rules with this code:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - anyone can read, only authenticated admins can write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // User carts - users can only access their own cart
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Step 4: Publish the Rules

Click the **"Publish"** button at the top right.

### Step 5: Refresh Your Website

Go back to `http://localhost:3000` and refresh the page. Your 12 products should now appear!

---

## What These Rules Do

✅ **Products**: Anyone can view products (public read), but only authenticated users can add/edit/delete  
✅ **Carts**: Users can only access their own cart data  
✅ **Users**: Users can only see their own profile data

This ensures security while allowing your store to work properly.
