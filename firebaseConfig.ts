// NOTE: Your Firebase project's configuration should be stored in environment variables.
// FIX: Changed firebase imports to scoped packages to resolve module export errors.
import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";

// Using placeholders which are expected to be replaced by the deployment environment.
// This avoids using `process.env` which may not be available in the browser and resolves the 'invalid-api-key' error.
export const firebaseConfig = {
  apiKey: "__FIREBASE_API_KEY__",
  authDomain: "__FIREBASE_AUTH_DOMAIN__",
  projectId: "__FIREBASE_PROJECT_ID__",
  storageBucket: "__FIREBASE_STORAGE_BUCKET__",
  messagingSenderId: "__FIREBASE_MESSAGING_SENDER_ID__",
  appId: "__FIREBASE_APP_ID__"
};

// Initialize Firebase with the standard v9 modular functions
const app = initializeApp(firebaseConfig);

// Export modular service instances for the rest of the app to use
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
