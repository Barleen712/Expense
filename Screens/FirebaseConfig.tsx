import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
const firebaseConfig = {
  apiKey: "AIzaSyDsRZhEMaN_Ijq2DBGMCr_zP8oso-FFLjY",
  authDomain: "expensetracker-d6937.firebaseapp.com",
  projectId: "expensetracker-d6937",
  storageBucket: "expensetracker-d6937.firebasestorage.app",
  messagingSenderId: "26672937768",
  appId: "1:26672937768:web:68f5eff3b1abf4b90a2e1d",
};
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
export { auth, db };
