import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from 'react-native'; // Platform එක හඳුනාගන්න

const firebaseConfig = {
  apiKey: "AIzaSyAoe26csQLBrBAxQesYm8hYiew3NRqkkjo",
  authDomain: "noteapp-77a6e.firebaseapp.com",
  projectId: "noteapp-77a6e",
  storageBucket: "noteapp-77a6e.firebasestorage.app",
  messagingSenderId: "773424812887",
  appId: "1:773424812887:web:47b7d07c10229734392412",
  measurementId: "G-KEYR85XY65"
};

let app;
let auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);

  // මෙතනින් බලනවා අපි ඉන්නේ Web එකේද Phone එකේද කියලා
  if (Platform.OS === 'web') {
    // Web එක නම් සාමාන්‍ය විදිහට ගන්න
    auth = getAuth(app);
  } else {
    // Phone එක නම් (Android/iOS) අර Storage එක දාන්න
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
  }
} else {
  app = getApp();
  auth = getAuth(app);
}

const db = getFirestore(app);

export { auth, db };
