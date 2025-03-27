
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDsRZhEMaN_Ijq2DBGMCr_zP8oso-FFLjY",
  authDomain: "expensetracker-d6937.firebaseapp.com",
  projectId: "expensetracker-d6937",
  storageBucket: "expensetracker-d6937.firebasestorage.app",
  messagingSenderId: "26672937768",
  appId: "1:26672937768:web:68f5eff3b1abf4b90a2e1d"
};

const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)