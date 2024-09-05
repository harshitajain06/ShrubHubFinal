import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYiqLGBhtIf3P5Y2kv4UCJJJrj3MCVkwk",
  authDomain: "shrub-hub-final.firebaseapp.com",
  projectId: "shrub-hub-final",
  storageBucket: "shrub-hub-final.appspot.com",
  messagingSenderId: "821424810922",
  appId: "1:821424810922:web:88592f2b527d4595c919d3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
})

export const db = getFirestore(app);

export const usersRef = collection(db,'users');