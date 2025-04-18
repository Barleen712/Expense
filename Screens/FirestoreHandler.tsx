import { addDoc } from "firebase/firestore";
import { db, auth } from "./FirebaseConfig";
import { collection, query, getDocs, where,onSnapshot } from "firebase/firestore";
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

export async function GetBudget()
{
  const q=query(collection(db,("Budgets")))
  const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          console.log(data)
        },
        (error) => {
          console.error("Error fetching transactions: ", error);
        }
      );
}