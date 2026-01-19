# Firebase Setup Guide

Follow these steps to connect your Firebase project to WordLane.

## Step 1: Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your WordLane project
3. Click the ⚙️ (gear icon) → **Project settings**
4. Scroll down to "Your apps" section
5. If you haven't added a web app yet:
   - Click **</> Web** icon
   - Register your app with nickname "WordLane Web"
   - You don't need Firebase Hosting for now
6. You'll see your Firebase configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef...",
};
```

## Step 2: Enable Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (we'll add security rules later)
4. Select your preferred Cloud Firestore location (choose closest to your users)
5. Click **Enable**

## Step 3: Enable Authentication

1. Go to **Build** → **Authentication**
2. Click **Get started**
3. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle **Enable**
   - Click **Save**
4. (Optional) Enable **Google** sign-in:
   - Click on "Google"
   - Toggle **Enable**
   - Enter your support email
   - Click **Save**

## Step 4: Create .env.local File

1. In your project root (`e:\wordlane`), create a file named `.env.local`
2. Copy the following template and fill in your values from Step 1:

```env
# WhatsApp Business Phone Number (international format without +)
NEXT_PUBLIC_WHATSAPP_PHONE=919867673627

# Admin Credentials (CHANGE THESE FOR PRODUCTION!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Firebase Configuration (Copy from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY_HERE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Save the file

## Step 5: Migrate Products to Firestore

Once your `.env.local` is set up, run the migration script:

```bash
npx tsx scripts/migrate-products.ts
```

This will upload all 12 products from your code to Firestore.

## Step 6: Restart Your Dev Server

1. Stop the current dev server (Ctrl+C)
2. Start it again:

```bash
npm run dev
```

## Verification

✅ You should see no Firebase errors in the console  
✅ Products should load from Firestore  
✅ You can sign up/login with email  
✅ Cart should sync when logged in

---

## Need Help?

Let me know if you encounter any issues during setup!
