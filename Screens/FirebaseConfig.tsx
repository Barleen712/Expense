// import { initializeApp } from "firebase/app";
// import {getAuth} from "firebase/auth"

// const firebaseConfig = {
//   apiKey: "AIzaSyDsRZhEMaN_Ijq2DBGMCr_zP8oso-FFLjY",
//   authDomain: "expensetracker-d6937.firebaseapp.com",
//   projectId: "expensetracker-d6937",
//   storageBucket: "expensetracker-d6937.firebasestorage.app",
//   messagingSenderId: "26672937768",
//   appId: "1:26672937768:web:68f5eff3b1abf4b90a2e1d"
// };

// const app = initializeApp(firebaseConfig);
// export const auth=getAuth(app)

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
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
// const firebaseConfig = {
//   apiKey: "AIzaSyDdgpDBd8uSz4R9vHJ-aC29afHXmB6_tN0",
//   authDomain: "practice-3dc14.firebaseapp.com",
//   projectId: "practice-3dc14",
//   storageBucket: "practice-3dc14.firebasestorage.app",
//   messagingSenderId: "53534647041",
//   appId: "1:53534647041:android:5ae08457f661e5de3ff100"
// };
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
export { auth, db };
