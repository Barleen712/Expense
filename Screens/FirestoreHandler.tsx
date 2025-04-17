import { addDoc } from "firebase/firestore";
import { db, auth } from "./FirebaseConfig";
import { collection, query, getDocs, where } from "firebase/firestore";
export async function AddTransaction(transactionData) {
  try {
    const docRef = await addDoc(collection(db, "Transactions"), transactionData);
  } catch (e) {
    console.log(e);
  }
}

export async function AddBudget(budgetData) {
  try {
    await addDoc(collection(db, "Budgets"), budgetData);
  } catch (e) {
    console.log(e);
  }
}
